DROP TRIGGER IF EXISTS recently_viewed;
DROP TRIGGER IF EXISTS prevent_self_follow;
DROP TRIGGER IF EXISTS add_rating;
DROP TRIGGER IF EXISTS update_rating;

DELIMITER $$
-- Trigger to keep most 10 recent anime viewed records
CREATE TRIGGER recently_viewed
AFTER INSERT ON ViewHistory
FOR EACH ROW
BEGIN
  DELETE FROM ViewHistory
  WHERE uid = NEW.uid
    AND (uid, aid) NOT IN (
      SELECT uid, aid FROM (
        SELECT uid, aid
        FROM ViewHistory
        WHERE uid = NEW.uid
        ORDER BY viewed_date DESC
        LIMIT 10
      ) AS TopTen
    );
END$$

DELIMITER ;

DELIMITER $$
-- -- Trigger to prevent user self follow
CREATE TRIGGER prevent_self_follow
BEFORE INSERT ON UserFollow
FOR EACH ROW
BEGIN
    IF NEW.followerUid = NEW.followeeUid THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot follow yourself';
    END IF;
END$$

DELIMITER ;

DELIMITER $$
-- -- Trigger to add new rating if the user hasn't rated the anime before
CREATE TRIGGER add_rating
AFTER INSERT ON Rating
FOR EACH ROW
BEGIN
  UPDATE Anime
  SET score = ROUND((score * numRating + NEW.score) / (numRating + 1), 2),
      numRating = numRating + 1
  WHERE aid = NEW.aid;
END$$

DELIMITER ;

DELIMITER $$
-- Trigger to update anime overall rating if the user resubmits the rating
CREATE TRIGGER update_rating
AFTER UPDATE ON Rating
FOR EACH ROW
BEGIN
  UPDATE Anime
  SET score = ROUND((score * numRating - OLD.score + NEW.score) / numRating, 2)
  WHERE aid = NEW.aid;
END$$

DELIMITER ;

