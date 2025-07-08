INSERT INTO User (username, password, uname, gender, age, location, joinedDate)
VALUES (
  'newuser',
  '$2b$12$2H1EJ0y1CmFRLJYrrOqMIuPo6Se6ik2XQ7dkY10DZYZsmzn9UKo4C',  -- hashed 'newpass123'
  'Newbie',
  'F',
  19,
  'Toronto',
  '2024-06-01'
);

SELECT * FROM User WHERE username = 'newuser' AND password = '$2b$12$2H1EJ0y1CmFRLJYrrOqMIuPo6Se6ik2XQ7dkY10DZYZsmzn9UKo4C';

SELECT * FROM User WHERE username = 'bob_theman' AND password = 'testing';

DELETE FROM User WHERE username = 'newuser';
