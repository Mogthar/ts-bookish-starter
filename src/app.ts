import express from 'express';
import 'dotenv/config';

import healthcheckRoutes from './controllers/healthcheckController';
import bookRoutes from './controllers/bookController';

var Request = require('tedious').Request;
var Connection = require('tedious').Connection;
var config = {
    server: "localhost",
    options :{
        database: 'bookish',
        port: 1433,
        trustServerCertificate: true,
        rowCollectionOnRequestCompletion: true
    },
    authentication: {
        type: "default",
        options: {  
            userName: "bookishuser",
            password: "icedlatte1",
        }
    }
};

var connection = new Connection(config);

connection.on('connect', function(err){
    if(err)
    {
        console.log(err);
    }
    console.log('Success');
    getAllBooks();
});

connection.connect();

function getAllBooks()
{
    var request = new Request('SELECT * FROM CATALOGUE;', (err, rowcount, rows) => {
        if(err)
        {
            throw err;
        }                                                    
    });
    let bookArray = [];
    request.on('row', function(columns){
        let data = [];
        columns.forEach(function(column) {
            data.push(column.value);
        });
        bookArray.push(new Book(data[0], data[1], data[2]));
    });

    request.on('requestCompleted', function(rowCount, more){
        console.log(bookArray);
        connection.close();
    });

    connection.execSql(request);

}






/*
const port = process.env['PORT'] || 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
*/

/**
 * Primary app routes.
 */

/*
app.use('/healthcheck', healthcheckRoutes);
app.use('/books', bookRoutes);

*/
class Book{
    isbn: number;
    bookName: string;
    numberOfCopies: number;
    constructor(isbn:number, bookName: string, copies:number)
    {
        this.isbn = isbn;
        this.bookName = bookName;
        this.numberOfCopies = copies;
    }
}


