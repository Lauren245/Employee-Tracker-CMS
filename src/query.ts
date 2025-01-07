import { QueryResult } from "pg";
import { pool } from "./connection.js";
//import Table from 'cli-table'


/*DEPARTMENT METHODS
    1. viewAllDepartments()
    2. addDepartment(departmentName: string) 
*/

/*EMPLOYEE METHODS
    1. viewAllEmployees()
    2. addEmployee(firstName: string, lastName: string, jobTitle: string, departmentName: string, managerId?: number)
    3. updateEmployeeRole(employeeId: number, )
 */

/*ROLE METHODS
    1. viewAllRoles
    2. addRole
*/
class Query{
    sqlStatement?: string

    constructor(){
        console.log("inside query constructor");
    }
    //GETTERS 
    async getDepartments(): Promise<string[]>{
        console.log("RUNNING getDepartments");
        try{
            this.sqlStatement = 
                `SELECT name
                FROM department;`;

            const result: QueryResult = await pool.query(this.sqlStatement);
            const resultArr: string[] = []

            if(result.rowCount){
                for(let i = 0; i < result.rowCount; i++){
                    resultArr.push((Object.values(result.rows[i]).toString()));
                }

                return resultArr;
            }
            //code will only reach this point if nothing is returned from the DB query.
            throw new Error(`unable to get departments.`);

        }catch(error){
            if(error instanceof Error){
                console.error(`\n getDepartments encountered error: ${error.stack}`);
            }else{
                console.error(`\n getDepartments encountered an unexpected error: ${error}`);
            }
            //TODO: change this to empty array
            throw new Error //either keep this, or figure out data validation for empty array.
        }
    }
    //TODO: add code that better handles a department not having roles
    async getDepartmentRoles(departmentName: string): Promise<string[]>{
        console.log("RUNNING getDepartmentRoles");
        try{
            //get the department ID based off its name
            const departmentId = await this.getDepartmentId(departmentName);

            //get the roles from the role table where the departmentId matches
            this.sqlStatement = 
                `SELECT title
                 FROM role
                 WHERE department_id = $1;`;

            const result: QueryResult = await pool.query(this.sqlStatement, [departmentId]);
            const resultArr: string[] = []

            if(result.rowCount){
                //TODO: ??? change to result.rows.map?
                for(let i = 0; i < result.rowCount; i++){
                    resultArr.push((Object.values(result.rows[i]).toString()));
                }

                return resultArr;
            }
            //code will only reach this point if nothing is returned from the DB query.
            throw new Error(`unable to get roles from department "${departmentName}" from the database.`);

        }catch(error){
            if(error instanceof Error){
                console.error(`\n getDepartmentRoles encountered error: ${error.stack}`);
            }else{
                console.error(`\n getDepartmentRoles encountered an unexpected error: ${error}`);
            }
            return [];
        }
    }

    async getEmployees(): Promise<string[]>{
        try{
            this.sqlStatement = 
                `SELECT id, first_name, last_name
                 FROM employee;`;

            const result: QueryResult = await pool.query(this.sqlStatement);
            //const resultsArr: string[] = [];

            if(result.rowCount){
                const resultsArr: string[] = result.rows.map(row => Object.values(row).toString().replace(/,/g, ' '));
                console.log(`resultsArr = ${JSON.stringify(resultsArr)}`);
                return resultsArr;
            }

            throw new Error('unable to get employees from the database.');

        }catch(error){
            if(error instanceof Error){
                console.error(`\n getEmployees encountered error: ${error.stack}`);
            }else{
                console.error(`\n getEmployees encountered an unexpected error: ${error}`);
            }
            return [];
        }
    }

    //this will be used for the manager selection list when adding a new employee to the DB. This ensures that only managers from the given departement are selected.
    async getEmployeesByDepartment(departmentName: string): Promise<string []>{
        console.log('RUNNING getEmployeesByDepartment');
        console.log(`departmentName passed in = ${departmentName}`);
        try{
            const departementId = await this.getDepartmentId(departmentName);
            console.log(`departmentID = ${departementId}`);
            this.sqlStatement =
                `SELECT emp.id, emp.first_name, emp.last_name
                FROM employee emp 
                    JOIN role rol 
                        ON emp.role_id = rol.id
                JOIN department dep 
                    ON rol.department_id = dep.id
                WHERE dep.id = $1; `;
            const result: QueryResult = await pool.query(this.sqlStatement, [departementId]);

            if(result.rowCount){
                const resultsArr: string[] = result.rows.map(row => Object.values(row).toString().replace(/,/g, ' '));
                console.log(`resultsArr = ${JSON.stringify(resultsArr)}`);
                return resultsArr;
            }

            throw new Error(`unable to get employees in the "${departmentName}" department from the database.`);

        }catch(error){
            if(error instanceof Error){
                console.error(`\n getEmployeesByDepartment encountered an error: ${error.stack}`);
            }
            else{
                console.error(`\n getEmployeesByDepartment encountered an unexpected error: ${error}`);
            }
            return [];
        }
    }

