import express from 'express';
import 'dotenv/config';

import healthcheckRoutes from './controllers/healthcheckController';
import bookRoutes from './controllers/bookController';
import { Sequelize, DataTypes } from 'sequelize';

import {Request as ExpressRequest} from 'express'
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;
const sequelize = new Sequelize('bookish', 'bookishuser', 'icedlatte1', {
    host: 'localhost',
    dialect: 'mssql'
});


sequelize.authenticate().then(value => {console.log('Connection has been established successfully.')
    }).catch(error => {console.error('Unable to connect to the database:', error);})
    

const User = sequelize.define('User', {
    UserName: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    Token: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Users',
    timestamps: false
});

const Book = sequelize.define('Book', {
    ISBN: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    BookName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CopiesOwned: {
        type: DataTypes.INTEGER,
        allowNull: false}
}, {
    tableName: 'Catalogue',
    timestamps: false
});

sequelize.sync({ alter: true}).then(value => {console.log("Synced")  
    }).catch(error => {console.error('Not synced:', error);})

const barry = User.build({ UserName: "Barry", Token: "hotchocolate" });
barry.save().then(value => {console.log('Barry was saved')
    }).catch(error => {console.log('Barry was not saved');
})

async function getAllUsers() {
    const users = await User.findAll();
    return (JSON.stringify(users, null, 2));
}

async function getAllBooks() {
    const books = await Book.findAll();
    return (JSON.stringify(books, null, 2));
}

const port = process.env['PORT'] || 3000;

const app = express();
const router = express.Router();
app.use(express.urlencoded({ extended: true }));            // what is this??
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

app.get('/getallbooks', async function (req, res) {
    let bookArray = await getAllBooks()
    res.send(bookArray)
});

app.get('/getallusers', async function (req, res) {
    let userArray = await getAllUsers()
    res.send(userArray)
});


app.get('/login', (req, res) => {
    res.sendFile(__dirname + "/pages/index.html")
});
app.put('/login', async function (req, res) => {
    myUser = await User.findOne({ where: { UserName: req.body.userName}})
})

function findUser(userName, password)
{
    return new Promise((resolve, reject) => {
        var sqlCommand = 'SELECT Token FROM Users \n WHERE Username=\'' + userName + '\';';
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
            if (result === password) {
                console.log("match");
                resolve(new User(userName, password));
            }
            else {
                console.log("no match");
                resolve(null);
            }
        });
        connection.execSql(request);
    })
}





/*

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
const router = express.Router();
app.use(express.urlencoded({ extended: true }));            // what is this??
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

/**
 * Primary app routes.
 */
/*
app.get("/login", function(req, res) {
    res.sendFile(__dirname + "/pages/index.html");
});

/*
//var passport = require('passport')
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    async function verify(userName, password, cb) {
        await findUser(userName, password)
            .then(user => {
                if (!user) {
                    console.log("no match");
                    return cb(null, false, {message: 'Incorrect username or password.'});
                }
                else {
                    console.log("match");
                    return cb(null, user, {message: 'Logged in succesfully'});
                }
            })
            .catch(err => cb(err));
    }
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'your_jwt_secret'
    },
    async function (jwtPayload, cb){
        await findUserByUsername(jwtPayload.userName)
        .then(user => {
            console.log('found the user!')
            return cb(null, user);
        })
        .catch(err => {
            console.log('user not found')
            return cb(err);
        })
    }
))


app.post('/login', function (req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err) {
            console.log("error 1");
            console.log(err)
            
            return res.status(400).json({
                message: 'Something is not right',
                user: user
            });
        }
        if (!user) {
            console.log("no user object");
        }
            
        

        const token = jwt.sign(JSON.stringify(user), 'your_jwt_secret');
        console.log("got the token");
        return res.json({user, token});

        /*
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }

            const token = jwt.sign(user, 'your_jwt_secret');
            return res.json({user, token});
        
        })
        
    })(req, res, next);
}); 

app.use('/healthcheck', passport.authenticate('jwt', {session: false}), healthcheckRoutes);
app.use('/books', bookRoutes);
app.get('/getallbooks', async function (req, res) {
    let bookArray = await getAllBooks()
    res.send(bookArray)
});

////// functions /////

export function findUser(userName, password)
{
    return new Promise((resolve, reject) => {
        var sqlCommand = 'SELECT Token FROM Users \n WHERE Username=\'' + userName + '\';';
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
            if (result === password) {
                console.log("match");
                resolve(new User(userName, password));
            }
            else {
                console.log("no match");
                resolve(null);
            }
        });
        connection.execSql(request);
    })
}

function findUserByUsername(userName)
{
    return new Promise((resolve, reject) => {
        var sqlCommand = 'SELECT Token FROM Users \n WHERE Username=\'' + userName + '\';';
        var request = new Request(sqlCommand, (err) => {
            if(err){
                throw err;
            }                                                    
        });

        let result = [];
        request.on('row', function(columns){
            columns.forEach(function(column) {
                result.push(column.value);
            });
        });

        request.on('requestCompleted', function(rowCount, more){
            if (result.length != 0) {
                console.log("found the user");
                resolve(new User(result[0], result[1]));
            }
            else {
                console.log("no user found");
                resolve(null);
            }
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
/*
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

class User{
    userName: string;
    password: string;
    constructor(userName: string, password: string)
    {
        this.userName = userName
        this.password = password
    }
}
*/