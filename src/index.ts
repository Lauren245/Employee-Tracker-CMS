import inquirer from "inquirer";
import { connectToDB, disconnectDB } from "./connection.js";
import Query from "./query.js";

async function runPrompts() {
    // Create variable to control loop so inquirer prompt keeps running until the user chooses to exit
    let exit: boolean = false;
    await connectToDB();
    //create an array of department names to store in case the user wants to add a role
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
                        'view employees by department',
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
                    when: (answers) => !!answers.roleName
                },
                {
                    type: 'list',
                    name: 'selectDepartment',
                    message: 'Which department does this new role belong to?',
                    choices: departmentsArr,
                    when: (answers) => !!answers.roleSalary
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
                    when: (answers) => !!answers.fName 
                },
                {
                    type: 'list',
                    name: 'empDepartment',
                    message: 'which department will this employee work in?',
                    choices: departmentsArr,
                    when: (answers) => !!answers.lName
                },
                {
                    type: 'list',
                    name: 'empRole',
                    message: 'assign a role for the employee',
                    choices: async (answers) => {
                        return await Query.getDepartmentRoles(answers.empDepartment);
                    },
                    when: (answers) => !!answers.empDepartment
                },
                {
                    type: 'confirm',
                    name: 'includeManager',
                    message: 'Do you want to add a manager for this employee?',
                    when: (answers) => !!answers.empRole 
                },
                {
                    type: 'list',
                    name: 'selectManager',
                    message: 'Please select a manager for this employee',
                    choices: async (answers) => {
                        return await Query.getEmployeesByDepartment(answers.empDepartment);      
                    },
                    when: (answers) => answers.includeManager === true
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
                        return await Query.getDepartmentRoles(answers.department);
                    },
                    when: (answers) => !!answers.department
                },
                {
                    type: 'list',
                    name: 'employeebyDepartment',
                    message: 'Which department would you like to see the employees of?',
                    choices: departmentsArr,
                    when: (answers) => answers.actions === 'view employees by department'
                }

            ]);
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
                case 'view employees by department':
                        await Query.viewEmployeesByDepartment(answers.employeebyDepartment);
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
                    if(answers.empRole.length > 0){
                        if(answers.includeManager){
                            await Query.addEmployee(answers.fName, answers.lName, answers.empDepartment, answers.empRole, answers.selectManager);
                        }else {
                            await Query.addEmployee(answers.fName, answers.lName, answers.empDepartment, answers.empRole);
                        }
                    }
                    //update employees array so it includes the new employee.
                    employeeArr = await Query.getEmployees();
                    break;
                case 'update an employee role':
                    if(answers.employeebyDepartment){
                        await Query.updateEmployeeRole(answers.employee, answers.department, answers.departmentRoles);
                    }
                    break;
                case 'exit':
                    exit = true;
                    //terminate the node.js app successfully
                    //this will be in the place of a break statement
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
    } while (!exit);
}

await runPrompts();
