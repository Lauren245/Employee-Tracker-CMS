import inquirer from "inquirer";
import { connectToDB, disconnectDB } from "./connection.js";
import Query from "./query.js";

async function runPrompts() {
    // Create variable to control loop so inquirer prompt keeps running until the user chooses to exit
    let exit: boolean = false;
    await connectToDB();
    //create an array of department names to store in case the user wants to add a role
    //!!! I think I may change this to be better match how I'm handling getDepartmentRoles
    let departmentsArr: string[] = await Query.getDepartments();
    let employeeArr = await Query.getEmployees();
    
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
                    message: 'Please enter the last name of the employee',
                    when: (answers) => answers.fName != undefined
                },
                {
                    type: 'list',
                    name: 'empDepartment',
                    message: 'which department will this employee work in?',
                    choices: departmentsArr,
                    when: (answers) => answers.lName != undefined
                },
                {
                    type: 'list',
                    name: 'empRole',
                    message: 'assign a role for the employee',
                    choices: async (answers) => {
                        //TODO: try to find more graceful way to do this.
                        if (answers.empDepartment) {
                            return await Query.getDepartmentRoles(answers.empDepartment);
                        }
                        return [];
                        // if (answers.empDepartment) {
                        //     try {
                        //         const roles = await Query.getDepartmentRoles(answers.empDepartment);
                        //         return roles.length > 0 ? roles : ['No roles available for this department'];
                        //     } catch (error) {
                        //         console.error('Error fetching roles:', error);
                        //         return ['Error fetching roles, please try again'];
                        //     }
                        // }
                        // return ['No department selected'];
                    },
                    when: (answers) => !!answers.empDepartment
                },
                {
                    type: 'confirm',
                    name: 'includeManager',
                    message: 'Do you want to add a manager for this employee?',
                    when: (answers) => !!answers.empRole //check if this works with empty arrays
                },
                {
                    type: 'input',
                    name: 'managerFName',
                    message: `Please enter the manager's first name`,
                    when: (answers) => answers.includeManager === true
                },
                {
                    type: 'input',
                    name: 'managerLName',
                    message: `Please enter the manager's last name`,
                    when: (answers) => answers.managerFName != undefined
                },
                {
                    type: 'list',
                    name: 'employee',
                    message: `Which employee's role do you want to update?`,
                    choices: employeeArr,
                    when: (answers) => answers.actions === 'update an employee role'
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department does their new role belong to?',
                    choices: departmentsArr,
                    when: (answers) => !!answers.employee
                },
                {
                    type: 'list',
                    name: 'departmentRoles',
                    message: `Please select the employee's new role`,
                    choices: async (answers) => {
                        //TODO: try to find more graceful way to do this.
                        if (answers.department) {
                            return await Query.getDepartmentRoles(answers.department);
                        }
                        return [];
                    },
                    when: (answers) => !!answers.department
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
                case 'add an employee':
                    // check that empRole did not return an empty array
                    // only checking empRole because it is the last required item in a series of prompts
                    if (answers.empRole.length != 0) {
                        if (answers.managerFName && answers.managerLName) {
                            await Query.addEmployee(answers.fName, answers.lName, answers.empDepartment, answers.empRole, answers.managerFName, answers.managerLName);
                        } else {
                            await Query.addEmployee(answers.fName, answers.lName, answers.empDepartment, answers.empRole);
                        }
                        //update employees array
                         employeeArr = await Query.getEmployees();
                    }
                    break;
                case 'update an employee role':
                    //TODO: add if statement
                    await Query.updateEmployeeRole(answers.employee, answers.department, answers.departmentRoles);
                    break;
                case 'exit':
                    exit = true;
                    //terminate the node.js app successfully
                    //this will be in the place of a break statement
                    //TODO: add pool.end
                    await disconnectDB();
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
