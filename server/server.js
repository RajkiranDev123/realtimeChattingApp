
// server.js : entry point

import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import db from "./config/dbConfig.js"
import server from "./app.js"

const PORT = process.env.PORT_NUMBER || 3002

server.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
})

//server.js : dotenv,db,port,listen