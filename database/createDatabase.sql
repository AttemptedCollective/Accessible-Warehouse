CREATE DATABASE warehouse;
USE warehouse;

CREATE TABLE IF NOT EXISTS Regions (
     regionID INT NOT NULL AUTO_INCREMENT,
     regionName varchar(60) NOT NULL,
     PRIMARY KEY (regionID)
);

CREATE TABLE IF NOT EXISTS Clusters (
     clusterID INT NOT NULL AUTO_INCREMENT,
     clusterName varchar(60) NOT NULL,
     regionID INT NOT NULL,
     PRIMARY KEY (clusterID),
     FOREIGN KEY (regionID) REFERENCES Regions(regionID)
);

CREATE TABLE IF NOT EXISTS Stores (
     storeID INT NOT NULL AUTO_INCREMENT,
     storeName varchar(60) NOT NULL,
     clusterID INT NOT NULL,
     PRIMARY KEY (storeID),
     FOREIGN KEY (clusterID) REFERENCES Clusters(clusterID)
);

CREATE TABLE IF NOT EXISTS Users (
     userID INT NOT NULL AUTO_INCREMENT,
     userName varchar(60) NOT NULL,
     PRIMARY KEY (userID)
);

-- Shows which users have access to which Regions
CREATE TABLE IF NOT EXISTS RegionAccess (
     userID INT NOT NULL,
     regionID INT NOT NULL,
     FOREIGN KEY (userID) REFERENCES Users(userID),
     FOREIGN KEY (regionID) REFERENCES Regions(regionID)
);

-- Shows which users have access to which Clusters
CREATE TABLE IF NOT EXISTS ClusterAccess (
     userID INT NOT NULL,
     clusterID INT NOT NULL,
     FOREIGN KEY (userID) REFERENCES Users(userID),
     FOREIGN KEY (clusterID) REFERENCES Clusters(clusterID)
);

-- Shows which users have access to which Stores
CREATE TABLE IF NOT EXISTS StoreAccess (
     userID INT NOT NULL,
     storeID INT NOT NULL,
     FOREIGN KEY (userID) REFERENCES Users(userID),
     FOREIGN KEY (storeID) REFERENCES Stores(storeID)
);

CREATE TABLE IF NOT EXISTS DriverAccess (
     userID INT NOT NULL,
     regionID INT NOT NULL,
     FOREIGN KEY (userID) REFERENCES Users(userID),
     FOREIGN KEY (regionID) REFERENCES Regions(regionID)
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
     sendingFromStoreID INT NOT NULL,
     sendingToStoreID INT NOT NULL,
     stockType INT NOT NULL,
     numOfBags INT NOT NULL,
     driverID INT NOT NULL,
     deliveryDueDate date NOT NULL,
     deliveryArrivedDate DATETIME,
     PRIMARY KEY (deliveryID),
     FOREIGN KEY (sendingFromStoreID) REFERENCES Stores(storeID) ON DELETE CASCADE,
     FOREIGN KEY (sendingToStoreID) REFERENCES Stores(storeID) ON DELETE CASCADE,
     FOREIGN KEY (stockType) REFERENCES StockTypes(stockID) ON DELETE CASCADE,
     FOREIGN KEY (driverID) REFERENCES Users(userID) ON DELETE CASCADE
);

-- Area for Template and Card Data
CREATE TABLE IF NOT EXISTS Templates (
     templateID INT NOT NULL AUTO_INCREMENT,
     templateName varchar(60) NOT NULL,
     chartType varchar(60) NOT NULL,
     dataType INT NOT NULL,
     tableMode boolean NOT NULL 
);

CREATE TABLE IF NOT EXISTS Cards (
     templateID INT NOT NULL AUTO_INCREMENT,
     title varchar(60) NOT NULL,
     chartType varchar(60) NOT NULL,
     cardType INT NOT NULL,
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

INSERT INTO Users (userName) VALUES 
     ('Store Manager'),
     ('Warehouse Manager'),
     ('Cluster Manager'),
     ('Region Manager'),
     ('Region Manager 2'),
     ('Hamilton'),
     ('Vettel');

INSERT INTO Regions (regionName)
VALUES
    ('Region 1'),
    ('Region 2'),
    ('Region 3');

INSERT INTO Clusters (clusterName, regionID)
VALUES
    ('Cluster 1', '1'),
    ('Cluster 2', '1'),
    ('Cluster 3', '2'),
    ('Cluster 4', '2'),
    ('Cluster 5', '3'),
    ('Cluster 6', '3');


INSERT INTO Stores (storeName, clusterID)
VALUES
    ('Warehouse 1', '1'),
    ('Store 2', '1'),
    ('Store 3', '1'),
    ('Store 4', '2'),
    ('Store 5', '3'),
    ('Store 6', '3'),
    ('Store 7', '4'),
    ('Store 8', '4'),
    ('Store 9', '5'),
    ('Store 10', '5'),
    ('Store 11', '6'),
    ('Store 12', '6');

INSERT INTO RegionAccess (userID, regionID)
VALUES
    (4, 1),
    (5, 2);

INSERT INTO ClusterAccess (userID, clusterID)
VALUES
    (3, 1);

INSERT INTO StoreAccess (userID, storeID)
VALUES
    (1, 2),
    (2, 1);

INSERT INTO DriverAccess (userID, regionID)
VALUES
    (6, 1),
    (7, 1);

INSERT INTO Deliveries (sendingFromStoreID, sendingToStoreID, stockType, numOfBags, driverID, deliveryDueDate, deliveryArrivedDate) values 
(1, 2, 1, 10, 6, '2020-03-22 10:00:00', '2020-09-22 12:00:00'),
(1, 2, 1, 10, 7, '2020-03-22 11:00:00', '2020-09-22 13:00:00'),
(1, 3, 1, 10, 6, '2020-03-22 12:00:00', null),
(1, 3, 1, 10, 7, '2020-03-23 10:00:00', '2020-09-22 11:00:00'),
(1, 2, 1, 10, 6, '2020-03-23 11:00:00', null),
(1, 2, 1, 10, 7, '2020-03-23 12:00:00', '2020-09-22 14:00:00'),
(1, 3, 1, 10, 6, '2020-03-24 10:00:00', null),
(1, 3, 1, 10, 7, '2020-03-24 11:00:00', null),
(1, 2, 1, 10, 6, '2020-03-24 12:00:00', null);
