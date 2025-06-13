CREATE DATABASE IF NOT EXISTS AnimeRatingApp;
USE AnimeRatingApp;

DROP TABLE IF EXISTS AnimeGenre;
DROP TABLE IF EXISTS Genre;
DROP TABLE IF EXISTS Watchlist;
DROP TABLE IF EXISTS Rating;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Anime;

-- Create Anime table
CREATE TABLE Anime (
  aid INT AUTO_INCREMENT PRIMARY KEY,
  aname VARCHAR(255) NOT NULL,
  score FLOAT NOT NULL,
  synopsis TEXT,
  genres VARCHAR(255),
  type ENUM('TV', 'Movie', 'OVA', 'ONA', 'Special', 'Music', 'Unknown') NOT NULL,
  episodes INT,
  aired VARCHAR(100),
  imageURL VARCHAR(255)
);

-- Create Genre table
CREATE TABLE Genre (
  gid INT AUTO_INCREMENT PRIMARY KEY,
  gname VARCHAR(255) NOT NULL
);

-- Create AnimeGenre table
CREATE TABLE AnimeGenre (
  aid INT,
  gid INT,
  FOREIGN KEY (aid) REFERENCES Anime(aid),
  FOREIGN KEY (gid) REFERENCES Genre(gid)
);
 
-- Create User table
CREATE TABLE User (
  uid INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  uname VARCHAR(255),
  gender VARCHAR(10),
  age INT,
  joinedDate DATE
);

-- Create Rating table
CREATE TABLE Rating (
  uid INT,
  aid INT,
  ratedDate DATE,
  score FLOAT,
  PRIMARY KEY (uid, aid),
  FOREIGN KEY (uid) REFERENCES User(uid) ON DELETE CASCADE,
  FOREIGN KEY (aid) REFERENCES Anime(aid) ON DELETE CASCADE
);

-- Create Watchlist table
CREATE TABLE Watchlist (
  uid INT,
  aid INT,
  PRIMARY KEY (uid, aid),
  FOREIGN KEY (uid) REFERENCES User(uid) ON DELETE CASCADE,
  FOREIGN KEY (aid) REFERENCES Anime(aid) ON DELETE CASCADE
);
