-- Insert into watchlist
INSERT INTO Watchlist (uid, aid)
VALUES (2047, 1901);

-- View watchlist
SELECT A.*
FROM Watchlist W
JOIN Anime A ON W.aid = A.aid
WHERE W.uid = 2047;

-- Delete anime from watchlist
DELETE FROM Watchlist
WHERE uid = 2047 AND aid = 1901;

