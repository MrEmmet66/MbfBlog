const express = require("express")

const registerController = require("../controllers/auth/regController.js")
const loginController = require("../controllers/auth/LoginController.js")

const app = express()

const db = require("../utils/db.js")
const cookieParser = require("cookie-parser")

db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT UNIQUE, password TEXT)"
    )
})

app.use(cookieParser('ilovemorgenstern'))

app.set("view engine", "hbs")
app.use(express.urlencoded({extended: false}))

const registerRouter = express.Router()
const loginRouter = express.Router()

registerRouter.use("/create_account", registerController.register_form)
registerRouter.use("/successfully_register", registerController.register_get_form)
loginRouter.get('/login', loginController.loginForm)
loginRouter.post('/login', loginController.loginPost)
loginRouter.get('/logout', loginController.logout)

app.use("/account", registerRouter)
app.use("/account", loginRouter)

app.listen(3000, () => {
    console.log("Server stated | http://localhost:3000")
})