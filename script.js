const adicionarTarefa = () => {
    const inputTarefa = document.getElementById("task-input");
    const valorInput = inputTarefa.value;

    if (valorInput === "") {
        alert("Digite uma tarefa!");
        return;
    }

    const listaTarefas = document.getElementById("task-list");
    const novaTarefa = document.createElement("li");
    novaTarefa.innerText = valorInput;
    listaTarefas.appendChild(novaTarefa);

    inputTarefa.value = "";
}

const limparTarefas = () => {
    const listaTarefas = document.getElementById("task-list");
    const tarefas = listaTarefas.getElementsByTagName("li");

    if (tarefas.length === 0) {
        alert("Não há tarefas para remover!");
        return;
    }

    const tarefaRemovida = tarefas[tarefas.length - 1];
    listaTarefas.removeChild(tarefaRemovida);
}