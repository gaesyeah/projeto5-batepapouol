axios.defaults.headers.common['Authorization'] = 'xXBbaHJJgCIsOXZfEH3Mf6s7';

//VARIAVEIS GLOBAIS
let message, user_name, entireCHAT, nameMENU, online;
//--------------------------

//COMEÇA AQUI, quando o usuario faz o login 
//(além das funções RESET_saveMENU e reset_saveCHAT que são chamadas a cada 10 e 3 segundos respectivamente, antes mesmo do login)
function login() {

    //troca a interface de login pela de loading
    const hide_login = document.getElementById('remove');
    hide_login.classList.add('hide');
    const show_loading = document.getElementById('add');
    show_loading.classList.remove('hide');

    document.querySelector('.input_message').value = ""; //apaga o texto atual no input (só para limpar o input caso o usuario digite algo, não envie e dê F5)
    //não fiz isso com o login pq, para caso o usuario queira entrar com o mesmo nome, fica salvo lá

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

    RESET_saveMENU(); //reseta e renderiza o TO do menu
    //(BOTEI "TO" NO NOME DAS CLASSES HTML E EM ALGUMAS PARTES DO JS, MAS DESCOBRI DEPOIS QUE O CERTO É "FROM")
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

function send_error() { //mas caso o usuario fique com o chat aberto, nunca(OU NÃO...) vai dar esse erro

    alert('Ocorreu um erro no servidor e você foi desconectado, entre novamente');
    window.location.reload()
}
//----------------------------------------------------------

function reset_saveCHAT() {

    entireCHAT = [];

    const await_promise = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    await_promise.then(renderCHAT);
}

setInterval(reset_saveCHAT, 3000); //chama a função para resetar a página a cada 3 segundos (INICIA AO ENTRAR NA PAGINA MESMO)

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

    //dá scroll para o final da página
    const scrollTOend = document.body.scrollHeight;
    window.scrollTo(0, scrollTOend);

}

//------------------------------------------------------
function toggle_menu() {

    //mostra/esconde a barra na tela
    const display_bar = document.querySelector('.side_bar');
    display_bar.classList.toggle('hide');

    //bota/tira a rolagem de todo o body, para a barra ficar por cima de toda a tela independente do que o usuario faça
    const KILLoverflow = document.querySelector('body');
    KILLoverflow.classList.toggle('OUToverflow');
}

//---------------------------------------------------------------------------------------------
//--------------------------------------SIDEBAR(MENU)------------------------------------------
//DÁ PARA FAZER COM SOMENTE UMA FUNÇÃO USANDO MAIS PARAMETROS, O MR PINK ENSINOU A FAZER ISSO NO PROJETO DRIVEN EATS

function TOclicked(clicked) {

    //SÓ VAI ENTRAR NESSE IF APÓS O USUARIO JÁ TER CLICADO UMA VEZ, OU SEJA, NO SEGUNDO CLIQUE

    //se dentro da div com classe option, que está dentro da div com classe TO-select, tiver alguma div com classe .check_selected, a mesma será removida
    const VERIFYcheck = document.querySelector('.TO-select .option .check_selected');
    if (VERIFYcheck !== null) {
        VERIFYcheck.classList.remove('check_selected');
    }
    
    //muda a cor do check para verde
    const ADDcheck = clicked.querySelector('.option .check');
    ADDcheck.classList.add('check_selected');
//------salva o texto numa variavel
    const FROM = clicked.querySelector('.text_select').innerHTML;
    console.log(FROM);
}

function TYPEclicked(clicked) {

    //SÓ VAI ENTRAR NESSE IF APÓS O USUARIO JÁ TER CLICADO UMA VEZ, OU SEJA, NO SEGUNDO CLIQUE
    
    //se dentro da div com classe option, que está dentro da div com classe TYPE-select, tiver alguma div com classe .chack-selected, a mesma será removida
    const VERIFYcheck = document.querySelector('.TYPE-select .option .check_selected')
    if (VERIFYcheck !== null) {
        VERIFYcheck.classList.remove('check_selected');
    }
    
    //muda a cor do check para verde
    const ADDcheck = clicked.querySelector('.option .check');
    ADDcheck.classList.add('check_selected');
//------salva o texto numa variavel
    const TYPE = clicked.querySelector('.text_select').innerHTML;
    console.log(TYPE);
}

//--------------------------------------------------------------------------------

function RESET_saveMENU() { //é chamada a cada 10 segundos e quando o usuario faz login

    nameMENU = [];

    //vai fazer uma requisição para o servidor pedindo o nome dos usuarios ativos
    const await_promise = axios.get('https://mock-api.driven.com.br/api/vm/uol/participants')
    //a função onlineUSERS é chamada quando a requisição recebe um retorno
    await_promise.then(onlineUSERS);
    
}
setInterval(RESET_saveMENU, 10000); //chama a função para renderizar o menu a cada 10 segundos (INICIA AO ENTRAR NA PAGINA MESMO)

function onlineUSERS(users) {

    let name = document.querySelector('.TO-select');
    //reseta o conteudo da div TO-select para incluir a opção padrão: Todos
    name.innerHTML = ` 
        <div onclick="TOclicked(this)" class="option" >
            <div class="adjust">
                <ion-icon class="icon_size" name="people"></ion-icon>
                <p class="text_option text_select">Todos</p>
            </div>
            <ion-icon class="check" name="checkmark-sharp"></ion-icon>
        </div>
    `;

    //é guardado num array o nome de todos os usuarios online, RETORNADO pelo servidor na função RESET_saveMENU
    online = [];
    online = users.data;

    //é renderizado na tela as divs com os nomes dos usuarios online
    for(i=0; i<online.length; i++) {

        name.innerHTML += `
            <div onclick="TOclicked(this)" class="option" >
                <div class="adjust">
                    <ion-icon class="icon_size" name="person-circle-sharp"></ion-icon>
                    <p class="text_option text_select">${online[i].name}</p>
                </div>
                <ion-icon class="check" name="checkmark-sharp"></ion-icon>
            </div>
        `;
    }
}