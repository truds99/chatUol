function getMsgs() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(renderMsgs);
}

function renderMsgs(msgs) {
    const content = document.querySelector(".content");
    for (let i=0; i<30; i++) {
    content.innerHTML +=
    `<div class="boxMsg" class="${msgs.data[i].type}">
        <span class="time">${msgs.data[i].time}</span> <span class="from">${msgs.data[i].from}</span> to <span class="to">${msgs.data[i].to}</span> ${msgs.data[i].text}
    </div>`;
    }
}           

getMsgs();