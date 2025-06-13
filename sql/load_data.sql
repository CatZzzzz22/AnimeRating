USE AnimeRatingApp;

-- Load Anime table
LOAD DATA LOCAL INFILE '../data/sample_anime.csv'
INTO TABLE Anime
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(@anime_id, name, @eng, @other, score, genres, synopsis, type, episodes, aired,
 @premiered, @status, @producers, @licensors, @studios, @source, @duration, 
 @rating, @rank, @popularity, @favorites, @scoredby, @members, imageURL);

-- Load Users
LOAD DATA LOCAL INFILE '../data/sample_users.csv'
INTO TABLE User
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(uid, uname, gender, age, joinedDate);

-- Load Ratings
LOAD DATA LOCAL INFILE '../data/sample_ratings.csv'
INTO TABLE Rating
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(uid, aid, ratedDate, score);

-- Load Watchlist
LOAD DATA LOCAL INFILE '../data/sample_watchlist.csv'
INTO TABLE Watchlist
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(uid, aid);

