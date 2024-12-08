'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, ChevronLeft, DollarSign, LineChart, LogOut, MessageSquare, PieChart, Plus, Send, Settings, TrendingUp, Users, Database, Box, Briefcase, Zap, Mail, FileSpreadsheet, CheckCircle2, Circle, ArrowRight } from 'lucide-react'

type Agent = {
  id: string
  name: string
  avatar: string
  specialty: string
}

type Message = {
  id: string
  content: string
  sender: 'user' | 'agent'
  agentId?: string
  type?: 'text' | 'excel' | 'table' | 'email'
  data?: any
}

type Chat = {
  id: string
  title: string
  messages: Message[]
}

type ProgressStep = {
  step: number
  description: string
  status: 'completed' | 'in-progress' | 'pending'
}

const agents: Agent[] = [
  { 
    id: 'querier', 
    name: 'Database Querier', 
    avatar: '/placeholder.svg?height=40&width=40', 
    specialty: 'Data Retrieval'
  },
  { 
    id: 'mailer', 
    name: 'Email Composer', 
    avatar: '/placeholder.svg?height=40&width=40', 
    specialty: 'Email Communication'
  },
  { 
    id: 'month-end-close', 
    name: 'Month End Close Agent', 
    avatar: '/placeholder.svg?height=40&width=40', 
    specialty: 'Financial Closing'
  },
]

