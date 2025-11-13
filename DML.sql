-- Create options
-- add a new category
INSERT INTO Categories (categoryName, description)
VALUES (:categoryNameInput, :categoryDescriptionInput);

-- add a new supplier
INSERT INTO Suppliers (supplierName, email, phoneNumber)
VALUES (:supplierNameInput, :supplierEmailInput, :supplierPhoneInput);

-- add a new customer
INSERT INTO Customers (firstName, lastName, phoneNumber, email, address, loyaltyPoints)
VALUES (:firstNameInput, :lastNameInput, :phoneInput, :emailInput, :addressInput, :loyaltyPointsInput);

-- add a new employee
INSERT INTO Employees (firstName, lastName, phoneNumber, position, payRate, hireDate)
VALUES (:firstNameInput, :lastNameInput, :phoneInput, :positionInput, :payRateInput, :hireDateInput);

-- add a new product (depends on category and supplier)
INSERT INTO Products (productName, description, categoryID, supplierID, listPrice, stockQuantity, reorderLevel)
VALUES (:productNameInput, :descriptionInput, :category_id_from_dropdown_Input, :supplier_id_from_dropdown_Input, 
:listPriceInput, :stockQtyInput, :reorderLevelInput);

-- add a new sale (depends on customer and employee)
INSERT INTO Sales (customerID, employeeID, saleDate)
VALUES (:customer_ID_from_dropdown_Input, :employee_ID_from_dropdown_Input, :saleDateInput);

-- add a new sale detail (depends on sale and product)
INSERT INTO SaleDetails (saleID, productID, quantity, unitPrice)
VALUES (:sale_ID_from_dropdown_Input, :product_ID_from_dropdown_Input, :quantityInput, :unitPriceInput);

--Retrieve options
-- get all categories
SELECT categoryID, categoryName, description FROM Categories;

-- get a specific category for update
SELECT description FROM Categories WHERE categoryID = :category_ID_from_dropdown_Input;

-- get all suppliers
SELECT supplierID, supplierName, email, phoneNumber FROM Suppliers;

-- get a specific supplier for update
SELECT email, phoneNumber FROM Suppliers WHERE supplierID = :supplier_ID_from_dropdown_Input;

-- get all customers
SELECT customerID, firstName, lastName, email, phoneNumber, address, loyaltyPoints FROM Customers;

-- get a specific customer for update
SELECT email, phoneNumber, address, loyaltyPoints FROM Customers WHERE customerID = :customer_ID_from_dropdown_Input;

-- get all employees
SELECT employeeID, firstName, lastName, phoneNumber, position, payRate, hireDate FROM Employees;

-- get a specific employee for update
SELECT phoneNumber,position, payRate FROM Employees WHERE employeeID = :employee_ID_from_dropdown_Input;

-- get all products with category and supplier info
SELECT Products.productID, Products.productName, Products.description, 
       Categories.categoryName AS category, Suppliers.supplierName as supplier, Products.listPrice, Products.stockQuantity, Products.reorderLevel
FROM Products
INNER JOIN Categories ON Products.categoryID = Categories.categoryID
INNER JOIN Suppliers  ON Products.supplierID = Suppliers.supplierID;

-- get a specific product for update
SELECT Products.description, Categories.categoryName AS category, Suppliers.supplierName as supplier, Products.listPrice, Products.stockQuantity, Products.reorderLevel
FROM Products
INNER JOIN Categories ON Products.categoryID = Categories.categoryID
INNER JOIN Suppliers  ON Products.supplierID = Suppliers.supplierID
WHERE Products.productID = :product_ID_from_dropdown_input;

-- get all sales with customer and employee info, left join sales so that the sale records with non-rigisted customers will be displayed
SELECT Sales.saleID, Sales.saleDate, CONCAT(Customers.firstName, ' ', Customers.lastName) AS customerFullName,
       CONCAT(Employees.firstName, ' ', Employees.lastName) AS employeeFullName
