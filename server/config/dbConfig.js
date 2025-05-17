import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import mongoose from "mongoose";

// console.log("check DB_CONN ==>", process.env.DB_CONN)
mongoose.connect(process.env.DB_CONN)

//connection state
const db = mongoose.connection

//on is event listener,db is event emitter, connected is event

db.on("connected", () => {
    console.log("DB Connected!")
})

db.on("err", () => {
    console.log("DB failed to Connect!")
})

export default db