const db = require("../core/db")
const pathToView = require("../views/views_path")

exports.check_profile = function(request, response) {
    const userName = request.params.username;
    console.log("Check profile:", userName)

    db.get("SELECT username, email FROM users WHERE username = ? LIMIT 1", [userName], (err, row) => {
        if(err) {
            console.log(err)
        }
        else if(row) {
            const { username, email } = row
            const viewPath = global.date

            db.all("SELECT name, date, content FROM posts WHERE name = ?", [username], (err, postsRows) => {
                if(err) {
                    console.log(err)
                }
                else {
                    const viewPath = global.date
                    
                    response.render(viewPath + "/profile.hbs", {
                        username: username,
                        avatar: 'https://pm1.aminoapps.com/7920/968a9a83cc9d01cdeaddea5df538ae639b9f9344r1-554-554v2_uhq.jpg',
                        posts: postsRows,
                        followers: 0 // Placeholder for number of followers
                    })
                }
            })
        }
    })
}