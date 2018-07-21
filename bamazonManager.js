// dependancies
var mysql = require('mysql');
var inquirer = require('inquirer')

// details for the database connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 8889,
    database: 'bamazon'
});

// establish the connection to the database
connection.connect(function (error) {
    if (error) throw error;
    console.log('connected as id ' + connection.threadId + '\n');
    console.log('loading bamazon **manager** storefront...');
    loadMangerInterface();
});

function loadMangerInterface() {
    inquirer.prompt([{
        name: 'task',
        type: 'list',
        message: 'What is your task for the day?',
        choices: ['View products', 'View low inventory', 'Add inventory', 'Add a product']
    }]).then(function (answer) {
        switch (answer.task) {
            case 'View products':
                viewProducts();
                break;
            case 'View low inventory':
                viewInventory();
                break;
            case 'Add inventory':
                addInventory();
                break;
            case 'Add a product':
                addProduct();
                break;
        }
    })
}

// display a list of all products for sale
function viewProducts() {
    connection.query('SELECT * FROM products', function (error, res) {
        if (error) throw error;

        console.log('\n * * *\n');

        for (var i = 0; i < res.length; i++) {
            console.log('prodID: ' + res[i].item_id + ' — price $' + res[i].price + ' — qty: ' + res[i].stock_quantity + ' — ' + res[i].product_name);
        }
        console.log('\n * * *\n');
    });
    connection.end();
    loadMangerInterface();
}

function viewInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (error, res) {
        if (error) throw error;

        console.log('\n * * *\n');

        for (var i = 0; i < res.length; i++) {
            console.log('prodID: ' + res[i].item_id + ' — price $' + res[i].price + ' — qty: ' + res[i].stock_quantity + ' — ' + res[i].product_name);
        }
    });
    connection.end();
    loadMangerInterface();
}

function addInventory() {
    connection.query('SELECT * FROM products', function (error, res) {
        if (error) throw error;
        console.log('\n * * *\n');

        inquirer.prompt([{
            name: "productChoice",
            type: "input",
            message: "Please enter the ID of the product you'd like to restock",
        }, {
            name: "restockQty",
            type: "input",
            message: "How many units will you be stocking?",
            validate: function (value) {
                // make sure we're only getting real numbers
                if (isNaN(value) === false && value > 0) {
                    return true;
                }
                return "Invalid quantity";
            }
        }]).then(function (answer) {
            connection.query('SELECT * FROM products WHERE ?', {
                item_id: answer.productChoice
            }, function (error, res) {
                if (error) throw error;

                // variables to improve readability
                var amt = answer.restockQty;
                var stock = answer.productChoice
                var qty = res[0].stock_quantity;
                var price = res[0].price

                // restock
                console.log('processing...')
                connection.query('UPDATE products SET ? WHERE ?', [{
                    stock_quantity: (qty + amt)
                }, {
                    item_id: stock
                }], function (error, res) {
                    if (error) throw error;
                    console.log('Product with ID ' + res[0].item_id + 'now has a stock_quantity of ' + (qty + amt));
                    connection.end();
                })
            });
        });
    });
    console.clear();
    loadMangerInterface();
}

function addProduct() {
    //
}