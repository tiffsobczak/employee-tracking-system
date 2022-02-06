const mysql = require('mysql2/promise');
const inquirer= require ('inquirer');

const questions =[
    {
    type: 'list',
    name: 'action',
    message: 'Choose an action:',
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
    }]

const required = (attr, input) => {
    if (input) {
        return true;
        //when there is no input
    } else {
        console.log(`Please enter valid input for ${attr}`);
        return false;
    }
}

const main = async() => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        //Your MYSQL UN and PW
        user: 'root',
        password: '',
        database: 'Employee Tracker'
    });
    const answers=await inquirer.prompt (questions)
    if (answers.action === 'view all departments') {
        const [departmentRows] = await connection.query ('SELECT * FROM department') 
        console.table (departmentRows)
    } else if (answers.action === 'view all roles') {
        const [rolesRows] = await connection.query ('SELECT * FROM role') 
        console.table (rolesRows)
    } else if (answers.action === 'view all employees') {
        const [employeeRows] = await connection.query ('SELECT * FROM employee') 
        console.table (employeeRows)
    } else if (answers.action === 'add a department') {
        const deptAnswers=await inquirer.prompt ([{
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?',
            validate: input => required("name", input)
        }, {
            type: 'input',
            name: 'description',
            message: 'What is the description of the department?',
            validate: input => required("description", input)
        }])
        
    }
    
    process.exit(0)
}



main (); 