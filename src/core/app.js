const express = require("express")

const registerController = require("../controllers/regController.js")
const profileViewController = require("../controllers/profileController.js")
const loginController = require("../controllers/auth/LoginController.js")

const cookieParser = require("cookie-parser")

const app = express()

const session = require("../core/node_modules/express-session");

const db = require("./db.js");

app.use(cookieParser("ilovemorgenshtern"))

db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT UNIQUE, password TEXT)"
    )
})



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

app.use("/account", registerRouter)
app.use("/account", loginRouter)
app.use("/users", profileViewRouter)


app.listen(3000, () => {
    console.log("Server stated | http://localhost:3000")
})