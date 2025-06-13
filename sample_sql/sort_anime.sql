CREATE VIEW PopulateAnime as 
select A.*, gname as genre
from Anime a join AnimeGenre ag on a.aid = ag.aid
    join Genre g on g.gid = ag.gid;

-- Sort anime by rating[highest to lowest]
select *
from PopulateAnime
order by score desc;

-- Sort anime by date[latest to oldest]
select *
from PopulateAnime
order by aired desc;