// "use client"

// import { useState, useEffect } from "react"
// import { pusherClient } from "@/lib/pusher"
// import { useSession } from "next-auth/react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"

// interface Message {
//   id: string
//   content: string
//   senderId: string
//   receiverId: string
//   createdAt: Date
// }

// export function Chat({ receiverId }: { receiverId: string }) {
//   const [messages, setMessages] = useState<Message[]>([])
//   const [newMessage, setNewMessage] = useState("")
//   const { data: session } = useSession()

//   useEffect(() => {
//     if (!session?.user?.id) return

//     const channel = pusherClient.subscribe(`private-chat-${session.user.id}-${receiverId}`)

//     channel.bind("message", (message: Message) => {
//       setMessages((prev) => [...prev, message])
//     })

//     return () => {
//       pusherClient.unsubscribe(`private-chat-${session.user.id}-${receiverId}`)
//     }
//   }, [session?.user?.id, receiverId])

//   const sendMessage = async () => {
//     if (!newMessage.trim() || !session?.user?.id) return

//     try {
//       const response = await fetch("/api/messages", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           content: newMessage,
//           receiverId,
//         }),
//       })

//       if (!response.ok) throw new Error("Failed to send message")

//       setNewMessage("")
//     } catch (error) {
//       console.error("Error sending message:", error)
//     }
//   }

//   return (
//     <div className="flex flex-col h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${message.senderId === session?.user?.id ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`max-w-[70%] rounded-lg px-4 py-2 ${
//                 message.senderId === session?.user?.id ? "bg-teal-500 text-white" : "bg-gray-100 dark:bg-gray-700"
//               }`}
//             >
//               {message.content}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="p-4 border-t dark:border-gray-700">
//         <div className="flex space-x-2">
//           <Input
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message..."
//             onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//           />
//           <Button onClick={sendMessage}>Send</Button>
//         </div>
//       </div>
//     </div>
//   )
// }

