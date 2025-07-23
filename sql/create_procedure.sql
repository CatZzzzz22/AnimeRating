DROP PROCEDURE IF EXISTS prune_view_history;

DELIMITER $$

CREATE PROCEDURE prune_view_history()
BEGIN
    DELETE FROM ViewHistory
    WHERE (uid, aid) IN (
        SELECT uid, aid FROM (
            SELECT uid, aid,
            ROW_NUMBER() OVER (PARTITION BY uid ORDER BY viewed_date DESC) AS row_num
            FROM ViewHistory
        ) AS ranked
        WHERE row_num > 10
    );
END$$

DELIMITER ;


