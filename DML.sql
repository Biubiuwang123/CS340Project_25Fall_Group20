-- ########################################
-- ########## SELECT QUERIES (Browsing/Dropdowns)
-- ########################################

-- Selects all categories for the dropdown list
SELECT categoryID, categoryName FROM Categories;

-- Selects all categories with descriptions for browsing
SELECT categoryID, categoryName, description FROM Categories;

-- Selects all suppliers for the dropdown list
SELECT supplierID, supplierName FROM Suppliers;

-- Selects all suppliers with contact information for browsing
SELECT supplierID, supplierName, email, phoneNumber FROM Suppliers;

-- Selects all customers for the dropdown list
SELECT customerID, CONCAT(firstName, ' ', lastName) AS customerFullName FROM Customers;

-- Selects all customers with full details for browsing
SELECT customerID, firstName, lastName, email, phoneNumber, address, loyaltyPoints FROM Customers;

-- Selects a specific customer for update form pre-populate(using Stored Procedure)
SELECT * FROM Customers WHERE customerID = :customerIDInput;

-- Selects all employees for the dropdown list
SELECT employeeID, CONCAT(firstName, ' ', lastName) AS employeeFullName FROM Employees;

-- Selects all employees with full details for browsing
SELECT employeeID, firstName, lastName, phoneNumber, position, payRate, DATE_FORMAT(hireDate, '%Y-%m-%d') AS hireDate FROM Employees;

-- Selects all products for the dropdown list
SELECT productID, productName FROM Products;

-- Selects all products with category and supplier info for browsing
SELECT Products.productID, Products.productName, Products.description, 
       Categories.categoryName AS category, Suppliers.supplierName as supplier, Products.listPrice, Products.stockQuantity, Products.reorderLevel
FROM Products
INNER JOIN Categories ON Products.categoryID = Categories.categoryID
INNER JOIN Suppliers  ON Products.supplierID = Suppliers.supplierID;

-- Selects all sales with customer and employee info for browsing and dropdown
-- Uses LEFT JOIN so that sales records with non-registered customers will be displayed
SELECT Sales.saleID, DATE_FORMAT(Sales.saleDate, '%Y-%m-%d') AS saleDate, CONCAT(Customers.firstName, ' ', Customers.lastName) AS customerFullName,
       CONCAT(Employees.firstName, ' ', Employees.lastName) AS employeeFullName
FROM Sales
LEFT JOIN Customers ON Sales.customerID = Customers.customerID
LEFT JOIN Employees ON Sales.employeeID = Employees.employeeID
ORDER BY Sales.saleID ASC;

-- Selects a specific sale for update form pre-populate(using Stored Procedure)
SELECT * FROM Sales WHERE saleID = :saleIDInput;

-- Selects all sale details with product and sale info for browsing and dropdown
SELECT Sales.saleID, SaleDetails.saleDetailID, Products.productName, SaleDetails.quantity, SaleDetails.unitPrice
FROM SaleDetails
INNER JOIN Products ON SaleDetails.productID = Products.productID
INNER JOIN Sales ON SaleDetails.saleID = Sales.saleID
ORDER BY Sales.saleID ASC;

-- Selects a specific sale detail for update form pre-populate(using Stored Procedure)
SELECT * FROM SaleDetails WHERE saleDetailID = :saleDetailIDInput;

-- ########################################
-- ########## CREATE OPERATIONS (Using Stored Procedures)
-- ########################################

-- Creates a new customer using stored procedure
CALL sp_create_customer(:firstNameInput, :lastNameInput, :phoneInput, :emailInput, :addressInput, :loyaltyPointsInput);

-- Creates a new sale using stored procedure
CALL sp_create_sale(:customer_ID_from_dropdown_Input, :employee_ID_from_dropdown_Input, :saleDateInput);

-- Creates a new sale detail using stored procedure
CALL sp_create_saledetail(:sale_ID_from_dropdown_Input, :product_ID_from_dropdown_Input, :quantityInput, :unitPriceInput);

-- ########################################
-- ########## UPDATE OPERATIONS (Using Stored Procedures)
-- ########################################

-- Updates an existing customer using stored procedure
CALL sp_update_customer(:customer_ID_from_dropdown_Input, :firstNameInput, :lastNameInput, :phoneInput, :emailInput, :addressInput, :loyaltyPointsInput);

-- Updates an existing sale using stored procedure
CALL sp_update_sale(:sale_ID_from_dropdown_Input, :customer_id_from_dropdown_Input, :employee_id_from_dropdown_Input, :saleDateInput);

-- Updates an existing sale detail using stored procedure
CALL sp_update_saledetail(:sale_detail_ID_from_dropdown_Input, :sale_id_from_dropdown_Input, :product_id_from_dropdown_Input, :quantityInput, :unitPriceInput);

-- ########################################
-- ########## DELETE OPERATIONS (Using Stored Procedures)
-- ########################################

-- Deletes an existing customer using stored procedure
CALL sp_delete_customer(:customer_ID_from_dropdown_Input);

-- Deletes an existing sale using stored procedure
CALL sp_delete_sale(:sale_ID_from_dropdown_Input);

-- Deletes an existing sale detail using stored procedure
CALL sp_delete_saledetail(:saleDetail_ID_from_dropdown_Input);
