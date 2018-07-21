CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(128) NOT NULL,
    department_name VARCHAR(64) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT
);

SELECT * FROM products;