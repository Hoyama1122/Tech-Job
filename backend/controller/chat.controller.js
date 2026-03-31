import { prisma } from "../lib/prisma.js";

// ดึงรายการ Conversation ทั้งหมดของ User ที่กำลัง Login
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { userId: userId } },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { 
                id: true, 
                email: true, 
                profile: { select: { firstname: true, lastname: true, avatar: true } } 
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Transform ข้อมูลให้ใช้ง่ายสำหรับ Frontend
    const formatted = conversations.map((conv) => {
      const otherParticipant = conv.participants.find((p) => p.userId !== userId);
      const myParticipant = conv.participants.find((p) => p.userId === userId);
      const lastMsg = conv.messages[0] || null;

      return {
        id: conv.id,
        otherUser: {
          id: otherParticipant?.user.id,
          name: otherParticipant?.user.profile 
            ? `${otherParticipant.user.profile.firstname} ${otherParticipant.user.profile.lastname}`
            : otherParticipant?.user.email,
          avatar: otherParticipant?.user.profile?.avatar,
        },
        lastMessage: lastMsg,
        unreadCount: myParticipant?.unreadCount || 0,
        // เพิ่มสถานะเพื่อให้ Frontend เช็คสีไอคอนง่ายๆ
        lastMessageStatus: lastMsg 
          ? (lastMsg.senderId === userId ? (lastMsg.isRead ? 'read' : 'sent') : 'received')
          : null
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ดึงข้อความใน Conversation หรือ สร้างถ้ายังไม่มี
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.params;

    if (!receiverId) return res.status(400).json({ message: "receiverId is required" });

    // หาแชทที่มีทั้งเราและเขา
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: userId } } },
          { participants: { some: { userId: Number(receiverId) } } },
        ],
      },
    });

    if (!conversation) {
      // ถ้ายังไม่เคยคุยกัน ให้สร้าง Conversation ใหม่
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [{ userId: userId }, { userId: Number(receiverId) }],
          },
        },
      });
      return res.json([]); // ยังไม่มีข้อความ
    }

    // มีแล้ว ดึงข้อความมา
    const messages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ดึงรายชื่อผู้ใช้ที่สามารถแชทได้ (ทุกคนยกเว้นตัวเอง)
export const getContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await prisma.user.findMany({
      where: {
        id: { not: userId },
      },
      select: {
        id: true,
        email: true,
        role: true,
        profile: true,
      },
      orderBy: {
        role: "asc", // เรียงตามตำแหน่ง
      }
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};
