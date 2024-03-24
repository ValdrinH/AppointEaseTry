import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import MessageComponent from '../Messages/MessageComponent';

function MySchedule() {
    const [appointments, setAppointments] = useState([]);
    const [patientData, setPatientData] = useState({});
    const [appointmentSlots, setAppointmentSlots] = useState({});
    const [errors, setErrors] = useState(null);
    const [errorMessage, setErrorMessage]=useState(null);
    // Assume userId is stored somewhere in the component state
    const [userId, setUserId] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch('https://localhost:7207/api/BookAppointment', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const appointmentData = await response.json();
                setAppointments(appointmentData);
            } else {
                setErrors('Failed to fetch appointment data');
            }
        } catch (error) {
            console.error('Error during fetching appointment data:', error);
            setErrors('An error occurred while fetching appointment data');
        }
    };

    useEffect(() => {
        // Fetch user id (assuming it's stored somewhere)
        const userId = localStorage.getItem('userId');
        setUserId(userId);

        fetchData();
    }, []);

    useEffect(() => {
        const fetchAppointmentSlots = async () => {
            try {
                const response = await fetch('https://localhost:7207/api/AppointmentSlot/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (response.ok) {
                    const slotData = await response.json();
                    const slots = {};
                    slotData.forEach(slot => {
                        // Ensure doctorId property exists for each slot
                        if (slot.doctorId && slot.isAccepted) {
                            slots[slot.appointmentSlotId] = {
                                ...slot,
                                doctorId: slot.doctorId
                            };
                        }
                    });
                    setAppointmentSlots(slots);
                } else {
                    setErrors('Failed to fetch appointment slots');
                }
            } catch (error) {
                console.error('Error during fetching appointment slots:', error);
                setErrors('An error occurred while fetching appointment slots');
            }
        };
        fetchAppointmentSlots();
    }, []);

    useEffect(() => {
        const fetchPatientData = async (patientId) => {
            try {
                const response = await fetch(`https://localhost:7207/api/Patient/GetPatientById?patientId=${patientId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const patient = await response.json();
                    setPatientData((prevData) => ({
                        ...prevData,
                        [patientId]: patient,
                    }));
                } else {
                    setErrors('Failed to fetch patient data');
                }
            } catch (error) {
                console.error('Error during fetching patient data:', error);
                setErrors('An error occurred while fetching patient data');
            }
        };

        appointments.forEach((appointment) => {
            if (!patientData[appointment.patientId]) {
                fetchPatientData(appointment.patientId);
            }
        });
    }, [appointments]);

    const cancelAppointment = async (id) => {
        try {
            const response = await fetch(`https://localhost:7207/api/BookAppointment/cancel/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.succeeded === true) {
                  console.log('Operation succeeded: true');
                  setErrorMessage(responseData);
                  console.log(responseData);
                  fetchData();
                } else {
                  console.log('Operation succeeded: false');
                  setErrorMessage(responseData);
                  console.log(responseData);
                }
            } else {
                const errorData = await response.json();
                console.error('Failed to cancel appointment:', errorData.message);
            }
        } catch (error) {
            console.error('Error canceling appointment:', error);
        }
    };

    return (
        <div className="col-py-9">
            <div className="row-md-1">
                <Sidebar userRole='Doctor' />
            </div>
            <div className="row-md-5 d-flex justify-content-center">
                <div className="w-75" >
                    <div className="my-5">
                        <h3>My Schedule</h3>    
                    </div>
                    {errorMessage && <MessageComponent message={errorMessage} />}
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Start Time</th>
                                    <th scope="col">End Time</th>
                                    <th scope="col">Patient Name</th>
                                    <th scope="col">Meeting Reason</th>
                                    <th scope="col">Meeting Request Desc.</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {appointments.map((appointment, index) => {
                                    const appointmentSlot = appointmentSlots[appointment.appointmentSlotId];
                                    if (appointmentSlot && appointmentSlot.doctorId === userId) {
                                        return (
                                            <tr key={appointment.bookAppointmentId}>
                                                <td>{appointmentSlot.date}</td>
                                                <td>{appointmentSlot.startTime}</td>
                                                <td>{appointmentSlot.endTime}</td>
                                                <td>{patientData[appointment.patientId]?.name} {patientData[appointment.patientId]?.surname}</td>
                                                <td>{appointment.meetingReason}</td>
                                                <td>{appointment.meetingRequestDescription}</td>
                                                <td>{appointment.isCanceled ? 'CANCELED' : 'Ongoing'}</td>
                                                {!appointment.isCanceled && (
                                                    <td>
                                                        <button className="btn btn-danger btn-sm" onClick={() => cancelAppointment(appointment.bookAppointmentId)}>Cancel Appointment</button>
                                                    </td>
                                                )}

                                            </tr>
                                        );
                                    } else {
                                        return null; // If appointment slot or doctorId doesn't match, return null
                                }
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MySchedule;