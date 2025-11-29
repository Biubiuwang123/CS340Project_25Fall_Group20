-- SP to test the delete
DELIMITER $$
DROP PROCEDURE IF EXISTS delete_michael_chen $$
CREATE PROCEDURE delete_michael_chen()
BEGIN
    DELETE FROM Customers WHERE firstName = 'Michael' AND lastName = 'Chen';
END $$
DELIMITER ;

-- SP to create a customer
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_create_customer $$
CREATE PROCEDURE `sp_create_customer`(
    IN p_firstName VARCHAR(100),
    IN p_lastName VARCHAR(100),
    IN p_phoneNumber VARCHAR(20),
    IN p_email VARCHAR(255),
    IN p_address VARCHAR(500),
    IN p_loyaltyPoints INT
)
BEGIN
    INSERT INTO Customers (firstName, lastName, phoneNumber, email, address, loyaltyPoints)
    VALUES (p_firstName, p_lastName, p_phoneNumber, p_email, p_address, p_loyaltyPoints);
END $$
DELIMITER ;

-- SP to update a customer
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_update_customer $$
CREATE  PROCEDURE `sp_update_customer`(
    IN p_customerID INT,
    IN p_phoneNumber VARCHAR(20),
    IN p_email VARCHAR(255),
    IN p_address VARCHAR(500),
    IN p_loyaltyPoints INT
)
BEGIN
    UPDATE Customers
    SET 
        phoneNumber = p_phoneNumber,
        email = p_email,
        address = p_address,
        loyaltyPoints = p_loyaltyPoints
    WHERE customerID = p_customerID;
END $$
DELIMITER ;

-- SP to delete a customer
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_delete_customer $$
CREATE PROCEDURE `sp_delete_customer`(IN p_customerID INT)
BEGIN
	DELETE FROM Customers
    WHERE customerID = p_customerID;
END $$
DELIMITER ;

-- SP to delete a sale detail
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_delete_saledetail $$
CREATE PROCEDURE `sp_delete_saledetail`(IN p_saleDetailID INT)
BEGIN
	DELETE FROM SaleDetails
    WHERE saleDetailID = p_saleDetailID;
END $$
DELIMITER ;