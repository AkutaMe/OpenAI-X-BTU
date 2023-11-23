let generating = false
let id = null
const urlelement = document.getElementById("urlInput")
document.getElementById("scanUrlBtn").addEventListener("click", function () {
  toggleSection("scan-url-section")
  appendLoadingMessage()
  generating = true
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  urlelement.value = tabs[0].url
  const url = urlelement.value
  fetch("https://nice-humpback-mutually.ngrok-free.app/api/v1/urls/scan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url }),
  }).then((res) => res.json())
    .then((data) => {
      const loadingElement = document.getElementById("load-res")
      loadingElement.remove()
      const message = data.response
      appendOtherMessage(message)
      generating = false
      id = data.id
    })
  })
})

document.getElementById("scanFileBtn").addEventListener("click", function () {
  toggleSection("scan-file-section")
})

document.getElementById("chat").addEventListener("submit", function (event) {
  event.preventDefault()
  if ( generating ) return
  generating = true
  const message = document.getElementById("chatInput").value
  document.getElementById("chatInput").value = ''
  appendUserMessage(message)
  appendLoadingMessage()
  fetch("https://nice-humpback-mutually.ngrok-free.app/api/v1/conversations/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message, id: id }),
  }).then((res) => res.json())
    .then((data) => {
      const loadingElement = document.getElementById("load-res")
      loadingElement.remove()
      const message = data.response
      appendOtherMessage(message)
      generating = false
    })
})

function toggleSection(sectionId) {
  document.getElementById("scan-url-section").style.display = "none"
  document.getElementById("scan-file-section").style.display = "none"
  document.getElementById(sectionId).style.display = "block"
}
const container = document.querySelector('.chat-ui')

function scrollToBottom() {
  container.scrollTop = container.scrollHeight
}

function splitMessages(message) {
  const words = message.split(" ")
  let newMessage = ""
  for (let i = 0; i < words.length; i++) {
    if (newMessage.length + words[i].length > 38) {
      newMessage += "\n" + words[i]
    } else {
      newMessage += " " + words[i]
    }
  }
  return newMessage
}

function appendUserMessage(message) {
  const bubbleHTML = `<div class="bubble user-bubble">${splitMessages(message)}</div>`
  container.insertAdjacentHTML("beforeend", bubbleHTML)
  scrollToBottom()
}

function appendOtherMessage(message) {
  const bubbleHTML = `<div class="bubble assistant-bubble">${splitMessages(message)}</div>`
  container.insertAdjacentHTML("beforeend", bubbleHTML)
  scrollToBottom()
}

function appendLoadingMessage() {
  const bubbleHTML = `<div class="bubble assistant-bubble" id="load-res"><img src="typing.gif"; id="bubble img"></div>`
  container.insertAdjacentHTML("beforeend", bubbleHTML)
  scrollToBottom()
}
