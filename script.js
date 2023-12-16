let user, dataUser = {};

function getMsgs() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(renderMsgs);
}

function renderMsgs(msgs) {
    const content = document.querySelector(".content");
    for (let i=0; i<30; i++) {
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
    const lastMsg = content.lastChild;
    lastMsg.scrollIntoView(); //not working
}           

function enterRoom() {
    do {
        user = prompt("Qual o seu nome de usuário?");
    } while (user === null);
    dataUser = {name: user};
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", dataUser);
    promise
        .catch(enterRoomError)
        .then(getMsgs);
}

function enterRoomError(userError) {
    const statusCode = userError.response.status;
    if (statusCode === 400) {
        alert("Já existe um usuário com esse nome");
        enterRoom();
        return;
    }
    alert ("Não foi possível entrar na sala");
}

function keepOnline() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", dataUser);
}

function sendMsg() {
    let msg = {from: user, to: "Todos", text: document.querySelector(input).value, type: message};
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", msg);
    
}

enterRoom();

setInterval(getMsgs, 3000);

setInterval(keepOnline, 5000);

