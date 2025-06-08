//#region {Variáveis Globais
const tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; //Array dos alunos.

// Se não houver tarefas no localStorage, inicializa com um array vazio.
const salvarTarefasNoStorage = () => localStorage.setItem('tarefas', JSON.stringify(tarefas));

//#endregion Variáveis Globais}

//===============================================================

//#region {Funções Auxiliares

//#region Utilitários
const dataAtual = () => { //Formata a data atual para o padrão "dd/mm/aaaa - hh:mm:ss".
    const agora = new Date(); //Cria um novo objeto Date com a data e hora atuais.
    return agora.toLocaleDateString() + ' - ' + agora.toLocaleTimeString();
};

const exibirTodasAsTarefas = () => { //Itera sobre o array de tarefas e exibe cada uma delas.
    for (let i = 0; i < tarefas.length; i++) {
        exibirTarefaDoIndice(i);
    }
}

const informacoes = () => { //Coleta as informações dos elementos HTML necessários para adicionar uma tarefa.
    const inputTarefa = document.getElementById('task-input'); //Coleta o input de tarefa.
    const prioridadeValue = document.getElementById('priority-input').value; //Coleta o valor da prioridade selecionada.
    const tasksList = document.getElementById("task-list"); //Coleta a lista de tarefas onde as novas tarefas serão exibidas.
    return [inputTarefa, prioridadeValue, tasksList]; //Retorna os valores.
};

const eventMarcaDagua = () => { // Permite que a marca d'água seja selecionada para todos os itens em conjunto.
    //Evento para a troca do estilo da marca d'água.
    document.getElementById('estiloMarcaDagua').addEventListener('change', (e) => {

        const novoEstilo = e.target.value; //Pega qual será o novo estilo selecionado.
        localStorage.setItem('estiloMarcaDagua', novoEstilo); //Salva o estilo no localStorage.

        const todasAsTarefas = document.querySelectorAll('#task-list li'); //Pega cada elemento da lista.
        todasAsTarefas.forEach(tarefa => { //Identifica qual a nova marca d'água.
            tarefa.classList.remove('marca-canto', 'marca-centro'); //Remove o tipo da marca d'água.
            if (novoEstilo === 'canto') { //Verifica o tipo da marca d'água (caso seja "canto").
                tarefa.classList.add('marca-canto'); //Adiciona o estilo "canto" na marca d'água.
            } else if (novoEstilo === 'centro') { //Verifica o tipo da marca d'água (caso seja "centralizada").
                tarefa.classList.add('marca-centro'); //Adiciona o estilo "centralizado" na marca d'água.
            }
            //Se for 'nenhum', nada será adicionado.
        });
    });
};
eventMarcaDagua();

//Adiciona um evento de tecla "Enter" para o input de tarefa, permitindo adicionar a tarefa ao pressionar "Enter".
const inputEnter = () => document.getElementById('task-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') { //Verifica se a tecla pressionada é "Enter".
        adicionar(); //Chama a função para adicionar a tarefa.
        event.preventDefault(); //Previne o comportamento padrão do evento.
    }
});
inputEnter();
//#endregion Utilitários
//----------------------------------------------------
//#region Botões de Ação

function filtrarTarefas() {
    const statusValue = document.getElementById('filtroStatus').value;
    const prioridadeValue = document.getElementById('filtroPrioridade').value;

    const elementosLi = document.querySelectorAll('#task-list li');

    elementosLi.forEach(tarefaLi => {
        const indice = parseInt(tarefaLi.dataset.indice);
        const prioridade = tarefaLi.dataset.prioridade;
        const tarefa = tarefas[indice];

        const bateStatus = 
            statusValue === '' || 
            (statusValue === 'completa' && tarefa.concluida) ||
            (statusValue === 'pendente' && !tarefa.concluida);

        const batePrioridade = 
            prioridadeValue === '' || 
            prioridadeValue === prioridade;

        if (bateStatus && batePrioridade) {
            tarefaLi.style.display = '';
        } else {
            tarefaLi.style.display = 'none';
        }
    });
}

document.getElementById('filtroStatus').addEventListener('change', filtrarTarefas);
document.getElementById('filtroPrioridade').addEventListener('change', filtrarTarefas);

