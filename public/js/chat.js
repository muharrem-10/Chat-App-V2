
const socket = io()

//elements 
const $messages = document.querySelector('#messages')
const $messageForm =  document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')


//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const messageTemplate_2 = document.querySelector('#location-message-template').innerHTML
const messageTemplate_3 = document.querySelector('#sidebar-template').innerHTML

//options
const {username, room, password, email, gender, age } = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    // new message element
    const $newMessage = $messages.lastElementChild

    // hight of the new message
    const newMessageStyles= getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $messages.offsetHeight

    //height of messages container
    const containerHeight = $messages.scrollHeight

    //how far have ı scrolled ?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight  // autoscroll fonksiyonunun içine sadece bu kodu koyarsan sürekli aşağı kaydırır
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate_2, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(messageTemplate_3, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
        //disable

    $messageFormButton.setAttribute('disabled', 'disabled')

    const messages = e.target.elements.message.value

    socket.emit('sendMessage', {username, messages}, (error) =>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value =''
        $messageFormInput.focus()
        //enable

        if(error){
            return console.log(error.message)
        }
        console.log("message received!")
    } )
})

$sendLocationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation){
        return alert("geolocation is not supported by your browser")
    }
    //disable
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position) 
        socket.emit('sendLocation', {username,
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        }, () => {
            //enable
            $sendLocationButton.removeAttribute('disabled')
            console.log('location shared!')
        })
    })
})

socket.emit('join', {username, room, password}, (error) => {

    console.log("çalıştı 2")
    if(error) {
        alert(error)
        location.href = '/'
    }
})

