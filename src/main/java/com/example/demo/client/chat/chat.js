const url = 'http://localhost:8080';
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
}

function sendMessage(msg) {
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