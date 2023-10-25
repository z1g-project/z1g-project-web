(e=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.innerText=e,document.head.appendChild(t)})(".chat-gpt-container{max-width:369px;margin-bottom:30px;border-radius:8px;border:1px solid #dadce0;padding:15px;flex-basis:0;flex-grow:1;word-wrap:break-word;white-space:pre-wrap}.chat-gpt-container p{margin:0}.chat-gpt-container .prefix{font-weight:700}.chat-gpt-container .loading{color:#b6b8ba;animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite}@keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}.chat-gpt-container.sidebar-free{margin-left:60px;height:fit-content}.chat-gpt-container pre{white-space:pre-wrap;min-width:0;margin-bottom:0;line-height:20px}.chat-gpt-translate-button{border-radius:8px;border:1px solid #dadce0;padding:5px}.chat-gpt-translate-button:hover{color:#006494;transition:color .1s ease-out}.chat-gpt-translate-button[disabled]{color:#eee}");

(function() {
  "use strict";
  var monkeyWindow = window;
  var GM_info = /* @__PURE__ */ (() => monkeyWindow.GM_info)();
  var GM_setValue = /* @__PURE__ */ (() => monkeyWindow.GM_setValue)();
  var GM_deleteValue = /* @__PURE__ */ (() => monkeyWindow.GM_deleteValue)();
  var GM_addStyle = /* @__PURE__ */ (() => monkeyWindow.GM_addStyle)();
  var GM_registerMenuCommand = /* @__PURE__ */ (() => monkeyWindow.GM_registerMenuCommand)();
  var GM_unregisterMenuCommand = /* @__PURE__ */ (() => monkeyWindow.GM_unregisterMenuCommand)();
  var GM_xmlhttpRequest = /* @__PURE__ */ (() => monkeyWindow.GM_xmlhttpRequest)();
  var GM_getValue = /* @__PURE__ */ (() => monkeyWindow.GM_getValue)();
  function getUserscriptManager() {
    try {
      const userscriptManager = GM_info.scriptHandler;
      return userscriptManager;
    } catch (error) {
      return "other";
    }
  }
  function uuidv4() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 16), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr(s[19] & 3 | 8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
  }
  const lang = navigator.appName == "Netscape" ? navigator.language : navigator.userLanguage;
  let config = {};
  switch (lang) {
    case "zh-CN":
    case "zh-SG":
      config = {
        waitingResponse: "等待 ChatGPT 响应...",
        login: "请在以下地址登录：",
        tooManyRequests: "1小时内请求太多。请稍后再试。",
        checkClouflare: "请通过 Cloudflare 安全检查，地址为",
        unknowError: "哦，可能是个错误，请检查或提交到",
        networkException: "网络异常，请刷新页面。",
        containerPosition: "容器位置 - 侧面(1)/顶部(0): ",
        chatGPTTranslate: "ChatGPT 翻译"
      };
      break;
    case "zh-TW":
    case "zh-HK":
      config = {
        waitingResponse: "等待 ChatGPT 回應...",
        login: "請在以下地址登錄：",
        tooManyRequests: "1小時內請求太多。請稍後再試。",
        checkClouflare: "請通過 Cloudflare 安全檢查，地址為",
        unknowError: "哦，可能是個錯誤，請檢查或提交到",
        networkException: "網路異常，請刷新頁面。",
        containerPosition: "容器位置 - 側面(1)/頂部(0):",
        chatGPTTranslate: "ChatGPT 翻譯"
      };
      break;
    default:
      config = {
        waitingResponse: "Waiting for ChatGPT response...",
        login: "Please login at ",
        tooManyRequests: "Too many requests in 1 hour. Try again later.",
        checkClouflare: "Please pass Cloudflare security check at ",
        unknowError: "Oops, maybe it is a bug, please check or submit ",
        networkException: "Network exception, please refresh the page.",
        containerPosition: "Container Position - Side(1)/Top(0): ",
        chatGPTTranslate: "ChatGPT Translate"
      };
  }
  function i18n(name, param) {
    return config[name] ? config[name].replace("#t#", param) : name;
  }
  const container = document.createElement("div");
  function getContainer() {
    return container;
  }
  function initContainer() {
    const container2 = getContainer();
    container2.className = "chat-gpt-container";
    container2.innerHTML = `<p class="loading">${i18n("waitingResponse")}</p>`;
  }
  function containerShow(answer) {
    const container2 = getContainer();
    container2.innerHTML = '<p><span class="prefix">ChatGPT</span><pre></pre></p>';
    container2.querySelector("pre").textContent = answer;
  }
  function containerAlert(htmlStr) {
    const container2 = getContainer();
    container2.innerHTML = htmlStr;
  }
  function alertLogin() {
    containerAlert(`<p>${i18n("login")}<a href="https://chat.openai.com" target="_blank" rel="noreferrer">chat.openai.com</a></p>`);
  }
  function alertBlockedByCloudflare() {
    containerAlert(`<p>${i18n("checkClouflare")}<a href="https://chat.openai.com" target="_blank" rel="noreferrer">chat.openai.com</a></p>`);
  }
  function alertFrequentRequests() {
    containerAlert(`<p>${i18n("tooManyRequests")}</p>`);
  }
  function isBlockedbyCloudflare(resp) {
    try {
      const html = new DOMParser().parseFromString(resp, "text/html");
      const title = html.querySelector("title");
      return title.innerText === "Just a moment...";
    } catch (error) {
      return false;
    }
  }
  async function getAnswer(question, callback) {
    try {
      const accessToken = await getAccessToken();
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://chat.openai.com/backend-api/conversation",
        headers: {
          "Content-Type": "	application/json",
          Authorization: `Bearer ${accessToken}`
        },
        responseType: responseType(),
        data: JSON.stringify({
          action: "next",
          messages: [
            {
              id: uuidv4(),
              role: "user",
              content: {
                content_type: "text",
                parts: [question]
              }
            }
          ],
          model: "text-davinci-002-render",
          parent_message_id: uuidv4()
        }),
        onloadstart: onloadstart(),
        onload: onload(),
        onerror: function(event) {
          console.error("getAnswer error: ", event);
        },
        ontimeout: function(event) {
          console.error("getAnswer timeout: ", event);
        }
      });
    } catch (error) {
      if (error === "UNAUTHORIZED") {
        removeAccessToken();
        alertLogin();
      }
      console.error("getAnswer error: ", error);
    }
    function responseType() {
      if (getUserscriptManager() === "Tampermonkey") {
        return "stream";
      } else {
        return "text";
      }
    }
    function onload() {
      function finish() {
        if (typeof callback === "function") {
          return callback("finish");
        }
      }
      finish();
      return function(event) {
        if (event.status === 401) {
          removeAccessToken();
          alertLogin();
        }
        if (event.status === 403) {
          alertBlockedByCloudflare();
        }
        if (event.status === 429) {
          alertFrequentRequests();
        }
        if (getUserscriptManager() !== "Tampermonkey") {
          if (event.response) {
            const answer = JSON.parse(event.response.split("\n\n").slice(-3, -2)[0].slice(6)).message.content.parts[0];
            containerShow(answer);
          }
        }
      };
    }
    function onloadstart() {
      if (getUserscriptManager() === "Tampermonkey") {
        return function(stream) {
          const reader = stream.response.getReader();
          reader.read().then(function processText({ done, value }) {
            if (done) {
              return;
            }
            let responseItem = String.fromCharCode(...Array.from(value));
            const items = responseItem.split("\n\n");
            if (items.length > 2) {
              const lastItem = items.slice(-3, -2)[0];
              if (lastItem.startsWith("data: [DONE]")) {
                responseItem = items.slice(-4, -3)[0];
              } else {
                responseItem = lastItem;
              }
            }
            if (responseItem.startsWith("data: {")) {
              const answer = JSON.parse(responseItem.slice(6)).message.content.parts[0];
              containerShow(answer);
            } else if (responseItem.startsWith("data: [DONE]")) {
              return;
            }
            return reader.read().then(processText);
          });
        };
      }
    }
  }
  function removeAccessToken() {
    GM_deleteValue("accessToken");
  }
  function getAccessToken() {
    return new Promise(async (resolve, rejcet) => {
      const accessToken = await GM_getValue("accessToken");
      if (!accessToken) {
        GM_xmlhttpRequest({
          url: "https://chat.openai.com/api/auth/session",
          onload: function(response) {
            if (isBlockedbyCloudflare(response.responseText)) {
              alertLogin();
              return;
            }
            const accessToken2 = JSON.parse(response.responseText).accessToken;
            if (!accessToken2) {
              rejcet("UNAUTHORIZED");
            }
            GM_setValue("accessToken", accessToken2);
            resolve(accessToken2);
          },
          onerror: function(error) {
            rejcet(error);
          },
          ontimeout: () => {
            console.error("getAccessToken timeout!");
          }
        });
      } else {
        resolve(accessToken);
      }
    });
  }
  const _default = "";
  function getWebsite() {
    if (location.hostname.indexOf(".google.") !== -1) {
      return configRequestImmediately("google");
    }
    switch (location.hostname) {
      case "www.bing.com":
      case "cn.bing.com":
        return configRequestImmediately("bing");
      case "www.baidu.com":
        return configRequestImmediately("baidu");
      case "duckduckgo.com":
        return configRequestImmediately("duckduckgo");
      case "www.deepl.com":
        return configRequestAfterClickButton("deepl");
      default:
        throw new Error(`unknow website: ${location.hostname}`);
    }
    function configRequestImmediately(name) {
      return {
        name,
        type: "immediately"
      };
    }
    function configRequestAfterClickButton(name) {
      return {
        name,
        type: "after-click-button"
      };
    }
  }
  function getQuestion() {
    switch (getWebsite().name) {
      case "baidu":
        return new URL(window.location.href).searchParams.get("wd");
      default:
        return new URL(window.location.href).searchParams.get("q");
    }
  }
  function getPosition() {
    return GM_getValue("containerPosition", 1);
  }
  function setPosition(newPosition) {
    GM_setValue("containerPosition", newPosition);
  }
  function initUI() {
    initContainer();
    switch (getWebsite().name) {
      case "google":
        googleInjectContainer();
        break;
      case "bing":
        bingInjectContainer();
        break;
      case "baidu":
        baiduInjectContainer();
        break;
      case "duckduckgo":
        duckduckgoInjectContainer();
        break;
      case "deepl":
        deeplInjectContainer();
        break;
      default:
        alertUnknowError();
    }
    function googleInjectContainer() {
      if (getPosition() === 1) {
        const container2 = getContainer();
        const siderbarContainer = document.getElementById("rhs");
        if (siderbarContainer) {
          siderbarContainer.prepend(container2);
        } else {
          container2.classList.add("sidebar-free");
          document.getElementById("rcnt").appendChild(container2);
        }
      } else {
        GM_addStyle(".chat-gpt-container{max-width: 100%!important}");
        const container2 = getContainer();
        const mainContainer = document.querySelector("#search");
        if (mainContainer) {
          mainContainer.prepend(container2);
        }
      }
    }
    function bingInjectContainer() {
      if (getPosition() === 1) {
        const container2 = getContainer();
        const siderbarContainer = document.getElementById("b_context");
        siderbarContainer.prepend(container2);
      } else {
        GM_addStyle(".chat-gpt-container{max-width: 100%!important}");
        GM_addStyle(".chat-gpt-container{width: 70vw}");
        const container2 = getContainer();
        const mainBarContainer = document.querySelector("main");
        mainBarContainer.prepend(container2);
      }
    }
    function baiduInjectContainer() {
      if (getPosition() === 1) {
        const container2 = getContainer();
        const siderbarContainer = document.getElementById("content_right");
        siderbarContainer.prepend(container2);
      } else {
        GM_addStyle(".chat-gpt-container{max-width: 100%!important}");
        const container2 = getContainer();
        const siderbarContainer = document.querySelector("#content_left");
        siderbarContainer.prepend(container2);
      }
    }
    function duckduckgoInjectContainer() {
      const container2 = getContainer();
      const siderbarContainer = document.getElementsByClassName("results--sidebar")[0];
      siderbarContainer.prepend(container2);
    }
    function deeplInjectContainer() {
      const container2 = getContainer();
      container2.style.maxWidth = "1000px";
      const button = document.createElement("button");
      button.innerHTML = i18n("chatGPTTranslate");
      button.className = "chat-gpt-translate-button";
      document.getElementsByClassName("lmt__textarea_container")[0].appendChild(button);
      button.addEventListener("click", function() {
        initContainer();
        button.disabled = true;
        try {
          document.getElementsByClassName("lmt__raise_alternatives_placement")[0].insertBefore(container2, document.getElementsByClassName("lmt__translations_as_text")[0]);
        } catch {
          document.getElementsByClassName("lmt__textarea_container")[1].insertBefore(container2, document.getElementsByClassName("lmt__translations_as_text")[0]);
        }
        let outlang = document.querySelectorAll("strong[data-testid='deepl-ui-tooltip-target']")[0].innerHTML;
        let question = "Translate the following paragraph into " + outlang + " and only " + outlang + "\n\n" + document.getElementById("source-dummydiv").innerHTML;
        getAnswer(question, (t) => {
          button.disabled = false;
        });
      });
    }
  }
  function initMenu() {
    let position_id = GM_registerMenuCommand(i18n("containerPosition") + getPosition(), position_switch, "M");
    function position_switch() {
      GM_unregisterMenuCommand(position_id);
      setPosition((getPosition() + 1) % 2);
      position_id = GM_registerMenuCommand(i18n("containerPosition") + getPosition(), position_switch, "M");
      location.reload();
    }
  }
  async function main() {
    initUI();
    initMenu();
    if (getWebsite().type === "immediately") {
      getAnswer(getQuestion());
    }
  }
  main().catch((e) => {
    console.error(e);
  });
})();