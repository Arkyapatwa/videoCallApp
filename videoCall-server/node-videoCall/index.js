const { Server } = require("socket.io") 

const io = new Server(8000, {
    cors: {
        origin: "*",
    }
})

const socketidToEmailIdmap = new Map()
const EmailIdToSocketIdMap = new Map()

io.on("connection", socket => {
    console.log("io server started with: ", socket.id)
    socket.on("join", (data) => {
        const { email, roomId } = data
        socketidToEmailIdmap.set(socket.id, email)
        EmailIdToSocketIdMap.set(email, socket.id)
        io.to(socket.id).emit("join", data)
    })
})
