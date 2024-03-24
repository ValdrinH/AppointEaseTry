import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Container, Nav, NavDropdown, Offcanvas} from 'react-bootstrap';
import './Navbar.css';
import { CgProfile } from "react-icons/cg";
import { IoMdChatbubbles } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";
import { HiChatBubbleBottomCenterText } from "react-icons/hi2";
import { FaUserFriends } from "react-icons/fa";
import ChatBot from './Chat/ChatBot';

const Navbar = ({ isLoggedIn, handleLogout }) => {

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const navbarTextColor = '#ffffff'; // White color for text

  return (
    <>
    <BootstrapNavbar bg="primary" expand="lg" sticky="top" data-bs-theme="dark">
      <BootstrapNavbar.Brand href="/home" className="navbar-brand">
        <span style={{ color: navbarTextColor }}>AppointEase</span>
      </BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {isLoggedIn === false && (
            <>
              <Nav.Link href="/home" style={{ color: navbarTextColor }}>Home</Nav.Link>
              <Nav.Link href="/about-us" style={{ color: navbarTextColor }}>About Us</Nav.Link>
              <Nav.Link href="/contact-us" style={{ color: navbarTextColor }}>Contact Us</Nav.Link>
            </>
          )}
         
          {isLoggedIn ? (
            <>
             <Nav.Link href="/user-list" style={{ color: navbarTextColor }}><FaUserFriends style={{ fontSize: "30px" }}/></Nav.Link>
              <NavDropdown align={{ lg: 'end' }} title={<IoMdNotifications style={{ fontSize: "30px", color: '#ffffff'}}/>} id="profile-dropdown" >
                <NavDropdown.Item href="/profile" style={{ color: '#ffffff' }}>Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} style={{ color: '#ffffff' }}>Log Out</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown align={{ lg: 'end' }} drop='down-centered' title={<IoMdChatbubbles style={{ fontSize: "30px",color:"white" }}/>} id="chat-dropdown" >
                <NavDropdown.Item href="/chat" style={{ color: '#ffffff' }}>
                  <IoMdChatbubbles className='mr-2' style={{ fontSize: "25px" }}/>
                  Messages
                </NavDropdown.Item>
                <NavDropdown.Item href="#" style={{ color: '#ffffff' }} onClick={toggleOffcanvas}>
                  <HiChatBubbleBottomCenterText className='' style={{ fontSize: "25px" }}/>
                  Chat bot
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown align={{ lg: 'end' }} title={<CgProfile style={{ fontSize: "30px",color: '#ffffff'  }}></CgProfile>} id="profile-dropdown" >
                <NavDropdown.Item href="/profile" style={{ color: '#ffffff' }}>Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} style={{ color: '#ffffff' }}>Log Out</NavDropdown.Item>
              </NavDropdown>


            </>
          ) : (
            <>
              <Nav.Link href="/login" style={{ color: navbarTextColor }}>Login</Nav.Link>
              <Nav.Link href="/register-patient" style={{ color: navbarTextColor }}>Register</Nav.Link>
            </>
          )}
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
     <Offcanvas show={showOffcanvas} onHide={toggleOffcanvas} placement="end">
     <Offcanvas.Header closeButton>
       <Offcanvas.Title>Chatbot</Offcanvas.Title>
     </Offcanvas.Header>
     <Offcanvas.Body>
       <ChatBot />
     </Offcanvas.Body>
   </Offcanvas>
   </>
  );
};

export default Navbar;
