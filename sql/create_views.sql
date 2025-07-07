-- A master view that contains all the available animes with corresponding genre
CREATE OR REPLACE VIEW Anime_genre AS
SELECT a.*, g.gname
FROM Anime a
LEFT JOIN AnimeGenre ag ON a.aid = ag.aid
LEFT JOIN Genre g ON g.gid = ag.gid;