import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie;
    let token = socket.handshake.auth.token;
    
    if (!token && cookies) {
      const match = cookies.match(/token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      console.log("Socket Connection Failed: No token");
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      console.log("Socket Connection Failed: Invalid token");
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id} (${socket.user.role})`);

    // Join room based on role or specific requirements
    if (["ADMIN", "SUPERVISOR", "SUPERADMIN"].includes(socket.user.role)) {
      socket.join("admin-room");
    }

    socket.on("technician:location:update", async (data) => {
      // Security: Only allow TECHNICIAN to update their own location
      if (socket.user.role !== "TECHNICIAN") {
        return;
      }

      const { latitude, longitude, accuracy } = data;
      const userId = Number(socket.user.id);

      try {
       
        const updatedLocation = await prisma.technicianLocation.upsert({
          where: { userId: userId },
          update: {
            latitude,
            longitude,
            accuracy,
            updatedAt: new Date(),
          },
          create: {
            userId: userId,
            latitude,
            longitude,
            accuracy,
          },
          include: {
            user: {
              select: {
                id: true,
                role: true,
                profile: {
                  select: {
                    firstname: true,
                    lastname: true,
                  },
                },
                departmentId: true,
              },
            },
          },
        });

        const broadcastData = {
          userId: Number(updatedLocation.userId),
          name: `${updatedLocation.user.profile?.firstname || ""} ${updatedLocation.user.profile?.lastname || ""}`.trim(),
          latitude: updatedLocation.latitude,
          longitude: updatedLocation.longitude,
          accuracy: updatedLocation.accuracy,
          updatedAt: updatedLocation.updatedAt,
          online: true,
          departmentId: updatedLocation.user.departmentId,
        };

        io.to("admin-room").emit("technician:location:broadcast", broadcastData);

      } catch (error) {
        console.error("Error updating location:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`);
      
      if (socket.user?.role === "TECHNICIAN") {
        const userId = Number(socket.user.id);
        
        // Broadcast immediately
        io.to("admin-room").emit("technician:location:broadcast", {
          userId: userId,
          online: false,
          updatedAt: new Date(),
        });

        // Also update DB to "old" time so refresh shows offline
        // (Set to 11 minutes ago to exceed the 10-minute threshold)
        const offlineTime = new Date(Date.now() - 11 * 60 * 1000);
        prisma.technicianLocation.update({
          where: { userId: userId },
          data: { updatedAt: offlineTime }
        }).catch(err => console.error("Error updating offline status in DB:", err));
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
