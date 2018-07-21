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
            message: "Please enter the ID of the product you'd like to purchase",
            validate: function (value) {
                if (value > res.length) {
                    return "Invalid ID";
                } else if (isNaN(value) === false && value > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            name: "purchaseQty",
            type: "input",
            message: "How many units would you like to purchase?",
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
                var amt = answer.purchaseQty;
                var purch = answer.productChoice
                var qty = res[0].stock_quantity;
                var price = res[0].price

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
                        console.log(amt + ' units purchased at a price of $' + price);
                        console.log('Generating invoice for $' + (price * amt));
                        console.log('Your order is on its way!');
                        connection.end();
                    })
                } else {
                    console.log('\nWe are unable to fulfill your order at this time. Rest assured, we greatly value your business, and are hard at work restocking our warehouse.');
                    console.log('.\n.\n.\n.')
                    console.log('Please try again later. Goodbye.');
                    connection.end();
                }
            });
        });
    });
}