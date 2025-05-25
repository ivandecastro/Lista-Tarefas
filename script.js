// ==============================
// Variáveis e LocalStorage
// ==============================

const tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; //Array dos alunos.

//Verifica se o localStorage já possui alunos cadastrados, caso contrário, inicializa como um array vazio.
const salvarTarefasNoStorage = () => localStorage.setItem('tarefas', JSON.stringify(tarefas));

// ==============================
// Funções Utilitárias
// ==============================

const informacoes = () => {
    const inputTarefa = document.getElementById('task-input');
    const prioridadeValue = document.getElementById('priority-input').value;
    return [inputTarefa, prioridadeValue];
};

const itensArray = () => tarefas.forEach((tarefa, i) => {
    exibirTarefas(tarefa.descricao, tarefa.prioridade, tarefa.data, tarefa.concluida, i);
});

const botaoConfirmar = (indice) => {
    const link = document.createElement('button');

    // Define o status inicial com base na tarefa armazenada
    let permitido = tarefas[indice].concluida;
    aplicarEstilo(link, permitido);

    link.addEventListener("click", () => {
        permitido = !permitido;

        // Atualiza o objeto no array com base no novo estado
        tarefas[indice].concluida = permitido;
        salvarTarefasNoStorage();
        aplicarEstilo(link, permitido);
        console.log(tarefas);
    });

    return link;
};

const aplicarEstilo = (botao, permitido) => {
    botao.style.border = "none";
    botao.style.borderRadius = "8px";
    botao.style.cursor = "pointer";
    botao.style.transition = "all 0.3s ease";
    botao.style.textDecoration = 'none';
    botao.style.padding = '10px 18px'
    botao.style.position = 'relative';
    botao.style.bottom = '10px';
    botao.style.right = '8px';

    if (permitido) {
        botao.textContent = "COMPLETO";
        botao.style.backgroundColor = "#4caf50"; //Verde
        botao.style.color = "#fff";
    } else {
        botao.textContent = "INCOMPLETO";
        botao.style.backgroundColor = "#f44336"; //Vermelho
        botao.style.color = "#fff";
    }
};

const inputEnter = () => document.getElementById('task-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        adicionar();
        event.preventDefault();
    }
});
inputEnter();

const dataAtual = () => { //Formata a data atual para o padrão "dd/mm/aaaa - hh:mm:ss".
    const agora = new Date();
    return agora.toLocaleDateString() + ' - ' + agora.toLocaleTimeString();
};

// ==============================
// Adicionar Tarefa
// ==============================

const adicionarTarefa = (afazer, preferencia, tarefaStatus) => {
    const tarefa = {
        descricao: afazer,
        prioridade: preferencia,
        concluida: tarefaStatus,
        data: dataAtual()
    }

    tarefas.push(tarefa);
    salvarTarefasNoStorage();
    return tarefa;
};

const adicionar = () => {
    const [inputTarefa, prioridadeValue] = informacoes();

    if (inputTarefa.value === "") {
        alert("Digite uma tarefa!");
        return;
    }

    const tarefa = adicionarTarefa(inputTarefa.value, prioridadeValue, false); // false = incompleta

    exibirTarefas(tarefa.descricao, tarefa.prioridade, tarefa.data, tarefa.concluida, tarefas.length - 1);
    inputTarefa.value = '';
    console.log(tarefas);
};

// ==============================
// Exibição das Tarefas
// ==============================

const exibirTarefas = (input, priority, data, status, indice) => {
    const listaTarefas = document.getElementById("task-list");
    const novaTarefa = document.createElement("li");

    const texto = document.createTextNode(`${input} - prioridade: ${priority} - Data: ${data} -`);

    const confirmar = botaoConfirmar(indice);

    novaTarefa.appendChild(texto);
    novaTarefa.appendChild(confirmar);

    listaTarefas.appendChild(novaTarefa);
};

// ==============================
// Remover Tarefas
// ==============================

const limparTarefas = () => {
    const listaTarefas = document.getElementById('task-list');
    const tarefasDom = listaTarefas.getElementsByTagName('li');

    if (tarefasDom.length === 0) {
        alert('Não há tarefas para remover!');
        return;
    }

    const tarefaRemovida = tarefasDom[tarefas.length - 1];
    listaTarefas.removeChild(tarefaRemovida);
    tarefas.pop();
    salvarTarefasNoStorage();
    console.log(tarefas);
};

// ==============================
// Inicialização
// ==============================

console.log(tarefas);

window.onload = () => {
    itensArray();
};