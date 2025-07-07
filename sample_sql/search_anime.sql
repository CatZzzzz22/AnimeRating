-- Match all anime where name contains 'kenshin'
SELECT *
FROM Anime
WHERE LOWER(aname) LIKE '%kenshin%';