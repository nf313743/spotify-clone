import { Server } from "socket.io"
import { Message } from "../models/message.model";

/**
 * 
  Practical rule: if the action concerns “this client,” use socket; if it concerns “everyone/rooms/another socket id,” use io (optionally io.to(id) for one specific recipient).
 */
export const intializeSocket = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: 'http//localhost:3000',
            credentials: true
        }
    })



    const userSockets = new Map<string, string>();
    const userActivities = new Map<string, string>()

    io.on('connection', socket => {

        socket.on('user_connected', userId => {
            userSockets.set(userId, socket.id)
            userActivities.set(userId, 'idle')

            // Broadcast to all connected sockets that this user just logged in
            io.emit('user_connected', userId)

            socket.emit('user_online', Array.from(userSockets.keys()))
            io.emit('activities', Array.from(userActivities.entries()))
        })

        socket.on('update_activity', ({ userId, activity }) => {
            console.log('activity updated', userId, activity)
            userActivities.set(userId, activity)
            io.emit('activity_updated', { userId, activity })
        })

        socket.on('send_message', async (data) => {
            try {
                const { senderId, receiverId, content } = data

                const message = await Message.create({
                    sender: senderId,
                    receiverId,
                    content
                })

                const receiverSocketId = userSockets.get(receiverId)

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('receive_message', message)
                }
            }
            catch (error: any) {
                console.error('Message error:', error)
                socket.emit('message_error', error.message)
            }
        })


        socket.on('disconnect', () => {
            for (const [userId, socketId] of Array.from(userSockets.entries()).filter(([_, socketId]) => socketId === socket.id)) {
                userSockets.delete(userId)
                userActivities.delete(userId)
                io.emit('user_disconnected', userId)
            }

        })

    })


}
