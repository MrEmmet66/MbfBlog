
const passport = require('../../core/node_modules/passport')
const db = require('../../core/db')
const express = require('../../core/node_modules/express')
const app = express()
const session = require('../../core/node_modules/express-session')

exports.loginPost = function (request, response) {
    let email = request.body.email
    let password = request.body.password

    if(!request.session) {
        request.session = {}
    }

    db.get(
        "SELECT id Id, username name, email email, password pwd FROM users WHERE email = ?", [email], (err, row) => {
            if(err){
                console.error(err)
                return response.status(500).send('Internal Error')
            } 
            else {
                if(!row) {
                    const viewPath = global.date;
                    return response.status(404).sendFile(viewPath + "/user_not_found.html");
                }
                if(password != row.pwd) {
                    return response.status(401).send('Invalid password')
                }
                cookie = {
                    id: row.Id,
                    name: row.name,
                    email: row.email
                }
                response.cookie('MbfBlogUser', cookie)
                response.redirect("/feed")

            }
        }
    )
}

exports.loginForm = function (request, response) {
    if(request.cookies['MbfBlogUser']) {
        response.redirect("/feed")
    }
    else {
        response.sendFile(global.date + '\\auth\\loginView.html')
    }
}

exports.logout = function (request, response) {
    request.session.user = {}
    response.clearCookie('MbfBlogUser')
    response.redirect("/")
}