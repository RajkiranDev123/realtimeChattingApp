import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import mongoose from "mongoose";

// console.log("check DB_CONN ==>", process.env.DB_CONN)
mongoose.connect(process.env.DB_CONN)

//connection state
const db = mongoose.connection

//on is event listener
db.on("connected", () => {
    console.log("DB Connected!")
})

db.on("err", () => {
    console.log("DB not Connected!")
})

export default db