import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Offcanvas, Button } from "react-bootstrap";
import bg1 from "./Images/4.png"
import { LuLayoutDashboard } from "react-icons/lu";
import { CiBookmarkPlus } from "react-icons/ci";
import { MdMedicalInformation } from "react-icons/md";
import { FaUserDoctor,FaNewspaper,FaUserLarge } from "react-icons/fa6";
import { FaClinicMedical } from "react-icons/fa";

 
const Sidebar = ({ userRole }) => {
  const location = useLocation();
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [userData, setUserData] = useState(null);
  const [photo,setPhotoData] = useState('No Image');
  const [photoformat,SetPhotoFormat] = useState('No Image');
  const name = localStorage.getItem("name");
  const surname = localStorage.getItem("surname");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setPhotoData(localStorage.getItem("photodata"));
    SetPhotoFormat(localStorage.getItem("photoformat"));

  }, []);
  

  const handleOffCanvasToggle = () => {
    setShowOffCanvas(!showOffCanvas);
  };

  return (
    <>
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-transparent" style={{ width: "80px" }}>
            <button className="btn btn-primary rounded-circle d-block d-md-block mb-2" style={{ padding: "0px" }} onClick={handleOffCanvasToggle}>
                <span className="fs-3">☰</span>
            </button>
        </div>
        <Offcanvas show={showOffCanvas} onHide={handleOffCanvasToggle}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
            <div className="mt-3 text-center position-relative">
            <div className="rounded-circle overflow-hidden d-inline-block" style={{ width: '150px', height: '150px', backgroundColor: '#f0f0f0' }}>
            <img 
              src={`data:image/${photo};base64,${photoformat}`} 
              className="img-fluid " 
              alt="Doctor's Photo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            </div>
            <p className="mt-2 lead md-5">{name} {surname}</p>
            <hr className="bg-primary"></hr>
          </div>

            {userRole === 'Clinic' && (
          <>
           <div className="list-group mt-3">
               <Link to="/clinci-dashboard" className={`list-group-item py-2 ${location.pathname === '/clinic-dashboard' ? 'active' : ''}`} onClick={handleOffCanvasToggle}>
                    <i className="bi bi-house fs-4 me-2"></i>
                    <LuLayoutDashboard className="mr-2"></LuLayoutDashboard>
                    <span>Dashboard</span>
                </Link>
                <Link to="/appointment-slot-list" className={`list-group-item py-2 ${location.pathname === '/appointment-slot-list' ? 'active' : ''}`} onClick={handleOffCanvasToggle}>
                    <i className="bi bi-house fs-4 me-2"></i>
                   <CiBookmarkPlus className="mr-2"></CiBookmarkPlus>
                    <span>Appointments</span>
                </Link>
                <Link to="/consultations" className={`list-group-item py-2 ${location.pathname === '/consultations' ? 'active' : ''}`} onClick={handleOffCanvasToggle}>
                    <i className="bi bi-house fs-4 me-2"></i>
                     <MdMedicalInformation className="mr-2" />
                    <span>Consultations</span>
                </Link>
                <Link to="/news" className={`list-group-item py-2 ${location.pathname === '/news' ? 'active' : ''}`} onClick={handleOffCanvasToggle}>
                    <i className="bi bi-house fs-4 me-2"></i>
                    <FaNewspaper className="mr-2"/>
                    <span>News</span>
                </Link>
                <Link to="/doctor-list" className={`list-group-item py-2 ${location.pathname === '/doctor-list' ? 'active' : ''}`} onClick={handleOffCanvasToggle}>
                    <i className="bi bi-house fs-4 me-2"></i>
                    <FaUserDoctor className="mr-2"/>
                    <span>Doctors</span>
                </Link>
                <Link to="/clinic-profile" className={`list-group-item py-2 ${location.pathname === '/clinic-profile' ? 'active' : ''}`} onClick={handleOffCanvasToggle}>
                    <i className="bi bi-person fs-4 me-2"></i>
                     <FaUserLarge className="mr-2"/>
                    <span>Clinic Profile</span>
                </Link>
            </div>
          </>)}
          {userRole === 'Patient' && (
          <>
          <div className="list-group mt-3">
          <Link to="/patient-dashboard" className={`list-group-item py-2 ${location.pathname === '/patient-dashboard' ? 'active' : ''}`} onClick={handleOffCanvasToggle}>
                    <i className="bi bi-house fs-4 me-2"></i>
                    <LuLayoutDashboard className="mr-2"></LuLayoutDashboard>
                    <span>Dashboard</span>
                </Link>
            <Link to="/search-list" className={`list-group-item py-2 ${location.pathname === '/search-list' ? 'active' : ''}`}>
              <i className="bi bi-house fs-4 me-2"></i>
              <CiBookmarkPlus className="mr-2"></CiBookmarkPlus>
              <span>Appointments</span>
            </Link>
            <Link to="/consultations" className={`list-group-item py-2 ${location.pathname === '/consultations' ? 'active' : ''}`}>
              <i className="bi bi-house fs-4 me-2"></i>
              <MdMedicalInformation className="mr-2" />
              <span>Consultations</span>
            </Link>
            <Link to="/news" className={`list-group-item py-2 ${location.pathname === '/news' ? 'active' : ''}`}>
              <i className="bi bi-house fs-4 me-2"></i>
              <FaNewspaper className="mr-2"/>
              <span>News</span>
            </Link>
            <Link to="/patient-profile" className={`list-group-item py-2 ${location.pathname === '/patient-profile' ? 'active' : ''}`}>
              <i className="bi bi-person fs-4 me-2"></i>
              <FaUserLarge className="mr-2"/>
              <span>Patient Profile</span>
            </Link>
          </div>

          </>
        )}
        {userRole === 'Doctor' && (
          <>
          <div className="list-group mt-3">
          <Link to="/patient-dashboard" className={`list-group-item py-2 ${location.pathname === '/patient-dashboard' ? 'active' : ''}`} onClick={handleOffCanvasToggle}>
              <i className="bi bi-house fs-4 me-2"></i>
              <span>Dashboard</span>
              </Link>
            <Link to="/book-appointment-requests" className={`list-group-item py-2 ${location.pathname === '/book-appointment-requests' ? 'active' : ''}`}>
              <i className="bi bi-house fs-4 me-2"></i>
              <span>Appointment Requests</span>
            </Link>
            <Link to="/my-schedule" className={`list-group-item py-2 ${location.pathname === '/my-schedule' ? 'active' : ''}`}>
              <i className="bi bi-house fs-4 me-2"></i>
              <span>My Schedule</span>
            </Link>
            <Link to="/consultations" className={`list-group-item py-2 ${location.pathname === '/consultations' ? 'active' : ''}`}>
              <i className="bi bi-house fs-4 me-2"></i>
              <span>Consultations</span>
            </Link>
            <Link to="/news" className={`list-group-item py-2 ${location.pathname === '/news' ? 'active' : ''}`}>
              <i className="bi bi-house fs-4 me-2"></i>
              <span>News</span>
            </Link>
          </div>
          </>
        )}     
        </Offcanvas.Body>
        </Offcanvas>
    </>
);

};

export default Sidebar;