import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import MessageComponent from '../Messages/MessageComponent';

const BookAppointment = (userId) => {
  const UserId = userId.userId;
  const { doctorId } = useParams();
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointmentSlotId, setSelectedAppointmentSlotId] = useState('');
  const [meetingReason, setMeetingReason] = useState('');
  const [meetingRequestDescription, setMeetingRequestDescription] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);
  const [responseDateTime, setResponseDateTime] = useState(null);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [errorMessage, setErrorMessage]=useState(null);

  useEffect(() => {
    fetchAppointmentSlots();
  }, [doctorId, UserId]);

  const fetchAppointmentSlots = async () => {
    try {
      const response = await fetch(`https://localhost:7207/api/AppointmentSlot/ByDoctorId?doctorId=${doctorId}`);
      if (response.ok) {
        const data = await response.json();
        setAppointmentSlots(data);
      } else {
        console.error('Failed to fetch appointment slots:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching appointment slots:', error);
    }
  };

  const filteredAppointments = appointmentSlots.filter(slot => {
    const slotDate = moment.utc(`${slot.date} ${slot.startTime}`, 'YYYY-MM-DDTHH:mm:ss').toDate();
    return moment(slotDate).isSame(selectedDate, 'day');
  });

  const handleAppointmentSlotSelect = (event) => {
    const selectedId = event.target.value; // Extracting the id part from appointmentSlotId
    setSelectedAppointmentSlotId(selectedId);
};


const bookAppointment = async () => {
  setIsBookingInProgress(true);
  try {
      const requestBody = {
          appointmentSlotId: selectedAppointmentSlotId,
          patientId: UserId,
          meetingReason,
          meetingRequestDescription,
          isAccepted,
          responseDateTime
      };

      // Create appointment
      const response = await fetch('https://localhost:7207/api/BookAppointment/CreateBookAppointment', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.succeeded === true) {
          console.log('Operation succeeded: true');
          setErrorMessage(responseData);
          console.log(responseData);
          window.location.href='/my-patient-appointments';
        } else {
          console.log('Operation succeeded: false');
          setErrorMessage(responseData);
          console.log(responseData);
        }
      } else {
          console.error('Failed to book appointment:', response.statusText);
          console.log('Request body:', JSON.stringify(requestBody));
      }
  } catch (error) {
      console.error('Error booking appointment:', error);
      alert('An error occurred while booking the appointment. Please try again later.');
  } finally {
      setIsBookingInProgress(false);
  }
};
const [doctorDetails, setDoctorDetails] = useState(null);
useEffect(() => {
  const fetchDoctorDetails = async () => {
    try {
      const response = await fetchDoctorById(doctorId);
      if (response) {
        setDoctorDetails(response); // Set the doctorDetails state
        console.log("doctor", doctorDetails)
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  fetchDoctorDetails();
}, [doctorId]);
const fetchDoctorById = async (doctorId) => {
  try {
    const response = await fetch(`https://localhost:7207/api/Doctor/GetDoctorById?doctorId=${doctorId}`);
    if (response.ok) {
      const data = await response.json();
      return data; // Assuming this returns {name, surname} for the doctor
    } else {
      console.error('Failed to fetch doctor details:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching doctor details:', error);
  }
  return null; // In case of error, return null
};

return (
  <Container>
      <Row className="align-items-center" style={{display:'flex', justifyContent:'center', marginTop:'-7%'}}>
        <Col md={4} className="text-center" style={{width:'15%'}}>
          {doctorDetails && doctorDetails.photoFormat && doctorDetails.photoData && (
            <img 
              src={`data:image/${doctorDetails.photoFormat};base64,${doctorDetails.photoData}`} 
              className="img-fluid img-thumbnail" 
              alt="Doctor's Photo" 
              style={{ 
                Width: '10%', 
                Height: '10%', 
              }} 
            />
          )}
        </Col>
        <Col md={8} style={{width:'auto'}}> 
          {doctorDetails && (
            <div>
              <h5>{`${doctorDetails.name} ${doctorDetails.surname}`}</h5>
            </div>
          )}
        </Col>
      </Row>
    <Row>
      <Col md={5} className="text-center">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
        />
      </Col>
      <Col md={7}>
        <Form>
          <Form.Group controlId="appointmentSlotSelect" className="mb-3">
            <Form.Control as="select" value={selectedAppointmentSlotId} onChange={handleAppointmentSlotSelect}>
              <option value="">Select Appointment Slot</option>
              {filteredAppointments.map(appointment => (
                <option key={appointment.appointmentSlotId} value={appointment.appointmentSlotId} disabled={appointment.isBooked || moment.utc().isAfter(moment.utc(`${appointment.date} ${appointment.startTime}`))}>
                {`${appointment.startTime}-${appointment.endTime}`}
              </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="meetingReason" className="mb-3">
            <Form.Control type="text" placeholder="Enter meeting reason" value={meetingReason} onChange={(e) => setMeetingReason(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="meetingRequestDescription" className="mb-3">
            <Form.Control as="textarea" rows={3} placeholder="Enter meeting request description" value={meetingRequestDescription} onChange={(e) => setMeetingRequestDescription(e.target.value)} />
          </Form.Group>
          <Button variant="primary" onClick={bookAppointment} disabled={!selectedAppointmentSlotId || isBookingInProgress}>
            {isBookingInProgress ? 'Booking...' : 'Book Appointment'}
          </Button>
        </Form>
      </Col>
    </Row>
  </Container>
);


};

export default BookAppointment;