const botaoRemover = (indice) => { //Cria um botão para remover uma tarefa específica do array de tarefas.
    const link = document.createElement('button'); //Cria um elemento de botão.
    link.textContent = "REMOVER"; //Define o texto do botão.
    link.className = "btn-remove"; //Adiciona uma classe para o botão.

    const [, , listaTarefas] = informacoes(); //Coleta a lista de tarefas para poder remover o item da lista HTML.

    link.addEventListener("click", (event) => { //Adiciona um evento de clique ao botão.
        let confirm = window.confirm('Você tem certeza que deseja remover esta tarefa?');
        if (!confirm) return; //Verifica se o usuário realmente deseja remover a tarefa.

        event.preventDefault(); //Previne o comportamento padrão do botão.

        const tarefaLi = link.closest('li'); //Pega o elemento li mais próximo do botão clicado.

        if (tarefaLi) { //Verifica se o elemento li existe.
            tarefaLi.classList.add('removendo'); //Adiciona a classe 'removendo'.
            setTimeout(() => { //Define o time em que a tarefa será excluída.
                tarefas.splice(indice, 1); //Remove a tarefa do array usando o indice de base.
                salvarTarefasNoStorage();  //Salva as alterações feitas.
                listaTarefas.innerHTML = ''; //Limpa a lista de tarefas do HTML.
                exibirTodasAsTarefas(); //Exibe novamente as tarefas (atualizadas).
                console.log(tarefas); //Log das tarefas.
            }, 400) //Define o tempo de remoção da tarefa em 400ms.
        }
    });

    return link;
};



const botaoConfirmar = (indice) => { //Cria um botão para confirmar a conclusão de uma tarefa específica.
    const link = document.createElement('button'); //Cria um elemento de botão.

    let permitido = tarefas[indice].concluida; //Define o status inicial com base na tarefa armazenada.
    aplicarEstiloBotaoConfirmar(link, permitido); //Aplica os estilos ao botão de confirmar.

    link.addEventListener("click", () => { //Adiciona um evento de clique ao botão.
        permitido = !permitido; //Inverte o estado de conclusão da tarefa.


        tarefas[indice].concluida = permitido; //Atualiza o objeto no array com base no novo estado.
        salvarTarefasNoStorage(); //Salva as alterações no localStorage.
        aplicarEstiloBotaoConfirmar(link, permitido, 'COMPLETA', 'PENDENTE'); //Aplica o estilo atualizado ao botão.
    });

    return link;
};
//#endregion Botões de Ação
//----------------------------------------------------
//#region Estilos de elementos HTML

const aplicarEstiloMarcaDagua = (elemento) => { //Aplica qual o estilo que foi selecionado pelo usuário.
    const estilo = localStorage.getItem('estiloMarcaDagua') || 'nenhum'; //Pega o item da "marca d'água".

    elemento.classList.remove('marca-canto', 'marca-centro'); //Remove os elementos da marca d'água.

    if (estilo === 'canto') { //Verifica qual o estilo da marca d'água está na classe do elemento.
        elemento.classList.add('marca-canto'); //Adiciona "marca-canto" caso o estilo seja "canto".
    } else if (estilo === 'centro') { //Verifica qual o estilo da marca d'água está na classe do elemento.
        elemento.classList.add('marca-centro'); //Adiciona "marca-centro" caso o estilo seja "centro".
    }
};

const definirCorDaPrioridade = (elemento, prioridade) => { //Define qual a cor de cada prioridade alta, media e baixa.
    if (prioridade === 'Alta') { //Verifica qual a prioridade da tarefa.
        elemento.style.backgroundColor = '#FF7F7F'; //Adiciona a cor Vermelha.
    } else if (prioridade === 'Média') { //Verifica qual a prioridade da tarefa.
        elemento.style.backgroundColor = '#ffb347' //Adiciona a cor Amarela.
    } else { //Verifica qual a prioridade da tarefa.
        elemento.style.backgroundColor = '#2ecc71'; //Adiciona a cor Verde.
    }
}

const aplicarEstiloBotaoConfirmar = (botao, permitido) => { //Aplica estilos ao botão de confirmar tarefa.
    botao.className = 'btn-confirmar'; // sempre aplica a classe base
    botao.id = 'button-cofirm';

    if (permitido) { //Altera o estilo do botão, para diferenciar das tarefas concluidas para as inconcluídas.
        botao.textContent = 'COMPLETA'; //Coloca o texto do botão como "COMPLETA".
        botao.classList.add('completa'); //Adiciona a classe "completa" ao botão.
        botao.classList.remove('pendente'); //Remove a classe "pendente" ao botão.
    } else {
        botao.textContent = 'PENDENTE'; //Coloca o texto do botão como "PENDENTE".
        botao.classList.add('pendente'); //Adiciona a classe "pendente" ao botão.
        botao.classList.remove('completa'); //Remove a classe "completa" ao botão.
    }
};
//#endregion Estilos de elementos HTML

//#endregion Funções Auxiliares}

//===============================================================

//#region {Funções Principais 

//#region Adicionar Tarefa
//Decidindo o formato do array de armazenamento das informações de cada tarefa.
const adicionarTarefa = (afazer, preferencia, tarefaStatus) => {
    const tarefa = { //Cria um objeto tarefa com as informações fornecidas.
        descricao: afazer,
        prioridade: preferencia,
        concluida: tarefaStatus,
        data: dataAtual() //Pega a data e hora atual.
    }

    tarefas.push(tarefa); //Adiciona a nova tarefa ao array de tarefas.
    salvarTarefasNoStorage(); //Salva o array atualizado no localStorage.
    return tarefa;
};

