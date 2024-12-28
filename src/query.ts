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

    //TODO: consider making special error-handling method to avoid repitition. 

    //This method constructs queries to view all of the elements related to the provided table
    buildViewAllQuery(tableName: string): string{
        console.log('RUNNING buildViewAllQuery');
        console.log(`this.sqlStatement =  ${this.sqlStatement}`);
        console.log(`table name passed in = ${tableName}`);
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
            console.log(`RETURNING ${this.sqlStatement}`);
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
        console.log(`this.sqlStatement =  ${this.sqlStatement}`);
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
            console.log(`Department name passed in = ${departmentName}`);
    
            try{
                const lowerCaseDepName = departmentName.toLowerCase();
                const checkQuery = `SELECT COUNT(*) FROM department WHERE LOWER(name) = $1`;
                const checkResult = await pool.query(checkQuery, [lowerCaseDepName]);
                
                console.log(`checkResult = ${JSON.stringify(checkResult.rows)}`);
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
                    console.log(`Department "${departmentName} was added successfully!"`);                    
                }               
            }catch(error){
                console.error(`\n addDepartment encountered an unexpected error. ${error}`);
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
