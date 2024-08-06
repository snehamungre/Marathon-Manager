DROP TABLE Volunteer cascade constraints;
DROP TABLE MarathonTable cascade constraints;
DROP TABLE Charity cascade constraints;
DROP TABLE RaceCategory cascade constraints;
DROP TABLE Runner cascade constraints;
DROP TABLE Sponsor cascade constraints;
DROP TABLE Vendor cascade constraints;
DROP TABLE Sponsors cascade constraints;
DROP TABLE Volunteers cascade constraints;
DROP TABLE RunnerRookie cascade constraints;
DROP TABLE RunnerElite cascade constraints;
DROP TABLE ComprisesTable cascade constraints;
DROP TABLE Registration cascade constraints;
DROP TABLE RaceCourse cascade constraints;
DROP TABLE Donates cascade constraints;
DROP TABLE Booths cascade constraints;
DROP TABLE Cause cascade constraints;



CREATE TABLE Volunteer (
    volunteerID NUMBER PRIMARY KEY,
    volunteerFirstName VARCHAR2(40) NOT NULL,
    volunteerLastName VARCHAR2(40),
    volunteerContact VARCHAR2(40) NOT NULL UNIQUE
);
CREATE TABLE MarathonTable (
    name VARCHAR2(40) NOT NULL,
    city VARCHAR2(40) NOT NULL,
    eventDate DATE NOT NULL,
    weatherCond VARCHAR2(40),
    PRIMARY KEY (name,eventDate)
);
CREATE TABLE Charity (
    charityName VARCHAR(40) PRIMARY KEY,
    country VARCHAR(20)
);
CREATE TABLE RaceCategory (
    categoryDistance NUMBER(4,1) PRIMARY KEY,
    fee INTEGER NOT NULL
);
CREATE TABLE Runner (
    runnerID INTEGER PRIMARY KEY,
    contact VARCHAR2(40),
    firstName VARCHAR2(40),
    lastName VARCHAR2(40),
    gender VARCHAR2(20) NOT NULL,
    age INTEGER NOT NULL
);
CREATE TABLE Sponsor (
    sponsorName VARCHAR(20) PRIMARY KEY,
    contribution INTEGER
);
CREATE TABLE Vendor (
    name VARCHAR(50) PRIMARY KEY,
    contact VARCHAR(25) NOT NULL,
    stallNo INTEGER,
    type VARCHAR(20) NOT NULL
);
CREATE TABLE Sponsors (
    marathonName VARCHAR(20) NOT NULL,
    marathonDate DATE NOT NULL,
    sponsorName VARCHAR(20) NOT NULL,
    PRIMARY KEY (marathonName, marathonDate, sponsorName),
    FOREIGN KEY (marathonName, marathonDate) REFERENCES MarathonTable(name,eventDate) ON DELETE CASCADE,
    FOREIGN KEY (sponsorName) REFERENCES Sponsor(sponsorName) ON DELETE CASCADE
);
CREATE TABLE Volunteers (
    id NUMBER NOT NULL,
    role VARCHAR(40) NOT NULL,
    marathonName VARCHAR(40) NOT NULL,
    marathonDate DATE NOT NULL,
    FOREIGN KEY (marathonName, marathonDate) REFERENCES MarathonTable(name,eventDate) ON DELETE CASCADE,
    FOREIGN KEY (id) REFERENCES Volunteer(volunteerID) ON DELETE CASCADE,
    PRIMARY KEY(id,marathonName,marathonDate)
);
CREATE TABLE RunnerRookie (
    runnerID INTEGER PRIMARY KEY,
    estimatedTime NUMBER,
    FOREIGN KEY (runnerID) REFERENCES Runner(runnerID) ON DELETE CASCADE
);
CREATE TABLE RunnerElite (
    runnerID INTEGER PRIMARY KEY,
    fastestKM NUMBER,
    FOREIGN KEY (runnerID) REFERENCES Runner(runnerID) ON DELETE CASCADE
);
CREATE TABLE ComprisesTable (
    name VARCHAR2(40) NOT NULL,
    eventDate DATE NOT NULL,
    categoryDistance NUMBER(4,1),
    startTime TIMESTAMP NOT NULL,
    PRIMARY KEY (name,eventDate,categoryDistance),
    FOREIGN KEY (name, eventDate) REFERENCES MarathonTable(name,eventDate) ON DELETE CASCADE,
    FOREIGN KEY (categoryDistance) REFERENCES RaceCategory(categoryDistance)
    ON DELETE CASCADE
);
CREATE TABLE Registration (
    confirmationID INTEGER NOT NULL,
    registrationDate DATE NOT NULL,
    finishTime INTEGER,
    runnerID INTEGER NOT NULL,
    eventName VARCHAR2(40) NOT NULL,
    eventDate DATE NOT NULL,
    categoryDistance NUMBER(4,1),
    PRIMARY KEY (confirmationID),
    FOREIGN KEY (runnerID) REFERENCES Runner(runnerID)
    ON DELETE CASCADE,
    FOREIGN KEY (eventName,eventDate,categoryDistance) REFERENCES ComprisesTable(name,eventDate,categoryDistance)
    ON DELETE CASCADE
);
CREATE TABLE RaceCourse (
    courseDistance NUMBER(4,1),
    courseName VARCHAR(20),
    terrainType VARCHAR(20),
    startPoint VARCHAR(20),
    endPoint VARCHAR(20),
    PRIMARY KEY (courseDistance, courseName),
    FOREIGN KEY (courseDistance) REFERENCES RaceCategory(categoryDistance) ON DELETE CASCADE
);
CREATE TABLE Donates (
    runnerID INTEGER NOT NULL,
    charityName VARCHAR2(40) NOT NULL,
    amount INTEGER,
    PRIMARY KEY (runnerID, charityName),
    FOREIGN KEY (runnerID) REFERENCES Runner(runnerID) ON DELETE CASCADE,
    FOREIGN KEY (charityName) REFERENCES Charity(charityName) ON DELETE CASCADE
);
CREATE TABLE Booths (
    vendorName VARCHAR(50),
    marathonDate DATE,
    marathonName VARCHAR(50),
    PRIMARY KEY (vendorName, marathonDate, marathonName),
    FOREIGN KEY (marathonName, marathonDate) REFERENCES MarathonTable(name,eventDate) ON DELETE CASCADE,
    FOREIGN KEY (vendorName) REFERENCES Vendor(name) ON DELETE CASCADE
);

