const { Server } = require("socket.io") 

const io = new Server(8000, {
    cors: {
        origin: "*",
    }
})

io.on("connection", socket => {
    console.log("io server started with: ", socket.id)
})
