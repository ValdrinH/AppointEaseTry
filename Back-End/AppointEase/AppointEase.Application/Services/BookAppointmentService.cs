﻿using AppointEase.Application.Contracts.Interfaces;
using AppointEase.Application.Contracts.Models.Operations;
using AppointEase.Application.Contracts.Models.Request;
using AppointEase.Data.Contracts.Interfaces;
using AppointEase.Data.Contracts.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppointEase.Application.Services
{
    public class BookAppointmentService : IBookAppointmentService
    {
        private readonly IRepository<BookAppointment> _bookappointmentRepository;
        private readonly IRepository<AppointmentSlot> _appointmentSlotRepository;
        private readonly IMapper _mapper;
        private readonly IApplicationExtensions _common;
        private readonly IOperationResult _operationResult;
        public BookAppointmentService(IMapper mapper, IApplicationExtensions common, IOperationResult operationResult, IRepository<BookAppointment> bookappointmentReposiotry, IRepository<AppointmentSlot> appointmentSlotRepository)
        {
            _mapper = mapper;
            _common = common;
            _operationResult = operationResult;
            _bookappointmentRepository = bookappointmentReposiotry;
            _appointmentSlotRepository = appointmentSlotRepository;
        }
        public async Task<OperationResult> CreateBookAppointment(BookAppointmentRequest bookappointment)
        {
            try
            {
                var appointmentSlot = await _appointmentSlotRepository.GetByIdAsync(bookappointment.AppointmentSlotId);
                if (appointmentSlot == null)
                {
                    return _operationResult.ErrorResult($"Failed to book appointment: Appointment slot with ID {bookappointment.AppointmentSlotId} not found.", new[] { "Appointment slot not found." });
                }
                else if (appointmentSlot.IsBooked)
                {
                    return _operationResult.ErrorResult($"Failed to book appointment: Appointment slot is already booked.", new[] { "Appointment slot is already booked." });
                }

                var appointments = _mapper.Map<BookAppointment>(bookappointment);
                await _bookappointmentRepository.AddAsync(appointments);

                // Mark the corresponding appointment slot as booked
                appointmentSlot.IsBooked = true;
                await _appointmentSlotRepository.UpdateAsync(appointmentSlot);

                return _operationResult.SuccessResult("Appointment Created Successfully!");
            }
            catch (FluentValidation.ValidationException validationException)
            {
                return _operationResult.ErrorResult("Failed to create appointment: Validation error ", validationException.Errors.Select(e => e.ErrorMessage));
            }
            catch (Exception exception)
            {
                _common.AddErrorMessage($"Error creating Appointment: {exception.Message}");
                return _operationResult.ErrorResult($"Failed to create Appointment:", new[] { exception.Message });
            }
        }
        public async Task<IEnumerable<BookAppointmentRequest>> GetAllBookAppointment()
        {
            try
            {
                var bookappointment = await _bookappointmentRepository.GetAllAsync();
                var bookappointmentRequests = _mapper.Map<IEnumerable<BookAppointmentRequest>>(bookappointment);

                // Your additional logic (if any) after getting all appointment slots

                return bookappointmentRequests;
            }
            catch (Exception exception)
            {
                _common.AddErrorMessage($"Error getting all Appointments: {exception.Message}");
                throw; // You may want to handle this exception according to your application requirements
            }
        }

        public async Task<BookAppointmentRequest> GetBookAppointmentById(string id)
        {
            try
            {
                var bookappointment = await _bookappointmentRepository.GetByIdAsync(id);
                var bookappointmentRequest = _mapper.Map<BookAppointmentRequest>(bookappointment);

                // Your additional logic (if any) after getting the appointment slot by ID

                return bookappointmentRequest;
            }
            catch (Exception exception)
            {
                _common.AddErrorMessage($"Error getting AppointmentS by ID: {exception.Message}");
                throw; // You may want to handle this exception according to your application requirements
            }
        }
        public async Task<OperationResult> UpdateBookAppointment(string id, BookAppointmentRequest bookappointmentRequest)
        {
            try
            {
                var existingBookAppointment = await _bookappointmentRepository.GetByIdAsync(id);

                if (existingBookAppointment != null)
                {
                    // Retrieve the existing and new appointment slot IDs
                    var existingAppointmentSlotId = existingBookAppointment.AppointmentSlotId;
                    var newAppointmentSlotId = bookappointmentRequest.AppointmentSlotId;

                    // Retrieve the existing and new appointment slots
                    var existingAppointmentSlot = await _appointmentSlotRepository.GetByIdAsync(existingAppointmentSlotId);
                    var newAppointmentSlot = await _appointmentSlotRepository.GetByIdAsync(newAppointmentSlotId);

                    // Ensure the new appointment slot exists
                    if (newAppointmentSlot == null)
                    {
                        return _operationResult.ErrorResult($"Failed to update Appointment: Appointment slot with ID {newAppointmentSlotId} not found.", new[] { "Appointment slot not found." });
                    }

                    // Update IsBooked status in the appointment slots
                    existingAppointmentSlot.IsBooked = false;
                    newAppointmentSlot.IsBooked = true;

                    // Update appointment slot statuses in the database
                    await _appointmentSlotRepository.UpdateAsync(existingAppointmentSlot);
                    await _appointmentSlotRepository.UpdateAsync(newAppointmentSlot);

                    // Update properties based on the request
                    _mapper.Map(bookappointmentRequest, existingBookAppointment);

                    // Update the booked appointment
                    await _bookappointmentRepository.UpdateAsync(existingBookAppointment);

                    return _operationResult.SuccessResult("Appointment Updated Successfully!");
                }
                else
                {
                    return _operationResult.ErrorResult("Failed to update Appointment:", new[] { "Appointment not found!" });
                }
            }
            catch (FluentValidation.ValidationException validationException)
            {
                return _operationResult.ErrorResult("Failed to update appointment: Validation error ", validationException.Errors.Select(e => e.ErrorMessage));
            }
            catch (Exception exception)
            {
                _common.AddErrorMessage($"Error updating Appointment: {exception.Message}");
                return _operationResult.ErrorResult($"Failed to update Appointment:", new[] { exception.Message });
            }
        }

        public async Task<OperationResult> DeleteBookAppointment(string id)
        {
            try
            {
                await _bookappointmentRepository.DeleteAsync(id);

                // Your additional logic (if any) after deleting the appointment slot

                return _operationResult.SuccessResult("Appointment Deleted Successfully!");
            }
            catch (Exception exception)
            {
                _common.AddErrorMessage($"Error deleting Appointment: {exception.Message}");
                return _operationResult.ErrorResult($"Failed to delete Appointment:", new[] { exception.Message });
            }
        }
    }
}
