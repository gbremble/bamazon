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

});

// display a list of all products for sale
function viewProducts() {
    connection.query('SELECT * FROM products', function (error, res) {
        for (var i = 0; i < res.length; i++) {
            console.log('prodID: ' + res[i].item_id + ' — price $' + res[i].price + ' — qty: ' + res[i].stock_quantity + ' — ' + res[i].product_name);
        }
    });
}