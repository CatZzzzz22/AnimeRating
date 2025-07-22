DROP TRIGGER IF EXISTS prevent_self_follow;

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

-- User with uid 2 follows user with uid 1
INSERT INTO UserFollow VALUES (1, 2);

-- Users that User with uid 2 follows
SELECT followeeUid
FROM UserFollow
WHERE followerUid = 2;

-- User with uid 2 unfollows user with uid 1
DELETE FROM UserFollow
WHERE followeeUid = 2 and followerUid = 1;

-- Users that User with uid 2 follows after unfollows
SELECT followeeUid
FROM UserFollow
WHERE followerUid = 2;