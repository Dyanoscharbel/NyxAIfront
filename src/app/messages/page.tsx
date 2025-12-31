"use client"

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/hooks/useI18n'
import { 
  Send, 
  Loader2, 
  User as UserIcon,
  ArrowLeft,
  MessageSquare,
  Shield
} from 'lucide-react'

interface Message {
  id: string
  senderId: string
  receiverId: string
  message: string
  createdAt: string
  read: boolean
}

interface Conversation {
  userId: string
  userName: string
  userImage?: string
  userRole: string
  lastMessage: string
  lastMessageDate: string
  unreadCount: number
}

function MessagesContent() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { user, isLoading: isAuthLoading } = useAuth()
  const { locale } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const userIdFromUrl = searchParams.get('userId')

  useEffect(() => {
    // Wait for auth to load
    if (isAuthLoading) return
    
    if (!user) {
      router.push('/login')
      return
    }

    fetchConversations()
  }, [user, isAuthLoading, router])

  useEffect(() => {
    if (!userIdFromUrl) return
    
    console.log('📨 UserIdFromUrl detected:', userIdFromUrl)
    console.log('📊 Current conversations:', conversations)
    
    // If we have conversations loaded, check if this user exists
    if (conversations.length > 0) {
      const conversation = conversations.find(c => c.userId === userIdFromUrl)
      if (conversation) {
        console.log('✅ Found existing conversation')
        selectConversation(conversation)
      } else {
        console.log('🆕 New conversation, fetching user details')
        fetchUserDetails(userIdFromUrl)
      }
    } else if (!isLoadingConversations) {
      // No conversations yet, this is a new conversation
      console.log('🆕 No existing conversations, fetching user details')
      fetchUserDetails(userIdFromUrl)
    }
  }, [userIdFromUrl, conversations, isLoadingConversations])

  // Poll for new messages every 3 seconds when a conversation is selected
  useEffect(() => {
    if (!selectedUser) return

    const interval = setInterval(() => {
      fetchMessages(selectedUser.userId, true)
    }, 3000)

    return () => clearInterval(interval)
  }, [selectedUser])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversations = async () => {
    try {
      setIsLoadingConversations(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setConversations(data.data)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setIsLoadingConversations(false)
    }
  }

  const fetchUserDetails = async (userId: string) => {
    try {
      console.log('🔍 Fetching user details for:', userId)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      const data = await response.json()
      console.log('👤 User details response:', data)

      if (response.ok) {
        const newConversation: Conversation = {
          userId: data.data.id,
          userName: data.data.fullName,
          userImage: data.data.profileImage,
          userRole: data.data.role,
          lastMessage: '',
          lastMessageDate: new Date().toISOString(),
          unreadCount: 0
        }
        console.log('✅ Setting selected user:', newConversation)
        setSelectedUser(newConversation)
        setMessages([])
      } else {
        console.error('❌ Failed to fetch user details:', data)
      }
    } catch (error) {
      console.error('❌ Error fetching user details:', error)
    }
  }

  const fetchMessages = async (userId: string, silent = false) => {
    try {
      if (!silent) setIsLoadingMessages(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        console.log('📬 Messages loaded:', data.data.length)
        console.log('👤 Current user ID:', user?.id)
        if (data.data.length > 0) {
          console.log('📝 First message senderId:', data.data[0].senderId)
          console.log('🔍 ID comparison:', data.data[0].senderId === user?.id)
          console.log('🔍 ID types:', typeof data.data[0].senderId, typeof user?.id)
        }
        setMessages(data.data)
        // Scroll to bottom only on initial load, not during polling
        if (!silent) {
          setTimeout(() => scrollToBottom(), 100)
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      if (!silent) setIsLoadingMessages(false)
    }
  }

  const selectConversation = (conversation: Conversation) => {
    setSelectedUser(conversation)
    fetchMessages(conversation.userId)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || isSending) return

    try {
      setIsSending(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          receiverId: selectedUser.userId,
          message: newMessage.trim()
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessages([...messages, data.data])
        setNewMessage('')
        fetchConversations() // Refresh conversations list
        setTimeout(() => scrollToBottom(), 100) // Scroll after sending
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
    // Shift+Enter permet le retour à la ligne
  }

  if (!user) return null

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] px-2 md:px-4">
        <div className="flex h-full gap-2 md:gap-4">
          {/* Conversations List */}
          <Card className={`w-full md:w-80 border-sidebar-border bg-sidebar/50 backdrop-blur flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-3 md:p-4 border-b border-sidebar-border">
              <h2 className="text-lg md:text-xl font-bold text-sidebar-foreground">
                {locale === 'en' ? 'Messages' : 'Messages'}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoadingConversations ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-sidebar-foreground/60">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium mb-2">
                    {locale === 'en' ? 'No conversations yet' : 'Aucune conversation'}
                  </p>
                  <p className="text-sm">
                    {user.role === 'student' 
                      ? (locale === 'en' 
                          ? 'Start by finding a researcher to contact' 
                          : 'Commencez par trouver un chercheur à contacter')
                      : (locale === 'en'
                          ? 'Students will be able to contact you once you enable messages in your profile'
                          : 'Les étudiants pourront vous contacter une fois que vous activerez les messages dans votre profil')}
                  </p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.userId}
                    onClick={() => selectConversation(conv)}
                    className={`p-3 md:p-4 border-b border-sidebar-border cursor-pointer hover:bg-sidebar-accent/50 transition-colors ${
                      selectedUser?.userId === conv.userId ? 'bg-sidebar-accent' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 md:h-12 md:w-12">
                        <AvatarImage src={conv.userImage} />
                        <AvatarFallback className="bg-primary/20">
                          <UserIcon className="h-4 w-4 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <p className="font-medium text-sidebar-foreground truncate text-sm md:text-base">
                              {conv.userName}
                            </p>
                            {conv.userRole === 'admin' && (
                              <Badge variant="outline" className="border-amber-500 text-amber-500 text-xs px-1.5 py-0 h-5 gap-1 shrink-0">
                                <Shield className="h-3 w-3" />
                                Admin
                              </Badge>
                            )}
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-sidebar-foreground/60 truncate">
                          {conv.lastMessage || (locale === 'en' ? 'No messages yet' : 'Aucun message')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Messages Area */}
          <Card className={`flex-1 border-sidebar-border bg-sidebar/50 backdrop-blur flex flex-col ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
            {selectedUser ? (
              <>
                {/* Header */}
                <div className="p-3 md:p-4 border-b border-sidebar-border flex items-center space-x-3">
                  {/* Back button - visible only on mobile */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedUser(null)}
                    className="md:hidden"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10 md:h-12 md:w-12">
                    <AvatarImage src={selectedUser.userImage} />
                    <AvatarFallback className="bg-primary/20">
                      <UserIcon className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sidebar-foreground text-sm md:text-base truncate">{selectedUser.userName}</h3>
                      {selectedUser.userRole === 'admin' && (
                        <Badge variant="outline" className="border-amber-500 text-amber-500 text-xs px-1.5 py-0.5 gap-1 shrink-0">
                          <Shield className="h-3 w-3" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-sidebar-foreground/60">
                      {selectedUser.userRole === 'researcher' 
                        ? (locale === 'en' ? 'Researcher' : 'Chercheur')
                        : selectedUser.userRole === 'admin'
                        ? (locale === 'en' ? 'Administrator' : 'Administrateur')
                        : (locale === 'en' ? 'Student' : 'Étudiant')}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2 md:space-y-4">
                  {isLoadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-sidebar-foreground/60 text-sm md:text-base px-4 text-center">
                      {locale === 'en' ? 'No messages yet. Start the conversation!' : 'Aucun message. Commencez la conversation !'}
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isMyMessage = msg.senderId === user?.id
                      // Log pour le premier message uniquement
                      if (index === 0) {
                        console.log('🎨 Rendering messages - First message:', {
                          senderId: msg.senderId,
                          userId: user?.id,
                          isMyMessage,
                          senderIdType: typeof msg.senderId,
                          userIdType: typeof user?.id
                        })
                      }
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] md:max-w-[70%] min-w-[100px] px-3 py-2 shadow-sm ${
                              isMyMessage
                                ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                                : 'bg-sidebar-accent text-sidebar-foreground rounded-2xl rounded-tl-sm'
                            }`}
                            style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                          >
                            <p className="text-xs md:text-sm whitespace-pre-wrap">
                              {msg.message}
                            </p>
                            <p className={`text-xs mt-1 ${isMyMessage ? 'text-right opacity-70' : 'text-left opacity-60'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString(locale === 'en' ? 'en-US' : 'fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-2 md:p-4 border-t border-sidebar-border">
                  <div className="flex items-end space-x-1 md:space-x-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={locale === 'en' ? 'Type your message...' : 'Écrivez votre message...'}
                      disabled={isSending}
                      className="flex-1 bg-sidebar border-sidebar-border resize-none min-h-[50px] md:min-h-[60px] max-h-[150px] md:max-h-[200px] text-sm"
                      rows={2}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSending}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 h-[50px] md:h-[60px] px-3 md:px-4"
                    >
                      {isSending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-sidebar-foreground/60">
                <div className="text-center">
                  <p className="text-lg mb-2">
                    {locale === 'en' ? 'Select a conversation to start messaging' : 'Sélectionnez une conversation pour commencer'}
                  </p>
                  {user.role === 'student' && (
                    <Button
                      onClick={() => router.push('/researchers')}
                      variant="outline"
                      className="mt-4"
                    >
                      {locale === 'en' ? 'Find Researchers' : 'Trouver des chercheurs'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    }>
      <MessagesContent />
    </Suspense>
  )
}
