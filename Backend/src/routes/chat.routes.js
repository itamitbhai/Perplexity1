import {Router} from 'express';
import {sendMessage, getChats, getMessages, deleteChat} from "../controller/chat.controller.js"
import { authUser } from '../middleware/auth.middleware.js';

const chatRouter = Router();


chatRouter.post("/message",authUser, sendMessage)
chatRouter.get("/", authUser, getChats)


export default chatRouter;

