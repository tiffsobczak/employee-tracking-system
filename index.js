const mysql = require('mysql2/promise');



const main = async() => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        //Your MYSQL UN and PW
        user: 'root',
        password: '',
        database: 'Employee Tracker'
    });
    const [rows] = await connection.query (
        'SELECT * FROM role'
    )
    console.table (rows)
}

main (); 