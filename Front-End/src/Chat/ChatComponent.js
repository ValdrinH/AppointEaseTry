import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, ListGroup, Image, InputGroup, Button } from 'react-bootstrap';
import bg from '../Images/3.jpg';
import useSignalRHub from '../SiganlR/SignalRComponent'; 
import { Spinner } from 'react-bootstrap';

function UserList({ users, handleUserClick }) {
  return (
<div className="user-list">
      <h5 className="mb-3">User List</h5>
      <ListGroup>
        {users.map(user => (
          <ListGroup.Item
            key={user.id}
            action
            onClick={() => handleUserClick(user)}
            className="d-flex align-items-center"
          >
            <Image src={bg} alt={user.name} className="avatar mr-2" roundedCircle style={{ width: '70px', height: '70px' }} />
            <span>{user.name}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

function MessageList({ messages, currentUser }) {

  const id = localStorage.getItem('userId');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(messages.length === 0); // Vendos loading në true nëse nuk ka mesazhe
   }, [messages]);



  return (
    <div className="message-list">
       {loading && 
             <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100%' }}>
             <Spinner animation="border" role="status">
               <span className="sr-only">Loading...</span>
             </Spinner>
           </div>
        }

      {currentUser && (
        <div className="">
          <div className="">
            {messages.map((message, index) => (
              <div key={index} className='row'>
                <div className={`message ${message.user === id ? 'text-right' : 'text-left'}`}>
                  <div className={`bg-primary w-auto my-1 p-2 rounded text-white  ${message.user === id ? 'float-right' : 'float-left'}`} style={{maxWidth: "50%",minWidth:"20%"}}>
                    <p className="user">{message.user == id? message.senderName : message.receiverName}</p>
                    <p className="text-white m-0">{message.text}</p>
                    {message.time && <p className="text-muted m-0">{message.time}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


function ChatApp({signalrConnection}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isTyping,SetTyping]= useState(false);

  useEffect(() => {
    console.log(signalrConnection);
    if (signalrConnection) {
      signalrConnection.on("ReceiveMessage", (messageRespons) => {
        const dateObject = new Date(messageRespons.timestamp);
        const time = `${dateObject.getHours()}:${String(dateObject.getMinutes()).padStart(2, '0')}`;
        const dateFormatted = dateObject.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        const newMessage = {
          text: messageRespons.content,
          user: messageRespons.sender,
          senderName: messageRespons.senderName,
          receiverName: messageRespons.receiverName,
          time: time,
          date: dateFormatted
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
      });

      signalrConnection.on("SetIsTyping",(typingStatus)=>{
          console.log(typingStatus)
          SetTyping(typingStatus);
      })

    }
    
  }, [signalrConnection]);

  useEffect(() => {
    if (selectedUser) {
      GetMessages();
    }
  }, [selectedUser]);

  const GetMessages = async() => {
    const loginId = localStorage.getItem('userId');
    try {
      const response = await fetch(`https://localhost:7207/api/Chat/messages?senderId=${loginId}&receiverId=selectedUserid`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        const formattedMessages = data.map(message => {
          const dateObject = new Date(message.timestamp);
  
          const time = `${dateObject.getHours()}:${String(dateObject.getMinutes()).padStart(2, '0')}`;
  
          const date = `${dateObject.getDate()}-${dateObject.getMonth() + 1}-${dateObject.getFullYear()}`;
  
          return {
            text: message.content,
            user: message.sender,
            senderName: message.senderName,
            receiverName: message.receiverName,
            time: time,
            date: date
          };
        });
        setMessages(formattedMessages);
      } else {
        console.error('Error fetching messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  const handleInputChange = async (e) => {
    setInputText(e.target.value);
    if ( e.target.value.trim() !== '') {
      setStatusTyping(true);
    } else if ( e.target.value.trim() === '') {
      setStatusTyping(false);
    }
  };
  const setStatusTyping = async (value)=>{
    const userId = "b6edfcc6-5298-404b-8ae4-aa0427e70cfb";
    try {
      await signalrConnection.invoke("NotifyTyping", userId, value);
    } catch (err) {
      console.error(err);
    }
  }

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleMessageSend = async() => {
    if (inputText.trim() === '' || !selectedUser) return;

    const id = localStorage.getItem('userId');
    const messageRequest = {
      senderId: id ,
      receiverId: "selectedUserid",
      message: inputText.trim(),
      timestamp:  new Date().toISOString().slice(0, -1)
    };

    await signalrConnection.invoke("SendMessage", messageRequest).catch(err => console.error(err));
    setStatusTyping(false);
    setInputText('');
  };

  const scrollToBottom = () => {
    const messageContainer = document.getElementById('messageContainer');
    if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
};
useEffect(() => {
  scrollToBottom();
}, [messages]);




  return (
    <Container fluid className="py-5" style={{ backgroundColor: "#CDC4F9" }}>
      <Row >
        <Col md={4}>
          <div className="card">
            <div className="card-body">
              <InputGroup className="mb-3">
                <input type="text" className="form-control" placeholder="Search..." />
              </InputGroup>
              <UserList
                users={[
                  { id: 1, name: 'User 1', image: 'user1.jpg' },
                  { id: 2, name: 'User 2', image: 'user2.jpg' },
                  // Add more users as needed
                ]}
                handleUserClick={handleUserClick}
              />
            </div>
          </div>
        </Col>
        <Col md={8}>
          {selectedUser && (
           <div className="container card">
           <div className="row w-100">
             <div className="card-header w-100">
               <img src={selectedUser.image} alt={selectedUser.name} className="avatar mr-2" />
               {selectedUser.name}
             </div>
           </div>
           <div id="messageContainer" 
           className="row h-100 w-100" style={{ maxHeight: '100%', overflowY: 'scroll' }}
          >
            
              <MessageList messages={messages} currentUser={selectedUser} />
              {isTyping && (
    <div
      style={{
        position: 'sticky',
        bottom: '0',
        zIndex: '1',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        width:'auto'
      }}
    >
      <Spinner animation="grow" variant="primary" size="sm" />
      <p style={{ marginLeft: '10px', fontSize: '15px', color: '#666' }}>{selectedUser.name} is typing...</p>
    </div>
  )}
           </div>
           <div className="row w-100">
           
             <div className="card-footer">
               <InputGroup>
                 <input
                   type="text"
                   className="form-control"
                   placeholder={`Message ${selectedUser.name}`}
                   value={inputText}
                   onChange={handleInputChange}
                 />
                 <Button variant="primary" onClick={handleMessageSend}>Send</Button>
               </InputGroup>
             </div>
           </div>
         </div>
         
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ChatApp;
