"use client"
import React, { useEffect, useRef, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { sendMessageToBot, getChatHistory } from "@/actions/chat"

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { text: 'Hi! How can I help you?', from: 'bot' },
  ])
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input
    setMessages((prev) => [...prev, { text: userMessage, from: "user" }])
    setInput("")

    const response = await sendMessageToBot(userMessage)

    setMessages((prev) => [...prev, { text: response, from: "bot" }])
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end w-full px-2 sm:px-4">
      {/* Chat Box */}
      {isOpen && (
        <div className="mb-2 w-full max-w-md sm:max-w-lg h-[30rem] bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
          <div className="p-3 border-b font-semibold bg-gray-100 rounded-t-lg text-gray-700">Chat Bot</div>
          <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-700 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`whitespace-pre-wrap ${msg.from === 'user' ? 'text-right text-blue-600' : 'text-left'}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-grow px-3 py-2 text-sm border-none outline-none"
              placeholder="Type a message..."
            />
            <button onClick={handleSend} className="px-4 bg-blue-600 text-white">Send</button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  )
}

export default ChatWidget
