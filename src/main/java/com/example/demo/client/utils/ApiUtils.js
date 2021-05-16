const CHAT_SERVICE = "http://localhost:8080";

const request = (options) => {
  const headers = new Headers();

  if (options.setContentType !== false) {
    headers.append("Content-Type", "application/json");
  }

  if (localStorage.getItem("accessToken")) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem("accessToken")
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export function getUsers() {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  // return request({
  //   url: AUTH_SERVICE + "/users/summaries",
  //   method: "GET",
  // });

  return $.getJSON('')

}

export function countNewMessages(senderId, recipientId) {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  // return request({
  //   url: CHAT_SERVICE + "/messages/" + senderId + "/" + recipientId + "/count",
  //   method: "GET",
  // });
  $.getJSON("/messages" + senderId + "/" + recipientId + "/count", function(data) {
    return data;
  });
}

export function findChatMessages(senderId, recipientId) {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  // return request({
  //   url: CHAT_SERVICE + "/messages/" + senderId + "/" + recipientId,
  //   method: "GET",
  // });
  $.getJSON("/messages/" + senderId + "/" + recipientId, function(data) {
    return data;
  });
}

export function findChatMessage(id) {
  if (!localStorage.getItem("accessToken")) {
    return Promise.reject("No access token set.");
  }

  // return request({
  //   url: CHAT_SERVICE + "/messages/" + id,
  //   method: "GET",
  // });
  $.getJSON("/messages/" + id, function(data) {
    return data;
  })
}

export function getCurrentTime() {
  return new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
}