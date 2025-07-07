import pandas as pd
import numpy as np
import datetime
import os

#### CREATE A NEW DIRECTORY FOR CLEANED DATA ####
dir_path = '../../production_cleaned_data'
os.makedirs(dir_path, exist_ok=True)

##### IMPORT ANIME DETAILS #####

# Load the raw anime production CSV
anime_path = '../../production_raw_data/anime_production.csv'
raw_df = pd.read_csv(anime_path)
raw_df.columns = raw_df.columns.str.strip()

# Clean & transform for the Anime table
anime_df = raw_df.rename(columns={
    'anime_id': 'aid',
    'Name':     'aname',
    'Score':    'score',
    'Synopsis': 'synopsis',
    'Type':     'type',
    'Episodes': 'episodes',
    'Aired':    'aired',
    'ImageURL': 'imageURL'
})[['aid','aname','score','synopsis','type','episodes','aired','imageURL']]

# Drop duplicates by aid
anime_df = anime_df.drop_duplicates(subset='aid')

# Trim whitespace on string columns
for col in ['aname', 'synopsis', 'type', 'imageURL']:
    anime_df[col] = anime_df[col].astype(str).str.strip()

# Ensure numeric types
anime_df['score']    = pd.to_numeric(anime_df['score'], errors='coerce').fillna(0.0)
anime_df['episodes'] = (
    pd.to_numeric(anime_df['episodes'], errors='coerce')
      .fillna(0)
      .astype(int)
)

# Parse dates
anime_df['aired'] = pd.to_datetime(anime_df['aired'], errors='coerce').dt.date

# Add numRating and write the cleaned anime CSV
anime_df['numRating'] = 3
anime_output = '../../production_cleaned_data/anime.csv'
anime_df.to_csv(anime_output, index=False)
print(f"Cleaned Anime CSV written to {anime_output} with {len(anime_df)} records.")


##### EXTRACT DISTINCT GENRES #####

if 'Genres' in raw_df.columns:
    genres_series = (
        raw_df['Genres']
          .dropna()
          .astype(str)
          .str.split(',')
          .explode()
          .str.strip()
    )
    unique_genres = sorted(genres_series.unique())
    genre_df = pd.DataFrame({
        'gid':  range(1, len(unique_genres) + 1),
        'gname': unique_genres
    })

    genres_output = '../../production_cleaned_data/genre.csv'
    genre_df.to_csv(genres_output, index=False)
    print(f"Extracted {len(genre_df)} distinct genres to {genres_output}.")
else:
    print("'Genres' column not found in raw data; skipping genre extraction.")


##### CREATE ANIME–GENRE MAPPING #####

# Explode each anime's genres into separate rows and map to gid
if 'Genres' in raw_df.columns and not genre_df.empty:
    anime_genre = (
        raw_df[['anime_id','Genres']]
          .dropna(subset=['Genres'])
          .assign(genre=raw_df['Genres'].str.split(','))
          .explode('genre')
    )
    anime_genre['genre'] = anime_genre['genre'].str.strip()

    # merge to get gid
    anime_genre = anime_genre.merge(
        genre_df, left_on='genre', right_on='gname', how='inner'
    )

    mapping_df = anime_genre[['anime_id','gid']].rename(columns={'anime_id':'aid'})
    mapping_output = '../../production_cleaned_data/animegenre.csv'
    mapping_df.to_csv(mapping_output, index=False)
    print(f"Written anime–genre mapping ({len(mapping_df)} rows) to {mapping_output}.")
else:
    print("Skipping anime–genre mapping; prerequisites not met.")


##### IMPORT USER DETAILS #####

users_input = '../../production_raw_data/user_production.csv'
user_df = pd.read_csv(users_input)
user_df.columns = user_df.columns.str.strip()

# Select & rename columns to match your final schema
users_df = user_df.rename(columns={
    'Mal ID':    'uid',
    'Username':  'username',
    'Gender':    'gender',
    'Birthday':  'birthday',
    'Joined':    'joinedDate'
})[['uid','username','gender','birthday','joinedDate']]

# Format date
users_df['joinedDate'] = (
    pd.to_datetime(users_df['joinedDate'], errors='coerce')
      .dt.date
)

# Parse birthday --> age
users_df['birthday'] = pd.to_datetime(users_df['birthday'], errors='coerce').dt.date
today = datetime.date.today()
users_df['age'] = users_df['birthday'].apply(
    lambda bd: today.year - bd.year - ((today.month, today.day) < (bd.month, bd.day))
)
users_df['age'] = users_df['age'].astype('Int64')

# Derive uname, init password, reorder
users_df['uname']    = users_df['username'].str.extract(r'([A-Za-z]+)')[0].str.title()
users_df['password'] = users_df['username'] + 'pass123'

# define a pool of cities
locations = [
    'Toronto', 'London', 'New York', 'Paris',
    'Berlin', 'Sydney', 'Tokyo', 'São Paulo'
]

# for reproducibility
np.random.seed(123)

# randomly assign one of these to each user
users_df['location'] = np.random.choice(locations, size=len(users_df))

users_df = users_df[['uid','username','password','uname','gender','age', 'location','joinedDate']]

# Write out cleaned users CSV
users_output = '../../production_cleaned_data/user.csv'
users_df.to_csv(users_output, index=False)
print(f"Cleaned Users CSV written to {users_output} with {len(users_df)} records.")


##### IMPORT & CLEAN USER–SCORE DATA #####

scores_input = '../../production_raw_data/user_score_production.csv'
scores_df = pd.read_csv(scores_input)
scores_df.columns = scores_df.columns.str.strip()

scores_df['uid'] = scores_df['user_id'].astype('category').cat.codes + 1
scores_df['aid'] = scores_df['anime_id'].astype('category').cat.codes + 1

# Generate a daily ratedDate starting 2024-04-01
start = pd.to_datetime('2000-01-01')
scores_df['ratedDate'] = [start + pd.Timedelta(days=i) for i in range(len(scores_df))]

# Rename rating
scores_df['score'] = scores_df['rating'].astype(float)

# Select & reorder
user_scores_df = scores_df[['uid', 'aid', 'ratedDate', 'score']]

# Write cleaned user scores CSV
scores_output = '../../production_cleaned_data/rating.csv'
user_scores_df.to_csv(scores_output, index=False)
print(f"Cleaned User Scores CSV written to {scores_output} with {len(user_scores_df)} records.")


##### GENERATE WATCH LIST #####

scores_input = '../../production_raw_data/user_score_production.csv'
scores_df = pd.read_csv(scores_input)
scores_df.columns = scores_df.columns.str.strip()

# Map to your internal codes (must match the mapping used for scores)
scores_df['uid'] = scores_df['user_id'].astype('category').cat.codes + 1
scores_df['aid'] = scores_df['anime_id'].astype('category').cat.codes + 1

# Select and dedupe just the uid/aid pairs
watchlist_df = (
    scores_df[['uid', 'aid']]
    .drop_duplicates()
    .reset_index(drop=True)
)

# Write out the watch list
watchlist_output = '../../production_cleaned_data/watchlist.csv'
watchlist_df.to_csv(watchlist_output, index=False)
print(f"Watch List CSV written to {watchlist_output} with {len(watchlist_df)} entries.")



