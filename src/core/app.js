const express = require("express")

const registerController = require("../controllers/auth/regController.js")

const app = express()

const db = require("../utils/db.js")

db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT UNIQUE, password TEXT)"
    )
})

app.set("view engine", "hbs")
app.use(express.urlencoded({extended: false}))

const registerRouter = express.Router()

registerRouter.use("/create_account", registerController.register_form)
registerRouter.use("/successfully_register", registerController.register_get_form)

app.use("/account", registerRouter)

app.listen(3000, () => {
    console.log("Server stated | http://localhost:3000")
})