export default function FinAIDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0])
  const [chats, setChats] = useState<{ [key: string]: Chat }>({
    'month-end-close': { id: '1', title: 'Month End Close', messages: [] },
    'querier': { id: '2', title: 'Database Queries', messages: [] },
    'mailer': { id: '3', title: 'Email Composition', messages: [] },
  })
  const [currentChat, setCurrentChat] = useState<Chat>(chats['month-end-close'])
  const [input, setInput] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('chat')
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    { step: 1, description: "Reconciliation", status: "completed" },
    { step: 2, description: "Email Drafting", status: "in-progress" },
    { step: 3, description: "User Consent", status: "pending" },
    { step: 4, description: "Email Responses", status: "pending" },
    { step: 5, description: "Journal Entries", status: "pending" },
    { step: 6, description: "Excel Review", status: "pending" },
  ])
  const [emailsSent, setEmailsSent] = useState(0)
  const [emailResponses, setEmailResponses] = useState(0)
  const [chatHistory, setChatHistory] = useState<Chat[]>([])
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    setCurrentChat(chats[selectedAgent.id])
    setActiveTab('chat')
  }, [selectedAgent])

  const handleSendMessage = () => {
    if (input.trim()) {
      const newUserMessage: Message = {
        id: Date.now().toString(),
        content: input,
        sender: 'user',
        type: 'text'
      }
      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, newUserMessage]
      }
      setCurrentChat(updatedChat)
      setChats({...chats, [selectedAgent.id]: updatedChat})
      setInput('')

      // Simulate data fetching
      setIsFetching(true)

      // Simulate agent response
      setTimeout(() => {
        let newAgentMessage: Message
        if (selectedAgent.id === 'month-end-close') {
          newAgentMessage = {
            id: (Date.now() + 1).toString(),
            content: "Here's the current progress of the month-end close process:",
            sender: 'agent',
            agentId: selectedAgent.id,
            type: 'text'
          }
        } else if (selectedAgent.id === 'querier') {
          newAgentMessage = {
            id: (Date.now() + 1).toString(),
            content: "Here's the result of your database query:",
            sender: 'agent',
            agentId: selectedAgent.id,
            type: 'table',
            data: [
              { id: 1, poNumber: 'PO001', amount: 10000, owner: 'john@example.com' },
              { id: 2, poNumber: 'PO002', amount: 15000, owner: 'jane@example.com' },
              { id: 3, poNumber: 'PO003', amount: 20000, owner: 'bob@example.com' },
            ]
          }
        } else if (selectedAgent.id === 'mailer') {
          newAgentMessage = {
            id: (Date.now() + 1).toString(),
            content: "I've drafted the following email for your review:",
            sender: 'agent',
            agentId: selectedAgent.id,
            type: 'email',
            data: {
              to: 'john@example.com',
              subject: 'Urgent: Purchase Order Confirmation Required',
              body: 'Dear John,\n\nWe need your confirmation for PO001 amounting to $10,000. Please review and respond as soon as possible.\n\nBest regards,\nFinAI Team'
            }
          }
        }
        const chatWithAgentResponse = {
          ...updatedChat,
          messages: [...updatedChat.messages, newAgentMessage]
        }
        setCurrentChat(chatWithAgentResponse)
        setChats({...chats, [selectedAgent.id]: chatWithAgentResponse})
        setIsFetching(false)
      }, 2000)
    }
  }

  const handleSendEmail = (email: any) => {
    setEmailsSent(prev => prev + 1)
    const newMessage: Message = {
      id: Date.now().toString(),
      content: `Email sent to ${email.to}`,
      sender: 'agent',
      agentId: 'mailer',
      type: 'text'
    }
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, newMessage]
    }
    setCurrentChat(updatedChat)
    setChats({...chats, [selectedAgent.id]: updatedChat})
  }

  const handleDownloadExcel = () => {
    // Simulating Excel download
    console.log("Downloading Excel file...")
  }

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `New Chat ${chatHistory.length + 1}`,
      messages: []
    }
    setChatHistory([newChat, ...chatHistory])
    setCurrentChat(newChat)
  }

  return (
    <div className="flex h-screen bg-[#181D23] text-[#D6D0C6]">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-[#1F2937] transition-all duration-300 ease-in-out overflow-hidden flex flex-col border-r border-[#374151]`}>
        <div className="p-4">
          <h2 className="text-2xl font-bold text-[#EEAD75] mb-4 flex items-center">
            <Zap className="mr-2" />
            FinAI
          </h2>
          <Button onClick={handleNewChat} className="w-full bg-[#EEAD75] hover:bg-[#F0B88D] text-[#181D23] font-bold mb-4">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {chatHistory.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className="w-full justify-start mb-1 text-[#D6D0C6] hover:bg-[#374151]"
              onClick={() => setCurrentChat(chat)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {chat.title}
            </Button>
          ))}
        </ScrollArea>
        <div className="p-4 border-t border-[#374151]">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-[#EEAD75]">John Doe</p>
              <p className="text-xs text-[#9CA3AF]">john@example.com</p>
              <p className="text-xs text-[#9CA3AF] mt-1">Pro Plan</p>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" size="sm" className="w-full mr-2 text-[#EEAD75] border-[#374151] hover:bg-[#374151] hover:text-[#181D23] font-semibold">
              <Settings size={16} className="mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" className="w-full ml-2 text-[#EEAD75] border-[#374151] hover:bg-[#374151] hover:text-[#181D23] font-semibold">
              <LogOut size={16} className="mr-2" />
              Log out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#1F2937] border-b border-[#374151] p-4 flex items-center justify-between">
          {!isSidebarOpen && (
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="text-[#D6D0C6] hover:bg-[#374151]">
              <MessageSquare />
              <span className="sr-only">Open sidebar</span>
            </Button>
          )}
          <h1 className="text-xl font-bold text-center flex-1 text-[#EEAD75]">FinAI Dashboard</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className={`hidden sm:inline-flex text-[#EEAD75] border-[#374151] hover:bg-[#374151] hover:text-[#181D23] font-semibold ${selectedAgent.id !== 'month-end-close' && isFetching ? 'border-green-500 shadow-green-500/50 animate-pulse' : ''}`}>
              <Briefcase className="mr-2 h-4 w-4" />
              ERP System
            </Button>
            <Button variant="outline" size="sm" className={`hidden sm:inline-flex text-[#EEAD75] border-[#374151] hover:bg-[#374151] hover:text-[#181D23] font-semibold ${selectedAgent.id !== 'month-end-close' && isFetching ? 'border-green-500 shadow-green-500/50 animate-pulse' : ''}`}>
              <Database className="mr-2 h-4 w-4" />
              Database
            </Button>
            <Button variant="outline" size="sm" className={`hidden sm:inline-flex text-[#EEAD75] border-[#374151] hover:bg-[#374151] hover:text-[#181D23] font-semibold ${selectedAgent.id !== 'month-end-close' && isFetching ? 'border-yellow-500 shadow-yellow-500/50 animate-pulse' : ''}`}>
              <Users className="mr-2 h-4 w-4" />
              Salesforce
            </Button>
            <Button variant="outline" size="sm" className={`hidden sm:inline-flex text-[#EEAD75] border-[#374151] hover:bg-[#374151] hover:text-[#181D23] font-semibold ${selectedAgent.id !== 'month-end-close' && isFetching ? 'border-green-500 shadow-green-500/50 animate-pulse' : ''}`}>
              <Box className="mr-2 h-4 w-4" />
              Manufacturing
            </Button>
          </div>
        </header>

        <div className="bg-[#1F2937] p-4 border-b border-[#374151]">
          <h3 className="text-lg font-semibold mb-2 text-[#EEAD75]">Select AI Agent</h3>
          <div className="flex space-x-2">
            {agents.map((agent) => (
              <Button
                key={agent.id}
                variant={selectedAgent.id === agent.id ? "default" : "outline"}
                onClick={() => setSelectedAgent(agent)}
                className={selectedAgent.id === agent.id ? 'bg-[#EEAD75] text-[#181D23] font-bold' : 'text-[#EEAD75] border-[#374151] hover:bg-[#374151] hover:text-[#181D23] font-semibold'}
              >
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                  <AvatarFallback>{agent.name[0]}</AvatarFallback>
                </Avatar>
                <span>{agent.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {selectedAgent.id === 'month-end-close' ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="bg-[#1F2937] border-b border-[#374151] justify-start px-4">
              <TabsTrigger value="chat" className="text-[#D6D0C6] data-[state=active]:bg-[#EEAD75] data-[state=active]:text-[#181D23]">Chat</TabsTrigger>
              <TabsTrigger value="dashboard" className="text-[#D6D0C6] data-[state=active]:bg-[#EEAD75] data-[state=active]:text-[#181D23]">Dashboard</TabsTrigger>
              <TabsTrigger value="progress" className="text-[#D6D0C6] data-[state=active]:bg-[#EEAD75] data-[state=active]:text-[#181D23]">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="flex-1 p-4 bg-[#181D23]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <Card className="bg-[#1F2937] border-[#374151]">
                  <CardHeader>
                    <CardTitle className="text-[#EEAD75]">Month End Close Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={(progressSteps.filter(step => step.status === 'completed').length / progressSteps.length) * 100} className="h-2 mb-2" />
                    <p className="text-[#D6D0C6]">{progressSteps.filter(step => step.status === 'completed').length} of {progressSteps.length} steps completed</p>
                  </CardContent>
                </Card>
                <Card className="bg-[#1F2937] border-[#374151]">
                  <CardHeader>
                    <CardTitle className="text-[#EEAD75]">Emails Sent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-[#EEAD75]">{emailsSent}</p>
                    <p className="text-[#D6D0C6]">Total emails sent</p>
                  </CardContent>
                </Card>
                <Card className="bg-[#1F2937] border-[#374151]">
                  <CardHeader>
                    <CardTitle className="text-[#EEAD75]">Email Responses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-[#EEAD75]">{emailResponses}</p>
                    <p className="text-[#D6D0C6]">Responses received</p>
                  </CardContent>
                </Card>
              </div>
              <Card className="bg-[#1F2937] border-[#374151]">
                <CardHeader>
                  <CardTitle className="text-[#EEAD75]">Month End Close Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progressSteps.map((step, index) => (
                      <div key={step.step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          step.status === 'completed' ? 'bg-green-500' : 
                          step.status === 'in-progress' ? 'bg-[#EEAD75]' : 'bg-red-500'
                        }`}>
                          {step.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-white" />}
                          {step.status === 'in-progress' && <Circle className="w-5 h-5 text-white" />}
                          {step.status === 'pending' && <Circle className="w-5 h-5 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            step.status === 'completed' ? 'text-green-500' : 
                            step.status === 'in-progress' ? 'text-[#EEAD75]' : 'text-red-500'
                          }`}>
                            Step {step.step}: {step.description}
                          </p>
                          <Progress 
                            value={step.status === 'completed' ? 100 : step.status === 'in-progress' ? 50 : 0} 
                            className="h-1 mt-1 [&>div]:origin-left"
                          />
                        </div>
                        {index < progressSteps.length - 1 && (
                          <ArrowRight className="w-5 h-5 mx-2 text-[#D6D0C6]" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
              <div className="flex-1 p-4 overflow-auto">
                {currentChat.messages.map((message, index) => (
                  <div key={index} className={`flex items-start mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className={`w-8 h-8 ${message.sender === 'user' ? 'bg-[#EEAD75]' : 'bg-[#C3C6C3]'}`}>
                        {message.sender === 'user' ? (
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        ) : (
                          <AvatarImage src={agents.find(a => a.id === message.agentId)?.avatar} alt={agents.find(a => a.id === message.agentId)?.name} />
                        )}
                        <AvatarFallback>{message.sender === 'user' ? 'U' : 'A'}</AvatarFallback>
                      </Avatar>
                      <div className={`bg-[#1F2937] rounded-lg p-3 max-w-[70%] ${message.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'} border ${message.sender === 'user' ? 'border-[#EEAD75]' : 'border-[#C3C6C3]'}`}>
                        {message.type === 'text' && <p className="text-[#D6D0C6]">{message.content}</p>}
                        {message.type === 'table' && (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {Object.keys(message.data[0]).map((key) => (
                                  <TableHead key={key} className="text-[#EEAD75]">{key}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {message.data.map((row, i) => (
                                <TableRow key={i}>
                                  {Object.values(row).map((value, j) => (
                                    <TableCell key={j} className="text-[#D6D0C6]">{value}</TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                        {message.type === 'email' && (
                          <div className="text-[#D6D0C6]">
                            <p><strong>To:</strong> {message.data.to}</p>
                            <p><strong>Subject:</strong> {message.data.subject}</p>
                            <p><strong>Body:</strong></p>
                            <p>{message.data.body}</p>
                            <Button onClick={() => handleSendEmail(message.data)} className="mt-2 bg-[#EEAD75] hover:bg-[#F0B88D] text-[#181D23] font-bold">
                              <Send className="mr-2 h-4 w-4" />
                              Send Email
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-[#1F2937] border-t border-[#374151]">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-[#181D23] text-[#D6D0C6] border-[#374151] focus:border-[#EEAD75] focus:ring-[#EEAD75]"
                  />
                  <Button onClick={handleSendMessage} className="bg-[#EEAD75] hover:bg-[#F0B88D] text-[#181D23] font-bold">
                    <Send size={20} className="mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="flex-1 p-4 bg-[#181D23]">
              <h2 className="text-2xl font-bold mb-4 text-[#EEAD75]">Month End Close Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {progressSteps.map((step, index) => (
                  <Card key={step.step} className="bg-[#1F2937] border-[#374151]">
                    <CardHeader>
                      <CardTitle className="text-[#EEAD75] flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          step.status === 'completed' ? 'bg-green-500' : 
                          step.status === 'in-progress' ? 'bg-[#EEAD75]' : 'bg-red-500'
                        }`}>
                          {step.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-white" />}
                          {step.status === 'in-progress' && <Circle className="w-5 h-5 text-white" />}
                          {step.status === 'pending' && <Circle className="w-5 h-5 text-white" />}
                        </div>
                        Step {step.step}: {step.description}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress 
                        value={step.status === 'completed' ? 100 : step.status === 'in-progress' ? 50 : 0} 
                        className="h-2 mb-2 [&>div]:origin-left"
                      />
                      <div className="flex flex-col space-y-2">
                        <p className={`text-[#D6D0C6] ${
                          step.status === 'completed' ? 'text-green-500' : 
                          step.status === 'in-progress' ? 'text-[#EEAD75]' : 'text-red-500'
                        }`}>
                          {step.status === 'completed' ? 'Completed' : 
                           step.status === 'in-progress' ? 'In Progress' : 'Pending'}
                        </p>
                        {step.status !== 'completed' && (
                          <Button 
                            onClick={() => {
                              const updatedSteps = [...progressSteps];
                              updatedSteps[index].status = step.status === 'pending' ? 'in-progress' : 'completed';
                              setProgressSteps(updatedSteps);
                            }} 
                            className="bg-[#EEAD75] hover:bg-[#F0B88D] text-[#181D23] font-bold w-full"
                          >
                            {step.status === 'pending' ? 'Start' : 'Complete'}
                          </Button>
                        )}
                        {step.step === 6 && step.status === 'completed' && (
                          <Button onClick={handleDownloadExcel} className="bg-[#EEAD75] hover:bg-[#F0B88D] text-[#181D23] font-bold w-full">
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Download Excel
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4 overflow-auto">
              {currentChat.messages.map((message, index) => (
                <div key={index} className={`flex items-start mb-4 ${message.sender === 'user' ? 'justify-end': 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className={`w-8 h-8 ${message.sender === 'user' ? 'bg-[#EEAD75]' : 'bg-[#C3C6C3]'}`}>
                      {message.sender === 'user' ? (
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      ) : (
                        <AvatarImage src={agents.find(a => a.id === message.agentId)?.avatar} alt={agents.find(a => a.id === message.agentId)?.name} />
                      )}
                      <AvatarFallback>{message.sender === 'user' ? 'U' : 'A'}</AvatarFallback>
                    </Avatar>
                    <div className={`bg-[#1F2937] rounded-lg p-3 max-w-[70%] ${message.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'} border ${message.sender === 'user' ? 'border-[#EEAD75]' : 'border-[#C3C6C3]'}`}>
                      {message.type === 'text' && <p className="text-[#D6D0C6]">{message.content}</p>}
                      {message.type === 'table' && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {Object.keys(message.data[0]).map((key) => (
                                <TableHead key={key} className="text-[#EEAD75]">{key}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {message.data.map((row, i) => (
                              <TableRow key={i}>
                                {Object.values(row).map((value, j) => (
                                  <TableCell key={j} className="text-[#D6D0C6]">{value}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                      {message.type === 'email' && (
                        <div className="text-[#D6D0C6]">
                          <p><strong>To:</strong> {message.data.to}</p>
                          <p><strong>Subject:</strong> {message.data.subject}</p>
                          <p><strong>Body:</strong></p>
                          <p>{message.data.body}</p>
                          <Button onClick={() => handleSendEmail(message.data)} className="mt-2 bg-[#EEAD75] hover:bg-[#F0B88D] text-[#181D23] font-bold">
                            <Send className="mr-2 h-4 w-4" />
                            Send Email
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#1F2937] border-t border-[#374151]">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-[#181D23] text-[#D6D0C6] border-[#374151] focus:border-[#EEAD75] focus:ring-[#EEAD75]"
                />
                <Button onClick={handleSendMessage} className="bg-[#EEAD75] hover:bg-[#F0B88D] text-[#181D23] font-bold">
                  <Send size={20} className="mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

