import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getMessages, getChats, deleteChat } from "../service/chat.api";
import {addMessages, setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage} from "../chat.slice";
import { useDispatch } from "react-redux"

export const useChat = () => {

    const dispatch = useDispatch()

        async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true))
        const data = await sendMessage({ message, chatId })
        const { chat, aiMessage } = data
        if (!chatId)
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title,
            }))
        dispatch(addNewMessage({
            chatId: chatId || chat._id,
            content: message,
            role: "user",
        }))
        dispatch(addNewMessage({
            chatId: chatId || chat._id,
            content: aiMessage.content,
            role: aiMessage.role,
        }))
        dispatch(setCurrentChatId(chat._id))
    }

    async function handleGetChats(){
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[ chat._id ] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
        
    }

  
    async function handleOpenChat(chatId, chats) {
        const messages = chats?.[chatId]?.messages ?? [];

       console.log("chatId:", chatId);
       console.log("messages:", messages);
     
       if (messages.length === 0) {
         const data = await getMessages(chatId);
     
         const formattedMessages = data.messages.map(msg => ({
           content: msg.content,
           role: msg.role,
         }));
     
         dispatch(
           addMessages({
             chatId,
        messages: formattedMessages,
      })
     )}

     dispatch(setCurrentChatId(chatId));
}

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }
}