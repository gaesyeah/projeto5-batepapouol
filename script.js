axios.defaults.headers.common['Authorization'] = 'xXBbaHJJgCIsOXZfEH3Mf6s7';
//VARIAVEIS GLOBAIS
let message, user_name;
//--------------------------
function login() {

    user_name = prompt('Qual o seu nome?');

    const user_login = {
        name: user_name
    };

    //chama as funções login-sucess() ou login_error() para verificar se o login foi bem sucedido
    const await_promise = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', user_login);
    await_promise.then(login_success);
    await_promise.catch(login_error);
}

//TUDO COMEÇA AQUI, QUANDO A PÁGINA É ABERTA
login();
//------------------------------------------------------

function login_success(reply) {

    console.log(reply.status);
    alert('Você logou com sucesso!');

    //chama a função user_status() a cada 5 segundos para verificar se o usuario está ativo, ou seja, digitando
    setInterval(user_status, 5000);

/*     message = document.querySelector('.messages_container');
    message.innerHTML += `
        <div class="message_box ENTERorEXIT">
            <p class="time">(00:00:00)</p>
            <p class="message"><strong>${user_name}</strong> entra na sala...</p>
        </div>
    `; */
}
function login_error(reply) {

    alert('Já existe um usuario ativo logado com esse nome, tente novamente com outro');
    //chama função login novamente caso o axios retorne um erro, nesse caso vai ser o status 400
    login();
}
//-------

function user_status() {

    const on_off = {
        name: user_name
    };

    const await_promise = axios.post('https://mock-api.driven.com.br/api/vm/uol/status', on_off);
    await_promise.then(user_inactive);
}

function user_inactive() {

    console.log('verificado após 5 segundos')

}

//---------------------------------------------------------------------
//---------------------------------------------------------------------
//essa função é chamada quando o usuario envia uma mensagem
function send(){

    let input = document.querySelector('.input_message');
    let input_send = input.value;

    if (input_send == "") {
        return; //para parar a execuçao da função caso o usuario envie uma mensagem "vazia"
    }

    user_send = {
        from: user_name,
        to: "Todos",
        text: input_send,
        type: "message" // ou "private_message" para o bônus
    };

    //as funções send_sucess() e send_error() verificam se a mensagem foi enviada ou não
    const await_promise = axios.post('https://mock-api.driven.com.br/api/vm/uol/messages', user_send)
    await_promise.then(send_success);
    await_promise.catch(send_error);

}

//caso a mensagem seja enviada ao servidor sem erros, a mensagem é guardada no servidor e a renderizada na tela
function send_success(reply) {

    /*     message.innerHTML += `
        <div class="message_box">
            <p class="time">(00:00:00)</p>
            <p class="message"><strong>${user_name}</strong> para <strong>todos</strong>: ${input_send}</p>
        </div>
    `; */
    document.querySelector('.input_message').value = ""; //apaga o texto atual no input após a mensagem ser renderizada na tela

}

function send_error(reply) {
    return;
}
//----------------------------------------------------------