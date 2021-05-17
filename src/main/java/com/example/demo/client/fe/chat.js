const url = 'http://localhost:8081';
let stompClient;
let selectedUser;
let currentUser;
let newMessages = new Map();


function connect(event) {
    // const Stomp = require("stompjs");
    // var SockJS = require("sockjs-client");
    // SockJS = new SockJS("/ws");
    // stompClient = Stomp.over(SockJS);
    // stompClient.connect({}, onConnected, onError);
    console.log("connecting to chat...")
    let socket = new SockJS("/ws");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onerror);
}

function onConnected(msg) {
    console.log("connected");
    stompClient.subscribe("/user" + currentUser.id + "queue/messages", onMessageReceived);
}

function onMessageReceived(data) {
    var notification = JSON.parse(data.body);
    if(selectedUser.id == notification.senderId) {
        render(data, selectedUser.id);
    }
    else {
        newMessages.set(data.fromLogin, data.message);
        $('#userNameAppender_' + data.fromLogin).append('<span id="newMessage_' + data.fromLogin + '" style="color: red">+1</span>');
    }
}

function sendMsg(msg) {
    if(msg.trim() !== "") {
        const message = {
            senderId: currentUser.id,
            recipientId: selectedUser.id,
            senderName: currentUser.name,
            recipientName: selectedUser.name,
            content: msg,
            timestamp: new Date(),
        };
        stompClient.send("/app/chat", {}, JSON.stringify(message));
    }

}

//Find user by name
function findUser(username) {
    $.getJSON(url + "/users/" + username, function (response) {
        let users = JSON.parse(response);
        let usersTemplateHTML = "";
        for (let i = 0; i < users.length; i++) {
            usersTemplateHTML = usersTemplateHTML + '<a href="#" onclick="selectUser(\'' + users[i] + '\')"><li class="clearfix">\n' +
                '                <img src="https://rtfm.co.ua/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png" width="55px" height="55px" alt="avatar" />\n' +
                '                <div class="about">\n' +
                '                    <div id="userNameAppender_' + users[i].userId + '" class="name">' + users[i].userName + '</div>\n' +
                '                    <div class="status">\n' +
                '                        <i class="fa fa-circle offline"></i>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '            </li></a>';
        }
        $('#usersList').html(usersTemplateHTML);
    })
}

//Get user to chat
function selectUser(user) {
    console.log("selecting users: " + user.userName);
    selectedUser = user;
    let isNew = document.getElementById("newMessage_" + user.userId) !== null;
    if (isNew) {
        let element = document.getElementById("newMessage_" + user.userId);
        element.parentNode.removeChild(element);
        render(newMessages.get(userName), userName);
    }
    $('#selectedUserId').html('');
    $('#selectedUserId').append('Chat with ' + userName);
}

//Get all user whom not be blocked
function fetchAll() {
    $.get(url + "/fetchAllUsers", function (response) {
        let users = response;
        let usersTemplateHTML = "";
        for (let i = 0; i < users.length; i++) {
            usersTemplateHTML = usersTemplateHTML + '<a href="#" onclick="selectUser(\'' + users[i] + '\')"><li class="clearfix">\n' +
                '                <img src="https://rtfm.co.ua/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png" width="55px" height="55px" alt="avatar" />\n' +
                '                <div class="about">\n' +
                '                    <div id="userNameAppender_' + users[i] + '" class="name">' + users[i] + '</div>\n' +
                '                    <div class="status">\n' +
                '                        <i class="fa fa-circle offline"></i>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '            </li></a>';
        }
        $('#usersList').html(usersTemplateHTML);
    });
}

function registration() {
    let userName = document.getElementById("userName").value;
    $.get(url + "/registration/" + userName, function (response) {
        connect();
    }).fail(function (error) {
        if (error.status === 400) {
            alert("Login is already busy!")
        }
    })
}