var mysql = require('mysql');
var inquirer = require('inquirer')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 8889,
    database: 'bamazon'
});

connection.connect(function(error) {
    if (error) throw error;
    console.log('connected as id ' + connection.threadId + '\n');
    // do stuff here
});