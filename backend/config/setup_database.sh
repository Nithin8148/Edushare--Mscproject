#!/bin/bash

# Variables
DB_NAME="edushare"
DB_USER="root"
DB_PASS="your_password"
DUMP_FILE="create_tables.sql"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null
then
    echo "MySQL could not be found. Please install MySQL and try again."
    exit 1
fi

# Create the database if it doesn't exist
mysql -u $DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" || { echo "Failed to create database"; exit 1; }

# Import the dump file
mysql -u $DB_USER -p$DB_PASS $DB_NAME < $DUMP_FILE || { echo "Failed to import database dump"; exit 1; }

echo "Database setup completed."

#to run
#install mysql
#create .env
#install dependency: npm install
#run "chmod +x setup_database.sh" then run
#./setup_database.sh
