//#region {Variáveis Globais
const tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; //Array dos alunos.

// Se não houver tarefas no localStorage, inicializa com um array vazio.
const salvarTarefasNoStorage = () => localStorage.setItem('tarefas', JSON.stringify(tarefas));

//#endregion Variáveis Globais}

//===============================================================

//#region {Funções Auxiliares

//#region Utilitários
const dataAtual = () => { //Formata a data atual para o padrão "dd/mm/aaaa - hh:mm:ss".
    const agora = new Date(); //Cria um novo objeto Date com a data e hora atuais
    return agora.toLocaleDateString() + ' - ' + agora.toLocaleTimeString();
};

const exibirTodasAsTarefas = () => { //Itera sobre o array de tarefas e exibe cada uma delas.
    for (let i = 0; i < tarefas.length; i++) {
        exibirTarefaDoIndice(i);
    }
}

const informacoes = () => { //Coleta as informações dos elementos HTML necessários para adicionar uma tarefa.
    const inputTarefa = document.getElementById('task-input'); //Coleta o input de tarefa
    const prioridadeValue = document.getElementById('priority-input').value; //Coleta o valor da prioridade selecionada
    const tasksList = document.getElementById("task-list"); //Coleta a lista de tarefas onde as novas tarefas serão exibidas
    return [inputTarefa, prioridadeValue, tasksList];
};

const eventMarcaDagua = () => {
    document.getElementById('estiloMarcaDagua').addEventListener('change', (e) => {
        const novoEstilo = e.target.value;
        localStorage.setItem('estiloMarcaDagua', novoEstilo);

        const todasAsTarefas = document.querySelectorAll('#task-list li');
        todasAsTarefas.forEach(tarefa => {
            tarefa.classList.remove('marca-canto', 'marca-centro');
            if (novoEstilo === 'canto') {
                tarefa.classList.add('marca-canto');
            } else if (novoEstilo === 'centro') {
                tarefa.classList.add('marca-centro');
            }
            // se for 'nenhum', nada será adicionado
        });
    });
};
eventMarcaDagua();

//Adiciona um evento de tecla "Enter" para o input de tarefa, permitindo adicionar a tarefa ao pressionar "Enter".
const inputEnter = () => document.getElementById('task-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') { //Verifica se a tecla pressionada é "Enter"
        adicionar(); //Chama a função para adicionar a tarefa
        event.preventDefault(); //Previne o comportamento padrão do evento
    }
});
inputEnter();
//#endregion Utilitários
//----------------------------------------------------
//#region Botões de Ação

const botaoRemover = (indice) => { //Cria um botão para remover uma tarefa específica do array de tarefas.
    const link = document.createElement('button'); //Cria um elemento de botão
    link.textContent = "REMOVER"; //Define o texto do botão
    link.className = "btn-remove";

    const [, , listaTarefas] = informacoes(); //Coleta a lista de tarefas para poder remover o item da lista HTML.

    link.addEventListener("click", (event) => { //Adiciona um evento de clique ao botão
        event.preventDefault(); //Previne o comportamento padrão do botão

        tarefas.splice(indice, 1); //Remove a tarefa do array (usando o índice correto via texto ou alguma outra marca)
        salvarTarefasNoStorage(); //Salva as alterações no localStorage

        listaTarefas.innerHTML = ''; //Limpa a lista de tarefas visualmente
        exibirTodasAsTarefas()
        console.log(tarefas);
    });

    return link;
};

const botaoConfirmar = (indice) => { //Cria um botão para confirmar a conclusão de uma tarefa específica.
    const link = document.createElement('button'); //Cria um elemento de botão

    let permitido = tarefas[indice].concluida; //Define o status inicial com base na tarefa armazenada
    aplicarEstiloBotaoConfirmar(link, permitido); //Aplica os estilos ao botão de confirmar

    link.addEventListener("click", () => { //Adiciona um evento de clique ao botão
        permitido = !permitido; //Inverte o estado de conclusão da tarefa


        tarefas[indice].concluida = permitido; //Atualiza o objeto no array com base no novo estado
        salvarTarefasNoStorage(); //Salva as alterações no localStorage
        aplicarEstiloBotaoConfirmar(link, permitido, 'COMPLETA', 'PENDENTE'); //Aplica o estilo atualizado ao botão
        console.log(tarefas);
    });

    return link;
};
//#endregion Botões de Ação
//----------------------------------------------------
//#region Estilos de elementos HTML

const aplicarEstiloMarcaDagua = (elemento) => {
    const estilo = localStorage.getItem('estiloMarcaDagua') || 'nenhum';

    elemento.classList.remove('marca-canto', 'marca-centro');

    if (estilo === 'canto') {
        elemento.classList.add('marca-canto');
    } else if (estilo === 'centro') {
        elemento.classList.add('marca-centro');
    }
};

const definirCorDaPrioridade = (elemento, prioridade) => {
    if (prioridade === 'Alta') {
        elemento.style.backgroundColor = '#FF7F7F';
    } else if (prioridade === 'Média') {
        elemento.style.backgroundColor = '#ffb347'
    } else {
        elemento.style.backgroundColor = '#2ecc71';
    }
}

