DROP DATABASE IF EXISTS accessibleWarehouse; /* Delete the old Database if it existed*/
CREATE DATABASE accessibleWarehouse; /* create the Database to store all the Tables for the system*/
USE studylog; /* select the new Database*/

CREATE TABLE IF NOT EXISTS User (
     ID INT NOT NULL AUTO_INCREMENT,
     /*googleToken CHAR(21) UNIQUE NOT NULL,*/
     name varchar(60) NOT NULL,
     accessLevel int NOT NULL DEFAULT 1,
     driverType BOOLEAN NOT NULL DEFAULT 0,
     PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Locations (
     ID INT NOT NULL AUTO_INCREMENT,
     name varchar(60) NOT NULL,
     PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS StockTypes (
     ID INT NOT NULL AUTO_INCREMENT,
     name varchar(60) NOT NULL,
     averageWeight float NOT NULL,
     PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Deliveries (
     ID INT NOT NULL AUTO_INCREMENT,
     deliverNumber INT NOT NULL,
     location INT NOT NULL,
     stockType INT NOT NULL,
     bagNumbers INT NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (location) REFERENCES Locations(ID) ON DELETE CASCADE,
     FOREIGN KEY (stockType) REFERENCES StockTypes(ID) ON DELETE CASCADE     
);
