INSERT INTO Permission(id, permission_name) VALUES (1, 'MODERATOR');
INSERT INTO Permission(id, permission_name) VALUES (2, 'EDITOR');
INSERT INTO Permission(id, permission_name) VALUES (3, 'CANDIDATE');

--ALTER SEQUENCE Permission_seq RESTART WITH 4;

INSERT INTO Position(id, name, active) VALUES (1, 'Junior Machine Learning Engineer', true);
INSERT INTO Position(id, name, active) VALUES (2, 'Senior Recruiter', true);
INSERT INTO Position(id, name, active) VALUES (3, 'Network Engineer', true);

--ALTER SEQUENCE Position_seq RESTART WITH 4;

-- password: password
INSERT INTO Account(id, username, password, first_name, last_name, permission_id) VALUES (1, 'candidate','$2a$10$Fzg3T4YiOP4ij3NeqCZoue0Ff6TXlRX.i//V6E6fXBkH0NzqSC4JS','firstName','lastName',3);
INSERT INTO Account(id, username, password, first_name, last_name, permission_id) VALUES (2, 'moderator','$2a$10$Fzg3T4YiOP4ij3NeqCZoue0Ff6TXlRX.i//V6E6fXBkH0NzqSC4JS','firstName','lastName',1);
INSERT INTO Account(id, username, password, first_name, last_name, permission_id) VALUES (3, 'editor','$2a$10$Fzg3T4YiOP4ij3NeqCZoue0Ff6TXlRX.i//V6E6fXBkH0NzqSC4JS', 'firstName', 'lastName',2);

--ALTER SEQUENCE Account_seq RESTART WITH 7;

INSERT INTO Question(id, content, question_type, name) VALUES (1, 'Explain the recurrence hidden behind recurrent neural network cells.', 'OPEN', 'Recurrence');
INSERT INTO Question(id, content, question_type, name) VALUES (2, 'What will be the output of printing typeof(typeof(int)) in JavaScript?', 'OPEN', 'Typeof');
INSERT INTO Question(id, content, question_type, name) VALUES (3, 'Explain the memory overhead of polymorphism in C++.', 'OPEN', 'Polymorphism');
INSERT INTO Question(id, content, question_type, name) VALUES (4, 'What is the purpose of creating the StringBuilder object?','OPEN', 'StringBuilder');
INSERT INTO Question(id, content, question_type, name) VALUES (5, 'What is the purpose of creating the network namespaces (netns)?','OPEN', 'Netns');
INSERT INTO Question(id, content, question_type, name) VALUES (6, 'What will be the output of printing the res variable int8_t res=2&1;?','NUMERICAL', 'Expression');
INSERT INTO Question(id, content, question_type, name) VALUES (7, 'Python is statically or dynamically typed?','CHOICE', 'Python');

--ALTER SEQUENCE Question_seq RESTART WITH 6;

INSERT INTO Test(id, name, position_id) VALUES (1, 'Junior Engineer test', 1);
INSERT INTO Test(id, name, position_id) VALUES (2, 'Network Engineer test', 3);

--ALTER SEQUENCE Test_seq RESTART WITH 3;

INSERT INTO test_question(test_id, question_id) VALUES (1, 1);
INSERT INTO test_question(test_id, question_id) VALUES (1, 2);
INSERT INTO test_question(test_id, question_id) VALUES (1, 3);
INSERT INTO test_question(test_id, question_id) VALUES (1, 4);
INSERT INTO test_question(test_id, question_id) VALUES (1, 6);
INSERT INTO test_question(test_id, question_id) VALUES (1, 7);
INSERT INTO test_question(test_id, question_id) VALUES (2, 3);
INSERT INTO test_question(test_id, question_id) VALUES (2, 5);
INSERT INTO test_question(test_id, question_id) VALUES (2, 6);
INSERT INTO test_question(test_id, question_id) VALUES (2, 7);