        /*this method gets the id for a role based on the combination of role title and department names.
     this is needed becasue mulitple departments can have a role with the same name, but department
     can't have multiple roles with the same name.*/
     async getRoleId(roleName: string, departmentName: string): Promise<number>{
        console.log('RUNNING getRoleId');
        try{
            const departmentIdQuery = 
                `SELECT id
                FROM department
                WHERE name = $1;`;

            const departmentIdResult = await pool.query(departmentIdQuery, [departmentName]);
            //console.log(`departmentIdResult.rows = ${departmentIdResult.rows}`);

            //convert to number
            const departmentId = parseInt(departmentIdResult.rows[0].id);
            //console.log(`departmentId = ${departmentId}`);

            const roleIdQuery = 
                `SELECT id
                FROM role 
                WHERE department_id = $1 AND title = $2;`;
            const roleIdResult = await pool.query(roleIdQuery, [departmentId, roleName]);

            //convert to number
            const roleId = parseInt(roleIdResult.rows[0].id);
            //console.log(`roleId = ${roleId}`);

            return roleId;

        }catch(error){
            console.error(`getRoleId has encountered an unexpected error: ${error}`);
            return -1;
        }
    }

    async getDepartmentId(departmentName: string): Promise<number>{
        console.log('RUNNING getDepartmentId');
        try{
            const departmentIdQuery =
                `SELECT id 
                 FROM department
                 WHERE name = $1;`;

            const departmentIdResult = await pool.query(departmentIdQuery, [departmentName]);

            //convert to number
            const departmentId = parseInt(departmentIdResult.rows[0].id);
            //console.log(`departmentId = ${departmentId}`);

            return departmentId;
            
        }catch(error){
            console.error(`\n getDepartmentId encountered unexpected error: ${error}`);
            return -1;
        }
    }
    //TODO: consider making special error-handling method to avoid repitition. 

    //This method constructs queries to view all of the elements related to the provided table
    //TODO: I think this should probably be async
    buildViewAllQuery(tableName: string): string{
        console.log('RUNNING buildViewAllQuery');
        //console.log(`this.sqlStatement =  ${this.sqlStatement}`);
        //console.log(`table name passed in = ${tableName}`);
        try{
            switch(tableName){
                case 'department':
    
                    this.sqlStatement = 
                        `SELECT *
                        FROM department;`;
                    break;
    
                case 'role':
    
                    this.sqlStatement =
                        `SELECT rol.id AS id, rol.title AS title, 
                            dep.name AS department, rol.salary AS salary
                        FROM role AS rol
                            JOIN department AS dep
                                ON rol.department_id = dep.id;`;
                    break;
    
                case 'employee':
                    
                    this.sqlStatement = 
                        `SELECT emp.id AS ID, emp.first_name AS "First Name",
                            emp.last_name AS "Last Name", rol.title AS Title, 
                            dep.name AS Department, rol.salary AS Salary,
                            --include case statement to replace empty space with null if employee has no manager
                            CASE
                                WHEN mgr.id IS NULL THEN 'null'
                                ELSE CONCAT(mgr.first_name, ' ', mgr.last_name)
                            END AS Manager
                        FROM employee AS emp
                            JOIN role AS rol 
                                ON emp.role_id = rol.id
                            JOIN department AS dep 
                                ON rol.department_id = dep.id
                            LEFT JOIN employee AS mgr
                                ON emp.manager_id = mgr.id
                        --ensures the employee can't be their own manager.
                        WHERE emp.id <> emp.manager_id OR emp.manager_id IS NULL;`;
                    break;
                default:
                    throw new Error(`unable to build a query for the table "${tableName}".`);               
            };
            //console.log(`RETURNING ${this.sqlStatement}`);
            return this.sqlStatement;

        }catch(error){
            if(error instanceof Error){
                console.error(`\n buildViewAllQuery encountered error: ${error.stack}`);
            }else{
                console.error(`\n buildViewAllQuery encountered an unexpected error: ${error}`);
            }
            return '';
        }
    };

