DROP VIEW IF EXISTS PopulateAnime;

CREATE VIEW PopulateAnime as 
select A.*, GROUP_CONCAT(DISTINCT g.gname ORDER BY g.gname SEPARATOR ', ') as genre
from Anime a join AnimeGenre ag on a.aid = ag.aid
    join Genre g on g.gid = ag.gid
group by
    a.aid, a.aname, a.score, a.synopsis,
    a.type, a.episodes, a.aired, a.imageURL, a.numRating;

-- Sort anime by rating[highest to lowest]
select *
from PopulateAnime
order by score desc
limit 10;

-- Sort anime by date[latest to oldest]
select *
from PopulateAnime
order by aired desc
limit 10;