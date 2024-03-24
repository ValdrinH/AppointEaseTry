import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, Tab, Nav, Button, Dropdown } from 'react-bootstrap';
import ModalNotify from './ModalMessages/ModalNotifications';
import { format } from 'date-fns';

const FriendList = () =>
{
    const [friends, setFriends] = useState([]);
    const [friendRequests, setRequests] = useState([]);
    const [allOtherUsers, setOthers] = useState([]);

    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('friends');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
       
        const dummyRequests = async () =>{
            try {

                const fetchData = await fetch(`https://localhost:7207/api/RequestConnection/GetConnections?userId=${localStorage.getItem('userId')}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
            
                if (fetchData.ok) {
                    const response = await fetchData.json();
                    setRequests(response);
                    console.log(response);
                    
                } else {
                    console.error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    
        dummyRequests();
    
    }, []);
    const handlePageChange = (pageNumber) =>
    {
        setCurrentPage(pageNumber);
    };

    const handleTabChange = (tab) =>
    {
        if(tab === 'friends'){
            if (friends.length === 0)
            {
                setShowModal(true);
            }; 
        }

        setActiveTab(tab);
        setCurrentPage(1);
    };
    const handleCloseModal = () => {
        setShowModal(false); 
    };

    const renderPagination = (totalItems) =>
    {
        const pageCount = Math.ceil(totalItems / pageSize);
        const totalPages = Math.ceil(pageCount / 10);
        const currentGroup = Math.ceil(currentPage / 10);

        const handleNextGroup = () =>
        {
            setCurrentPage((currentGroup * 10) + 1);
        };

        const handlePrevGroup = () =>
        {
            setCurrentPage(((currentGroup - 2) * 10) + 1);
        };

      


        if (!totalItems || totalItems === 0) return null; // Hide buttons if totalItems is null or 0

        return (
            <div className="mt-3 d-flex justify-content-center">
                <Button onClick={handlePrevGroup} disabled={currentGroup === 1}>{'<'}</Button>
                {Array.from({ length: Math.min(10, pageCount - ((currentGroup - 1) * 10)) }, (_, i) => ((currentGroup - 1) * 10) + i + 1).map(page => (
                    <Button key={page} variant="light" bg='primary' onClick={() => handlePageChange(page)} className="mx-1">
                        {page}
                    </Button>
                ))}
                <Button bg='primary' onClick={handleNextGroup} disabled={currentGroup === totalPages}>{'>'}</Button>
            </div>
        );
    };

    const renderUsers = (users) =>
    {

        const usersArray = users || [];
        console.log(users);
        // Check if usersArray is empty
        if (usersArray.length === 0) {
            return (
                <ModalNotify
                    show={showModal}
                    handleClose={handleCloseModal}
                    title="Message"
                    body="There are no users to display."
                />
            );
        }
        
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return format(date, 'dd MMM, yyyy | HH:mm');
        };

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return users.slice(startIndex, endIndex).map(user => (
            <ListGroup.Item key={user.id} className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                    <img src={`data:image/${user.photoFormat};base64,${user.photo}`} alt={user.fullName} className="mr-3" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                    <span className="lead mx-2">{user.fullName}</span> {' | '}
                    <span className="lead mx-2">{formatDate(user.date)}</span>
                </div>
                {activeTab === 'friends' &&
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            ...
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item >Remove</Dropdown.Item>
                            <Dropdown.Item >View Profile</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                }
                {activeTab === 'requests' &&
                    <div className='d-flex justify-content-between'>
                        <Button variant="primary" className="mx-1">Accept</Button>
                        <Button variant="danger" className="mx-1">Reject</Button>
                        <Button variant="secondary" className="mx-1">View Profile</Button>
                    </div>
                }
                {activeTab === 'Add more' &&
                    <Button variant="secondary">View Profile</Button>
                }
            </ListGroup.Item>
        ));
    };

    return (
        <div className='container-fluid'>
            <Row className='h-100 w-100'>
                <Col className='h-100 w-100'>
                    <Tab.Container id="friend-list-tabs" defaultActiveKey="friends" onSelect={(tab) => handleTabChange(tab)} >
                        <Row className="my-4 align-items-center mx-3">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">🔍</span>
                                </div>
                                <input type="text" className="form-control" placeholder="Search..." aria-label="Search" aria-describedby="basic-addon1" />
                            </div>
                            <Nav variant="pills" className="ml-auto">
                                <Nav.Item>
                                    <Nav.Link eventKey="friends">Friends</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="requests">Friend Requests</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Add more">Add Other Users</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Row>
                        <Tab.Content className='mx-3' style={{minHeight:'100vh'}}>
                            <Tab.Pane eventKey="friends">
                                <ListGroup>
                                    {renderUsers(friends)}
                                </ListGroup>
                                {renderPagination(friends.length)}
                            </Tab.Pane>
                            <Tab.Pane eventKey="requests">
                                <ListGroup>
                                    {renderUsers(friendRequests)}
                                </ListGroup>
                                {renderPagination(friendRequests.length)}
                            </Tab.Pane>
                            <Tab.Pane eventKey="Add more">
                                <ListGroup>
                                    {renderUsers(allOtherUsers)}
                                </ListGroup>
                                {renderPagination(allOtherUsers.length)}
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>
        </div>
    );
};

export default FriendList;
