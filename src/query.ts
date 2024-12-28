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

    async viewAllDepartments(){
        //this.initialize();
        this.sqlStatement = 
        `SELECT *
         FROM department;`;
        
         try{
            const result: QueryResult = await pool.query(this.sqlStatement);
            await this.outputTable(result);
         }catch(error){
            if(error instanceof Error){
                console.error(`\n viewAllDepartments encountered error: ${error.stack}`);
            }else{
                console.error(`\n viewAllDepartments encountered an unexpected error: ${error}`);
            }
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