FROM Sales
LEFT JOIN Customers ON Sales.customerID = Customers.customerID
LEFT JOIN Employees ON Sales.employeeID = Employees.employeeID
ORDER BY Sales.saleID ASC;

-- get sale details 
SELECT Sales.saleID, SaleDetails.saleDetailID, Products.productName, SaleDetails.quantity, SaleDetails.unitPrice
FROM SaleDetails
INNER JOIN Products ON SaleDetails.productID = Products.productID
INNER JOIN Sales ON SaleDetails.saleID = Sales.saleID
ORDER BY Sales.saleID ASC;

-- get product id and name for dropdown box
SELECT productID, productName FROM Products;

-- get customer id and name for dropdown box
SELECT customerID, CONCAT(firstName, ' ', lastName) AS customerFullName FROM Customers;

-- get employee id and name for dropdown box
SELECT employeeID, CONCAT(firstName, ' ', lastName) AS employeeFullName FROM Employees;

-- get supplier id and name for dropdown box
SELECT supplierID, supplierName FROM Suppliers;

-- get category id and name for dropdown box
SELECT categoryID, categoryName FROM Categories;

-- get sale id for dropdown box
SELECT saleID FROM Sales;

-- get sale detail id for dropdown box
SELECT saleDetailID FROM SaleDetails;

-- Update options
-- update a category
UPDATE Categories
SET description = :categoryDescriptionInput
WHERE categoryID = :category_ID_from_dropdown_Input;

-- update a supplier
UPDATE Suppliers
SET email = :supplierEmailInput, phoneNumber = :supplierPhoneInput
WHERE supplierID = :supplier_ID_from_dropdown_Input;

-- update a customer
UPDATE Customers
SET phoneNumber = :phoneInput,
    email = :emailInput, address = :addressInput, loyaltyPoints = :loyaltyPointsInput
WHERE customerID = :customer_ID_from_dropdown_Input;

-- update an employee
UPDATE Employees
SET phoneNumber = :phoneInput,
    position = :positionInput, payRate = :payRateInput
WHERE employeeID = :employee_ID_from_dropdown_Input;

-- update a product
UPDATE Products
SET description = :descriptionInput, 
    categoryID = :category_id_from_dropdown_Input, supplierID = :supplier_id_from_dropdown_Input, 
    listPrice = :listPriceInput, stockQuantity = :stockQtyInput, reorderLevel = :reorderLevelInput
WHERE productID = :product_ID_from_dropdown_Input;

-- update a sale
UPDATE Sales
SET customerID = :customer_id_from_dropdown_Input, employeeID = :employee_id_from_dropdown_Input, 
    saleDate = :saleDateInput
WHERE saleID = :sale_ID_from_dropdown_Input;

-- update a sale detial
UPDATE SaleDetails
SET productID = :product_id_from_dropdown_Input, saleID = :sale_id_from_dropdown_Input, 
    quantity = :quantityInput, unitPrice = :unitPriceInput
WHERE saleDetailID = :sale_detail_ID_from_dropdown_Input;


-- Delete options
-- delete a category
DELETE FROM Categories WHERE categoryID = :category_ID_from_dropdown_Input;

-- delete a supplier
DELETE FROM Suppliers WHERE supplierID = :supplier_ID_from_dropdown_Input;

-- delete a customer
DELETE FROM Customers WHERE customerID = :customer_ID_from_dropdown_Input;

-- delete an employee
DELETE FROM Employees WHERE employeeID = :employee_ID_from_dropdown_Input;

-- delete a product
DELETE FROM Products WHERE productID = :product_ID_from_dropdown_Input;

-- delete a sale
DELETE FROM Sales WHERE saleID = :sale_ID_from_dropdown_Input;

-- delete a sale detail
DELETE FROM SaleDetails WHERE saleDetailID = :saleDetail_ID_from_dropdown_Input;