CREATE TABLE Cause (
    charityName VARCHAR(20),
    cause VARCHAR(40),
    PRIMARY KEY (charityName, cause),
    FOREIGN KEY (charityName) REFERENCES
                Charity (charityName)
                ON DELETE CASCADE
);


INSERT INTO Volunteer VALUES (1, 'Amy', 'Cooper', 'amy@gmail.com');
INSERT INTO Volunteer VALUES (2, 'Sheldon', 'Cooper', 'sheldon@gmail.com');
INSERT INTO Volunteer VALUES (3, 'Leonard', 'Hofstader', 'leonard@gmail.com');
INSERT INTO Volunteer VALUES (4, 'Penny', 'Hofstader', 'penny@hotmail.com');
INSERT INTO Volunteer VALUES (5, 'Howard', 'Holowitz', 'howard@outlook.com');
INSERT INTO Volunteer VALUES (6, 'Bernadette', 'Holowitz', 'bernie@outlook.com');
INSERT INTO Volunteer VALUES (7, 'Raj', 'Kumar', 'raj@gmail.com');
INSERT INTO Volunteer VALUES (8, 'Mary', 'Copper', 'mary@gmail.com');
INSERT INTO Volunteer VALUES (9, 'Lucy', 'Gray', 'lucygray@district12.com');
INSERT INTO Volunteer VALUES (10, 'Cornelius', 'Snow', 'snow@capital.com');

INSERT INTO MarathonTable VALUES ('Great Trek', 'Vancouver', TO_DATE('2024-10-28', 'YYYY-MM-DD'), NULL);
INSERT INTO MarathonTable VALUES ('Great Trek', 'Vancouver', TO_DATE('2023-10-27', 'YYYY-MM-DD'), 'Rainy');
INSERT INTO MarathonTable VALUES ('Great Trek', 'Vancouver', TO_DATE('2022-10-26', 'YYYY-MM-DD'), 'Sunny');
INSERT INTO MarathonTable VALUES ('Chicago Marathon', 'Chicago', TO_DATE('2024-10-08', 'YYYY-MM-DD'), NULL);
INSERT INTO MarathonTable VALUES ('Chicago Marathon', 'Chicago', TO_DATE('2023-07-07', 'YYYY-MM-DD'), 'Cloudy');
INSERT INTO MarathonTable VALUES ('Chicago Marathon', 'Chicago', TO_DATE('2022-07-06', 'YYYY-MM-DD'), 'Clear');
INSERT INTO MarathonTable VALUES ('Boston Marathon', 'Boston', TO_DATE('2024-04-14', 'YYYY-MM-DD'), NULL);
INSERT INTO MarathonTable VALUES ('Boston Marathon', 'Boston', TO_DATE('2023-04-13', 'YYYY-MM-DD'), 'Clear');
INSERT INTO MarathonTable VALUES ('Boston Marathon', 'Boston', TO_DATE('2022-04-08', 'YYYY-MM-DD'), 'Clear');
INSERT INTO MarathonTable VALUES ('Mumbai Marathon', 'Mumbai', TO_DATE('2024-11-30', 'YYYY-MM-DD'), NULL);
INSERT INTO MarathonTable VALUES ('Mumbai Marathon', 'Mumbai', TO_DATE('2023-11-30', 'YYYY-MM-DD'), 'Clear');
INSERT INTO MarathonTable VALUES ('BMO Marathon', 'Vancouver', TO_DATE('2024-05-30', 'YYYY-MM-DD'), 'Clear');
INSERT INTO MarathonTable VALUES ('BMO Marathon', 'Vancouver', TO_DATE('2023-05-31', 'YYYY-MM-DD'), 'Clear');
INSERT INTO MarathonTable VALUES ('BMO Marathon', 'Vancouver', TO_DATE('2022-05-29', 'YYYY-MM-DD'), 'Clear');
INSERT INTO MarathonTable VALUES ('Demo Marathon', 'Demo City', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 'Demo Weather');


