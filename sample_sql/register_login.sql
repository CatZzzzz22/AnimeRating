-- Register a new user
INSERT INTO User (username, password, uname, gender, age, joinedDate)
VALUES ('newuser123', 'newpass123', 'Newbie', 'F', 19, '2024-06-01');

-- Attempt to log in with correct credentials - should output [(uid)][(1)]
SELECT uid FROM User WHERE username = 'alice21' AND password = 'alicepass123';

-- Attempt to log in with incorrect credentials - should not output anything
SELECT uid FROM User WHERE username = 'bob_theman' AND password = 'wrongpass';

-- Clean up test user
DELETE FROM User WHERE username = 'newuser123';
