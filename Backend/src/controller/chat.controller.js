import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {

    const { message, chat: chatId } = req.body;

    let chat = null;

    if (chatId) {
        chat = await chatModel.findOne({ _id: chatId, user: req.user.id })

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found"
            })
        }
    } else {
        let title;
        try {
            title = await generateChatTitle(message);
        } catch (error) {
            console.error("generateChatTitle failed, falling back to default title:", error.message);
        }
        chat = await chatModel.create({
            user: req.user.id,
            ...(title && { title })
        })
    }

    const userMessage = await messageModel.create({
        chat: chat._id,
        content: message,
        role: "user"
    })

    const messages = await messageModel.find({ chat: chat._id })

    let result;
    try {
        result = await generateResponse(messages);
    } catch (error) {
        console.error("generateResponse failed:", error.message);
        return res.status(502).json({
            message: "The AI service is temporarily unavailable. Please try again in a moment.",
            chat,
            userMessage
        })
    }

    const aiMessage = await messageModel.create({
        chat: chat._id,
        content: result,
        role: "ai"
    })

    res.status(201).json({
        chat,
        userMessage,
        aiMessage
    })

}

export async function getChats(req, res) {
    const user = req.user

    const chats = await chatModel.find({ user: user.id })

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    })
}

export async function getMessages(req, res) {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    const messages = await messageModel.find({
        chat: chatId
    })

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages
    })
}

export async function deleteChat(req, res) {

    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    res.status(200).json({
        message: "Chat deleted successfully"
    })
}