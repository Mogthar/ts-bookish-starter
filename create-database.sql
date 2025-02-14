DROP TABLE WROTE;
DROP TABLE BOOKEDBOOKS;
DROP TABLE USERS;
DROP TABLE AUTHORS;
DROP TABLE CATALOGUE;

CREATE TABLE Catalogue (
	ISBN int NOT NULL,
	BookName varchar(255) NOT NULL,
	CopiesOwned int NOT NULL,
	PRIMARY KEY (ISBN)
);

CREATE TABLE Authors (
	AuthorID int NOT NULL AUTO_INCREMENT,
	AuthorName varchar(255) NOT NULL,
	PRIMARY KEY (AuthorID)
);

CREATE TABLE Users (
	UserName varchar(255) NOT NULL,
	Token varchar(255) NOT NULL,
	PRIMARY KEY (UserName)
);

CREATE TABLE BookedBooks (
	ID int NOT NULL AUTO_INCREMENT,
	ISBN int NOT NULL,
	UserName varchar(255) NOT NULL,
	DateDue date NOT NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (ISBN) REFERENCES Catalogue(ISBN),
	FOREIGN KEY (UserName) REFERENCES Users(UserName)
);

CREATE TABLE Wrote (
	ID int IDENTITY(0,1) NOT NULL,
	AuthorID int NOT NULL,
	ISBN int NOT NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (AuthorID) REFERENCES Authors(AuthorID),
	FOREIGN KEY (ISBN) REFERENCES Catalogue(ISBN)
);