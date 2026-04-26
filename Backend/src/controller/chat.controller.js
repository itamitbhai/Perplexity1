import { response } from "express";
import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js";


export async function sendMessage(req, res) {

    const { message, chat: chatId } = req.body;

    let title = null, chat = null;

    if(!chatId) {
        title = await generateChatTitle(message);
        chat = await chatModel.create({
            user: req.user.id,
            title
        })
    }

    const messages = await messageModel.findOne({ chat: chatId})


    const result = await generateResponse(messages)

    // const title = await generateChatTitle(message);

    // const chat = await chatModel.create({
    //     user: req.user.id,
    //     title
    // })

    const userMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: message,
        role: "user"
    });





    const Aimessage = await messageModel.create({
        chat: chatId || chat._id,
        content: result,
        role:"ai"
    })

    res.status(201).json({
       title,
       chat,
       Aimessage

    });

}