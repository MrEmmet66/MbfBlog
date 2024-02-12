const express = require("express")

const registerController = require("../controllers/regController.js")
const profileViewController = require("../controllers/profileController.js")

const cookieParser = require("cookie-parser")

const app = express()

const session = require("../core/node_modules/express-session");

app.use(session({
    secret: 'oleg_bebra',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // set secure to true if using HTTPS
  }));

const db = require("./db.js");

app.use(cookieParser("ilovemorgenshtern"))

db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT)"
    )
})

app.set("view engine", "hbs")
app.use(express.urlencoded({extended: false}))

const registerRouter = express.Router()
const profileViewRouter = express.Router()

registerRouter.use("/create_account", registerController.register_form)
registerRouter.use("/successfully_register", registerController.register_get_form)

profileViewRouter.use("/:username", profileViewController.check_profile)

app.use("/account", registerRouter)
app.use("/users", profileViewRouter)

app.listen(3000, () => {
    console.log("Server stated | http://localhost:3000")
})