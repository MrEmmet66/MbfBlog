const express = require("express")

const app = express()

app.get("/", function(request, response) {
    response.send("беброчка")
})

app.listen(3000, () => {
    console.log("Server stated | http://localhost:3000")
})