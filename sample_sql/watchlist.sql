-- Insert into watchlist
INSERT INTO Watchlist (uid, aid)
VALUES (1, 15);

-- View watchlist
SELECT A.*
FROM Watchlist W
JOIN Anime A ON W.aid = A.aid
WHERE W.uid = 1;

-- Delete anime from watchlist
DELETE FROM Watchlist
WHERE uid = 1 AND aid = 15;

