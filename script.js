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

const informacoes = () => { //Coleta as informações dos elementos HTML necessários para adicionar uma tarefa.
    const inputTarefa = document.getElementById('task-input'); //Coleta o input de tarefa
    const prioridadeValue = document.getElementById('priority-input').value; //Coleta o valor da prioridade selecionada
    const tasksList = document.getElementById("task-list"); //Coleta a lista de tarefas onde as novas tarefas serão exibidas
    return [inputTarefa, prioridadeValue, tasksList]; 
};

const itensArray = () => tarefas.forEach((tarefa, i) => { //Itera sobre o array de tarefas e exibe cada uma delas.
    exibirTarefas(tarefa.descricao, tarefa.prioridade, tarefa.data, tarefa.concluida, i);
});

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
    aplicarEstiloBotaoRemover(link); //Aplica os estilos ao botão de remover

    const [, , listaTarefas] = informacoes(); //Coleta a lista de tarefas para poder remover o item da lista HTML.

    link.addEventListener("click", (event) => { //Adiciona um evento de clique ao botão
        event.preventDefault(); //Previne o comportamento padrão do botão

        tarefas.splice(indice, 1); //Remove a tarefa do array (usando o índice correto via texto ou alguma outra marca)
        salvarTarefasNoStorage(); //Salva as alterações no localStorage

        listaTarefas.innerHTML = ''; //Limpa a lista de tarefas visualmente
        itensArray(); //Reexibe tudo com índices corretos
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

const layoutHorizontal = (listaTarefas) => { //Aplica estilos de layout horizontal à lista de tarefas.
    listaTarefas.style.display = "flex"; //Define o display como flexível
    listaTarefas.style.justifyContent = "space-between"; //Distribui o espaço entre os itens
    listaTarefas.style.alignItems = "center"; //Alinha os itens verticalmente ao centro
    listaTarefas.style.marginBottom = "10px"; //Adiciona uma margem inferior para espaçamento
    listaTarefas.style.padding = "10px"; //Adiciona um preenchimento interno
    listaTarefas.style.border = "1px solid #ccc"; //Adiciona uma borda ao redor do item
    listaTarefas.style.borderRadius = "8px"; //Arredonda os cantos da borda
    listaTarefas.style.backgroundColor = "#f9f9f9"; //Define a cor de fundo do item
}

const aplicarEstiloBotaoRemover = (botao) => { //Aplica estilos ao botão de remover tarefa.
    botao.textContent = "REMOVER"; //Define o texto do botão
    botao.style.border = "2px solid #b30000"; //Define a borda do botão
    botao.style.borderRadius = "8px"; //Arredonda os cantos da borda 
    botao.style.cursor = "pointer"; //Define o cursor como ponteiro ao passar sobre o botão
    botao.style.backgroundColor = "#ff4d4d"; //Define a cor de fundo do botão
    botao.style.color = "#fff"; //Define a cor do texto do botão
    botao.style.padding = '10px 18px'; //Adiciona preenchimento interno ao botão
    botao.style.fontWeight = "bold"; //Define o peso da fonte do texto do botão
    botao.style.marginLeft = '10px'; //Adiciona uma margem à esquerda do botão
    botao.style.marginTop = '5px'; //Adiciona uma margem superior ao botão
}

const aplicarEstiloBotaoConfirmar = (botao, permitido) => { //Aplica estilos ao botão de confirmar tarefa.
    botao.style.borderRadius = "8px"; //Arredonda os cantos da borda
    botao.style.cursor = "pointer"; //Define o cursor como ponteiro ao passar sobre o botão
    botao.style.transition = "all 0.3s ease"; //Adiciona uma transição suave para as mudanças de estilo
    botao.style.textDecoration = 'none'; //Remove o sublinhado do texto do botão
    botao.style.padding = '10px 18px' ; //Adiciona preenchimento interno ao botão
    botao.style.marginLeft = '10px'; //Adiciona uma margem à esquerda do botão
    botao.style.marginTop = '5px'; //Adiciona uma margem superior ao botão

    if (permitido) {
        botao.textContent = 'COMPLETA'; //Define o texto do botão como "COMPLETA"
        botao.style.backgroundColor = "#4caf50"; //Verde
        botao.style.color = "#fff"; //Define a cor do texto do botão como branco 
    } else {
        botao.textContent = 'PENDENTE'; //Define o texto do botão como "PENDENTE"
        botao.style.backgroundColor = "#f44336"; //Vermelho
        botao.style.color = "#fff"; //Define a cor do texto do botão como branco
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

    const tarefa = adicionarTarefa(inputTarefa.value, prioridadeValue, false); // false = incompleta

    //Adiciona a tarefa ao array e exibe na lista
    exibirTarefas(tarefa.descricao, tarefa.prioridade, tarefa.data, tarefa.concluida, tarefas.length - 1);
    inputTarefa.value = ''; //Limpa o campo de entrada após adicionar a tarefa
    console.log(tarefas);
};
//#endregion Adicionar Tarefa
//----------------------------------------------------
//#region Exibição das Tarefas
// Exibe as tarefas na lista HTML, criando elementos para cada tarefa e adicionando botões de ação.
const exibirTarefas = (input, priority, data, status, indice) => { 
    // Coleta as informações necessárias para exibir a tarefa
    const [inputTarefa, prioridadeValue, listaTarefas] = informacoes();  
    const novaTarefa = document.createElement("li"); //Cria um novo elemento de lista para a tarefa

    layoutHorizontal(novaTarefa); //Aplica o layout horizontal à nova tarefa

    const texto = document.createElement("span"); //Cria um elemento de texto para exibir a descrição da tarefa
    //Define o texto da tarefa com as informações coletadas
    texto.textContent = `${input} - prioridade: ${priority} - Data: ${data} -`; //

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
    if (tarefas.length === 0) { //Verifica se não há tarefas para limpar
        alert("Não há tarefas para limpar!");
        return;
    }
    //Solicita confirmação do usuário antes de limpar as tarefas
    const confirm = window.confirm("Você tem certeza que deseja limpar todas as tarefas?"); 
    if (confirm) { //Se o usuário confirmar, limpa as tarefas
        tarefas.length = 0; //Limpa o array de tarefas
        salvarTarefasNoStorage(); //Atualiza o localStorage
        document.getElementById('task-list').innerHTML = ''; //Limpa a lista visual
        console.log(tarefas);
    }
};
//#endregion Limpeza de Tarefas}

//===============================================================

//#region {Eventos
window.onload = () => { //Ao carregar a página, exibe as tarefas já existentes no localStorage
    itensArray(); // Exibe as tarefas armazenadas no localStorage
    console.log(tarefas); //Exibe o array de tarefas no console para depuração
};
//#endregion Eventos}