const adicionar = () => { //Função para adicionar uma nova tarefa à lista.
    const [inputTarefa, prioridadeValue] = informacoes();

    if (inputTarefa.value === "") { //Verifica se o campo de tarefa está vazio.
        alert("Digite uma tarefa!");
        return;
    }

    adicionarTarefa(inputTarefa.value, prioridadeValue, false); //Vai pegar as informações e adicionar ao array.

    exibirTarefaDoIndice(tarefas.length - 1); //Adiciona a tarefa ao array e exibe na lista.
    inputTarefa.value = ''; //Limpa o campo de entrada após adicionar a tarefa.
    console.log(tarefas); //Log das tarefas.
};
//#endregion Adicionar Tarefa
//----------------------------------------------------
//#region Exibição das Tarefas
//Exibe as tarefas na lista HTML, criando elementos para cada tarefa e adicionando botões de ação.
const exibirTarefaDoIndice = (indice) => {
    const { descricao, prioridade, data } = tarefas[indice]
    //Coleta as informações necessárias para exibir a tarefa.
    const [, , listaTarefas] = informacoes();

    const novaTarefa = document.createElement("li"); //Cria um novo elemento de lista para a tarefa.
    novaTarefa.className = 'text-list'; //Criando uma ClassName para a tag 'li'.

    //Decidido o atributo que adicionará as prioridade.
    novaTarefa.setAttribute('data-prioridade', `${prioridade} Prioridade`);
    novaTarefa.setAttribute('data-indice', indice);

    definirCorDaPrioridade(novaTarefa, prioridade); //Coloca a cor de fundo de acordo com cada prioridade.
    aplicarEstiloMarcaDagua(novaTarefa); //Aplica o estilo da marca d'água, e onde será exibida.

    const texto = document.createElement("span"); //Cria um elemento de texto para exibir a descrição da tarefa.
    texto.textContent = `${descricao} - Data: ${data}`; //Define o texto da tarefa com as informações coletadas.

    const containerBotoes = document.createElement("div"); //Cria um contêiner para os botões de ação.
    containerBotoes.style.display = "flex"; //Define o display do contêiner como flexível.
    containerBotoes.style.gap = "8px"; //Adiciona um espaçamento entre os botões.

    const removerTarefa = botaoRemover(indice); //Cria o botão de remover tarefa, passando o índice da tarefa.
    const confirmar = botaoConfirmar(indice); //Cria o botão de confirmar tarefa, passando o índice da tarefa.

    containerBotoes.appendChild(confirmar); //Adiciona o botão de confirmar ao contêiner de botões.
    containerBotoes.appendChild(removerTarefa); //Adiciona o botão de remover ao contêiner de botões.

    novaTarefa.appendChild(texto); //Adiciona o texto da tarefa ao elemento de lista.
    novaTarefa.appendChild(containerBotoes); //Adiciona o contêiner de botões ao elemento de lista.

    listaTarefas.appendChild(novaTarefa); //Adiciona a nova tarefa à lista de tarefas no HTML.
};
//#endregion Exibição das Tarefas

//#endregion Funções Principais}

//===============================================================

//#region {Limpeza de Tarefas

const limparTarefas = () => { //Função para limpar todas as tarefas da lista.
    const [input, , lista] = informacoes();

    if (tarefas.length === 0) { //Verifica se não há tarefas para limpar.
        alert("Não há tarefas para limpar!");
        return;
    }
    //Solicita confirmação do usuário antes de limpar as tarefas.
    const confirmacao = window.confirm("Você tem certeza que deseja limpar todas as tarefas?");
    if (!confirmacao) return;

    const itens = lista.querySelectorAll('li'); //Pega todos os <li> da lista.

    itens.forEach(li => {
        li.classList.add('removendo'); //Aplica a animação de remoção.
    });

    //Espera a animação acabar antes de limpar.
    setTimeout(() => {
        tarefas.length = 0; //Limpa o array.
        salvarTarefasNoStorage(); //Atualiza o loczalStorage.
        lista.innerHTML = ''; //Limpa visualmente.
        input.value = ''; //Limpa o campo de entrada.
    }, 400); //Duração igual à da animação CSS.
};
//#endregion Limpeza de Tarefas}

//===============================================================

//#region {Eventos
window.onload = () => { //Executará todas as informações guardadas ao carregar da página.
    const estiloSalvo = localStorage.getItem('estiloMarcaDagua') || 'nenhum'; //Pega o estilo das marcas d'água.
    document.getElementById('estiloMarcaDagua').value = estiloSalvo; //Define o valor do estilo das marcas d'água.

    exibirTodasAsTarefas(); //Exibe todas as tarefas salvas.
    console.log(tarefas); //Log das tarefas.
};
//#endregion Eventos}