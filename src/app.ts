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
    if(err){
        console.log(err);
    }
    console.log('Success');
});

connection.connect();


const port = process.env['PORT'] || 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));            // what is this??
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

/**
 * Primary app routes.
 */

app.use('/healthcheck', healthcheckRoutes);
app.use('/books', bookRoutes);
app.get('/getallbooks', async function (req, res) {
    let bookArray = await getAllBooks()
    res.send(bookArray)
    });


app.post('/test', function(req, res) {
    let testVar = req.body.testInput;
    console.log(testVar);
});

app.get('/test', function(req, res) {
    res.send('Hi, try and input something here');
});

/*
app.put('/login', async function (req, res) {
    let userValidation = await checkUser('no, 'no');
    // take string and compare to database
    // if a match, give token and print success
    // if not, print user not valid
});
*/

function checkUser(username, password)
{
    return new Promise((resolve, reject) => {
        var sqlCommand = 'SELECT Token FROM Users \n WHERE Username=\'' + username + '\';';
        var request = new Request(sqlCommand, (err) => {
            if(err){
                throw err;
            }                                                    
        });

        let result;
        request.on('row', function(columns){
            columns.forEach(function(column) {
                result = column.value;
            });
        });

        request.on('requestCompleted', function(rowCount, more){
            resolve(result === password);
        });
        connection.execSql(request);
    })
}

function getAllBooks() {
    return new Promise((resolve, reject) => {
        var request = new Request('SELECT * FROM CATALOGUE;', (err) => {
            if(err){
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
            resolve(bookArray)
        });
        connection.execSql(request);
    })
}

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