INSERT INTO Charity VALUES ('Red Cross', 'USA');
INSERT INTO Charity VALUES ('Malala Fund', 'International');
INSERT INTO Charity VALUES ('Tata Foundation', 'India');
INSERT INTO Charity VALUES ('WWF', 'International');
INSERT INTO Charity VALUES ('Greenpeace', 'USA');
INSERT INTO Charity VALUES ('Save the Children', 'International');
INSERT INTO Charity VALUES ('Reliance Foundation', 'India');
INSERT INTO Charity VALUES ('Salvation Army BC', 'Canada');
INSERT INTO Charity VALUES ('UNICEF', 'Canada');
INSERT INTO Charity VALUES ('Canadian Cancer Society', 'Canada');

INSERT INTO RaceCategory VALUES (5, 30);
INSERT INTO RaceCategory VALUES (10, 55);
INSERT INTO RaceCategory VALUES (21.1, 80);
INSERT INTO RaceCategory VALUES (42.2, 100);

INSERT INTO RaceCourse VALUES (5, 'UBC', 'Trail', 'Pacific Park', 'Pacific Park');
INSERT INTO RaceCourse VALUES (10, 'UBC', 'Paved', 'Main Mall', 'Flag Pole');
INSERT INTO RaceCourse VALUES (21.1, 'UBC', 'Paved', 'Main Mall', 'Flag Pole');

INSERT INTO RaceCourse VALUES (5, 'Mumbai', 'City', 'Marine Drive', 'Sea Link');
INSERT INTO RaceCourse VALUES (10, 'Mumbai', 'City', 'Marine Drive', 'Sea Link');
INSERT INTO RaceCourse VALUES (21.1, 'Mumbai', 'City', 'Marine Drive', 'Sea Link');
INSERT INTO RaceCourse VALUES (42.2, 'Mumbai', 'City', 'Marine Drive', 'Sea Link');

INSERT INTO RaceCourse VALUES (5, 'Chicago', 'Paved', 'Millenium Park', 'Navy Pier');
INSERT INTO RaceCourse VALUES (10, 'Chicago', 'Paved', 'Millenium Park', 'Navy Pier');
INSERT INTO RaceCourse VALUES (21.1, 'Chicago', 'City', 'Navy Pier', 'Millenium Park');
INSERT INTO RaceCourse VALUES (42.2, 'Chicago', 'City', 'Navy Pier', 'Millenium Park');

INSERT INTO RaceCourse VALUES (5, 'Boston', 'Trail', 'Boston Garden', 'Freedom Trail');
INSERT INTO RaceCourse VALUES (10, 'Boston', 'City', 'Navy Yard', 'Freedom Trail');
INSERT INTO RaceCourse VALUES (21.1, 'Boston', 'City', 'Freedom Trail','Navy Yard');
INSERT INTO RaceCourse VALUES (42.2, 'Boston', 'City', 'Freedom Trail', 'Navy Yard');

INSERT INTO RaceCourse VALUES (5, 'Vancouver', 'Trail', 'Pacific Park', 'Pacific Park');
INSERT INTO RaceCourse VALUES (10, 'Vancouver', 'Trail', 'Pacific Park', 'Pacific Park');
INSERT INTO RaceCourse VALUES (21.1, 'Vancouver', 'Trail', 'Stanley Park', 'Yaletown');
INSERT INTO RaceCourse VALUES (42.2, 'Vancouver', 'City', 'Yaletown', 'Stanley Park');


