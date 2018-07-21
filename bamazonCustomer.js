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
    console.log('loading bamazon storefront...');
    viewProducts();
});

// display a list of all products for sale
function viewProducts() {
    connection.query('SELECT * FROM products', function (error, res) {
        for (var i = 0; i < res.length; i++) {
            console.log('prodID: ' + res[i].item_id + ' — price (USD): ' + res[i].price + ' — ' + res[i].product_name);
        }
        // after displying products, close the sale
        placeOrder();
    });
}

// use inquirer to determine what product will be purchased
function placeOrder() {
    connection.query('SELECT * FROM products', function (error, res) {
                if (error) throw error;
                inquirer.prompt([{
                    name: "productChoice",
                    type: "input",
                    message: "Please enter the ID of the product you'd like to purchase"
                }, {
                    name: "purchaseQty",
                    type: "input",
                    message: "How many units would you like to purchase?"
                }]).then(function (answer) {
                    connection.query('SELECT * FROM products WHERE ?', {
                        item_id: answer.productChoice
                    }, function (error, res) {
                        if (error) throw error;

                        // variables to improve readability
                        var amt = answer.purchaseQty;
                        var purch = answer.productChoice
                        var qty = res[0].stock_quantity;

                        // if we have enough in stock to complete the order, do that
                        if (amt < qty) {
                            console.log('processing order...')
                            connection.query('UPDATE products SET ? WHERE ?', [{
                                stock_quantity: (qty - amt)
                            }, {
                                item_id: purch
                            }], function (error, res) {
                                if (error) throw error;
                                // show purchase cost
                            })
                        } else {
                            console.log('\nWe are unable to fulfill your order at this time. Rest assured, we greatly value your business, and are hard at work restocking our warehouse.');
                            console.log('Please try again later. Good bye.');
                            connection.end();
                        }
                    });
                });
            }