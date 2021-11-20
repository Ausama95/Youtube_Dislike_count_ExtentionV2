const apiUrl = "https://return-youtube-dislike-api.azurewebsites.net";
chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    if (request.message === "get_auth_token") {

    } else if (request.message === "log_off") {

    } else if (request.message == "set_state") {

      let token = "";
      fetch(`${apiUrl}/votes?videoId=${request.videoId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          sendResponse(response);
        })
        .catch();
      return true;
    } else if (request.message == "send_links") {
      toSend = toSend.concat(request.videoIds.filter((x) => !sentIds.has(x)));
      if (toSend.length >= 20) {
        fetch(`${apiUrl}/votes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toSend),
        });
        for (const toSendUrl of toSend) {
          sentIds.add(toSendUrl);
        }
        toSend = [];
      }
    }
  }
);
const sentIds = new Set();
let toSend = [];
