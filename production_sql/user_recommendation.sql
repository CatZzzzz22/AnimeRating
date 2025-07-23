WITH RECURSIVE SocialGraph (connected_uid, depth) AS (
    SELECT following AS connected_uid, 1 AS depth
    FROM Follow
    WHERE follower = [target_uid]

    UNION

    SELECT follower AS connected_uid, 1 AS depth
    FROM Follow
    WHERE following = [target_uid]

    UNION ALL

    SELECT f.following, sg.depth + 1
    FROM Follow f
    JOIN SocialGraph sg ON f.follower = sg.connected_uid
    WHERE sg.depth < 3

    UNION ALL

    SELECT f.follower, sg.depth + 1
    FROM Follow f
    JOIN SocialGraph sg ON f.following = sg.connected_uid
    WHERE sg.depth < 3
)

SELECT DISTINCT u.uid, u.username, u.uname, sg.depth
FROM SocialGraph sg
JOIN User u ON u.uid = sg.connected_uid
WHERE u.uid != [target_uid]
  AND u.uid NOT IN (
      SELECT following FROM Follow WHERE follower = [target_uid]
      UNION
      SELECT follower FROM Follow WHERE following = [target_uid]
  )
ORDER BY sg.depth, u.username
LIMIT 10;


