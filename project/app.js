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
app.engine('.hbs', engine({ extname: '.hbs' })); // Create instance of handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.


// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/', async function (req, res) {
    try {
        res.render('home.hbs'); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});

//app.get('/bsg-people', async function (req, res) {
    //try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
       // const query1 = `SELECT bsg_people.id, bsg_people.fname, bsg_people.lname, \
            //bsg_planets.name AS 'homeworld', bsg_people.age FROM bsg_people \
           // LEFT JOIN bsg_planets ON bsg_people.homeworld = bsg_planets.id;`;
        //const query2 = 'SELECT * FROM bsg_planets;';
        //const [people] = await db.query(query1);
        //const [homeworlds] = await db.query(query2);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        //res.render('bsg-people', { people: people, homeworlds: homeworlds });
    //} catch (error) {
        //console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        //res.status(500).send(
        //    'An error occurred while executing the database queries.'
        //);
    //}
//});
app.get('/customers', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = "SELECT customerID, firstName, lastName, email, phoneNumber, address, loyaltyPoints FROM Customers;";
        const [customers] = await db.query(query1);
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
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});