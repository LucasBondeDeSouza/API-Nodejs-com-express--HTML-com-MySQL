var mysql = require('mysql2')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'bondelucas', 
    database: 'db_Biblioteca',
})
connection.connect((err) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('Database conectada')
})
module.exports = connection