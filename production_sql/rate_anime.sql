DROP TRIGGER IF EXISTS UserRating;

DELIMITER $$

CREATE TRIGGER UserRating
BEFORE INSERT ON Rating
FOR EACH ROW
BEGIN
    DECLARE old_score FLOAT;
    DECLARE cur_num INT;
    DECLARE cur_avg FLOAT;

    -- see if the user has rated the anime before
    SELECT score INTO old_score
    FROM Rating
    WHERE uid = NEW.uid AND aid = NEW.aid
    LIMIT 1;

    -- get current numRating and average score
    SELECT numRating, score INTO cur_num, cur_avg
    FROM Anime
    WHERE aid = NEW.aid;

    IF old_score IS NOT NULL THEN
        -- update existing rating
        UPDATE Rating
        SET score = NEW.score,
            ratedDate = NEW.ratedDate
        WHERE uid = NEW.uid AND aid = NEW.aid;

        -- recalc average score (numRating unchanged)
        UPDATE Anime
        SET score = ((cur_avg * cur_num) - old_score + NEW.score) / cur_num
        WHERE aid = NEW.aid;

        -- prevent the insert because we already updated
        SET NEW.uid = NULL;
        SET NEW.aid = NULL;

    ELSE
        -- new rating: update average and increment numRating
        UPDATE Anime
        SET score = ((cur_avg * cur_num) + NEW.score) / (cur_num + 1),
            numRating = numRating + 1
        WHERE aid = NEW.aid;
    END IF;
END$$

DELIMITER ;

-- Rating of anime with aid 1 before the rating
SELECT score
FROM Anime
WHERE aid = 1;

-- User with uid 36 rate anime with aid 1 with a rating of 8
INSERT INTO Rating VALUES (36, 1, CURDATE(), 8);

-- Rating of anime with aid 1 after the rating
SELECT score
FROM Anime
WHERE aid = 1;
 