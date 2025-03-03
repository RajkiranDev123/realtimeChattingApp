import express from "express"
import routes from "./routes/index.js"
const app = express()
app.use(express.json())// It parses the JSON payload and attaches the resulting object to the req.body property.
app.use("/api/v1",routes)
export default app