    //When given a valid SQL statement (meaning this.sqlStatement is truthy), this method queries the database and calls the method to render the table
    //I isolated this from the code that builds the SQL statement, because (unlike that code), this code remains the same for every view all query
    async renderViewAllQuery(){
        console.log('RUNNING renderViewAllQuery');
        //console.log(`this.sqlStatement =  ${this.sqlStatement}`);
        try{
            //ensure sqlStatement property has a truthy value.
            if(this.sqlStatement){
                const result: QueryResult = await pool.query(this.sqlStatement);
                await this.outputTable(result);
            }
            else{
                throw new Error(`Invalid SQL statement.`);
            }
         }catch(error){
            if(error instanceof Error){
                console.error(`\n renderViewAll encountered error: ${error.stack}`);
            }else{
                console.error(`\n renderViewAll encountered an unexpected error: ${error}`);
            }
         }
    }

        //TODO: figure out how to modify this to preventSQL injections, there is a possiblility that the pool statement will handle this.
    async addDepartment(departmentName: string){
        console.log('RUNNING addDepartment');
        //console.log(`Department name passed in = ${departmentName}`);
    
        try{
            /*I'm converting departmentName to lowerCase and comparing it to existing department names (converted to lowercase using the database
              function LOWER()). The goal is to prevent matching department names with different casings from being counted as 
              seperate departments (i.e. SALES, sales, and Sales are considered to be the same department). This conversion is only done 
              when testing for existing department names that match the departmentName parameter. That way, the user can still create new department 
              names using whichever form of casing they prefer.*/
            const lowerCaseDepName = departmentName.toLowerCase();
            const checkQuery = `SELECT COUNT(*) FROM department WHERE LOWER(name) = $1`;
            const checkResult = await pool.query(checkQuery, [lowerCaseDepName]);
                
            //console.log(`checkResult = ${JSON.stringify(checkResult.rows)}`);
            //check if a record was returned from the previous query
            if(parseInt(checkResult.rows[0].count) > 0){
                //I considered making this an error, but it isn't really an error that the app needs to know about.
                console.log(`Department with name "${departmentName}" already exists in the database`);
            }
            else{
                //the calling function ensures that departmentName is valid before calling this method.
                this.sqlStatement = 
                    `INSERT INTO department (name)
                     VALUES ($1);`;

                await pool.query(this.sqlStatement, [departmentName]);
                console.log(`Department "${departmentName}" was added successfully!`);                    
            }               
        }catch(error){
            console.error(`\n addDepartment encountered an unexpected error. ${error}`);
        }
    }
    //TODO ensure there are no leading or trailing spaces on the names.
    //employee's first name, last name, role, and manager, and that employee is added to the database
    async addEmployee(firstName: string, lastName: string, departmentName: string, roleName: string,  managerInfo?: string){
        console.log('RUNNING addEmployee');
        try{
                //get the id for role using their names
                const roleId = await this.getRoleId(roleName, departmentName);              

            //having a manager is not required so different actions must be taken if no manager is entered.
            if(managerInfo){
                console.log('inside managerInfo if statement');
                console.log(`values passed in for managerInfo = ${JSON.stringify(managerInfo)}`);
                const split = managerInfo.split(' ');
                //get the content after the last , 
                const managerId = split[0].trim();
                console.log(`MANAGER id = ${managerId}`);
                this.sqlStatement = 
                  `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                   VALUES($1, $2, $3, $4)`;
                //get the id for manager using their name
                //const managerId = await this.getManagerId(managerFName, managerLName);
                await pool.query(this.sqlStatement, [firstName, lastName, roleId, managerId]);
            }else{
                this.sqlStatement = 
                  `INSERT INTO employee (first_name, last_name, role_id)
                   VALUES($1, $2, $3)`;
                await pool.query(this.sqlStatement, [firstName, lastName, roleId]);
            }

            console.log(`Employee "${firstName} ${lastName}" was added successfully!`);


        }catch(error){
            console.error(`\n addEmployee encoutered an unexpected error: ${error}`);
        }

    }

