const { dirname } = require("path")
const db = require("../core/db")
const pathToView = require("../views/views_path")

exports.register_form = function(request, response) {
   
    if(request.cookies['MbfBlogUser']) {
        console.log("Log with cookie")
        request.session.user = request.cookies["MbfBlogUser"]
        console.log("Session set from cookie:", request.session.user)
      }

    if(request.session && request.session.user) {
      console.log("User is logged in");
      response.send("у тя есть куки иди нахуй")
    } else {
      console.log("User is not logged in");
    }

    const viewPath = global.date;
    response.sendFile(viewPath + "/regPage.html");
}

exports.register_get_form = function(request, response) {
  const session = request.session;
  const username = request.body.username;
  const email = request.body.email;
  const password = request.body.password;

  if (!session.user) {
      db.run(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, password],
          function (err) {
              if (err) {
                  console.error(err);
                  response.status(500).send("Error registering user");
              } else {
                  session.user = {
                      username: username,
                      email: email
                  };

                  console.log("User registered successfully");

                  if (session.user) {
                      console.log("Session successfully set for user:", session.user.username);
                      response.cookie("MbfBlogUser", request.session.user)
                  } else {
                      console.log("Error setting session for user");
                  }

                  const viewPath = global.date;
                  response.sendFile(viewPath + "/success_register.html");
              }
          }
      );
  } else {
      console.log("User is already registered with session");
      const viewPath = global.date;
      response.sendFile(viewPath + "/already_registered.html");
  }
};

exports.feed = function(request, response) {
    requireAuth(request, response, function() {
        response.send("bebra")
    })
}