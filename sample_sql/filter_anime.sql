CREATE VIEW AnimeAggregate AS (Select A.*, G.gname
                               FROM Anime A LEFT JOIN AnimeGenre AG ON A.aid = AG.aid
                                            LEFT JOIN Genre G ON G.gid = AG.gid);

-- Match all anime where name contains 'kenshin'
SELECT aname, score, type, gname, synopsis
FROM AnimeAggregate
WHERE LOWER(aname) LIKE '%kenshin%';

-- Match all anime where genres is romance
SELECT aname, score, type, gname, synopsis
FROM AnimeAggregate
WHERE LOWER(gname) = 'romance';

DROP VIEW AnimeAggregate;