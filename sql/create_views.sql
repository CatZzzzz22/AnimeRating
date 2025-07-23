-- A master view that contains all the available animes with corresponding genre
CREATE OR REPLACE VIEW Anime_genre AS
SELECT 
    a.*,
    GROUP_CONCAT(DISTINCT g.gname ORDER BY g.gname SEPARATOR ', ') AS genres
FROM Anime a
LEFT JOIN AnimeGenre ag ON a.aid = ag.aid
LEFT JOIN Genre g ON g.gid = ag.gid
GROUP BY a.aid;

-- A master view that joins user's watchlist and anime details
CREATE OR REPLACE VIEW Watchlist_anime AS
SELECT w.uid, a.*
FROM Watchlist w
JOIN Anime_genre a ON w.aid = a.aid;

-- A master view that joins user's most recently viewed anime and anime details
CREATE OR REPLACE VIEW Recent_viewed AS
SELECT *
FROM (
    SELECT v.uid, v.viewed_date, a.*, ROW_NUMBER() OVER (PARTITION BY v.uid ORDER BY v.viewed_date DESC) AS rn
    FROM ViewHistory v
    JOIN Anime_genre a ON v.aid = a.aid
) AS ranked
WHERE rn <= 5;