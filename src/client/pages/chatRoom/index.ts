import "./index.css";
import { io } from 'socket.io-client'
import { UserData } from '@/service/UserService'
import { titleFormatter } from "@/utils";

// 1. 去建立連接到node server
const clientIo = io()

const url = new URL(location.href)
const userName = url.searchParams.get('userName')
const room = url.searchParams.get('room') as unknown as string
if (!userName || !room) {
  location.href = '/main/main.html'
}

clientIo.emit('enter', { userName, room })
let userId = ''

const textInput = document.getElementById('textInput') as HTMLInputElement
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement
const roomTitle = document.getElementById('title') as HTMLParagraphElement
roomTitle.innerHTML = titleFormatter(room) || '--'
const backBtn = document.getElementById('backBtn') as HTMLButtonElement

const exitHandler = (msg: string) => {
  const chatBoard = document.getElementById('chatBoard') as HTMLDivElement
  const divBox = document.createElement('div')
  divBox.classList.add('flex', 'justify-center', 'mb-4', 'items-center')
  divBox.innerHTML = `<div class="flex justify-center mb-4 items-center">
  <p class="text-gray-700 text-sm">${msg}</p>
  </div>`
  chatBoard.appendChild(divBox)
  chatBoard.scrollTop = chatBoard.scrollHeight
}

const msgHandler = (userData: UserData, msg: string, time: number) => {
  const { id, name, chatRoom } = userData
  const chatBoard = document.getElementById('chatBoard') as HTMLDivElement
  const divBox = document.createElement('div')

  if (id === userId) {
    divBox.classList.add('flex', 'justify-end', 'mb-4', 'items-end')
    divBox.innerHTML = `
  <p class="text-xs text-gray-700 mr-4 d-none">
    ${new Date(time).getHours()}:${new Date(time).getMinutes()}
  </p>
<div>
  <p class="text-xs text-white mb-1 text-right">${name}</p>
  <p
    class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full"
  >
    ${msg}
  </p>
</div>`
  } else {
    divBox.classList.add('flex', 'justify-start', 'mb-4', 'items-end')
    divBox.innerHTML = `<div>
      <p class="text-xs text-gray-700 mb-1">${name}</p>
      <p
        class="mx-w-[50%] break-all bg-gray-800 px-4 py-2 rounded-tr-full rounded-br-full rounded-tl-full text-white"
      >
      ${msg}
      </p>
    </div>
    <p class="text-xs text-gray-700 ml-4">
      ${new Date(time).getHours()}:${new Date(time).getMinutes()}
    </p>`
  }

  chatBoard.appendChild(divBox)
  textInput.value = ''
  chatBoard.scrollTop = chatBoard.scrollHeight
}

backBtn.addEventListener('click', () => {
  location.href = '/main/main.html'
})

submitBtn.addEventListener('click', () => {
  const textVal = textInput.value
  if (textVal === '') { return alert('請輸入訊息') }
  clientIo.emit('chat', textVal)
})

textInput.addEventListener('keypress', (e) => {
  const textVal = textInput.value
  if (textVal === '') { return alert('請輸入訊息') }
  if (e.key === 'Enter') {
    clientIo.emit('chat', textVal)
  }
})

clientIo.on('enter', (msg) => {
  exitHandler(msg)
})

clientIo.on('chat', (userData: UserData, msg: string, time: number) => {
  msgHandler(userData, msg, time)
})

clientIo.on('leave', (msg) => {
  exitHandler(msg)
})

clientIo.on('userId', (id) => {
  userId = id
})