import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { Card } from 'react-bootstrap';

const PatientDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const appointmentsRegistered = 10;
    const appointmentsPending = 5;

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);

        // Filtroni elementet e nevojshme këtu
        const filtered = ["Item 1", "Item 2", "Item 3"]; // Për shembull, mund të jenë elementet e filtruara
        setFilteredItems(filtered);
    };

    return (
        <div className="col-py-9">
            <div className="row-md-1">
                <Sidebar userRole='Patient' />
            </div>
            <div className="row-md-9 col-lg-12 px-md-4">
                <div className="my-5">
                    <h2>Patient Dashboard</h2>
                    <hr />
                    <div className="input-group mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Search..." 
                            aria-label="Search" 
                            aria-describedby="basic-addon2"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button className="btn btn-outline-secondary bg-primary text-white" type="button" id="button-addon2">Search</button>
                    </div>
                    {filteredItems.length > 0 && (
                        <div className="col-md-12">
                            <div className=" p-3 bg-light rounded">
                                <ul className="list-group">
                                    {filteredItems.map((item, index) => (
                                        <li className="list-group-item" key={index}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
                <div className="row">
                    {/* Kartat e përditësuara për t'i përshtatur klasën e re */}
                    <div className="col-md-4 mb-4">
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Total Appointment</Card.Title>
                                <Card.Text>{appointmentsRegistered}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-4 mb-4">
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Appointments In Progress</Card.Title>
                                <Card.Text>{appointmentsPending}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-4 mb-4">
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Total</Card.Title>
                                <Card.Text>{appointmentsPending}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
