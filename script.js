axios.defaults.headers.common['Authorization'] = 'xXBbaHJJgCIsOXZfEH3Mf6s7';

//VARIAVEIS GLOBAIS
let message, user_name, entireCHAT;
//--------------------------

//COMEÇA AQUI, quando o usuario faz o login
function login() {

    //troca a interface de login pela de loading
    const hide_login = document.getElementById('remove');
    hide_login.classList.add('hide');
    const show_loading = document.getElementById('add');
    show_loading.classList.remove('hide');

    document.querySelector('.input_message').value = ""; //apaga o texto atual no input (só para limpar o input caso o usuario digite algo, não envie e dê F5)
    //não fiz isso com o login para caso o usuario queira entrar com o mesmo nome, fica salvo lá

    const login_input = document.querySelector('.login_input');
    user_name = login_input.value;

    const user_login = {
        name: user_name
    };

    //chama as funções login-sucess() ou login_error() para verificar se o login foi bem sucedido
    const await_promise = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', user_login);
    await_promise.then(login_success);
    await_promise.catch(login_error);
}

//------------------------------------------------------

function login_success(reply) {

    reset_saveCHAT(); //reseta e renderiza o chat

    console.log(`${reply.status}; ${user_name} logou com sucesso`);

    //esconde a tela de login
    const hide_screen = document.querySelector('.login_screen');
    hide_screen.classList.add('hide');
    const hide_box = document.querySelector('.login_box');
    hide_box.classList.add('hide');


    //chama a função user_status() a cada 5 segundos para verificar se o usuario está ativo, ou seja, digitando
    setInterval(user_status, 5000);
}
function login_error(reply) {

    alert('Já existe um usuario ativo logado com esse nome, tente novamente com outro');

    //reinicia a página caso o axios retorne um erro, nesse caso vai ser o status 400
    window.location.reload()
}
//-------

function user_status() {

    const status = {
        name: user_name
    };

    const await_promise = axios.post('https://mock-api.driven.com.br/api/vm/uol/status', status);
    await_promise.then(user_active);
}

function user_active(reply) {

    console.log(`${reply.status}; Verificado após 5 segundos`)

}

//---------------------------------------------------------------------
//---------------------------------------------------------------------
//essa função é chamada quando o usuario envia uma mensagem
function send(){

    const input = document.querySelector('.input_message');
    const input_send = input.value;

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

//caso a mensagem seja enviada ao servidor sem erros
function send_success() {

    reset_saveCHAT(); //reseta e renderiza o chat

    document.querySelector('.input_message').value = ""; //apaga o texto atual no input após a mensagem ser renderizada na tela
}

function send_error() {

    alert('você foi desconectado por inatividade, entre novamente');
    window.location.reload()
}
//----------------------------------------------------------

function reset_saveCHAT() {

    entireCHAT = [];

    const await_promise = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    await_promise.then(renderCHAT);
}

setInterval(reset_saveCHAT, 3000); //chama a função para resetar a página a cada 3 segundos

function renderCHAT(historyCHAT) {

    entireCHAT = historyCHAT.data;
    console.log(historyCHAT);
    console.log(entireCHAT);

    message = document.querySelector('.messages_container');
    message.innerHTML = ''; //reseta o chat

    for(i=0; i<entireCHAT.length; i++) {

        if (["Message", "message", "Message:", "message:"].includes(entireCHAT[i].type)) { //se for uma mensagem

            message.innerHTML += `
            <div class="message_box">
                <p class="time">(${entireCHAT[i].time})</p>
                <p class="message"><strong>${entireCHAT[i].from}</strong> para <strong>${entireCHAT[i].to}:</strong> ${entireCHAT[i].text}</p>
            </div>
        `;
        } else { //se não for uma mensagem, OU SEJA, se entrou ou saiu (type: "status")

            message.innerHTML += `
            <div class="message_box ENTERorEXIT">
                <p class="time">(${entireCHAT[i].time})</p>
                <p class="message"><strong>${entireCHAT[i].from}</strong> ${entireCHAT[i].text}</p>
            </div>
        `;
        }
    }
}