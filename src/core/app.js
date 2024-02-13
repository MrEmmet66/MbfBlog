const express = require("express")
const session = require("../core/node_modules/express-session");
const cookieParser = require("cookie-parser")

const registerController = require("../controllers/regController.js")
const profileViewController = require("../controllers/profileController.js")
const loginController = require("../controllers/auth/LoginController.js")


const app = express()
const db = require("./db.js");

db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT UNIQUE, password TEXT)"
    )

    db.run(
      "CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, content TEXT)"
    )
})


app.use(cookieParser("ilovemorgenshtern"))

app.use(session({
  secret: 'oleg_bebra',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // set secure to true if using HTTPS
}));

app.set("view engine", "hbs")
app.use(express.urlencoded({extended: false}))

const registerRouter = express.Router()
const loginRouter = express.Router()
const profileViewRouter = express.Router()
registerRouter.use("/create_account", registerController.register_form)
registerRouter.use("/successfully_register", registerController.register_get_form)

loginRouter.get('/login', loginController.loginForm)
loginRouter.post('/login', loginController.loginPost)
loginRouter.get('/logout', loginController.logout)

profileViewRouter.use("/:username", profileViewController.check_profile)

app.get("/", function(request, response) {
  response.sendFile(global.date + "/rootPage.html")
})

app.get("/feed", function(request, response) {
  console.log(request.session.user)
  console.log(request.cookies)
  if(request.session.user || request.cookies["MbfBlogUser"]) {
    response.sendFile(global.date + "/feed.html")
  }
  else {
    response.sendFile(global.date + "/auth/loginView.html")
  }
})

app.post("/submit-comment", function(request, response) {
  const comment = request.body.comment
  const userId = request.cookies["MbfBlogUser"].id

  const date = new Date().toISOString()
  const content = comment

  const sql = "INSERT INTO posts (id, date, content) VALUES (?, ?, ?)"
  db.run(sql, [userId, date, content], function(err) {
    if(err) {
      console.log("Ошибка при вставке нового поста в БД:", err)
    }
    else {
      console.log("Добавлен новый пост для юзера:", request.cookies["MbfBlogUser"].name)
    }
  })

})


app.use("/account", registerRouter)
app.use("/account", loginRouter)
app.use("/users", profileViewRouter)

app.listen(3000, () => {
    console.log("Server stated | http://localhost:3000")
})