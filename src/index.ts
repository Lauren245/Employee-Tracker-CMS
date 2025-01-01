import inquirer from "inquirer";
import { connectToDB } from "./connection.js";
import Query from "./query.js";

async function runPrompts() {
    // Create variable to control loop so inquirer prompt keeps running until the user chooses to exit
    let exit: boolean = false;
    await connectToDB();
    //create an array of department names to store in case the user wants to add a role
    let departmentsArr: string[] = await Query.getDepartments();
    do {
        try {
            // Defining a const here so I can use await for queries
            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'actions',
                    message: 'Please choose from the following options: ',
                    choices: [
                        'view all departments', 
                        'view all roles', 
                        'view all employees', 
                        'add a department', 
                        'add a role', 
                        'add an employee',
                        'update an employee role',
                        'exit'
                    ],
                },
                {
                    type: 'input',
                    name: 'departmentName',
                    message: 'Please enter a name for the new department',
                    when: (answers) => answers.actions === 'add a department'
                },
                {
                    type: 'input',
                    name: 'roleName',
                    message: 'Please enter the name of the role that you wish to add.',
                    when: (answers) => answers.actions === 'add a role'
                },
                {
                    type: 'number',
                    name: 'roleSalary',
                    message: 'Please enter the salary for this role.',
                    when: (answers) => answers.roleName != undefined
                },
                {
                    type: 'list',
                    name: 'selectDepartment',
                    message: 'Which department does this new role belong to?',
                    choices: departmentsArr,
                    when: (answers) => answers.roleSalary != undefined
                },
                {
                    type: 'input',
                    name: 'fName',
                    message: 'Please enter the first name of the employee',
                    when: (answers) => answers.actions === 'add an employee'
                },
                {
                    type: 'input',
                    name: 'lName',
                    message: 'Please enter the first name of the employee',
                    when: (answers) => answers.fName != undefined
                }
            ]);
            //TODO: figure out a way to handle falsey values in if statement checks inside the switch statement
            //console.log(`answers = ${JSON.stringify(answers)}`);
            let sqlStatement = '';
            switch (answers.actions) {
                case 'view all departments':
                    sqlStatement = Query.buildViewAllQuery('department');
                    if (sqlStatement) {
                        await Query.renderViewAllQuery();
                    }
                    break;
                case 'view all roles':
                    sqlStatement = Query.buildViewAllQuery('role');
                    if (sqlStatement) {
                        await Query.renderViewAllQuery();
                    }
                    break;
                case 'view all employees':
                    sqlStatement = Query.buildViewAllQuery('employee');
                    if (sqlStatement) {
                        await Query.renderViewAllQuery();
                    }
                    break;
                case 'add a department':
                    //check that departmentName is truthy 
                    if(answers.departmentName){
                        await Query.addDepartment(answers.departmentName);
                        //a department has been added so the departments array must be updated
                        departmentsArr = await Query.getDepartments();
                    }
                    break;
                case 'add a role':
                    //check that selectDepartment is truthy
                    //only checking selectDepartment because it is the last in a series of prompts
                    if(answers.selectDepartment){
                        await Query.addRole(answers.roleName, answers.roleSalary, answers.selectDepartment);
                    }
                    break;
                case 'exit':
                    exit = true;
                    //terminate the node.js app successfully
                    //this will be in the place of a break statement
                    process.exit(0);
                default:
                    throw new Error(`Unable to process the requested query.`);
            }
        } catch (error) {
            if(error instanceof Error){
                console.error(`An error occurred: ${error.stack}`);
            }
            else{
                console.error(`An unexpected error occurred: ${error}`);
            }
        }
        //console.log(`At end of do/while loop. exit = ${exit}`);
    } while (!exit);
}

await runPrompts();
