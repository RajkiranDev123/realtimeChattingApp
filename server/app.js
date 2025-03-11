
import express from "express"
import routes from "./routes/index.js"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())// It parses the JSON payload and attaches the resulting js object to the req.body property.

app.use("/api/v1",routes)

export default app

//express app,routes,middlewares