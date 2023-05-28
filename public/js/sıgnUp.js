const socket = io()

const $sıgnUpForm = document.querySelector('#sıgnup-form')

$sıgnUpForm.addEventListener('submit', (e) => {
    
    console.log("signup button clicked");

     // Get the input values
    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const gender = document.querySelector('#gender').value;
    const age = document.querySelector('#age').value;
    const password = document.querySelector('#password').value;
    const room = document.querySelector('#room').value;

    // Emit a 'create' event to the server with the input values
    socket.emit('create', {username, email, gender, age, password, room}, (error) => {
        console.log("calıştı!!!")

        if(error) {
            e.preventDefault()
            alert(error)
            location.href = '/sıgnUp.html'
        }
    })
})