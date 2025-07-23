SET GLOBAL event_scheduler = ON;

DROP EVENT IF EXISTS daily_prune_view_history;

DELIMITER $$

CREATE EVENT IF NOT EXISTS daily_prune_view_history
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
  CALL prune_view_history();
END$$

DELIMITER ;