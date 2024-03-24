import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';

function MyPatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [appointmentSlots, setAppointmentSlots] = useState({});
    const [doctorData, setDoctorData] = useState({});
    const [errors, setErrors] = useState(null);
    const [userId, setUserId] = useState(''); // Assuming userId is stored somewhere

    useEffect(() => {
        // Fetch user id (assuming it's stored somewhere)
        const userId = localStorage.getItem('userId');
        setUserId(userId);

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
                        slots[slot.appointmentSlotId] = {
                            ...slot,
                            doctorId: slot.doctorId // Store DoctorId alongside slot data
                        };
                        // Fetch doctor data if not already fetched
                        if (!doctorData[slot.doctorId]) {
                            fetchDoctorData(slot.doctorId);
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

    const fetchDoctorData = async (doctorId) => {
        try {
            const response = await fetch(`https://localhost:7207/api/Doctor/GetDoctorById?doctorId=${doctorId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const doctor = await response.json();
                setDoctorData((prevData) => ({
                    ...prevData,
                    [doctorId]: doctor,
                }));
            } else {
                setErrors('Failed to fetch doctor data');
            }
        } catch (error) {
            console.error('Error during fetching doctor data:', error);
            setErrors('An error occurred while fetching doctor data');
        }
    };
    const deleteAppointment = async (appointmentId) => {
        try {
            const response = await fetch(`https://localhost:7207/api/BookAppointment/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // If deletion is successful, update the appointments state
                setAppointments(prevAppointments =>
                    prevAppointments.filter(appointment => appointment.bookAppointmentId !== appointmentId)
                );
            } else {
                setErrors('Failed to cancel appointment');
            }
        } catch (error) {
            console.error('Error during canceling appointment:', error);
            setErrors('An error occurred while canceling appointment');
        }
    };

    const myPatientAppointments = appointments.filter(appointment =>
        appointmentSlots[appointment.appointmentSlotId] &&
        appointmentSlots[appointment.appointmentSlotId].patientId === userId &&
        appointment.isAccepted === true
    );
    
    const myPatientRequestAppointments = appointments.filter(appointment =>
        appointmentSlots[appointment.appointmentSlotId] &&
        appointmentSlots[appointment.appointmentSlotId].patientId === userId &&
        appointment.isAccepted === false
    );

    const cancelAppointmentFromPatient = async (appointmentId) => {
        try {
            const response = await fetch(`https://localhost:7207/api/BookAppointment/cancel-from-patient/${appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData.message); // Log success message
                // Handle any additional logic after successful cancelation
            } else {
                const errorData = await response.json();
                console.error('Failed to cancel appointment:', errorData.message);
                // Handle error case
            }
        } catch (error) {
            console.error('Error canceling appointment:', error);
            // Handle network error
        }
    };
    
    return (
        <div className="col-py-9">
            <div className="row-md-1">
                <Sidebar userRole='Patient' />
            </div>
            <div className="row-md-5 d-flex justify-content-center">
                <div className="w-75" >
                    <div className="my-5">
                        <h3>My Pending Appointment Requests</h3>    
                    </div>
                    {errors && <div className="alert alert-danger">{errors}</div>}
                    <div class="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Start Time - End Time</th>
                                    <th scope="col">Doctor</th>
                                    <th scope="col">Meeting Reason</th>
                                    <th scope="col">Meeting Request Desc.</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myPatientRequestAppointments.map((appointment, index) => (
                                    <tr key={appointment.bookAppointmentId}>
                                        <th scope="row">{index + 1}</th>
                                        <td>
                                            {appointmentSlots[appointment.appointmentSlotId] ? 
                                                appointmentSlots[appointment.appointmentSlotId].date : 
                                                'Fetching...'
                                            }
                                        </td>
                                        <td>
                                            {appointmentSlots[appointment.appointmentSlotId] ? 
                                                `${appointmentSlots[appointment.appointmentSlotId].startTime} - ${appointmentSlots[appointment.appointmentSlotId].endTime}` : 
                                                'Fetching...'
                                            }
                                        </td>
                                        <td>
                                        {doctorData[appointmentSlots[appointment.appointmentSlotId].doctorId] ? 
                                                `${doctorData[appointmentSlots[appointment.appointmentSlotId].doctorId].name} ${doctorData[appointmentSlots[appointment.appointmentSlotId].doctorId].surname}` : 
                                                'Fetching...'
                                        }
                                        </td>
                                        <td>{appointment.meetingReason}</td>
                                        <td>{appointment.meetingRequestDescription}</td>
                                        <td>
                                            <button onClick={() => deleteAppointment(appointment.bookAppointmentId)} className="btn btn-danger">Cancel Appointment</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="row-md-5 d-flex justify-content-center">
                <div className="w-75" >
                    <div className="my-5">
                        <h3>My Accepted Appointments</h3>    
                    </div>
                    {errors && <div className="alert alert-danger">{errors}</div>}
                    <div class="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Start Time - End Time</th>
                                    <th scope="col">Doctor</th>
                                    <th scope="col">Meeting Reason</th>
                                    <th scope="col">Meeting Request Desc.</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myPatientAppointments.map((appointment, index) => (
                                    <tr key={appointment.bookAppointmentId}>
                                        <th scope="row">{index + 1}</th>
                                        <td>
                                            {appointmentSlots[appointment.appointmentSlotId] ? 
                                                appointmentSlots[appointment.appointmentSlotId].date : 
                                                'Fetching...'
                                            }
                                        </td>
                                        <td>
                                            {appointmentSlots[appointment.appointmentSlotId] ? 
                                                `${appointmentSlots[appointment.appointmentSlotId].startTime} - ${appointmentSlots[appointment.appointmentSlotId].endTime}` : 
                                                'Fetching...'
                                            }
                                        </td>
                                        <td>
                                            {doctorData[appointmentSlots[appointment.appointmentSlotId].doctorId] ? 
                                                `${doctorData[appointmentSlots[appointment.appointmentSlotId].doctorId].name} ${doctorData[appointmentSlots[appointment.appointmentSlotId].doctorId].surname}` : 
                                                'Fetching...'
                                            }
                                        </td>
                                        <td>{appointment.meetingReason}</td>
                                        <td>{appointment.meetingRequestDescription}</td>
                                        <td>{appointment.isCanceled ? 'CANCELED':'Ongoing'}</td>
                                        {!appointment.isCanceled && (
                                            <td>
                                                <button className="btn btn-danger btn-sm" onClick={() => cancelAppointmentFromPatient(appointment.bookAppointmentId)} >Cancel Appointment</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyPatientAppointments;
