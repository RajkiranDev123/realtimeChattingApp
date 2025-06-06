import express from "express"
import routes from "./routes/index.js"
import cors from "cors"
import { createServer } from "http"
import { Server } from "socket.io";

const app = express()

app.use(cors())
app.use(express.json({ limit: "50mb" }))// It parses the JSON payload and attaches the resulting js object to the req.body property.
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONT_END_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.use("/api/v1", routes)


const onlineUser = []

//io : event emmiter , connection : event name , event handler : socket , on : event listener
io.on("connection", socket => {
    // console.log("socket id ==>", socket.id)
    socket.on("join-room", userId => {
        socket.join(userId)
    })

    socket.on("send-message", message => {
        console.log(message)
        io.to(message.members[0]).to(message.members[1])
            .emit("receive-message", message)

               io.to(message.members[0]).to(message.members[1])
            .emit("set-message-count", message)
    })

    socket.on("clear-unread-messages", data => {
        io.to(data.members[0]).to(data.members[1])
            .emit("message-count-cleared", data)
    })
    //user typing
    socket.on("user-typing", data => {
        io.to(data.members[0]).to(data.members[1])
            .emit("started-typing", data)
    })

    //online users
    socket.on("user-login", userId => {
        if (!onlineUser.includes(userId)) {
            onlineUser.push(userId)
        }
        socket.emit("online-users", onlineUser)
    })

    //offline users
    socket.on("user-offline", userId => {
        onlineUser.splice(onlineUser.indexOf(userId), 1)
        io.emit("online-users-updated", onlineUser)
    })

}
)// io.on ends
export default server

//express app,routes,middlewares