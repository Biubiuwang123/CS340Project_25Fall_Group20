// Citation for the following code:
// Date: 11/19/2025
// This file's structure is adapted from the OSU CS 340 starter code.
// All variables, queries, and application-specific logic have been rewritten 
// for our project requirements.
// https://canvas.oregonstate.edu/courses/2017561/pages/exploration-web-application-technology-2?module_item_id=25645131
// https://canvas.oregonstate.edu/courses/2017561/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25645149

// Citation for use of AI Tools:
// Date: 12/01/2025
// Prompts used to generate pre-filling function for UPDATE operation:
// When I update a row, I hope that after I select an ID to update, the other values will automatically fill in with the current values. How should I do this in Node.js?
// Prompts used to generate route for reset database including reloading triggers:
// Modify my route for resetting database, so that the triggers defined in triggers.sql will be reloaded.
// AI Source URL: https://chatgpt.com/
// ########################################
// ########## SETUP

// Express
console.log("Running app from:", __dirname);
const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 2016;

// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars'); // Import express-handlebars engine
app.engine('.hbs', engine({ 
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    cache: false, // Disable template caching for development
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})); // Create instance of handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.


// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/', async function (req, res) {
    try {
        res.render('home', { layout: 'main' }); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});

app.get('/customers', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = "SELECT customerID, firstName, lastName, email, phoneNumber, address, loyaltyPoints FROM Customers ORDER BY customerID;";
        const [customers] = await db.query(query1);
        console.log(`[CUSTOMERS ROUTE] Query returned ${customers.length} customers`);
        if (customers.length > 0) {
            console.log(`[CUSTOMERS ROUTE] First customer: ${customers[0].firstName} ${customers[0].lastName}`);
            console.log(`[CUSTOMERS ROUTE] All customers:`, customers.map(c => `${c.customerID}: ${c.firstName} ${c.lastName}`).join(', '));
        }
        // Render the customer file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('customers', { customers:customers });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/employees', async function (req, res) {
    try {
        const query1 = 
            "SELECT employeeID, firstName, lastName, phoneNumber, position, payRate, DATE_FORMAT(hireDate, '%Y-%m-%d') As hireDate FROM Employees;"
        ; 
        const [employees] = await db.query(query1);
        res.render('employees', { employees: employees });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send('An error occurred while executing the database queries.');
    }
});

app.get('/suppliers', async function (req, res) {
    try {
        const query1 = 
            "SELECT supplierID, supplierName, email, phoneNumber FROM Suppliers;"
        ;
        const [suppliers] = await db.query(query1);
        res.render('suppliers', { suppliers: suppliers });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send('An error occurred while executing the database queries.');
    }
});

app.get('/categories', async function (req, res) {
    try {
        const query1 = 
            "SELECT categoryID, categoryName, description FROM Categories;"
        ;
        const [categories] = await db.query(query1);
        res.render('categories', { categories: categories });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send('An error occurred while executing the database queries.');
    }
});
app.get('/products', async function (req, res) {
    try {
        const query1 = 
            "SELECT Products.productID, Products.productName, Products.description, Categories.categoryName AS category, Suppliers.supplierName as supplier, Products.listPrice, Products.stockQuantity, Products.reorderLevel FROM Products INNER JOIN Categories ON Products.categoryID = Categories.categoryID INNER JOIN Suppliers ON Products.supplierID = Suppliers.supplierID;"
        ;
        const query2 ="SELECT categoryID, categoryName FROM Categories;";
        const query3 = "SELECT supplierID, supplierName FROM Suppliers;";
        const [products] = await db.query(query1);
        const [categories] = await db.query(query2);
        const [suppliers] = await db.query(query3);
        res.render('products', {products, categories,suppliers});
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send('An error occurred while executing the database queries.');
    }
});
app.get('/sales', async function (req, res) {
    try {
        const query1 = 
            "SELECT Sales.saleID, DATE_FORMAT(Sales.saleDate, '%Y-%m-%d') AS saleDate, CONCAT(Customers.firstName, ' ', Customers.lastName) AS customerFullName, CONCAT(Employees.firstName, ' ', Employees.lastName) AS employeeFullName FROM Sales LEFT JOIN Customers ON Sales.customerID = Customers.customerID LEFT JOIN Employees ON Sales.employeeID = Employees.employeeID ORDER BY Sales.saleID ASC;";
        const query2 ="SELECT customerID, CONCAT(firstName, ' ', lastName) AS customerFullName FROM Customers;";
        const query3 = "SELECT employeeID, CONCAT(firstName, ' ', lastName) AS employeeFullName FROM Employees;";
        const [sales] = await db.query(query1);
        const [customers] = await db.query(query2);
        const [employees] = await db.query(query3);
        res.render('sales', {sales,customers,employees});
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send('An error occurred while executing the database queries.');
    }
});
app.get('/saledetails', async function (req, res) {
    try {
        const query1 = "SELECT Sales.saleID, SaleDetails.saleDetailID, Products.productName, SaleDetails.quantity, SaleDetails.unitPrice FROM SaleDetails INNER JOIN Products ON SaleDetails.productID = Products.productID INNER JOIN Sales ON SaleDetails.saleID = Sales.saleID ORDER BY Sales.saleID ASC;";
        const query2 ="SELECT productID, productName FROM Products";
        const query3 ="SELECT saleID FROM Sales;";
        const [saledetails] = await db.query(query1);
        const [products] = await db.query(query2);
        const [sales] = await db.query(query3)
        res.render('saledetails', {saledetails,products,sales});
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send('An error occurred while executing the database queries.');
    }
});

