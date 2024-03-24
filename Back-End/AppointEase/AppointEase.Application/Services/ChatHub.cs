﻿using AppointEase.Application.Contracts.Interfaces;
using AppointEase.Application.Contracts.Models.Hub;
using AppointEase.Application.Contracts.Models.Request;
using AppointEase.Data.Contracts.Identity;
using AppointEase.Data.Contracts.Models;
using AutoMapper;
using Microsoft.AspNet.SignalR.Messaging;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppointEase.Application.Services
{
    public class ChatHub : Hub
    {
        private readonly IChatMessagesService _chatMessagesService;
        private readonly IHubUserService _hubServices;
        private readonly UserManager<ApplicationUser> _userManager;

        public ChatHub(IChatMessagesService chatMessagesService, IHubUserService hubServices, UserManager<ApplicationUser> userManager)
        {
            _chatMessagesService = chatMessagesService;
            _hubServices = hubServices;
            _userManager = userManager;
        }
        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public async Task SendMessage(MessageRequest messageRequest)
        {
            await _chatMessagesService.SendMessageAsync(messageRequest);
            var getAllHubUser = await _hubServices.GetAllUsers();

            var GetUsers = getAllHubUser.Where(u => u.UserId.Contains(messageRequest.SenderId) || u.UserId == messageRequest.ReceiverId);

            var senderUser = await _userManager.FindByIdAsync(messageRequest.SenderId);
            var senderName = (senderUser == null) ? "User" : senderUser.UserName;
            var receiverUser = await _userManager.FindByIdAsync(messageRequest.ReceiverId);
            var receiverName = (receiverUser == null) ? "User" : receiverUser.UserName;

            var messageRespons = new
            {
                sender = messageRequest.SenderId,
                receiver = messageRequest.ReceiverId,
                senderName = senderName,
                receiverName = receiverName,
                content = messageRequest.Message,
                timestamp = messageRequest.Timestamp
            };

            foreach (var user in GetUsers)
            {
                var list = Clients.Client(user.ConnectionId);
                if(list != null)
                {
                    await Clients.Clients(user.ConnectionId).SendAsync("ReceiveMessage", messageRespons);
                }
                
            }
        }
        public async Task JoinUser(string userId,string connectionId)
        {
            var user = new HubUser()
            {
                UserId = userId,
                ConnectionId = connectionId,
                TimeStamp = DateTime.UtcNow
            };
            await _hubServices.AddUserToHub(user);
        }

        public async Task NotifyTyping(string userId, bool isTyping)
        {
            var getAllHubUser = await _hubServices.GetAllUsers();

            var GetUsers = getAllHubUser.Where(u => u.UserId.Contains(userId));
            foreach (var user in GetUsers)
            {
                var list = Clients.Client(user.ConnectionId);
                if (list != null)
                {
                    var typingStatus = isTyping;
                    await Clients.Clients(user.ConnectionId).SendAsync("SetIsTyping", typingStatus);
                }

            }

        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var connectionId = Context.ConnectionId;
            var users = await _hubServices.GetAllUsers();
            var usersToRemove = users.Where(u => u.ConnectionId.Contains(connectionId)).ToList();

            foreach (var user in usersToRemove)
            {
                await _hubServices.RemoveUser(user.UserId);
                Console.WriteLine(user.ConnectionId + " has been removed");
            }
            await base.OnDisconnectedAsync(exception);
        }



    }
}
