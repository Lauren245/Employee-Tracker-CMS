import inquirer from "inquirer";
import {connectToDB } from "./connection.js";

import Query from "./query.js";

async function runPrompts(){
    //create variable to control loop so inquirer prompt keeps running until the user chooses to exit
    let exit: boolean = false
    await connectToDB();
    do{
        //defining a const here so I can use await for queries
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'actions',
                message: 'please choose from the following options: ',
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
            }
        ])

        console.log(`answers = ${JSON.stringify(answers)}`);
        if(answers.actions === 'view all departments'){
            await Query.viewAllDepartments();
        }
        if(answers.actions === 'exit'){
            exit = true;
            //tell node.js to exit the program 
            process.exit(0);
        }
       console.log(`at end of do/while loop. exit = ${exit}`); 
    }while(!exit)
}

await runPrompts();

