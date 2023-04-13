axios.defaults.headers.common['Authorization'] = 'xXBbaHJJgCIsOXZfEH3Mf6s7';

//VARIAVEIS GLOBAIS
let message, user_name, entireCHAT;
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

    reset_saveCHAT(); //reseta e renderiza o chat

    console.log(reply.status);
    alert('Você logou com sucesso!');

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

            if (!["Todos", "todos", "Todos:", "todos:"].includes(entireCHAT[i].to)) {//se for uma mensagem PRIVADA

                    message.innerHTML += `
                    <div class="message_box reservedMSG">
                        <p class="time">(${entireCHAT[i].time})</p>
                        <p class="message"><strong>${entireCHAT[i].from}</strong> reservadamente para <strong>${entireCHAT[i].to}:</strong> ${entireCHAT[i].text}</p>
                    </div>
                `;
            } else {//se for uma mensagem para todos/Todos

                message.innerHTML += `
                <div class="message_box">
                    <p class="time">(${entireCHAT[i].time})</p>
                    <p class="message"><strong>${entireCHAT[i].from}</strong> para <strong>${entireCHAT[i].to}:</strong> ${entireCHAT[i].text}</p>
                </div>
            `;
            }

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