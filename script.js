(function (extensionId) {
  function getButtons() {
    return document
      .getElementById("menu-container")
      ?.querySelector("#top-level-buttons-computed");
  }

  function getLikeButton() {
    return getButtons().children[0];
  }

  function getDislikeButton() {
    return getButtons().children[1];
  }

  function isVideoLiked() {
    return getLikeButton().classList.contains("style-default-active");
  }

  function isVideoDisliked() {
    return getDislikeButton().classList.contains("style-default-active");
  }

  function isVideoNotLiked() {
    return getLikeButton().classList.contains("style-text");
  }

  function isVideoNotDisliked() {
    return getDislikeButton().classList.contains("style-text");
  }

  function getState() {
    if (isVideoLiked()) {
      return "liked";
    }
    if (isVideoDisliked()) {
      return "disliked";
    }
    return "neutral";
  }

  function setLikes(likesCount) {
    getButtons().children[0].querySelector("#text").innerText = likesCount;
  }

  function setDislikes(dislikesCount) {
    getButtons().children[1].querySelector("#text").innerText = dislikesCount;
  }

  function setState() {
    chrome.runtime.sendMessage(
      extensionId,
      {
        message: "set_state",
        videoId: getVideoId(window.location.href),
        state: getState(),
      },
      function (response) {
        if (response != undefined) {
          const formattedDislike = numberFormat(response.dislikes);
          setDislikes(formattedDislike);
          createRateBar(response.likes, response.dislikes);
        } else {
        }
      }
    );
  }

  function likeClicked() {
  }

  function dislikeClicked() {
  }

  function setInitalState() {
    setState();
  }

  function getVideoId(url) {
    const urlObject = new URL(url);
    const videoId = urlObject.searchParams.get("v");
    return videoId;
  }

  function isVideoLoaded() {
    const videoId = getVideoId(window.location.href);
    return (
      document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null
    );
  }

  function numberFormat(numberState) {
    const userLocales = navigator.language;
    const formatter = Intl.NumberFormat(userLocales, { notation: "compact" });
    return formatter.format(numberState);
  }

  var jsInitChecktimer = null;

  function setEventListeners(evt) {
    function checkForJS_Finish() {
      if (getButtons()?.offsetParent && isVideoLoaded()) {
        clearInterval(jsInitChecktimer);
        jsInitChecktimer = null;
        const buttons = getButtons();
        if (!window.dislikeButtonlistenersSet) {
          buttons.children[0].addEventListener("click", likeClicked);
          buttons.children[1].addEventListener("click", dislikeClicked);
          window.dislikeButtonlistenersSet = true;
        }
        setInitalState();
      }
    }

    if (window.location.href.indexOf("watch?") >= 0) {
      jsInitChecktimer = setInterval(checkForJS_Finish, 111);
    }
  }

  function createRateBar(likes, dislikes) {
    var rateBar = document.getElementById(
      "dislike-bar-container"
    );
    const widthPx =
      getButtons().children[0].clientWidth +
      getButtons().children[1].clientWidth;

    const widthPercent =
      likes + dislikes > 0 ? (likes / (likes + dislikes)) * 100 : 50;

    if (!rateBar) {
      document.getElementById("menu-container").insertAdjacentHTML(
        "beforeend",
        `<div id="dislike-bar-container" 
                  style="width: ${widthPx}px; 
                  height: 3px; margin-left: 6px;">
                  <div id="dislike-bar" style="width: ${widthPercent}%; height: 100%" ></div>
                </div>`
      );
    } else {
      document.getElementById(
        "dislike-bar-container"
      ).style.width = widthPx + "px";
      document.getElementById("dislike-bar").style.width =
        widthPercent + "%";
    }
  }

  setEventListeners();

  document.addEventListener("yt-navigate-finish", function (event) {
    if (jsInitChecktimer !== null) clearInterval(jsInitChecktimer);
    window.dislikeButtonlistenersSet = false;
    setEventListeners();
  });

})(document.currentScript.getAttribute("extension-id"));
