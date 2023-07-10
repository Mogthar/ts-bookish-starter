import {findUser} from "./app"

var passport = require('passport');
var LocalStrategy = require('passport-local');

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function verify(userName, password, cb) {
        return findUser(userName, password)
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

  