// ########################################
// ########## CREATE, UPDATE, DELETE ROUTES (CUD Operations)

// POST route for creating customers
app.post('/create-customer', async function (req, res) {
    try {
        const { create_firstNameInput, create_lastNameInput, create_phoneInput, create_emailInput, create_addressInput, create_loyaltyPointsInput } = req.body;
        
        if (!create_firstNameInput || !create_lastNameInput || !create_phoneInput) {
            return res.status(400).send("First name, last name, and phone number are required");
        }

        const query = "CALL sp_create_customer(?,?,?,?,?,?)";
        await db.query(query, [
            create_firstNameInput,
            create_lastNameInput,
            create_phoneInput,
            create_emailInput || null,
            create_addressInput || null,
            create_loyaltyPointsInput || 0
        ]);
        
        console.log("Customer created:", create_firstNameInput, create_lastNameInput);
        res.redirect('/customers');
    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).send("Error creating customer. Please ensure that the phone number and email address are unique.");
    }
});

// POST route for updating customers
app.post('/update-customer', async function (req, res) {
    try {
        const {update_customerIDInput, update_firstNameInput,update_lastNameInput,update_phoneInput, update_emailInput, update_addressInput, update_loyaltyPointsInput } = req.body;
        
        if (!update_customerIDInput ) {
            return res.status(400).send("Customer ID is required");
        }

        const query = "CALL sp_update_customer(?,?,?,?,?,?,?)";
        await db.query(query, [
            update_customerIDInput,
            update_firstNameInput,
            update_lastNameInput,
            update_phoneInput,
            update_emailInput || null,
            update_addressInput || null,
            update_loyaltyPointsInput || 0,
        ]);
        
        console.log("Customer updated:", update_customerIDInput);
        res.redirect('/customers');
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).send("Error updating customer. Please ensure that the phone number and email address are unique.");
    }
});

// GET route to fetch a single customer's data by ID (for pre-filling update form)
app.get('/api/customer/:id', async function (req, res) {
    const id = req.params.id;
    const query = "CALL sp_get_customer_by_id(?)";
    const [rows] = await db.query(query, [id]);
    res.json(rows[0][0]);
});


// POST route for customer deletion (handles form submissions)
app.post('/delete-customer', async function (req, res) {
    try {
        const customerID = req.body.delete_customer_id;
        if (!customerID) {
            return res.status(400).send("Customer ID is required");
        }
        const query = "CALL sp_delete_customer(?)";
        await db.query(query, [customerID]);
        console.log("Customer deleted:", customerID);
        res.redirect('/customers');
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).send("Error deleting customer.");
    }
});

// POST route for creating Sale Details
app.post('/create-saledetail', async function (req, res) {
    try {
        const { saleID, productID, quantity, unitPrice } = req.body;
        // Basic INSERT query (matches your DML)
        const query = "CALL sp_create_saledetail(?, ?, ?, ?)";
        
        await db.query(query, [saleID, productID, quantity, unitPrice]);
        res.redirect('/saledetails');
    } catch (error) {
        console.error("Error creating sale detail:", error);
        res.status(500).send("Error creating sale detail.");
    }
});

