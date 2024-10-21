CREATE DATABASE prospera;
USE prospera;

CREATE TABLE _Login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(20) NOT NULL UNIQUE,
    username VARCHAR(20) NOT NULL UNIQUE
);
DELIMITER $$

CREATE PROCEDURE create_user_expense_tables(IN user_name VARCHAR(20))
BEGIN
    -- Main expenses table
    SET @expenses_table = CONCAT('CREATE TABLE ', user_name, '_expenses (',
                                  'id INT AUTO_INCREMENT PRIMARY KEY, ',
                                  'total_academics INT, ',
                                  'total_food INT, ',
                                  'total_rent INT, ',
                                  'total_licenses INT, ',
                                  'total_travelling INT, ',
                                  'total_other INT, ',
                                  'total_expense INT AS (total_academics + total_food + total_rent + total_licenses + total_travelling + total_other))');
    PREPARE stmt FROM @expenses_table;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- Subtables for academics
    SET @subtable_academics = CONCAT('CREATE TABLE ', user_name, '_academics (',
                                     'id INT AUTO_INCREMENT PRIMARY KEY, ',
                                     'fees INT, ',
                                     'stationary INT, ',
                                     'assignment INT, ',
                                     'custom INT)');
    PREPARE stmt FROM @subtable_academics;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- Subtables for food
    SET @subtable_food = CONCAT('CREATE TABLE ', user_name, '_food (',
                                'id INT AUTO_INCREMENT PRIMARY KEY, ',
                                'canteen INT, ',
                                'fastfood INT, ',
                                'grocery INT, ',
                                'custom INT)');
    PREPARE stmt FROM @subtable_food;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- Subtables for rent
    SET @subtable_rent = CONCAT('CREATE TABLE ', user_name, '_rent (',
                                'id INT AUTO_INCREMENT PRIMARY KEY, ',
                                'hostel INT, ',
                                'library INT, ',
                                'emi INT, ',
                                'custom INT)');
    PREPARE stmt FROM @subtable_rent;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- Subtables for licenses
    SET @subtable_licenses = CONCAT('CREATE TABLE ', user_name, '_licenses (',
                                    'id INT AUTO_INCREMENT PRIMARY KEY, ',
                                    'netflix INT, ',
                                    'mobiledata INT, ',
                                    'coursera INT, ',
                                    'custom INT)');
    PREPARE stmt FROM @subtable_licenses;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- Subtables for travelling
    SET @subtable_travelling = CONCAT('CREATE TABLE ', user_name, '_travelling (',
                                      'id INT AUTO_INCREMENT PRIMARY KEY, ',
                                      'bus INT, ',
                                      'train INT, ',
                                      'rickshaw INT, ',
                                      'custom INT)');
    PREPARE stmt FROM @subtable_travelling;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- Subtables for other
    SET @subtable_other = CONCAT('CREATE TABLE ', user_name, '_other (',
                                 'id INT AUTO_INCREMENT PRIMARY KEY, ',
                                 'category1 INT, ',
                                 'category2 INT, ',
                                 'category3 INT, ',
                                 'category4 INT)');
    PREPARE stmt FROM @subtable_other;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

END$$

DELIMITER ;

-- Step 5: Add a user and create their expense tables (run this after inserting users)
CALL create_user_expense_tables('ronald_aaron');