    async addRole(roleName: string, salary: number, departmentName: string){
        console.log("RUNNING addRole method");
        try{
            //check if role is duplicate
            const lowerCaseRoleName = roleName.toLowerCase();
            const lowerCaseDepName = departmentName.toLowerCase();
            /*only counting duplicates if another record has the same roleName AND departmentName,
                that way a role name can be used in another department*/
            const checkQuery = 
                `SELECT COUNT(*) 
                FROM role 
                    JOIN department
                        ON role.department_id = department.id
                WHERE LOWER(role.title) = $1 AND LOWER(department.name) = $2;`;

            const checkResult = await pool.query(checkQuery, [lowerCaseRoleName, lowerCaseDepName]);
            //check if a record was returned from the previous query
            if(parseInt(checkResult.rows[0].count) > 0){
                console.log(`The role "${roleName}" in the "${departmentName}" department already exists in the database`);
            }
            else{
                //get the department id first
                const idQuery = 
                    `SELECT id
                     FROM department 
                     WHERE name = $1;`;
                const result = await pool.query(idQuery, [departmentName]);

                //convert object to type string so query knows what to do with it
                //[0][0] accesses the first value in the array of values in the first row.
                const departmentId = Object.values(result.rows[0])[0] as string;

                this.sqlStatement = 
                    `INSERT INTO role (title, salary, department_id)
                     VALUES ($1, $2, $3);`;

                await pool.query(this.sqlStatement, [roleName, salary, departmentId]);
                console.log(`role "${roleName}" was added successfully!`);
            }
        }catch(error){
            console.error(`\n addRole encountered an unexpected error. ${error}`);
        }
       
    }

    async updateEmployeeRole(employeeInfo: string, newDepartmentName: string, newRoleName: string){
        console.log(`RUNNING updateEmployeeRole`);
        console.log(`value passed in = ${JSON.stringify(employeeInfo)}, ${newDepartmentName}, ${newRoleName}`);
        try{
            const split = employeeInfo.split(' ');
            //get the content after the last , 
            const employeeId = split[0].trim();
            console.log(`EMPLOYEE id = ${employeeId}`);

            //get the roleId
            const roleId = await this.getRoleId(newRoleName, newDepartmentName);
            console.log(`roleId = ${roleId}`); 

            this.sqlStatement = 
                `UPDATE employee
                 SET role_id = $1
                 WHERE id = $2;`;

            await pool.query(this.sqlStatement, [roleId, employeeId]);
            console.log(`Employee's role changed to ${newRoleName} successfully!`);

        }catch(error){
            console.error(`\n updateEmployeeRole encountered an unexpected error. ${error}`);
        }
    }

    async outputTable(result: QueryResult){
        console.log("RUNNING outputTable method");
        try{
            //ensure result.rowCount is truthy
            if(result.rowCount){
                //get the column names using the keys of the first row.
                const columnNames = Object.keys(result.rows[0]);

                //calculate the max width for each column in the array to ensure that there is proper spacing
                /*this calculation takes into account both the length of the column name, and the length of the
                  longest value within that column to determine how much spacing is required.*/
                const columnWidths = columnNames.map(column => {
                    return Math.max(column.length, ...result.rows.map(row => String(row[column]).length));
                });

                //use the previously calculated columnWidths to format a row
                const formatRow = (row: any) => {
                    return columnNames.map((column, index) => {
                        //since any type can be passed in, we must convert the value passed via the parameter to a string
                        return String(row[column]).padEnd(columnWidths[index], ' ');
                    }).join(' | ');
                }

                //create table headers formatted with the previously calculated columnWidths
                let header = columnNames.map((column, index) => column.padEnd(columnWidths[index], ' ')).join(' | ');
                console.log(header);
                //print a separator line
                //.repeat will return copies of '-' until it matches the length of the header.
                console.log('-'.repeat(header.length)); 

                //loop through and format each row and log the result to the console.
                result.rows.forEach(row => {
                    console.log(formatRow(row));
                });

                //console log a space after the table output to improve readability
                console.log("\n");

            }else{
                //TODO: check to see if this returns the expected output
                throw new Error(`result.rowCount cannot be ${typeof(result.rowCount)}`);
            }
        }catch(error){
            if(error instanceof Error){
                console.error(`\n outputTable encountered error: ${error.stack}`);
            }else{
                console.error(`\n outputTable encountered an unexpected error: ${error}`);
            }
        }

 
    }
}
export default new Query();
