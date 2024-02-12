const express = require("express")

const registerController = require("../controllers/regController.js")
const profileViewController = require("../controllers/profileController.js")

const app = express()

const session = require("../core/node_modules/express-session");

app.use(session({
    secret: 'oleg_bebra',
    resave: false,
    saveUninitialized: false
}));

const db = require("./db.js")

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