const aplicarEstiloBotaoConfirmar = (botao, permitido) => { //Aplica estilos ao botão de confirmar tarefa.
    botao.className = 'btn-confirmar'; // sempre aplica a classe base

    if (permitido) {
        botao.textContent = 'COMPLETA';
        botao.classList.add('completa');
        botao.classList.remove('pendente');
    } else {
        botao.textContent = 'PENDENTE';
        botao.classList.add('pendente');
        botao.classList.remove('completa');
    }
};
//#endregion Estilos de elementos HTML

//#endregion Funções Auxiliares}

//===============================================================

//#region {Funções Principais 

//#region Adicionar Tarefa
// Adiciona uma nova tarefa ao array de tarefas e atualiza o localStorage.
const adicionarTarefa = (afazer, preferencia, tarefaStatus) => {
    const tarefa = { //Cria um objeto tarefa com as informações fornecidas
        descricao: afazer,
        prioridade: preferencia,
        concluida: tarefaStatus,
        data: dataAtual()
    }

    tarefas.push(tarefa); //Adiciona a nova tarefa ao array de tarefas
    salvarTarefasNoStorage(); //Salva o array atualizado no localStorage
    return tarefa;
};

const adicionar = () => { //Função para adicionar uma nova tarefa à lista
    const [inputTarefa, prioridadeValue] = informacoes();

    if (inputTarefa.value === "") { //Verifica se o campo de tarefa está vazio
        alert("Digite uma tarefa!");
        return;
    }

    adicionarTarefa(inputTarefa.value, prioridadeValue, false); // false = incompleta

    exibirTarefaDoIndice(tarefas.length - 1); //Adiciona a tarefa ao array e exibe na lista
    inputTarefa.value = ''; //Limpa o campo de entrada após adicionar a tarefa
    console.log(tarefas);
};
//#endregion Adicionar Tarefa
//----------------------------------------------------
//#region Exibição das Tarefas
// Exibe as tarefas na lista HTML, criando elementos para cada tarefa e adicionando botões de ação.
const exibirTarefaDoIndice = (indice) => {
    const { descricao, prioridade, data } = tarefas[indice]
    // Coleta as informações necessárias para exibir a tarefa
    const [, , listaTarefas] = informacoes();

    const novaTarefa = document.createElement("li"); //Cria um novo elemento de lista para a tarefa
    novaTarefa.className = 'text-list'; //Criando uma ClassName para a tag 'li'
    novaTarefa.setAttribute('data-prioridade', `${prioridade} Prioridade`);

    definirCorDaPrioridade(novaTarefa, prioridade); //Coloca a cor de fundo de acordo com cada prioridade
    aplicarEstiloMarcaDagua(novaTarefa);

    const texto = document.createElement("span"); //Cria um elemento de texto para exibir a descrição da tarefa
    texto.textContent = `${descricao} - Data: ${data}`; //Define o texto da tarefa com as informações coletadas

    const containerBotoes = document.createElement("div"); //Cria um contêiner para os botões de ação
    containerBotoes.style.display = "flex"; //Define o display do contêiner como flexível
    containerBotoes.style.gap = "8px"; //Adiciona um espaçamento entre os botões

    const removerTarefa = botaoRemover(indice); //Cria o botão de remover tarefa, passando o índice da tarefa
    const confirmar = botaoConfirmar(indice); //Cria o botão de confirmar tarefa, passando o índice da tarefa

    containerBotoes.appendChild(confirmar); //Adiciona o botão de confirmar ao contêiner de botões
    containerBotoes.appendChild(removerTarefa); //Adiciona o botão de remover ao contêiner de botões

    novaTarefa.appendChild(texto); //Adiciona o texto da tarefa ao elemento de lista
    novaTarefa.appendChild(containerBotoes); //Adiciona o contêiner de botões ao elemento de lista

    listaTarefas.appendChild(novaTarefa); //Adiciona a nova tarefa à lista de tarefas no HTML
};
//#endregion Exibição das Tarefas

//#endregion Funções Principais}

//===============================================================

//#region {Limpeza de Tarefas

const limparTarefas = () => { //Função para limpar todas as tarefas da lista
    const [input, , lista] = informacoes();

    if (tarefas.length === 0) { //Verifica se não há tarefas para limpar
        alert("Não há tarefas para limpar!");
        return;
    }
    //Solicita confirmação do usuário antes de limpar as tarefas
    const confirm = window.confirm("Você tem certeza que deseja limpar todas as tarefas?");
    if (confirm) { //Se o usuário confirmar, limpa as tarefas
        tarefas.length = 0; //Limpa o array de tarefas
        salvarTarefasNoStorage(); //Atualiza o localStorage
        lista.innerHTML = ''; //Limpa a lista visual
        input.value = '';
        console.log(tarefas);
    }
};
//#endregion Limpeza de Tarefas}

//===============================================================

//#region {Eventos
window.onload = () => {
    const estiloSalvo = localStorage.getItem('estiloMarcaDagua') || 'nenhum';
    document.getElementById('estiloMarcaDagua').value = estiloSalvo;

    exibirTodasAsTarefas();
    console.log(tarefas);
};
//#endregion Eventos}