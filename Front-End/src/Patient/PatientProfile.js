import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import MessageComponent from '../Messages/MessageComponent';

const PatientProfile = ({ userId }) => {
  const [message, setMessage] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({
    userName: '',
    name: '',
    surname: '',
    email: '',
    address: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
  });
  const [formData, setFormData] = useState({
    userName: '',
    name: '',
    surname: '',
    personalNumber: '',
    email: '',
    address: '',
    phoneNumber: '',
    password: null,
    gender: '',
    dateOfBirth: '',
    role: 'Patient',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://localhost:7207/api/Patient/GetPatientById/?patientId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const patientData = await response.json();
          setFormData(patientData);
        } else {
          console.error('Failed to fetch patient data:', response.statusText);
        }
      } catch (error) {
        console.error('Error during fetching patient data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevPatient) => ({
      ...prevPatient,
      [name]: value
    }));

    // Validate each field as it's being typed
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation of data before submitting the form
    const errors = {};
    Object.keys(formData).forEach((fieldName) => {
      validateField(fieldName, formData[fieldName]);
    });
    setFormErrors(errors);

    // If there are no errors, then submit the form
    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch(`https://localhost:7207/api/Patient/UpdatePatient/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          console.log(response.statusText);
          const responseData = await response.json();
          setApiMessage(responseData);
          setMessage(true);
        } else {
          console.error('Failed to update Patient:', response.statusText);
        }
      } catch (error) {
        console.error('Error during update:', error);
      }
    }
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'userName':
      case 'name':
      case 'surname':
      case 'address':
      case 'gender':
        setFormErrors({
          ...formErrors,
          [fieldName]: value ? '' : `${fieldName} is required`,
        });
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setFormErrors({
          ...formErrors,
          email: emailRegex.test(value)
            ? ''
            : 'Please enter a valid email address (e.g., example@example.com)',
        });
        break;
        case 'dateOfBirth':
            const currentDate = new Date();
            const inputDate = new Date(value);
            const ageDifference = currentDate.getFullYear() - inputDate.getFullYear();
            const hasReachedMinimumAge = ageDifference > 18 || (ageDifference === 18 && currentDate.getMonth() >= inputDate.getMonth() && currentDate.getDate() >= inputDate.getDate());

            if (!value || !hasReachedMinimumAge) {
                setFormErrors({
                ...formErrors,
                dateOfBirth: 'You must be at least 18 years old to register',
                });
            } else {
                setFormErrors({
                ...formErrors,
                dateOfBirth: '',
                });
            }
        break;
        case 'personalNumber':
            if (!value || value.length !== 10 || !/^\d+$/.test(value)) {
              setFormErrors({
                ...formErrors,
                personalNumber: 'Personal number must be 10 digits long and contain only numbers',
              });
            } else {
              setFormErrors({
                ...formErrors,
                personalNumber: '',
              });
            }
            break;
            case 'phoneNumber':
                if (!value || !/^\d+$/.test(value)) {
                  setFormErrors({
                    ...formErrors,
                    phoneNumber: 'Phone number must contain only numbers',
                  });
                } else {
                  setFormErrors({
                    ...formErrors,
                    phoneNumber: '',
                  });
                }
            break;
      default:
        break;
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          photoData: reader.result.split(",")[1],
          photoFormat: file.type.split("/")[1],
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="col-py-9">
      <div className="row-md-1">
        <Sidebar userRole='Patient' />
      </div>
      <div className="row-md-5 d-flex justify-content-center">
        <div className="w-75">
          <div className="my-5">
            <h3>Patient Profile</h3>
            <hr />
          </div>
          {message && (
            <MessageComponent message={apiMessage}/>
          )}
          <form className="file-upload" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" className="form-control" name="userName" value={formData.userName} onChange={handleChange} />
              {formErrors.userName && <div className="text-danger">{formErrors.userName}</div>}
            </div>
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
              {formErrors.name && <div className="text-danger">{formErrors.name}</div>}
            </div>
            <div className="form-group">
              <label>Surname</label>
              <input type="text" className="form-control" name="surname" value={formData.surname} onChange={handleChange} />
              {formErrors.surname && <div className="text-danger">{formErrors.surname}</div>}
            </div>
            <div className="form-group">
              <label>Personal Number</label>
              <input type="text" className="form-control" name="personalNumber" value={formData.personalNumber} onChange={handleChange} />
              {formErrors.personalNumber && <div className="text-danger">{formErrors.personalNumber}</div>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
              {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
              {formErrors.address && <div className="text-danger">{formErrors.address}</div>}
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              {formErrors.phoneNumber && <div className="text-danger">{formErrors.phoneNumber}</div>}
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select className="form-control" name="gender" value={formData.gender} onChange={handleChange}>
                <option>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {formErrors.gender && <div className="text-danger">{formErrors.gender}</div>}
            </div>
            <div className="form-group">
              <label>Date of Birth</label>              
              <input type="date" className="form-control" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
              {formErrors.dateOfBirth && <div className="text-danger">{formErrors.dateOfBirth}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="photo">Photo:</label>
              <input type="file" id="photo" name="photo" accept="image/*" onChange={handlePhotoChange} />
            </div>
            <button type="submit" className="btn btn-primary w-100">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;

