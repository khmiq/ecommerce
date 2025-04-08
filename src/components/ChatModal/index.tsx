// import { useState, useEffect } from 'react';
// import { Button } from '../ui/button';
// import { Textarea } from '../ui/textarea';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const API_BASE = "https://keldibekov.online";

// type Message = {
//   id: string;
//   text: string;
//   from_id: string;
//   to_id: string;
//   product_id: string;
//   date: string;
// };

// type ChatModalProps = {
//   productId: string;
//   sellerEmail: string;
//   sellerName: string;
//   children: React.ReactNode;
// };

// export const ChatModal = ({ productId, sellerEmail, sellerName, children }: ChatModalProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchMessages = async () => {
//     try {
//       // Replace with your actual API endpoint to fetch messages
//       const response = await axios.get(`${API_BASE}/messages`, {
//         params: { productId }
//       });
//       setMessages(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

//   useEffect(() => {
//     if (isOpen) {
//       fetchMessages();
//     }
//   }, [isOpen]);

//   const handleSendMessage = async () => {
//     if (!message.trim()) {
//       toast.error('Message cannot be empty');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.post(`${API_BASE}/messages`, {
//         text: message,
//         productId
//       });

//       if (response.status === 201) {
//         setMessages(prev => [...prev, response.data.data]);
//         setMessage('');
//         toast.success('Message sent successfully');
//       }
//     } catch (error) {
//       toast.error('Failed to send message');
//       console.error('Message error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         {children}
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
//         <DialogHeader>
//           <DialogTitle>Chat with {sellerName}</DialogTitle>
//         </DialogHeader>
        
//         <div className="flex-1 overflow-y-auto space-y-4 mb-4">
//           {messages.length === 0 ? (
//             <div className="text-center text-gray-500 py-8">
//               No messages yet. Start the conversation!
//             </div>
//           ) : (
//             messages.map((msg) => (
//               <div 
//                 key={msg.id} 
//                 className={`p-3 rounded-lg max-w-[80%] ${
//                   msg.from_id === 'current-user-id' 
//                     ? 'bg-blue-100 ml-auto' 
//                     : 'bg-gray-100 mr-auto'
//                 }`}
//               >
//                 <p className="text-sm">{msg.text}</p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   {new Date(msg.date).toLocaleTimeString()}
//                 </p>
//               </div>
//             ))
//           )}
//         </div>

//         <div className="border-t pt-4">
//           <Textarea
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder={`Message to ${sellerName} about this product...`}
//             rows={3}
//             className="w-full mb-2"
//             onKeyDown={(e) => {
//               if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSendMessage();
//               }
//             }}
//           />
//           <Button 
//             onClick={handleSendMessage}
//             disabled={isLoading || !message.trim()}
//             className="w-full"
//           >
//             {isLoading ? 'Sending...' : 'Send Message'}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, Send } from 'lucide-react';

const API_BASE = "https://keldibekov.online";

type Message = {
  id: string;
  text: string;
  from_id: string;
  to_id: string;
  product_id: string;
  date: string;
  senderName?: string;
  isCurrentUser?: boolean;
};

type ChatModalProps = {
  productId: string;
  sellerEmail: string;
  sellerName: string;
  currentUserId: string;
  children: React.ReactNode;
};

export const ChatModal = ({ 
  productId, 
  sellerEmail, 
  sellerName, 
  currentUserId,
  children 
}: ChatModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    setIsFetching(true);
    try {
      // Replace with your actual API endpoint to fetch messages
      const response = await axios.get(`${API_BASE}/messages`, {
        params: { productId },
        headers: {
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      const formattedMessages = (response.data.data || []).map((msg: Message) => ({
        ...msg,
        isCurrentUser: msg.from_id === currentUserId,
        senderName: msg.from_id === currentUserId ? 'You' : sellerName
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/messages`, {
        text: message,
        productId
      }, {
        headers: {
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.status === 201) {
        const newMessage = {
          ...response.data.data,
          isCurrentUser: true,
          senderName: 'You'
        };
        setMessages(prev => [...prev, newMessage]);
        setMessage(''); // Reset input field
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      toast.error('For messaging , please login first');
      console.error('Message error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] h-[85vh] sm:max-w-[500px] sm:h-[600px] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 pb-2 border-b">
          <DialogTitle className="text-lg">Chat with {sellerName}</DialogTitle>
        </DialogHeader>
        
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isFetching ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full text-center text-gray-500">
              <p>No messages yet</p>
              <p className="text-sm mt-1">Start the conversation with {sellerName}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.isCurrentUser ? 'items-end' : 'items-start'}`}
              >
                <div className="text-xs text-gray-500 mb-1">
                  {msg.senderName} • {new Date(msg.date).toLocaleString()}
                </div>
                <div 
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.isCurrentUser 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm break-words">{msg.text}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t p-4 bg-white">
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${sellerName}...`}
              rows={2}
              className="flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
              size="icon"
              className="h-auto"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {sellerName} usually responds within a few hours
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};