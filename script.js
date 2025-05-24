const tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; //Array dos alunos.

//Verifica se o localStorage já possui alunos cadastrados, caso contrário, inicializa como um array vazio.
const salvarTarefasNoStorage = () => localStorage.setItem('tarefas', JSON.stringify(tarefas));

const dataAtual = () => { //Formata a data atual para o padrão "dd/mm/aaaa - hh:mm:ss".
    const agora = new Date();
    return agora.toLocaleDateString() + ' - ' + agora.toLocaleTimeString();
}

const aplicarEstilo = (botao, permitido) => {
    botao.style.border = "none";
    botao.style.borderRadius = "8px";
    botao.style.cursor = "pointer";
    botao.style.transition = "all 0.3s ease";
    botao.style.textDecoration = 'none';

    if (permitido) {
        botao.textContent = "incompleto";
        botao.style.backgroundColor = "#4caf50"; //Verde
        botao.style.color = "#fff";
    } else {
        botao.textContent = "completo";
        botao.style.backgroundColor = "#f44336"; //Vermelho
        botao.style.color = "#fff";
    }
};

const adicionarTarefa = (afazer, preferencia, tarefaStatus) => {
    const tarefa = {
        descricao: afazer,
        prioridade: preferencia,
        concluida: tarefaStatus,
        data: dataAtual()
    }

    tarefas.push(tarefa);
    return tarefa;
}

const exibirTarefas = (input, priority, data) => {
    const listaTarefas = document.getElementById("task-list");
    const novaTarefa = document.createElement("li");

    const texto = document.createTextNode(`${input} - prioridade: ${priority} - Data: ${data} -`);

    const link = document.createElement('a');
    link.href = '#';

    let permitido = true;
    aplicarEstilo(link, permitido);

    link.addEventListener("click", () => {
        permitido = !permitido;
        aplicarEstilo(link, permitido);
    });

    novaTarefa.appendChild(texto);
    novaTarefa.appendChild(link);

    listaTarefas.appendChild(novaTarefa);

    document.getElementById('task-input').value = '';
};


const adicionar = () => {
    const inputTarefa = document.getElementById('task-input');
    const valorInput = inputTarefa.value;
    const prioridadeValue = document.getElementById('priority-input').value;

    if (valorInput === "") {
        alert("Digite uma tarefa!");
        return;
    }

    const indice = adicionarTarefa(valorInput, prioridadeValue);
    console.log(tarefas);

    const input = indice.descricao;
    const prioridade = indice.prioridade;
    const data = indice.data;

    exibirTarefas(input, prioridade, data);
}



const limparTarefas = () => {
    const listaTarefas = document.getElementById('task-list');
    const tarefas = listaTarefas.getElementsByTagName('li');

    if (tarefas.length === 0) {
        alert('Não há tarefas para remover!');
        return;
    }

    const tarefaRemovida = tarefas[tarefas.length - 1];
    listaTarefas.removeChild(tarefaRemovida);
}