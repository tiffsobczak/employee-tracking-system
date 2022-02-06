//Required imports to run
const mysql = require('mysql2/promise');
const inquirer= require ('inquirer');

//action options
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
    //options for actions
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
            //requires valid input
            validate: input => required("name", input)
        }, {
            type: 'input',
            name: 'description',
            message: 'What is the description of the department?',
            validate: input => required("description", input)
        }])
        //aligning input with columns on table to insert data
        await connection.execute ("INSERT INTO department (name, description) VALUES (?,?)", [deptAnswers.name, deptAnswers.description])
        console.log("Department added!")
    } else if (answers.action === 'add a role') {
        const roleAnswers=await inquirer.prompt ([{
            type: 'input',
            name: 'title',
            message: 'What is the name of the role?',
            validate: input => required("name", input)
        }, {
            type: 'number',
            name: 'salary',
            message: 'What is the salary of the role?',
            validate: input => required("salary", input)
        }, { 
            type: 'number',
            name: 'department',
            message: 'Which department id does this role belong to?'
        }])
        await connection.execute ("INSERT INTO role (title, salary, department_id) VALUES (?,?,?)", [roleAnswers.title, roleAnswers.salary, roleAnswers.department])
        console.log("Role added!")
    } else if (answers.action === 'add an employee') {
        const employeeAnswers=await inquirer.prompt([{
            type: 'input',
            name: 'first_name',
            message: "What is the employee's first name?",
            validate: input => required("first_name", input)
        },{ type: 'input',
            name: 'last_name',
            message: "What is the employee's last name?",
            validate: input => required("last_name", input)
        }, {
            type: 'number',
            name: 'role_id',
            message: 'What is role id of the employee?',
        }, {
            type: 'number',
            name: 'manager_id',
            message: 'What is manager id for the employee?',
        }])
        await connection.execute ("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [employeeAnswers.first_name, employeeAnswers.last_name, employeeAnswers.role_id, employeeAnswers.manager_id])
        console.log("Employee added!")
    } else if (answers.action === 'update an employee role') {
        const updateAnswers=await inquirer.prompt ([{
            type: 'number',
            name: 'employee_id',
            message: "What is the id of the employee you want to update?",
            validate: input => required("employee_id", input)
        }, {
            type: 'number',
            name: 'role_id',
            message: "What is the id of the role the employee should update to?",
            validate: input => required("role_id", input)
        }])
        await connection.execute ("UPDATE employee SET role_id=? WHERE id =?",[updateAnswers.role_id, updateAnswers.employee_id])
        console.log("The employee was updated!")
    }
    
    process.exit(0)
}



main (); 