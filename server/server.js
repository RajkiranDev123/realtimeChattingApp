
// server.js
import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import db from "./config/dbConfig.js"
import app from "./app.js"

const PORT = process.env.PORT_NUMBER || 3001

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
})

//server.js : dotenv,db,port,app listen