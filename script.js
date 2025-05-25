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

const itensArray = () => tarefas.forEach(tarefa => {
    exibirTarefas(tarefa.descricao, tarefa.prioridade, tarefa.data);
});

const botaoConfirmar = () => {
    const link = document.createElement('a');
    link.href = '#';

    let permitido = true;
    aplicarEstilo(link, permitido);

    link.addEventListener("click", () => {
        permitido = !permitido;
        aplicarEstilo(link, permitido);
    });
};

const aplicarEstilo = (botao, permitido) => {
    botao.style.border = "none";
    botao.style.borderRadius = "8px";
    botao.style.cursor = "pointer";
    botao.style.transition = "all 0.3s ease";
    botao.style.textDecoration = 'none';

    if (permitido) {
        botao.textContent = "INCOMPLETO";
        botao.style.backgroundColor = "#f44336"; //Vermelho
        botao.style.color = "#fff";
    } else {
        botao.textContent = "COMPLETO";
        botao.style.backgroundColor = "#4caf50"; //Verde
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

    let status = false;

    const tarefa = adicionarTarefa(inputTarefa.value, prioridadeValue, status); // false = incompleta

    exibirTarefas(tarefa.descricao, tarefa.prioridade, tarefa.data, tarefa.concluida);
    salvarTarefasNoStorage();
    inputTarefa.value = '';
    console.log(tarefas);
};

// ==============================
// Exibição das Tarefas
// ==============================

const exibirTarefas = (input, priority, data, status) => {
    const listaTarefas = document.getElementById("task-list");
    const novaTarefa = document.createElement("li");

    const texto = document.createTextNode(`${input} - prioridade: ${priority} - Data: ${data} -`);

    const link = document.createElement('a');
    link.href = '#';

    aplicarEstilo(link, !status); // Se status = false, botão começa como INCOMPLETO

    link.addEventListener("click", () => {
        status = !status;
        aplicarEstilo(link, !status);
        salvarTarefasNoStorage(); // se quiser salvar as mudanças de status
    });

    novaTarefa.appendChild(texto);
    novaTarefa.appendChild(link);

    listaTarefas.appendChild(novaTarefa);
};

// ==============================
// Remover Tarefas
// ==============================

const limparTarefas = () => {
    const listaTarefas = document.getElementById('task-list');
    const tarefas = listaTarefas.getElementsByTagName('li');

    if (tarefas.length === 0) {
        alert('Não há tarefas para remover!');
        return;
    }

    const tarefaRemovida = tarefas[tarefas.length - 1];
    listaTarefas.removeChild(tarefaRemovida);
};

// ==============================
// Inicialização
// ==============================

console.log(tarefas);

window.onload = () => {
    itensArray();
};