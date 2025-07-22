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

-- User with uid 103316 follows user with uid 119
INSERT INTO UserFollow VALUES (119, 103316);

-- Users that User with uid 103316 follows
SELECT followerUid
FROM UserFollow
WHERE followeeUid = 103316;

-- User with uid 103316 unfollows user with uid 119
DELETE FROM UserFollow 
WHERE followeeUid = 103316 and followerUid = 119;

-- Users that User with uid 103316 follows after unfollow
SELECT followerUid
FROM UserFollow
WHERE followeeUid = 103316;