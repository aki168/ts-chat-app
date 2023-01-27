import devServer from "@/server/dev";
import prodServer from "@/server/prod";
import express from "express";
import { Server } from 'socket.io'
import http from 'http'
import UserService from "@/service/userService";
import moment from "moment"

import { titleFormatter } from "@/utils";

const port = 3000;
const app = express();
const userService = new UserService()

const server = http.createServer(app) // http包建立server
const io = new Server(server) // 放入一個http的server,在最後面做一個Listen 

// 2. 去監測連接
// 3. 發訊息到頻道


io.on('connection', (socket) => {

  socket.emit('userId', socket.id)

  socket.on('enter', ({ userName, room }: { userName: string, room: string }) => {
    const userData = userService.userInfoHandler(
      socket.id,
      userName,
      room
    )
    userService.addUser(userData)
    socket.join(userData.chatRoom) // unique key 區別加入哪個聊天室 [重要]
    socket.broadcast.to(userData.chatRoom).emit('enter', `${userName} 加入了 ${titleFormatter(room)} 聊天室`)
  })

  socket.on('chat', (msg) => {
    const userData = userService.getUser(socket.id)
    const time = moment.utc()
    if (userData) {
      socket.join(userData.chatRoom) // unique key 區別加入哪個聊天室 [重要]
      io.to(userData.chatRoom).emit('chat', userData, msg, time)
      // 可以寫一個API存下資料
    }
  })

  socket.on('disconnect', () => {
    const userData = userService.getUser(socket.id)
    const userName = userData?.name
    if (userName) {
      socket.join(userData.chatRoom)
      socket.broadcast.to(userData.chatRoom).emit('leave', `${userData?.name} 離開聊天室`)
    }
    userService.removeUser(socket.id)
  })
})

// 執行npm run dev本地開發 or 執行npm run start部署後啟動線上伺服器
if (process.env.NODE_ENV === "development") {
  devServer(app);
} else {
  prodServer(app);
}

server.listen(port, () => {
  console.log(`The application is running on port ${port}.`);
});
