import "./index.css";
// import { name } from "@/utils";
// console.log("client side main page", name);

const nameInput = document.getElementById('nameInput') as HTMLInputElement
const roomSelect = document.getElementById('roomSelect') as HTMLSelectElement
const enterBtn = document.getElementById('enterBtn') as HTMLButtonElement

enterBtn.addEventListener('click', ()=> {
    const userName = nameInput.value
    const room = roomSelect.value
    if (!userName || !room){
        return alert('請填寫暱稱及選擇房間')
    }
    const params = new URLSearchParams({userName, room}).toString()
    location.href = `/chatRoom/chatRoom.html?${params}`
})
