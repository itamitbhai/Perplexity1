import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getMessages, getChats, deleteChat } from "../service/chat.api";
import {addMessages, setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, removeChat} from "../chat.slice";
import { useDispatch } from "react-redux"

export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId }) {
        dispatch(setError(null))
        dispatch(setLoading(true))

        try {
            const data = await sendMessage({ message, chatId })
            const { chat, userMessage, aiMessage } = data

            if (!chatId) {
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title,
                }))
            }

            dispatch(addNewMessage({
                chatId: chat._id,
                id: userMessage._id,
                content: userMessage.content,
                role: userMessage.role,
            }))
            dispatch(addNewMessage({
                chatId: chat._id,
                id: aiMessage._id,
                content: aiMessage.content,
                role: aiMessage.role,
            }))
            dispatch(setCurrentChatId(chat._id))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to send message"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetChats(){
        dispatch(setError(null))
        dispatch(setLoading(true))

        try {
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
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to load chats"))
        } finally {
            dispatch(setLoading(false))
        }
    }


    async function handleOpenChat(chatId, chats) {
        const messages = chats?.[chatId]?.messages ?? [];

        if (messages.length === 0) {
            try {
                const data = await getMessages(chatId);

                const formattedMessages = data.messages.map(msg => ({
                    id: msg._id,
                    content: msg.content,
                    role: msg.role,
                }));

                dispatch(
                    addMessages({
                        chatId,
                        messages: formattedMessages,
                    })
                )
            } catch (error) {
                dispatch(setError(error.response?.data?.message || "Failed to load messages"))
                return
            }
        }

        dispatch(setCurrentChatId(chatId));
    }

    function handleNewChat() {
        dispatch(setCurrentChatId(null));
    }

    async function handleDeleteChat(chatId) {
        try {
            await deleteChat(chatId)
            dispatch(removeChat(chatId))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to delete chat"))
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleNewChat,
        handleDeleteChat,
    }
}