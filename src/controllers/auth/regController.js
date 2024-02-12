const { dirname } = require("path")
const db = require("../../core/db")
const pathToView = require("../../views/views_path")

exports.register_form = function(request, response) {
    const viewPath = global.date
    response.sendFile(viewPath + "/regPage.html")
}

exports.register_get_form = function(request, response) {
    const username = request.body.username
    const email = request.body.email
    const password = request.body.password

    console.log(`Username: ${username}`)
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)

    db.run(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, password],
        function (err) {
          if (err) {
            console.error(err);
            response.status(500).send("Error registering user");
          } else {
            console.log("User registered successfully");
            const viewPath = global.date
            response.sendFile(viewPath + "/success_register.html")
          }
        }
      )
}