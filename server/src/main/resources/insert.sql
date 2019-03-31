INSERT INTO Permission(id, permissionName) VALUES (1, 'MODERATOR');
INSERT INTO Permission(id, permissionName) VALUES (2, 'EDITOR');
INSERT INTO Permission(id, permissionName) VALUES (3, 'CANDIDATE');

ALTER SEQUENCE Permission_seq RESTART WITH 4;

INSERT INTO Position(id, name, active) VALUES (1, 'Junior Machine Learning Engineer', true);
INSERT INTO Position(id, name, active) VALUES (2, 'Senior Recruiter', true);
INSERT INTO Position(id, name, active) VALUES (3, 'Network Engineer', true);

ALTER SEQUENCE masi.Position_seq RESTART WITH 4;

INSERT INTO Account(id, username, password, firstName, lastName, permission) VALUES (1, 'candidate','password','firstName','lastName',3);
INSERT INTO Account(id, username, password, firstName, lastName, permission) VALUES (2, 'moderator','password','firstName','lastName',1);
INSERT INTO Account(id, username, password, firstName, lastName, permission) VALUES (3, 'editor','password','firstName','lastName',2);

ALTER SEQUENCE Account_seq RESTART WITH 7;

INSERT INTO Question(id, content) VALUES (1, 'Explain the recurrence hidden behind recurrent neural network cells.');
INSERT INTO Question(id, content) VALUES (2, 'What will be the output of printing typeof(typeof(int)) in JavaScript?');
INSERT INTO Question(id, content) VALUES (3, 'Explain the memory overhead of polymorphism in C++.');
INSERT INTO Question(id, content) VALUES (4, 'What is the purpose of creating the StringBuilder object?');
INSERT INTO Question(id, content) VALUES (5, 'What is the purpose of creating the network namespaces (netns)?');

ALTER SEQUENCE Question_seq RESTART WITH 6;

INSERT INTO Test(id, position) VALUES (1, 1);
INSERT INTO Test(id, position) VALUES (2, 3);

ALTER SEQUENCE Test_seq RESTART WITH 3;

INSERT INTO test_question(test_id, question_id) VALUES (1, 1);
INSERT INTO test_question(test_id, question_id) VALUES (1, 2);
INSERT INTO test_question(test_id, question_id) VALUES (1, 3);
INSERT INTO test_question(test_id, question_id) VALUES (1, 4);
INSERT INTO test_question(test_id, question_id) VALUES (2, 3);
INSERT INTO test_question(test_id, question_id) VALUES (2, 5);