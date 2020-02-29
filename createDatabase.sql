-- DROP DATABASE IF EXISTS warehouse;
CREATE DATABASE warehouse;
USE warehouse;

CREATE TABLE IF NOT EXISTS Areas (
     areaID INT NOT NULL AUTO_INCREMENT,
     areaName varchar(60) NOT NULL,
     PRIMARY KEY (areaID)
);

CREATE TABLE IF NOT EXISTS Locations (
     locationID INT NOT NULL AUTO_INCREMENT,
     locationArea INT NOT NULL,
     locationName varchar(60) NOT NULL,
     locationType INT NOT NULL DEFAULT 0, -- 0 for store, 1 for warehouse
     PRIMARY KEY (locationID),
     FOREIGN KEY (locationArea) REFERENCES Areas(areaID)
);

CREATE TABLE IF NOT EXISTS Users (
     userID INT NOT NULL AUTO_INCREMENT,
     userName varchar(60) NOT NULL,
     warehouseAccess BOOLEAN NOT NULL DEFAULT 0,
     shopAccess BOOLEAN NOT NULL DEFAULT 0,
     overviewAccess BOOLEAN NOT NULL DEFAULT 0,
     driverAccess BOOLEAN NOT NULL DEFAULT 0,
     userLocation INT,
     PRIMARY KEY (userID),
     FOREIGN KEY (userLocation) REFERENCES Locations(locationID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS StockTypes (
     stockID INT NOT NULL AUTO_INCREMENT,
     stockName varchar(60) NOT NULL,
     stockColour varchar(60) NOT NULL,
     averageWeight float NOT NULL,
     PRIMARY KEY (stockID)
);

CREATE TABLE IF NOT EXISTS Deliveries (
     deliveryID INT NOT NULL AUTO_INCREMENT,
     fromLocation INT NOT NULL,
     toLocation INT NOT NULL,
     stockType INT NOT NULL,
     numOfBags INT NOT NULL,
     driverID INT NOT NULL,
     deliveryDueDate date NOT NULL,
     deliveryArrivedDate DATETIME,
     PRIMARY KEY (deliveryID),
     FOREIGN KEY (toLocation) REFERENCES Locations(locationID) ON DELETE CASCADE,
     FOREIGN KEY (fromLocation) REFERENCES Locations(locationID) ON DELETE CASCADE,
     FOREIGN KEY (stockType) REFERENCES StockTypes(stockID) ON DELETE CASCADE,
     FOREIGN KEY (driverID) REFERENCES Users(userID) ON DELETE CASCADE
);


-- Populate Database with initaial Data
USE warehouse;
INSERT INTO StockTypes (stockName, averageWeight, stockColour)
VALUES
    ('General', '1', 'rgb(29, 108, 204)'),
    ('Gold', '1', 'rgb(235, 223, 94)'),
    ('Oslo', '1', 'rgb(42, 232, 200)'),
    ('Ruby', '1', 'rgb(227, 27, 27)'),
    ('Revive', '1', 'rgb(100, 100, 100)'),
    ('Encore', '1', 'rgb(164, 119, 199)');

INSERT INTO Areas (areaName)
VALUES
    ('SW1'),
    ('Area51');

INSERT INTO Locations (locationArea, locationName, locationType)
VALUES
    ('1','Plymouth Warehouse', '1'),
    ('2', 'Cornwall Street', '0'),
    ('2','Plympton', '0'),
    ('1','Newton Abbot', '0'),
    ('1','Paignton', '0');

INSERT INTO Users (userName, userLocation, warehouseAccess) VALUES ('Warehouse Manager', '2', 1);
INSERT INTO Users (userName, overviewAccess) VALUES ('Area Manager', 1);
INSERT INTO Users (userName, driverAccess) VALUES ('Hamilton', 1);
INSERT INTO Users (userName, driverAccess) VALUES ('Vettel', 1);
