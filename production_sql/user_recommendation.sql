WITH RECURSIVE FollowGraph AS (
  SELECT followeeUid, 1 AS level
  FROM UserFollow
  WHERE followerUid = %s

  UNION

  SELECT uf.followeeUid, fg.level + 1
  FROM UserFollow uf
  JOIN FollowGraph fg ON uf.followerUid = fg.followeeUid
  WHERE fg.level < 6
)

SELECT DISTINCT u.uid, u.username, u.uname, u.gender, u.age, u.location, u.joinedDate
FROM FollowGraph fg
JOIN User u ON u.uid = fg.followeeUid
WHERE u.uid != %s
AND u.uid NOT IN (
  SELECT followeeUid FROM UserFollow WHERE followerUid = %s
)
LIMIT 5;

