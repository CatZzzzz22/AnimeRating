-- Recommend the top 3 scoring Anime to user with 
--      uid 36 based on the genres they have in their watchlist
WITH User_Fav AS (SELECT gid, ag.aid
                  FROM Watchlist w JOIN AnimeGenre ag ON ag.aid = w.aid
                  WHERE w.uid = 36 and gid IS NOT NULL),
     Fav_Gen AS (SELECT gid
                 FROM User_Fav
                 GROUP BY gid
                 HAVING count(aid) = (SELECT max(cnt)
                                      FROM (SELECT count(aid) AS cnt
                                            FROM User_Fav
                                            GROUP BY gid) AS count))


SELECT a.*
FROM Anime a Join AnimeGenre ag on a.aid = ag.aid
WHERE ag.gid IN (SELECT gid FROM Fav_Gen) 
      and a.aid NOT IN (SELECT aid FROM User_Fav)
ORDER BY score desc
LIMIT 3;
