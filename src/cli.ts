// import inquirer from "inquirer";

// import Query from "./query.js";

// async function runCli(){
//     //create variable to control loop so inquirer prompt keeps running until the user chooses to exit
//     let exit: boolean = false
//     do{
//         inquirer.prompt([
//             {
//                 type: 'list',
//                 name: 'actions',
//                 message: 'please choose from the following options: ',
//                 choices: [
//                     'view all departments', 
//                     'view all roles', 
//                     'view all employees', 
//                     'add a department', 
//                     'add a role', 
//                     'add an employee',
//                     'update an employee role',
//                     'exit'
//                 ],
//             }
//         ])
//         .then((answers) => {
//             console.log(`answers = ${JSON.stringify(answers)}`);
//             if(answers.actions === 'view all departments'){
//                 Query.viewAllDepartments();
//             }
//             if(answers.actions === 'exit'){
//                 exit = true;
//             }
//         }) 
//     }while(!exit)
// }

// export default { runCli };