INSERT INTO ComprisesTable VALUES ('Great Trek', TO_DATE('2024-10-28', 'YYYY-MM-DD'), 5, TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Great Trek', TO_DATE('2024-10-28', 'YYYY-MM-DD'), 10, TO_TIMESTAMP('08:15:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Great Trek', TO_DATE('2024-10-28', 'YYYY-MM-DD'), 21.1, TO_TIMESTAMP('08:45:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Great Trek', TO_DATE('2023-10-27', 'YYYY-MM-DD'), 5, TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Great Trek', TO_DATE('2023-10-27', 'YYYY-MM-DD'), 10, TO_TIMESTAMP('08:15:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Great Trek', TO_DATE('2023-10-27', 'YYYY-MM-DD'), 21.1, TO_TIMESTAMP('08:45:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Great Trek', TO_DATE('2022-10-26', 'YYYY-MM-DD'), 5, TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Great Trek', TO_DATE('2022-10-26', 'YYYY-MM-DD'), 10, TO_TIMESTAMP('08:15:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Great Trek', TO_DATE('2022-10-26', 'YYYY-MM-DD'), 21.1, TO_TIMESTAMP('08:45:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Mumbai Marathon', TO_DATE('2023-11-30', 'YYYY-MM-DD'), 10, TO_TIMESTAMP('08:30:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Mumbai Marathon', TO_DATE('2023-11-30', 'YYYY-MM-DD'), 21.1, TO_TIMESTAMP('08:40:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Mumbai Marathon', TO_DATE('2023-11-30', 'YYYY-MM-DD'), 42.2, TO_TIMESTAMP('08:50:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Mumbai Marathon', TO_DATE('2024-11-30', 'YYYY-MM-DD'), 10, TO_TIMESTAMP('08:30:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Mumbai Marathon', TO_DATE('2024-11-30', 'YYYY-MM-DD'), 21.1, TO_TIMESTAMP('08:40:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Mumbai Marathon', TO_DATE('2024-11-30', 'YYYY-MM-DD'), 42.2, TO_TIMESTAMP('08:50:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Chicago Marathon', TO_DATE('2024-10-08', 'YYYY-MM-DD'), 42.2, TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Chicago Marathon', TO_DATE('2023-07-07', 'YYYY-MM-DD'), 42.2, TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Chicago Marathon', TO_DATE('2022-07-06', 'YYYY-MM-DD'), 42.2, TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Boston Marathon', TO_DATE('2024-04-14', 'YYYY-MM-DD'), 42.2, TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Boston Marathon', TO_DATE('2023-04-13', 'YYYY-MM-DD'), 42.2, TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Boston Marathon', TO_DATE('2022-04-08', 'YYYY-MM-DD'), 42.2, TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('BMO Marathon', TO_DATE('2024-05-30', 'YYYY-MM-DD'), 42.2, TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('BMO Marathon', TO_DATE('2023-05-31', 'YYYY-MM-DD'), 42.2, TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('BMO Marathon', TO_DATE('2022-05-29', 'YYYY-MM-DD'), 42.2, TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('BMO Marathon', TO_DATE('2024-05-30', 'YYYY-MM-DD'), 21.1, TO_TIMESTAMP('08:30:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('BMO Marathon', TO_DATE('2023-05-31', 'YYYY-MM-DD'), 21.1, TO_TIMESTAMP('08:30:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('BMO Marathon', TO_DATE('2022-05-29', 'YYYY-MM-DD'), 21.1, TO_TIMESTAMP('08:30:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 5, TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 10, TO_TIMESTAMP('08:15:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 21.1, TO_TIMESTAMP('08:30:00', 'HH24:MI:SS'));
INSERT INTO ComprisesTable VALUES ('Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 42.2, TO_TIMESTAMP('08:45:00', 'HH24:MI:SS'));



INSERT INTO Volunteers VALUES (1, 'Water Station Attendant', 'Great Trek', TO_DATE('2024-10-28', 'YYYY-MM-DD'));
INSERT INTO Volunteers VALUES (2, 'Registration and Packet Pickup', 'Great Trek', TO_DATE('2024-10-28', 'YYYY-MM-DD'));
INSERT INTO Volunteers VALUES (3, 'Medical Team Support', 'Chicago Marathon', TO_DATE('2024-10-08', 'YYYY-MM-DD'));
INSERT INTO Volunteers VALUES (4, 'Cheer Squad', 'Chicago Marathon', TO_DATE('2024-10-08', 'YYYY-MM-DD'));
INSERT INTO Volunteers VALUES (5, 'Photographer', 'Boston Marathon', TO_DATE('2024-04-14', 'YYYY-MM-DD'));
INSERT INTO Volunteers VALUES (6, 'Social Media and Communications', 'Boston Marathon', TO_DATE('2024-04-14', 'YYYY-MM-DD'));
INSERT INTO Volunteers VALUES (7, 'Videographer', 'Boston Marathon', TO_DATE('2024-04-14', 'YYYY-MM-DD'));
INSERT INTO Volunteers VALUES (8, 'Medical Team Support', 'Mumbai Marathon', TO_DATE('2024-11-30', 'YYYY-MM-DD'));
INSERT INTO Volunteers VALUES (9, 'Water Station Attendant', 'Mumbai Marathon', TO_DATE('2024-11-30', 'YYYY-MM-DD'));
INSERT INTO Volunteers VALUES (10, 'Registration and Packet Pickup', 'BMO Marathon', TO_DATE('2024-05-30', 'YYYY-MM-DD'));

INSERT INTO Vendor VALUES ('Energize Nutrition', '123-456-7890', 1, 'Nutrition');
INSERT INTO Vendor VALUES ('Runners Refuel Station', '987-654-3210', 2, 'Snacks');
INSERT INTO Vendor VALUES ('Hydrate Hub', '555-123-4567', 3, 'Beverages');
INSERT INTO Vendor VALUES ('Sports Gear Zone', '777-888-9999', 4, 'Sporting Goods');
INSERT INTO Vendor VALUES ('Recovery Essentials', '444-333-2222', 5, 'Recovery Products');
INSERT INTO Vendor VALUES ('Marathon Merchandise', '666-555-4444', 6, 'Merchandise');
INSERT INTO Vendor VALUES ('Healthy Snack Haven', '222-111-0000', 7, 'Healthy Snacks');
INSERT INTO Vendor VALUES ('Footwear Fit Zone', '888-999-0001', 8, 'Footwear');
INSERT INTO Vendor VALUES ('Tech Gadgets Galore', '111-222-3333', 9, 'Technology');
INSERT INTO Vendor VALUES ('Motivational Books', '999-000-1111', 10, 'Books');

INSERT INTO Booths VALUES ('Energize Nutrition', TO_DATE('2024-10-28', 'YYYY-MM-DD'), 'Great Trek');
INSERT INTO Booths VALUES ('Runners Refuel Station', TO_DATE('2024-10-28', 'YYYY-MM-DD'),'Great Trek');
INSERT INTO Booths VALUES ('Hydrate Hub', TO_DATE('2024-10-08', 'YYYY-MM-DD'), 'Chicago Marathon');
INSERT INTO Booths VALUES ('Sports Gear Zone', TO_DATE('2024-10-08', 'YYYY-MM-DD'), 'Chicago Marathon');
INSERT INTO Booths VALUES ('Recovery Essentials', TO_DATE('2024-04-14', 'YYYY-MM-DD'), 'Boston Marathon');
INSERT INTO Booths VALUES ('Marathon Merchandise', TO_DATE('2024-04-14', 'YYYY-MM-DD'), 'Boston Marathon');
INSERT INTO Booths VALUES ('Healthy Snack Haven', TO_DATE('2024-04-14', 'YYYY-MM-DD'),  'Boston Marathon');
INSERT INTO Booths VALUES ('Footwear Fit Zone', TO_DATE('2024-11-30', 'YYYY-MM-DD'),  'Mumbai Marathon');
INSERT INTO Booths VALUES ('Tech Gadgets Galore', TO_DATE('2024-11-30', 'YYYY-MM-DD'),  'Mumbai Marathon');
INSERT INTO Booths VALUES ('Motivational Books', TO_DATE('2024-05-30', 'YYYY-MM-DD'),  'BMO Marathon');

INSERT INTO Sponsor VALUES ('BMO', 100000);
INSERT INTO Sponsor VALUES ('BlueShore', 75000);
INSERT INTO Sponsor VALUES ('TCS', 120000);
INSERT INTO Sponsor VALUES ('Goldman Sachs', 50000);
INSERT INTO Sponsor VALUES ('Reliance', 80000);

INSERT INTO Sponsors VALUES ('BMO Marathon', TO_DATE('2024-05-30', 'YYYY-MM-DD'), 'BMO');
INSERT INTO Sponsors VALUES ('Great Trek', TO_DATE('2024-10-28', 'YYYY-MM-DD'), 'BlueShore');
INSERT INTO Sponsors VALUES ('Boston Marathon', TO_DATE('2024-04-14', 'YYYY-MM-DD'), 'TCS');
INSERT INTO Sponsors VALUES ('Mumbai Marathon', TO_DATE('2024-11-30', 'YYYY-MM-DD'), 'Reliance');
INSERT INTO Sponsors VALUES ('Chicago Marathon', TO_DATE('2024-10-08', 'YYYY-MM-DD'), 'Goldman Sachs');

INSERT INTO Runner VALUES (1, 'eleanorbennet1@example.com', 'Eleanor', 'Bennet', 'female', 28);
INSERT INTO Runner VALUES (2, 'felixmontgomery2@example.com', 'Felix', 'Montgomery', 'male', 35);
INSERT INTO Runner VALUES (3, 'serenafitzgerald3@example.com', 'Serena', 'Fitzgerald', 'female', 22);
INSERT INTO Runner VALUES (4, 'adrianpembroke4@example.com', 'Adrian', 'Pembroke', 'male', 31);
INSERT INTO Runner VALUES (5, 'ariathorne5@example.com', 'Aria', 'Thorne', 'female', 26);
INSERT INTO Runner VALUES (6, 'xavierdonovan6@example.com', 'Xavier', 'Donovan', 'male', 29);
INSERT INTO Runner VALUES (7, 'elarawindsor7@example.com', 'Elara', 'Windsor', 'female', 24);
INSERT INTO Runner VALUES (8, 'danteharrington8@example.com', 'Dante', 'Harrington', 'male', 30);
INSERT INTO Runner VALUES (9, 'novasinclair9@example.com', 'Nova', 'Sinclair', 'female', 27);
INSERT INTO Runner VALUES (10, 'caspiankensington10@example.com', 'Caspian', 'Kensington', 'male', 32);
INSERT INTO Runner VALUES (11, 'aliciamartin11@example.com', 'Alicia', 'Martin', 'female', 15);
INSERT INTO Runner VALUES (12, 'brandonfoster12@example.com', 'Brandon', 'Foster', 'male', 18);
INSERT INTO Runner VALUES (13, 'zoeyjohnson13@example.com', 'Zoey', 'Johnson', 'female', 20);
INSERT INTO Runner VALUES (14, 'nathanhale14@example.com', 'Nathan', 'Hale', 'male', 40);
INSERT INTO Runner VALUES (15, 'emilybaker15@example.com', 'Emily', 'Baker', 'female', 45);
INSERT INTO Runner VALUES (16, 'oliveranderson16@example.com', 'Oliver', 'Anderson', 'male', 48);
INSERT INTO Runner VALUES (17, 'isabellacook17@example.com', 'Isabella', 'Cook', 'female', 55);
INSERT INTO Runner VALUES (18, 'ethanjones18@example.com', 'Ethan', 'Jones', 'male', 60);
INSERT INTO Runner VALUES (19, 'elizabethbennet@example.com', 'Elizabeth', 'Bennet', 'female', 23);
INSERT INTO Runner VALUES (20, 'fitzwilliamdarcy@example.com', 'Fitzwilliam', 'Darcy', 'male', 28);
INSERT INTO Runner VALUES (21, 'janebennet@example.com', 'Jane', 'Bennet', 'female', 25);
INSERT INTO Runner VALUES (22, 'charlotteLucas@example.com', 'Charlotte', 'Lucas', 'female', 27);
INSERT INTO Runner VALUES (23, 'georgeWickham@example.com', 'George', 'Wickham', 'male', 26);
INSERT INTO Runner VALUES (24, 'lydiaBennet@example.com', 'Lydia', 'Bennet', 'female', 20);
INSERT INTO Runner VALUES (25, 'carolineBingley@example.com', 'Caroline', 'Bingley', 'female', 29);
INSERT INTO Runner VALUES (26, 'kittyBennet@example.com', 'Kitty', 'Bennet', 'female', 42);
INSERT INTO Runner VALUES (27, 'maryBennet@example.com', 'Mary', 'Bennet', 'female', 22);
INSERT INTO Runner VALUES (28, 'williamCollins@example.com', 'William', 'Collins', 'male', 30);
INSERT INTO Runner VALUES (29, 'catherineDeBourgh@example.com', 'Catherine', 'de Bourgh', 'female', 50);
INSERT INTO Runner VALUES (30, 'percysthunder@example.com', 'Percy', 'Jackson', 'male', 17);
INSERT INTO Runner VALUES (31, 'annabethwisdom@example.com', 'Annabeth', 'Chase', 'female', 17);
INSERT INTO Runner VALUES (32, 'grovernature@example.com', 'Grover', 'Underwood', 'male', 28);
INSERT INTO Runner VALUES (33, 'thaliathunder@example.com', 'Thalia', 'Grace', 'female', 16);
INSERT INTO Runner VALUES (34, 'nicoShadows@example.com', 'Nico', 'di Angelo', 'male', 25);
INSERT INTO Runner VALUES (35, 'clarissawarrior@example.com', 'Clarisse', 'La Rue', 'female', 18);
INSERT INTO Runner VALUES (36, 'jasonstorm@example.com', 'Jason', 'Grace', 'male', 26);
INSERT INTO Runner VALUES (37, 'pipercharms@example.com', 'Piper', 'McLean', 'female', 23);
INSERT INTO Runner VALUES (38, 'leoengineer@example.com', 'Leo', 'Valdez', 'male', 26);
INSERT INTO Runner VALUES (39, 'franktransform@example.com', 'Frank', 'Zhang', 'male', 16);
INSERT INTO Runner VALUES (40, 'hazelwisdom@example.com', 'Hazel', 'Levesque', 'female', 20);
INSERT INTO Runner VALUES (41, 'demorunner1000@example.com', 'Demo', 'Runner1000', 'male', 39);
INSERT INTO Runner VALUES (42, 'demorunner1001@example.com', 'Demo', 'Runner1001', 'male', 27);
INSERT INTO Runner VALUES (43, 'demorunner1002@example.com', 'Demo', 'Runner1002', 'female',27);
INSERT INTO Runner VALUES (44, 'demorunner1003@example.com', 'Demo', 'Runner1003', 'female', 35);
INSERT INTO Runner VALUES (45, 'demorunner2000@example.com', 'Demo', 'Runner2000', 'male', 27);
INSERT INTO Runner VALUES (46, 'demorunner2001@example.com', 'Demo', 'Runner2001', 'male', 29);
INSERT INTO Runner VALUES (47, 'demorunner2002@example.com', 'Demo', 'Runner2002', 'female', 31);
INSERT INTO Runner VALUES (48, 'demorunner2003@example.com', 'Demo', 'Runner2003', 'female', 45);
INSERT INTO Runner VALUES (49, 'demorunner3000@example.com', 'Demo', 'Runner3000', 'male', 29);
INSERT INTO Runner VALUES (50, 'demorunner3001@example.com', 'Demo', 'Runner3001', 'male', 20);
INSERT INTO Runner VALUES (51, 'demorunner3002@example.com', 'Demo', 'Runner3002', 'female', 32);
INSERT INTO Runner VALUES (52, 'demorunner3003@example.com', 'Demo', 'Runner3003', 'female', 41);
INSERT INTO Runner VALUES (53, 'demorunner4000@example.com', 'Demo', 'Runner4000', 'male', 19);
INSERT INTO Runner VALUES (54, 'demorunner4001@example.com', 'Demo', 'Runner4001', 'male', 24);
INSERT INTO Runner VALUES (55, 'demorunner4002@example.com', 'Demo', 'Runner4002', 'female', 32);
INSERT INTO Runner VALUES (56, 'demorunner4003@example.com', 'Demo', 'Runner4003', 'female', 42);

INSERT INTO RunnerElite VALUES (1, 5.5);
INSERT INTO RunnerElite VALUES (2, 4.8);
INSERT INTO RunnerElite VALUES (3, 5.2);
INSERT INTO RunnerElite VALUES (4, 3.6);
INSERT INTO RunnerElite VALUES (5, 4.2);
INSERT INTO RunnerElite VALUES (6, 4.9);
INSERT INTO RunnerElite VALUES (7, 5.8);
INSERT INTO RunnerElite VALUES (8, 3.4);
INSERT INTO RunnerElite VALUES (9, 5.7);
INSERT INTO RunnerElite VALUES (10, 5.9);
INSERT INTO RunnerElite VALUES (30, 5.2);
INSERT INTO RunnerElite VALUES (31, 5.5);
INSERT INTO RunnerElite VALUES (32, 4.8);
INSERT INTO RunnerElite VALUES (33, 5.9);
INSERT INTO RunnerElite VALUES (34, 5.3);
INSERT INTO RunnerElite VALUES (35, 5.7);
INSERT INTO RunnerElite VALUES (36, 5.1);
INSERT INTO RunnerElite VALUES (37, 5.6);
INSERT INTO RunnerElite VALUES (38, 4.9);
INSERT INTO RunnerElite VALUES (39, 5.4);
INSERT INTO RunnerElite VALUES (40, 5.8);

--elite runners for demo marathon 
-- INSERT INTO RunnerElite VALUES (41, 5.5);
-- INSERT INTO RunnerElite VALUES (42, 4.8);
-- INSERT INTO RunnerElite VALUES (45, 5.2);
-- INSERT INTO RunnerElite VALUES (46, 3.6);
-- INSERT INTO RunnerElite VALUES (49, 4.2);
-- INSERT INTO RunnerElite VALUES (50, 4.9);
-- INSERT INTO RunnerElite VALUES (53, 5.8);
-- INSERT INTO RunnerElite VALUES (54, 3.4);


-- rookie runners for demo marathon
-- INSERT INTO RunnerRookie VALUES (43, 11.2);
-- INSERT INTO RunnerRookie VALUES (44, 9.8);
-- INSERT INTO RunnerRookie VALUES (47, 12.0);
-- INSERT INTO RunnerRookie VALUES (48, 11.8);
-- INSERT INTO RunnerRookie VALUES (51, 10.9);
-- INSERT INTO RunnerRookie VALUES (52, 11.5);
-- INSERT INTO RunnerRookie VALUES (55, 12.2);
-- INSERT INTO RunnerRookie VALUES (56, 10.2);

INSERT INTO RunnerRookie VALUES (11, 11.2);
INSERT INTO RunnerRookie VALUES (12, 9.8);
INSERT INTO RunnerRookie VALUES (13, 12.0);
INSERT INTO RunnerRookie VALUES (14, 11.8);
INSERT INTO RunnerRookie VALUES (15, 10.9);
INSERT INTO RunnerRookie VALUES (16, 11.5);
INSERT INTO RunnerRookie VALUES (17, 12.2);
INSERT INTO RunnerRookie VALUES (18, 10.2);
INSERT INTO RunnerRookie VALUES (19, 11.0);
INSERT INTO RunnerRookie VALUES (20, 10.8);
INSERT INTO RunnerRookie VALUES (22, 10.8);

-- (confirmationID, registrationDate, finishTime, runnerID, eventName, eventDate, categoryDistance) 
INSERT INTO Registration VALUES (1001, TO_DATE('2023-01-15', 'YYYY-MM-DD'), NULL, 5, 'BMO Marathon', TO_DATE('2024-05-30', 'YYYY-MM-DD'), 42.2);
INSERT INTO Registration VALUES (1002, TO_DATE('2023-02-28', 'YYYY-MM-DD'), 90, 12, 'BMO Marathon', TO_DATE('2023-05-31', 'YYYY-MM-DD'), 21.1);
INSERT INTO Registration VALUES (1003, TO_DATE('2023-03-17', 'YYYY-MM-DD'), NULL, 28, 'Great Trek', TO_DATE('2024-10-28', 'YYYY-MM-DD'), 10);
INSERT INTO Registration VALUES (1004, TO_DATE('2023-04-05', 'YYYY-MM-DD'), 300, 15, 'Great Trek', TO_DATE('2023-10-27', 'YYYY-MM-DD'), 5);
INSERT INTO Registration VALUES (1005, TO_DATE('2023-05-22', 'YYYY-MM-DD'), NULL, 33, 'Boston Marathon', TO_DATE('2024-04-14', 'YYYY-MM-DD'), 42.2);
INSERT INTO Registration VALUES (1006, TO_DATE('2023-06-11', 'YYYY-MM-DD'), 230, 7, 'Boston Marathon', TO_DATE('2023-04-13', 'YYYY-MM-DD'), 42.2);
INSERT INTO Registration VALUES (1007, TO_DATE('2023-07-04', 'YYYY-MM-DD'), NULL, 22, 'Chicago Marathon', TO_DATE('2024-10-08', 'YYYY-MM-DD'), 42.2);
INSERT INTO Registration VALUES (1008, TO_DATE('2023-08-19', 'YYYY-MM-DD'), 210, 38, 'Chicago Marathon', TO_DATE('2023-07-07', 'YYYY-MM-DD'), 42.2);
INSERT INTO Registration VALUES (1009, TO_DATE('2023-09-02', 'YYYY-MM-DD'), NULL, 10, 'Mumbai Marathon', TO_DATE('2024-11-30', 'YYYY-MM-DD'), 42.2);
INSERT INTO Registration VALUES (1010, TO_DATE('2023-10-11', 'YYYY-MM-DD'), 140, 19, 'Mumbai Marathon', TO_DATE('2023-11-30', 'YYYY-MM-DD'), 21.1);
INSERT INTO Registration VALUES (1011, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 720, 41, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 5);
INSERT INTO Registration VALUES (1012, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 900, 42, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 5);
INSERT INTO Registration VALUES (1013, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 1100, 43, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 5);
INSERT INTO Registration VALUES (1014, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 1200, 44, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 5);
INSERT INTO Registration VALUES (1015, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 1800, 45, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 10);
INSERT INTO Registration VALUES (1016, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 2100, 46, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 10);
INSERT INTO Registration VALUES (1017, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 2220, 47, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 10);
INSERT INTO Registration VALUES (1018, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 2400, 48, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 10);
INSERT INTO Registration VALUES (1019, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 3900, 49, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 21.1);
INSERT INTO Registration VALUES (1020, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 4000, 50, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 21.1);
INSERT INTO Registration VALUES (1021, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 4050, 51, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 21.1);
INSERT INTO Registration VALUES (1022, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 4100, 52, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 21.1);
INSERT INTO Registration VALUES (1023, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 7200, 53, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 42.2);
INSERT INTO Registration VALUES (1024, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 7300, 54, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 42.2);
INSERT INTO Registration VALUES (1025, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 7350, 55, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 42.2);
INSERT INTO Registration VALUES (1026, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 7400, 56, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 42.2);
INSERT INTO Registration VALUES (1027, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 7200, 30, 'BMO Marathon', TO_DATE('2023-05-31', 'YYYY-MM-DD'), 42.2);
INSERT INTO Registration VALUES (1028, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 7200, 30, 'Great Trek', TO_DATE('2023-10-27', 'YYYY-MM-DD'), 21.1);
INSERT INTO Registration VALUES (1029, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 7200, 30, 'Mumbai Marathon', TO_DATE('2023-11-30', 'YYYY-MM-DD'), 42.2);
INSERT INTO Registration VALUES (1030, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 7200, 30, 'Chicago Marathon', TO_DATE('2023-07-07', 'YYYY-MM-DD'), 42.2);
INSERT INTO Registration VALUES (1031, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 7200, 30, 'Boston Marathon', TO_DATE('2023-04-13', 'YYYY-MM-DD'), 42.2);
INSERT INTO Registration VALUES (1032, TO_DATE('2023-05-28', 'YYYY-MM-DD'), 7200, 30, 'Demo Marathon', TO_DATE('2023-10-28', 'YYYY-MM-DD'), 42.2);

INSERT INTO Cause VALUES ('Red Cross', 'Humanitarian Aid');
INSERT INTO Cause VALUES ('Malala Fund', 'Education');
INSERT INTO Cause VALUES ('Greenpeace', 'Environment');
INSERT INTO Cause VALUES ('UNICEF', 'Education');
INSERT INTO Cause VALUES ('WWF', 'Environment');

INSERT INTO Donates VALUES (1,'Red Cross', 40);
INSERT INTO Donates VALUES (2,'Malala Fund', 80);
INSERT INTO Donates VALUES (3,'Greenpeace', 20);
INSERT INTO Donates VALUES (2,'UNICEF', 50);
INSERT INTO Donates VALUES (5,'WWF', 40);
INSERT INTO Donates VALUES (7,'UNICEF', 40);


