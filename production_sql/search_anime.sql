-- Match all anime where name contains 'ken'
WITH AnimeAggregate AS (Select A.*, G.gname
                        FROM Anime A LEFT JOIN AnimeGenre AG ON A.aid = AG.aid
                                     LEFT JOIN Genre G ON G.gid = AG.gid)

SELECT aname, score, type, gname, episodes, aired, imageURL, synopsis
FROM AnimeAggregate
WHERE LOWER(aname) LIKE '%ken%'
LIMIT 10;