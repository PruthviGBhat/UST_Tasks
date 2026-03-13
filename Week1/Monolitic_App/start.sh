#!/bin/bash

# Start MySQL service
service mysql start

# Wait for MySQL to start
sleep 10

# Create database
mysql -u root <<EOF
CREATE DATABASE IF NOT EXISTS userdb;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
FLUSH PRIVILEGES;
EOF

# Run Spring Boot app
java -jar /app/target/*.jar
