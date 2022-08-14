const io = require("socket.io")(9000, {
    cors: {
        origin: "http://localhost:3000"
    }
})

let users=[];

const removeUser = (sockId) => {
    users = users.filter(user => user.socketId !== sockId);
}

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId);
}

io.on("connection",(socket)=>{
    console.log("user connected");
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
    })

    socket.on("sendMessage",(details)=>{
        let reciever=getUser(details.recieverId);
        if (reciever !== undefined) {
            io.to(reciever.socketId).emit("getMessage", { senderId:details.senderId, text:details.text ,itemId:details.itemId});
        }
    })

    socket.on("disconnect", () => {
        console.log("user is disconnected");
        removeUser(socket.id);
    })

})

