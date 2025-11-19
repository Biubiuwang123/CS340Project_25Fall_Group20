DELIMITER $$
DROP PROCEDURE IF EXISTS delete_michael_chen $$
CREATE PROCEDURE delete_michael_chen()
BEGIN
    DELETE FROM Customers WHERE firstName = 'Michael' AND lastName = 'Chen';
END $$
DELIMITER ;