// POST route for updating Sale Details
app.post('/update-saledetail', async function (req, res) {
    try {
        const { saleDetailID,saleID,productID,quantity, unitPrice } = req.body;
        // Basic UPDATE query
        const query = "CALL sp_update_saledetail(?,?,?, ?, ?)";
        
        await db.query(query, [saleDetailID,saleID,productID,quantity, unitPrice]);
        res.redirect('/saledetails');
    } catch (error) {
        console.error("Error updating sale detail:", error);
        res.status(500).send("Error updating sale detail.");
    }
});

// GET route to fetch a single sale detail's data by ID (for pre-filling update form)
app.get('/api/saledetail/:id', async function (req, res) {
    const id = req.params.id;
    const query = "CALL sp_get_saledetail_by_id(?)";
    const [rows] = await db.query(query, [id]);
    res.json(rows[0][0]);
});

// POST route for deleting Sale Details
app.post('/delete-saledetail', async function (req, res) {
    try {
        const { saleDetailID } = req.body;
        // Calling the Stored Procedure created in Phase 1
        const query = "CALL sp_delete_saledetail(?)";
        
        await db.query(query, [saleDetailID]);
        res.redirect('/saledetails');
    } catch (error) {
        console.error("Error deleting sale detail:", error);
        res.status(500).send("Error deleting sale detail.");
    }
});

// POST route for creating Sales
app.post('/create-sale', async function (req, res) {
    try {
        const { create_customerIDInput, create_employeeIDInput, create_saleDateInput } = req.body;
        const query = "CALL sp_create_sale(?, ?, ?)";
        
        await db.query(query, [create_customerIDInput||null, create_employeeIDInput, create_saleDateInput]);
        res.redirect('/sales');
    } catch (error) {
        console.error("Error creating sale:", error);
        res.status(500).send("Error creating sale.");
    }
});

// POST route for updating Sales
app.post('/update-sale', async function (req, res) {
    try {
        const { update_saleIDInput, update_customerIDInput, update_employeeIDInput, update_saleDateInput } = req.body;
        const query = "CALL sp_update_sale(?, ?, ?, ?)";
        
        await db.query(query, [update_saleIDInput, update_customerIDInput||null, update_employeeIDInput, update_saleDateInput]);
        res.redirect('/sales');
    } catch (error) {
        console.error("Error updating sale:", error);
        res.status(500).send("Error updating sale.");
    }
});

// GET route to fetch a single sale's data by ID (for pre-filling update form)
app.get('/api/sale/:id', async function (req, res) {
    const id = req.params.id;
    const query = "CALL sp_get_sale_by_id(?)";
    const [rows] = await db.query(query, [id]);
    res.json(rows[0][0]);
});

// POST route for deleting Sales
app.post('/delete-sale', async function (req, res) {
    try {
        const { delete_saleID } = req.body;
        const query = "CALL sp_delete_sale(?)";
        
        await db.query(query, [delete_saleID]);
        res.redirect('/sales');
    } catch (error) {
        console.error("Error deleting sale:", error);
        res.status(500).send("Error deleting sale.");
    }
});

// ########################################
// ########## RESET & TEST ROUTES

// Route to Reset the Database
app.get('/reset-table-data', async function (req, res) {
    try {
        // Calls the Stored Procedure defined in DDL.sql to reset schema and data
        const query = "CALL sp_reset_db();"; 
        await db.query(query);
        console.log("Database Reset Completed.");
        // Reload triggers
        const fs = require('fs');
        const triggersSql = fs.readFileSync("./database/triggers.sql", "utf8");
        const statements = triggersSql.split(';;').map(s => s.trim()).filter(s => s.length > 0);

        for (const stmt of statements) {
            await db.query(stmt);
}
        console.log("Triggers Reloaded.");
        
        // Redirect back to homepage
        res.redirect('/'); 
    } catch (error) {
        console.error("Error resetting database:", error);
        res.status(500).send("Error resetting database.");
    }
});

// Route to Test the Delete (Demonstrates the Reset)
app.get('/test-delete-customer', async function (req, res) {
    try {
        // Calls the Stored Procedure defined in PL.sql to delete a specific record
        const query = "CALL delete_michael_chen();"; 
        await db.query(query);
        console.log("Test Delete Executed.");

        // Redirect back to customers to verify the deletion
        res.redirect('/customers'); 
    } catch (error) {
        console.error("Error executing test delete:", error);
        res.status(500).send("Error executing test delete.");
    }
});


// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});
