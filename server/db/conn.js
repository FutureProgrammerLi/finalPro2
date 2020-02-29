const mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'final',
  multipleStatements:true
});
 
connection.connect();

module.exports = connection;
