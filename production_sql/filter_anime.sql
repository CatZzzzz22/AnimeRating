WITH AnimeAggregate AS (Select A.*, G.gname
                        FROM Anime A LEFT JOIN AnimeGenre AG ON A.aid = AG.aid
                                     LEFT JOIN Genre G ON G.gid = AG.gid)

-- Match all anime where genres is romance
SELECT aname, score, type, gname, episode, aired, imageURL, synopsis
FROM AnimeAggregate
WHERE LOWER(gname) = 'romance'
LIMIT 10;
