let user, dataUser = {}, verifyLast, lastMsg, lastChildContent;
const content = document.querySelector(".content");
const inputUser = document.querySelector(".enterUser");
const inputMsg = document.querySelector("input");
const enterScreen = document.querySelector(".enterScreen");

function enterRoom(element) {
    if(inputUser.value !== "") {
        user = inputUser.value;
        inputUser.value = "";
        dataUser = {name: user};
        const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", dataUser);
        promise
            .catch(enterRoomError)
            .then(getMsgs);
        element.parentNode.classList.add("invisible");
        setInterval(getMsgs, 3000);
        setInterval(keepOnline, 5000);
    }
}

function enterRoomError(userError) {
    const statusCode = userError.response.status;
    if (statusCode === 400) {
        alert("Já existe um usuário com esse nome");
        window.location.reload();
    }
    alert ("Não foi possível entrar na sala");
    window.location.reload();
}

function getMsgs() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(renderMsgs);
}

function renderMsgs(msgs) {
    content.innerHTML = "";
    for (let i=0; i<msgs.data.length; i++) {
        switch (msgs.data[i].type) {
            case "status": 
                content.innerHTML +=
                `<div class="boxMsg status">
                    <p><span class="time">(${msgs.data[i].time})</span> <span class="from">${msgs.data[i].from}</span> ${msgs.data[i].text}</p>
                </div>`;
                break;
            case "message":
                content.innerHTML +=
                `<div class="boxMsg message">
                    <p><span class="time">(${msgs.data[i].time})</span> <span class="from">${msgs.data[i].from}</span> para <span class="to">${msgs.data[i].to}</span> ${msgs.data[i].text}</p>
                </div>`;
                break;
            case "private_message":
                content.innerHTML +=
                `<div class="boxMsg private_message">
                    <p><span class="time">(${msgs.data[i].time})</span> <span class="from">${msgs.data[i].from}</span> reservadamente para <span class="to">${msgs.data[i].to}</span> ${msgs.data[i].text}</p>
                </div>`;
                break;
            default:;   
        }       
    }
    lastMsg = msgs.data[msgs.data.length - 1].time;
    scrollDown(lastMsg);
}           

function sendMsg() {
    if (inputMsg.value !== ""){
        let msgInput = inputMsg.value;
        inputMsg.value = "";
        let msg = {from: user, to: "Todos", text: msgInput, type: "message"};
        const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", msg);
        promise
            .catch(sendError)
            .then(getMsgs);
    }
}

function sendError() {
    window.location.reload();
}

function keepOnline() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", dataUser);
}

function scrollDown(lastMsg) {
    if(lastMsg != verifyLast) {
        content.lastChild.scrollIntoView();
    }
    verifyLast = lastMsg;
}

document.addEventListener("keyup", function (event) {
    if (event.key === "Enter" && enterScreen.classList.contains("invisible")) {
        sendMsg();  
        return;
    }
    if (event.key === "Enter") {
        enterRoom(inputUser);
    }});
