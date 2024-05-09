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
        io.to(roomId).emit("user:joined", {email, id: socket.id})
        socket.join(roomId)
        io.to(socket.id).emit("join", data)
    })

    socket.on("user:call", ({to, offer}) => {
        io.to(to).emit("incomming:call", {from: socket.id, offer})
    });

    socket.on("call:accepted", ({to, answer}) => {
        io.to(to).emit("call:accepted", {from: socket.id, answer})
    })
})
