import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showSubServices, setShowSubServices] = useState(false);
  const [selectedSubService, setSelectedSubService] = useState(null);

  const services = {
    'Technical Support': {
      'Option 1': ['Sub-option A', 'Sub-option B', 'Sub-option C'],
      'Option 2': ['Sub-option D', 'Sub-option E', 'Sub-option F'],
      'Option 3': {
        'Sub-option G': ['Sub-sub-option 1', 'Sub-sub-option 2', 'Sub-sub-option 3'],
        'Sub-option H': ['Sub-sub-option 4', 'Sub-sub-option 5', 'Sub-sub-option 6'],
        'Sub-option I': ['Sub-sub-option 7', 'Sub-sub-option 8', 'Sub-sub-option 9']
      }
    },
    'Problem Solution': {
      'Option A': ['Sub-option 1', 'Sub-option 2', 'Sub-option 3'],
      'Option B': ['Sub-option 4', 'Sub-option 5', 'Sub-option 6'],
      'Option C': ['Sub-option 7', 'Sub-option 8', 'Sub-option 9']
    },
    'Find a Doctor': {
      'Option X': ['Sub-option 10', 'Sub-option 11', 'Sub-option 12'],
      'Option Y': ['Sub-option 13', 'Sub-option 14', 'Sub-option 15'],
      'Option Z': ['Sub-option 16', 'Sub-option 17', 'Sub-option 18']
    },
    'Medical Assistance': {
      'Option I': ['Sub-option 19', 'Sub-option 20', 'Sub-option 21'],
      'Option II': ['Sub-option 22', 'Sub-option 23', 'Sub-option 24'],
      'Option III': ['Sub-option 25', 'Sub-option 26', 'Sub-option 27']
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    if (message) {
      setMessages([...messages, { sender: 'You', text: message }]);
      e.target.reset();
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    const message = `Service: ${service}`;
    setMessages([...messages, { sender: 'Chatbot', text: message }]);
    setShowSubServices(true);
  };

  const handleSubServiceClick = (subService) => {
    const message = `Sub-option selected: ${subService}`;
    setMessages([...messages, { sender: 'You', text: message }]);
  };

  const handleReset = () => {
    setMessages([]);
    setSelectedService(null);
    setShowSubServices(false);
    setSelectedSubService(null);
  };

  return (
    <Container>
      <h1 className="mt-4">Chat Bot</h1>
      <div style={{ height: '70vh', width: '100%', overflowY: 'scroll', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px' }}>
        <div className="p-3">
          {Object.keys(services).map((service, index) => (
            <Button key={index} variant="primary" className="mr-2 mb-2" onClick={() => handleServiceClick(service)}>
              {service}
            </Button>
          ))}
        </div>
        {messages.map((message, index) => (
          <div key={index} className="m-3 bg-primary rounded text-white p-3" style={{ minHeight: '50px' }}>
            <strong>{message.sender}: </strong>{message.text}
          </div>
        ))}
        {showSubServices && selectedService &&
          <div className="m-3 bg-primary rounded text-white p-3" style={{ minHeight: '50px' }}>
            <p>Choose an option:</p>
            {Object.keys(services[selectedService]).map((option, index) => (
              <Button key={index} variant="secondary" className="mr-2 mb-2" onClick={() => setSelectedSubService(option)}>
                {option}
              </Button>
            ))}
          </div>
        }
        {selectedSubService && typeof services[selectedService][selectedSubService] === 'object' &&
          <div className="m-3 bg-primary rounded text-white p-3" style={{ minHeight: '50px' }}>
            <p>Choose a sub-option for {selectedSubService}:</p>
            {Object.keys(services[selectedService][selectedSubService]).map((subOption, index) => (
              <Button key={index} variant="secondary" className="mr-2 mb-2" onClick={() => handleSubServiceClick(services[selectedService][selectedSubService][subOption])}>
                {services[selectedService][selectedSubService][subOption]}
              </Button>
            ))}
          </div>
        }
      </div>
      <Form onSubmit={handleSendMessage} className='w-100'>
        <Form.Group className="d-flex flex-column align-items-center justify-content-between">
          <Form.Control type="text" name="message" placeholder="Type your message..." />
          <div className='my-2 d-flex'>
            <Button variant="danger" className="mr-2 w-100" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="primary" type="submit" className="mr-2 w-100">
              Send
            </Button>
          </div>
        </Form.Group>
      </Form>
    </Container>
  );
}

export default ChatBot;
