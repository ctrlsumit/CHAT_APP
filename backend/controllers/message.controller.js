import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    let { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!message) {
      return res.status(400).json({ error: "Message content is required" });
    }

    receiverId = receiverId.trim(); // Trim any whitespace or newline characters

    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    
    conversation.messages.push(newMessage._id);
    await Promise.all(conversation.save(), newMessage.save());

    res.status(201).json({ newMessage });
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const {id:userToChatId} = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if(!conversation)return res.status(200).json([]);
    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessage controller:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};