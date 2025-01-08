# Employee-Tracker-CMS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) - https://opensource.org/licenses/MIT

## Table of Contents 
[Description](#description)

[Installation](#installation)

[Usage](#usage)

[Tests](#tests)

[License](#license)

[Questions](#questions)

[Resources](#resources)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Tutorials](#tutorials)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3rd-Party Software](#3rd-party-software)

[Screenshots](#screenshots)

[Video Demonstration](#video-demonstration)

## Description
Employee-Tracker-CMS is a command-line application designed to manage a company's employee database. This system allows users to view and manage departments, roles, and employees within an organization. The application provides a user-friendly interface to perform various operations such as viewing all departments, roles, and employees, adding new departments, roles, and employees, and updating employee roles. It leverages Node.js, Inquirer.js for interactive command-line prompts, and PostgreSQL for database management. This tool is ideal for HR departments or managers who need to keep track of employee information efficiently.

The application meets all the acceptance criteria, but there are somethings I want to tweak in the future. These items have comments labeled TODO.

## Installation
1. **Clone [the Repository](https://github.com/Lauren245/Employee-Tracker-CMS)**

2. **Install Dependencies:** Ensure you have Node.js and npm installed. Then, run the following command to install the required dependencies: ```npm install```.

3. **Set Up the Database:**
- Ensure you have PostgreSQL installed and running.
- Create a .env file in the root directory and add your database credentials: 

    ```DB_USER=your_database_user```

    ```DB_PASSWORD=your_database_password```

    ```DB_NAME=company_db```
- Run the database schema and seed files to set up the database:
    
    ```psql -U your_database_user -f db/schema.sql``` 

    ```psql -U your_database_user -f db/seeds.sql```

4. **Start the Application:** Run the application using: ```npm run start```

You should now be able to use the Employee-Tracker-CMS application to manage your company's employee database.

## Usage
1. **Navigate the Command-Line Interface**: 
    - The application will present you with a series of interactive prompts. Use the arrow keys to navigate through the options and press ```Enter``` to select an option.


2. **View Data**: 
    - **View All Departments**: Select this option to view a list of all departments in the company.

    - **View All Roles**: select this option to view a list of all roles within the company, along with their associated departments and salaries.

    - **View All Employees**: Select this option to view a list of all employees, including their roles, departments, salaries, and managers.

    - **View Employees by Department**: Select this option, and a department name, to view a list of all the employees within the specified department, including their ids, names, and job titles.

3. **Add Data**:
    - **Add a Department**: Select this option to add a new department. You will be prompted to enter the name of the department.

    - **Add a Role**: Select this option to add a new role. You will be prompted to enter the role name, salary, and the department to which the role belongs.

    - **Add an Employee**: Select this option to add a new employee. You will be prompted to enter the employee's first name, last name, department, role, and optionally, their manager.

4. **Update Data**:
    - **Update an Employee Role**: Select this option to update an employee's role. You will be prompted to select the employee, their new department, and their new role.

5. **Exit the Application**: Select this option to exit the application. The database connection will be closed, and the application will terminate.

## Tests
- There are no unit tests, but the application can be tested manually.

## License
Copyright 2025 Lauren Moore

This software uses an [MIT license](https://opensource.org/license/MIT).

## Questions
If you have additional questions, you can contact me at: 

GitHub: [Lauren245](https://github.com/Lauren245)

Email: laurenmoorejm@gmail.com

## Resources

### Tutorials
1. **[SQL CASE Statement](https://www.geeksforgeeks.org/sql-case-statement/)** by Geeks for Geeks: Resource on using CASE statements in SQL. I did this for the view all employees query.

2. **[SQL Operators](https://www.w3schools.com/sql/sql_operators.asp)** by W3 Schools: Resource for SQL operators.

3. **[node-postgres pooling](https://node-postgres.com/features/pooling)**
Postgres documentation reference for pooling. 

4. **[PostgreSQL UPDATE](https://www.w3schools.com/postgresql/postgresql_update.php)** by W3 Schools: Resource for using the UPDATE statement in Postgre SQL.

5. **[JavaScript String repeat()](https://www.w3schools.com/jsref/jsref_repeat.asp)** by W3 Schools: Resource for using the string repeat method. Used when creating output table.

6. **[How to use Inquirer.js](https://javascript.plainenglish.io/how-to-inquirer-js-c10a4e05ef1f)** by Mat Wilmot on Medium: used for additional research on how to use Inquirer.js.
 7. **[TypeScript String trim() Method](https://www.geeksforgeeks.org/typescript-string-trim-method/)** by Geeks for Geeks: Resource on using the string trim method, used when adding employees to the database.
8. [ChatGPT Help with Async Await Bug Fix](https://chatgpt.com/share/676f5311-6e28-8012-b912-fe7942bcb977)

9. [ChatGPT Help With Table Formatting](https://chatgpt.com/share/676f5d3a-279c-8012-8528-486955d4b515)

10. [ChatGPT how to use the LOWER() function in SQL](https://chatgpt.com/share/676f7d34-db7c-8012-8207-339638419efc)

### 3rd-Party Software
1.  **[Inquirer.js](https://github.com/SBoudrias/Inquirer.js)** Copyright (c) 2023 Simon Boudrias (twitter: [@vaxilart](https://twitter.com/Vaxilart)) - Licensed under the MIT license.

2. **[Pg Package](https://www.npmjs.com/package/pg)** Copyright (c) 2010-2020 Brian Carlson (brian.m.carlson@gmail.com)


## Screenshots

**Image of the schema for the company_db database.**

![A screenshot of a VS Code workspace showing a PostgreSQL schema file named schema.sql. The file defines a database named company_db with three tables: department, role, and employee. Each table includes columns with specific data types and constraints, such as primary keys and foreign key relationships](./resources/screenshots/Employee-CMS-Schema.jpg)


**Image of the main menu of the application running in the command line.**

![A screenshot of a VS Code workspace showing a project directory and terminal output. After running the npm start command, the program compiles (tsc) and presents a menu with options such as "view all departments," "view all roles," "view all employees," "view employees by department," "add a department," "add a role," "add an employee," and "update an employee role." The user is prompted to select an option using arrow keys.](./resources/screenshots/Employee-CMS-Main-Menu.jpg)

**Image showing the table results from the view all employees prompt.**

![A screenshot of a VS Code workspace showing a project directory and terminal output.After running the npm start command, the program compiles (tsc) and presents a menu with options. The option "view all employees" is selected, displaying a formatted table of employee data. The table includes columns for id, First Name, Last Name, title, department, salary, and manager. Example entries include "John Doe" as a Software Engineer in the Engineering department with a salary of 80,000. Below the table, the menu reappears with options like "view all departments" and "add an employee."](./resources/screenshots/Employee-CMS-View-All-Employees.jpg)


## Video Demonstration
 **[Link to demonstration video on Google Drive](https://drive.google.com/file/d/1iCmjnRVdJv8BsyRfpNkGC18CrDG4rWhC/view?usp=sharing)**
 
--- 

**[Back to Top](#employee-tracker-cms)**
