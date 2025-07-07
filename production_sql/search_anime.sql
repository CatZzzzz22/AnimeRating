-- Match all anime where name contains 'ken'
SELECT aname, score, type, gname, episode, aired, imageURL, synopsis
FROM Anime
WHERE LOWER(aname) LIKE '%ken%'
LIMIT 10;