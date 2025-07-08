-- Match all anime where name contains 'ken'
With PopulateAnime AS 
SELECT A.*, GROUP_CONCAT(DISTINCT g.gname ORDER BY g.gname SEPARATOR ', ') as genre
FROM Anime a join AnimeGenre ag on a.aid = ag.aid
    join Genre g on g.gid = ag.gid
GROUP BY
    a.aid, a.aname, a.score, a.synopsis,
    a.type, a.episodes, a.aired, a.imageURL, a.numRating

SELECT aname, score, type, genre, episodes, aired, imageURL, synopsis
FROM PopulateAnime
WHERE LOWER(aname) LIKE '%ken%'
LIMIT 6;