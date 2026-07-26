import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hook/useChat'
import { useAuth } from '../../auth/hook/useAuth'
import remarkGfm from 'remark-gfm'
import Logo from '../../../components/Logo'

const SUGGESTIONS = [
  'Explain quantum computing simply',
  "What's new in web development?",
  'Give me a healthy dinner recipe',
  'Summarize the latest AI news',
]

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M4.5 6.75h15M9.75 6.75V4.5A1.5 1.5 0 0111.25 3h1.5a1.5 1.5 0 011.5 1.5v2.25M18 6.75l-.68 12.23A2.25 2.25 0 0115.08 21H8.92a2.25 2.25 0 01-2.24-2.02L6 6.75" />
  </svg>
)

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
)

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m9 0l-3-3m3 3l-3 3" />
  </svg>
)

const TypingBubble = () => (
  <div className="mr-auto flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-none bg-white/6 px-4 py-3.5">
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.3s]" />
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.15s]" />
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60" />
  </div>
)

const Dashboard = () => {
  const chat = useChat()
  const { handleLogout } = useAuth()

  const [chatInput, setChatInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const error = useSelector((state) => state.chat.error)
  const user = useSelector((state) => state.auth.user)

  const messagesEndRef = useRef(null)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const currentChat = chats[currentChatId]
  const messages = currentChat?.messages ?? []

  const sortedChats = useMemo(
    () => Object.values(chats).sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)),
    [chats]
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, isSending, currentChatId])

  const handleSubmitMessage = async (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage || isSending) {
      return
    }

    setChatInput('')
    setIsSending(true)
    try {
      await chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    } finally {
      setIsSending(false)
    }
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
    setSidebarOpen(false)
  }

  const startNewChat = () => {
    chat.handleNewChat()
    setSidebarOpen(false)
  }

  const removeChat = (event, chatId) => {
    event.stopPropagation()
    if (window.confirm('Delete this chat? This cannot be undone.')) {
      chat.handleDeleteChat(chatId)
    }
  }

  return (
    <main className="h-dvh w-full overflow-hidden bg-[#07090f] text-white">
      <div className="mx-auto flex h-full w-full max-w-400 md:gap-4 md:p-4">
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 transform flex-col bg-[#0a0d16] p-4 transition-transform duration-200 ease-out md:static md:z-auto md:w-72 md:translate-x-0 md:rounded-3xl md:border md:border-white/10 md:transition-none ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Logo size={30} />
              <h1 className="text-xl font-semibold tracking-tight">DeepOcean</h1>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
            >
              <CloseIcon />
            </button>
          </div>

          <button
            type="button"
            onClick={startNewChat}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#31b8c6]/50 bg-[#31b8c6]/10 px-3 py-2.5 text-sm font-semibold text-[#5fd3df] transition hover:bg-[#31b8c6]/20"
          >
            <PlusIcon />
            New chat
          </button>

          <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
            {sortedChats.length === 0 && (
              <p className="px-2 py-4 text-center text-sm text-white/40">No conversations yet</p>
            )}
            {sortedChats.map((c) => (
              <button
                onClick={() => openChat(c.id)}
                key={c.id}
                type="button"
                className={`group flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
                  c.id === currentChatId
                    ? 'border-[#31b8c6]/60 bg-[#31b8c6]/10 text-white'
                    : 'border-transparent text-white/75 hover:border-white/20 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="truncate">{c.title}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => removeChat(event, c.id)}
                  aria-label="Delete chat"
                  className="shrink-0 rounded-md p-1 text-white/40 opacity-0 transition hover:bg-white/10 hover:text-red-400 group-hover:opacity-100 focus:opacity-100"
                >
                  <TrashIcon />
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#31b8c6]/20 text-sm font-semibold text-[#5fd3df]">
              {user?.username?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.username}</p>
              <p className="truncate text-xs text-white/40">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              className="shrink-0 rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              <LogoutIcon />
            </button>
          </div>
        </aside>

        <section className="flex h-full min-w-0 flex-1 flex-col md:rounded-3xl">
          <header className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-[#07090f] px-4 py-3 md:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/10"
            >
              <MenuIcon />
            </button>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Logo size={22} />
              <span className="truncate text-sm font-semibold text-white/90">
                {currentChat?.title ?? 'DeepOcean'}
              </span>
            </div>
          </header>

          {error && (
            <div className="mx-3 mt-3 shrink-0 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-300 md:mx-0">
              {error}
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-2">
            {!currentChatId ? (
              <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                <Logo size={56} />
                <h2 className="mt-4 text-2xl font-semibold tracking-tight">Dive into DeepOcean</h2>
                <p className="mt-2 max-w-sm text-sm text-white/50">
                  Ask anything — DeepOcean can search the web for up-to-date answers.
                </p>
                <div className="mt-6 grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setChatInput(suggestion)}
                      className="rounded-xl border border-white/10 bg-white/3 px-3.5 py-2.5 text-left text-sm text-white/70 transition hover:border-[#31b8c6]/50 hover:text-white"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-auto flex max-w-3xl flex-col gap-3">
                {messages.map((message, index) => (
                  <div
                    key={message.id ?? index}
                    className={`w-fit max-w-[85%] rounded-2xl px-4 py-3 text-sm md:max-w-[75%] md:text-base ${
                      message.role === 'user'
                        ? 'ml-auto rounded-br-none bg-[#31b8c6]/15 text-white'
                        : 'mr-auto rounded-bl-none bg-white/6 text-white/90'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="mb-2 list-disc pl-5">{children}</ul>,
                          ol: ({ children }) => <ol className="mb-2 list-decimal pl-5">{children}</ol>,
                          code: ({ children }) => <code className="rounded bg-white/10 px-1 py-0.5 wrap-break-word">{children}</code>,
                          pre: ({ children }) => <pre className="mb-2 overflow-x-auto rounded-xl bg-black/30 p-3">{children}</pre>,
                        }}
                        remarkPlugins={[remarkGfm]}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                ))}
                {isSending && <TypingBubble />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <footer className="shrink-0 border-t border-white/10 bg-[#07090f] p-3 md:mx-2 md:mb-2 md:rounded-3xl md:border md:border-white/15 md:bg-[#080b12] md:p-4">
            <form onSubmit={handleSubmitMessage} className="mx-auto flex max-w-3xl items-center gap-2 md:gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Message DeepOcean..."
                autoComplete="off"
                className="w-full min-w-0 rounded-2xl border border-white/15 bg-white/4 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/40 focus:border-[#31b8c6]/70 focus:bg-white/6"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isSending}
                aria-label="Send message"
                className="flex shrink-0 items-center justify-center rounded-full bg-[#31b8c6] p-3 text-[#06222a] transition hover:bg-[#45c7d4] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
              >
                <SendIcon />
              </button>
            </form>
          </footer>
        </section>
      </div>
    </main>
  )
}

export default Dashboard
