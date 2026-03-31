import { Server } from "socket.io";
import { prisma } from "./prisma.js";
import jwt from "jsonwebtoken";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    // try to get from header cookie
    const cookieStr = socket.request.headers.cookie;
    let token = null;
    if (cookieStr) {
      const tokenMatch = cookieStr.match(/token=([^;]+)/);
      if (tokenMatch) token = tokenMatch[1];
    }
    
    // fallback to handshake payload if exist
    if (!token) token = socket.handshake.auth?.token;
    
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  const userSockets = new Map();

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id, "UserId:", socket.user?.id);
    const userId = Number(socket.user.id);
    
    // Store user socket
    userSockets.set(userId, socket.id);
    socket.join(`user_${userId}`);
    io.emit("user_status", { userId, status: "online" });

    socket.on("join_room", (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on("send_message", async (data, callback) => {
      // data: { receiverId, conversationId, content }
      try {
        const { receiverId, conversationId, content, room, clientTempId } = data;
        
        // Backward compatibility for original text rooms
        if (room && !receiverId) {
          io.to(room).emit("receive_message", data);
          return;
        }

        let targetConversationId = conversationId;
        const targetReceiverId = Number(receiverId);
        
        // If no conversationId yet, check or create
        if (!targetConversationId && targetReceiverId) {
          let conversation = await prisma.conversation.findFirst({
            where: {
              AND: [
                { participants: { some: { userId: userId } } },
                { participants: { some: { userId: targetReceiverId } } },
              ],
            },
          });

          if (!conversation) {
            conversation = await prisma.conversation.create({
              data: {
                participants: {
                  create: [
                    { userId: userId },
                    { userId: targetReceiverId },
                  ]
                }
              }
            });
          }
          targetConversationId = conversation.id;
        }

        const message = await prisma.message.create({
          data: {
            content,
            senderId: userId,
            conversationId: targetConversationId,
          },
        });

        const latestMessage = await prisma.message.findUnique({
          where: { id: message.id },
          include: {
            sender: { select: { id: true, email: true, profile: true } }
          }
        });

        // Attach clientTempId for the sender to de-duplicate
        const messageWithTempId = { ...latestMessage, clientTempId, receiverId: targetReceiverId };

        // Update target participant's unread count
        if (targetReceiverId) {
          const participant = await prisma.participant.findFirst({
            where: { userId: targetReceiverId, conversationId: targetConversationId }
          });
          if (participant) {
            await prisma.participant.update({
              where: { id: participant.id },
              data: { unreadCount: { increment: 1 } },
            });
          }
          io.to(`user_${targetReceiverId}`).emit("receive_message", messageWithTempId);
          io.to(`user_${userId}`).emit("receive_message", messageWithTempId); // Echo back to sender
        }

        if (typeof callback === "function") callback({ status: "sent", message: messageWithTempId });

      } catch (err) {
        console.error("Socket error on send_message:", err);
        if (typeof callback === "function") callback({ status: "error", message: err.message });
      }
    });

    socket.on("mark_as_read", async ({ conversationId }) => {
      try {
        const convId = Number(conversationId);
        if (!convId) return;

        // 1. Mark all messages from other user as read
        await prisma.message.updateMany({
          where: {
            conversationId: convId,
            senderId: { not: userId },
            isRead: false,
          },
          data: { isRead: true },
        });

        // 2. Update participant unread count and lastReadAt
        const participant = await prisma.participant.findFirst({
          where: { userId: userId, conversationId: convId }
        });
        if (participant) {
          await prisma.participant.update({
            where: { id: participant.id },
            data: { unreadCount: 0, lastReadAt: new Date() }
          });
        }

        // 3. Find other participant to notify them
        const otherParticipant = await prisma.participant.findFirst({
          where: { conversationId: convId, userId: { not: userId } }
        });

        if (otherParticipant) {
          // Emit to both users to update UI across all active sessions
          const roomReader = `user_${userId}`;
          const roomSender = `user_${otherParticipant.userId}`;

          const payload = {
            conversationId: convId,
            readerId: userId
          };

          io.to(roomReader).to(roomSender).emit("messages_read", payload);
          console.log(`[Socket] messages_read emitted to rooms: ${roomReader}, ${roomSender}`);
        }
      } catch (err) {
        console.error("mark_as_read error", err);
      }
    });

    socket.on("typing", ({ receiverId, conversationId, isTyping }) => {
      io.to(`user_${receiverId}`).emit("typing_status", { senderId: userId, conversationId, isTyping });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      const userId = Number(socket.user?.id);
      if (userId) {
        userSockets.delete(userId);
        io.emit("user_status", { userId, status: "offline" });
      }
    });
  });

  return io;
};

export default setupSocket;
