USE ProductionAnimeRatingApp;

-- Load Anime table
LOAD DATA LOCAL INFILE '../../production_cleaned_data/anime.csv'
INTO TABLE Anime
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(aid, aname, score, synopsis, type, episodes, aired, imageURL, numRating);

-- Load Genre table
LOAD DATA LOCAL INFILE '../../production_cleaned_data/genre.csv'
INTO TABLE Genre
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(gid, gname);

-- Load AnimeGenre table
LOAD DATA LOCAL INFILE '../../production_cleaned_data/animegenre.csv'
INTO TABLE AnimeGenre
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(aid, gid);

-- Load Users
LOAD DATA LOCAL INFILE '../../production_cleaned_data/user.csv'
INTO TABLE User
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(uid, username, password, uname, gender, age, location, joinedDate);

-- Load Ratings
LOAD DATA LOCAL INFILE '../../production_cleaned_data/rating.csv'
INTO TABLE Rating
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(uid, aid, ratedDate, score);

-- Load Watchlist
LOAD DATA LOCAL INFILE '../../production_cleaned_data/watchlist.csv'
INTO TABLE Watchlist
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(uid, aid);

-- Load UserFollow
LOAD DATA LOCAL INFILE '../../production_cleaned_data/userfollow.csv'
INTO TABLE UserFollow
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(followerUid, followeeUid);

-- Load ViewHistory
LOAD DATA LOCAL INFILE '../../production_cleaned_data/viewhistory.csv'
INTO TABLE ViewHistory
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(uid, aid, viewed_date);
