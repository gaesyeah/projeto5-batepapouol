//VARIAVEIS GLOBAIS
let message, user_name;
//--------------------------

function login() {

    user_name = prompt('Qual o seu nome');

    message = document.querySelector('.messages_container');
    message.innerHTML += `
        <div class="message_box ENTERorEXIT">
            <p class="time">(00:00:00)</p>
            <p class="message"><strong>${user_name}</strong> entra na sala...</p>
        </div>
    `
}

login();
//-------------------------------------------------------
function send(send){

    let input = document.querySelector('.input_message');
    let input_send = input.value;

    if (input_send == "") {
        return; //para não fazer nada caso o usuario envie uma mensagem "vazia"
    }

    message.innerHTML += `
        <div class="message_box">
            <p class="time">(00:00:00)</p>
            <p class="message"><strong>${user_name}</strong> para <strong>todos</strong>: ${input_send}</p>
        </div>
    `
    document.querySelector('.input_message').value = "";
}
//----------------------------------------------------------