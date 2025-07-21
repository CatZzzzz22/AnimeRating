import pandas as pd
import numpy as np
import datetime
import os

#### CREATE A NEW DIRECTORY FOR CLEANED DATA ####
dir_path = '../../production_cleaned_data'
os.makedirs(dir_path, exist_ok=True)

##### IMPORT ANIME DETAILS #####

anime_path = '../../production_raw_data/anime_production.csv'
raw_df = pd.read_csv(anime_path)
raw_df.columns = raw_df.columns.str.strip()

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

anime_df = anime_df.drop_duplicates(subset='aid')

for col in ['aname', 'synopsis', 'type', 'imageURL']:
    anime_df[col] = anime_df[col].astype(str).str.strip()

anime_df = anime_df[anime_df['type'].astype(bool)]

anime_df['score']    = pd.to_numeric(anime_df['score'], errors='coerce').fillna(0.0)
anime_df['episodes'] = (
    pd.to_numeric(anime_df['episodes'], errors='coerce')
      .fillna(0)
      .astype(int)
)

anime_df = anime_df.drop_duplicates(subset=['aname'], keep='first')

# Parse 'aired' to datetime
anime_df['aired'] = pd.to_datetime(anime_df['aired'], errors='coerce')

# Identify rows with missing dates
missing_dates_mask = anime_df['aired'].isna()
num_missing = missing_dates_mask.sum()

# Generate random dates between 1990-01-01 and 2020-12-31
start_date = datetime.date(1990, 1, 1)
end_date   = datetime.date(2020, 12, 31)

np.random.seed(42)  # for reproducibility
random_ordinals = np.random.randint(start_date.toordinal(), end_date.toordinal(), size=num_missing)
random_dates = [datetime.date.fromordinal(ordinal) for ordinal in random_ordinals]

# Assign to missing 'aired' entries
anime_df.loc[missing_dates_mask, 'aired'] = random_dates

# Convert to date (if still datetime64)
anime_df['aired'] = pd.to_datetime(anime_df['aired']).dt.date

anime_df['numRating'] = np.where(anime_df['score'] == 0, 0, 3)

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

if 'Genres' in raw_df.columns and not genre_df.empty:
    anime_genre = (
        raw_df[['anime_id','Genres']]
          .dropna(subset=['Genres'])
          .assign(genre=raw_df['Genres'].str.split(','))
          .explode('genre')
    )
    anime_genre['genre'] = anime_genre['genre'].str.strip()

    anime_genre = anime_genre.merge(
        genre_df, left_on='genre', right_on='gname', how='inner'
    )

    mapping_df = anime_genre[['anime_id','gid']].rename(columns={'anime_id':'aid'})

    mapping_df = mapping_df[
        mapping_df['aid'].isin(anime_df['aid']) &
        mapping_df['gid'].isin(genre_df['gid'])
    ]

    mapping_output = '../../production_cleaned_data/animegenre.csv'
    mapping_df.to_csv(mapping_output, index=False)
    print(f"Written anime–genre mapping ({len(mapping_df)} rows) to {mapping_output}.")
else:
    print("Skipping anime–genre mapping; prerequisites not met.")

##### IMPORT USER DETAILS #####

users_input = '../../production_raw_data/user_production.csv'
user_df = pd.read_csv(users_input)
user_df.columns = user_df.columns.str.strip()

# Load user IDs from score file to find active users
scores_input = '../../production_raw_data/user_score_production.csv'
score_users = pd.read_csv(scores_input, usecols=['user_id'])
score_users.columns = score_users.columns.str.strip()
score_user_ids = set(score_users['user_id'].dropna().astype(int))

# Sample 10,000 random users
sampled_users = user_df.sample(n=10000, random_state=42)

# Union: include all sampled users and all users from score file
combined_user_ids = set(sampled_users['Mal ID']).union(score_user_ids)

# Filter the full user data by this union
users_df = user_df[user_df['Mal ID'].isin(combined_user_ids)].copy()

# Clean and transform
users_df = users_df.rename(columns={
    'Mal ID':    'uid',
    'Username':  'username',
    'Gender':    'gender',
    'Birthday':  'birthday',
    'Joined':    'joinedDate'
})[['uid','username','gender','birthday','joinedDate']]

users_df['joinedDate'] = pd.to_datetime(users_df['joinedDate'], errors='coerce').dt.date
users_df['birthday'] = pd.to_datetime(users_df['birthday'], errors='coerce').dt.date

today = datetime.date.today()
users_df['age'] = users_df['birthday'].apply(
    lambda bd: today.year - bd.year - ((today.month, today.day) < (bd.month, bd.day))
)
users_df['age'] = users_df['age'].astype('Int64')

users_df['uname']    = users_df['username'].str.extract(r'([A-Za-z]+)')[0].str.title()
users_df['password'] = users_df['username'] + 'pass123'

locations = [
    'Toronto', 'London', 'New York', 'Paris',
    'Berlin', 'Sydney', 'Tokyo', 'São Paulo'
]
np.random.seed(123)
users_df['location'] = np.random.choice(locations, size=len(users_df))

users_df = users_df[['uid','username','password','uname','gender','age','location','joinedDate']]

users_output = '../../production_cleaned_data/user.csv'
users_df.to_csv(users_output, index=False)
print(f"Cleaned Users CSV written to {users_output} with {len(users_df)} records.")

##### IMPORT & CLEAN USER–SCORE DATA #####

scores_df = pd.read_csv(scores_input)
scores_df.columns = scores_df.columns.str.strip()

scores_df['uid'] = scores_df['user_id'].astype('category').cat.codes + 1
scores_df['aid'] = scores_df['anime_id'].astype('category').cat.codes + 1

start = pd.to_datetime('2000-01-01')
end = pd.to_datetime('2025-01-01')

# Generate the dates
generated_dates = [start + pd.Timedelta(days=i) for i in range(len(scores_df))]

# Cap the dates at 2025-01-01
scores_df['ratedDate'] = [min(date, end) for date in generated_dates]

# Assign score
scores_df['score'] = scores_df['rating'].astype(float)

user_scores_df = scores_df[['uid', 'aid', 'ratedDate', 'score']]

user_scores_df = user_scores_df[
    user_scores_df['aid'].isin(anime_df['aid']) &
    user_scores_df['uid'].isin(users_df['uid'])
]

scores_output = '../../production_cleaned_data/rating.csv'
user_scores_df.to_csv(scores_output, index=False)
print(f"Cleaned User Scores CSV written to {scores_output} with {len(user_scores_df)} records.")

##### GENERATE WATCH LIST #####

scores_df = pd.read_csv(scores_input)
scores_df.columns = scores_df.columns.str.strip()

scores_df['uid'] = scores_df['user_id'].astype('category').cat.codes + 1
scores_df['aid'] = scores_df['anime_id'].astype('category').cat.codes + 1

watchlist_df = scores_df[['uid', 'aid']].drop_duplicates().reset_index(drop=True)

watchlist_df = watchlist_df[
    watchlist_df['aid'].isin(anime_df['aid']) &
    watchlist_df['uid'].isin(users_df['uid'])
]

watchlist_output = '../../production_cleaned_data/watchlist.csv'
watchlist_df.to_csv(watchlist_output, index=False)
print(f"Watch List CSV written to {watchlist_output} with {len(watchlist_df)} entries.")
