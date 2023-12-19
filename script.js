let user, dataUser = {}, verifyLast, lastMsg, lastChildContent, userSelected, sendTo, sendType;
const content = document.querySelector(".content");
const inputUser = document.querySelector(".enterUser");
const inputMsg = document.querySelector("input");
const enterScreen = document.querySelector(".enterScreen");
const menu = document.querySelector(".menu");
const mainScreen = document.querySelector(".mainScreen");
const leaveMenu = document.querySelector(".leaveMenu");
const usersList = document.querySelector(".users");
const textBottom = document.querySelector("h4");
const publicVisib = document.querySelector(".publicVisib");
const loadingScreen = document.querySelector(".loader");

function enterRoom(element) {
    if(inputUser.value !== "") {
        toggleLoader();
        user = inputUser.value;
        inputUser.value = "";
        dataUser = {name: user};
        const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", dataUser);
        promise
            .catch(enterRoomError)
            .then(getMsgs)
            .then(getParticipants)
            .then(toggleLoader);
        element.parentNode.classList.add("invisible");
        setInterval(getMsgs, 3000);
        setInterval(keepOnline, 5000);
        setInterval(getParticipants, 10000);
        sendTo = "Todos";
        sendType = "message";
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
        if (msgs.data[i].type !== "private_message" || msgs.data[i].to === user || msgs.data[i].from === user){
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
    }
    lastMsg = msgs.data[msgs.data.length - 1].time;
    scrollDown(lastMsg);
}           

function sendMsg() {
    if (inputMsg.value !== ""){
        let msgInput = inputMsg.value;
        inputMsg.value = "";
        let msg = {from: user, to: sendTo, text: msgInput, type: sendType};
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
    if (user) {
        axios.post("https://mock-api.driven.com.br/api/v6/uol/status", dataUser);
    }
}

function scrollDown(lastMsg) {
    if(lastMsg != verifyLast) {
        content.lastChild.scrollIntoView(); 
    }
    verifyLast = lastMsg;
}

function toggleMenu() {
    menu.classList.toggle("invisible");
    menu.classList.toggle("flex");
    leaveMenu.classList.toggle("invisible");
}

function getParticipants() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(renderParticipants);
}

function renderParticipants (response) {
    let visibility;
    if (sendTo === "Todos") {
        visibility = "visible"
    } else {
        visibility = "invisible"
    }
    usersList.innerHTML = `
    <div class="iconAndName" onclick="addCheckUsers(this)">
        <ion-icon name="people" class="iconMenu">;</ion-icon>
        <h3>Todos</h3>
        <ion-icon name="checkmark" class="checkToAll ${visibility}"></ion-icon>
    </div>`;
    for (let i=0; i<response.data.length; i++) {
        if (response.data[i].name !== user) {
            if (sendTo === response.data[i].name) {
                visibility = "visible"
            } else {
                visibility = "invisible"
            }
            usersList.innerHTML += 
            `<div class="iconAndName" onclick="addCheckUsers(this)">
                <ion-icon name="person-circle"></ion-icon>
                <h3>${response.data[i].name}</h3>
                <ion-icon name="checkmark" class="${visibility}" ></ion-icon>
            </div>`;
        }
    }
}

function addCheckUsers (elm) {
    let unChecked = elm.querySelector(".invisible");
    let checked = document.querySelector(".visible");
    sendTo = elm.querySelector("h3").innerHTML;
    if (sendTo === "Todos") {
        sendType = "message";
        addCheckVisib(publicVisib);
    }
    if (sendType === "private_message") {
        textBottom.innerHTML = `Enviando para ${sendTo} (reservadamente)`;
    }
    else {
        textBottom.innerHTML = `Enviando para ${sendTo}`;
    }
    if (unChecked) {
        checked.classList.remove("visible");
        checked.classList.add("invisible");
        unChecked.classList.add("visible");
        unChecked.classList.remove("invisible");
        elm.classList.add("checked");
    }
}

function addCheckVisib (elm) {
    let unChecked = elm.querySelector(".invisible");
    let checked = document.querySelector(".visibility").querySelector(".visible");
    if (!unChecked){
        return;                                                                                                                                     
    }
    if (sendTo !== "Todos" || elm === publicVisib){
        checked.classList.remove("visible");
        checked.classList.add("invisible");
        unChecked.classList.add("visible");
        unChecked.classList.remove("invisible");
    }    
    if (elm.querySelector("h3").innerHTML === "Público" || sendTo === "Todos"){
        textBottom.innerHTML = `Enviando para ${sendTo}`;
        sendType = "message";
    }
    else {
        textBottom.innerHTML = `Enviando para ${sendTo} (reservadamente)`;
        sendType = "private_message";
    }
} 

function toggleLoader() {
    loadingScreen.classList.toggle("flex");
    loadingScreen.classList.toggle("invisible");
}

document.addEventListener("keyup", function (event) {
    if (event.key === "Enter" && enterScreen.classList.contains("invisible")) {
        sendMsg();  
        return;
    }
    if (event.key === "Enter") {
        enterRoom(inputUser);
    }});
