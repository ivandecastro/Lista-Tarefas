//#region {Variáveis Globais
const tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; //Array dos alunos.

//Se não houver tarefas no localStorage, inicializa com um array vazio.
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
    //Pega os valores dos filtros de status, prioridade e texto.
    const statusValue = document.getElementById('filtroStatus').value;
    const prioridadeValue = document.getElementById('filtroPrioridade').value;
    const filtroTexto = document.getElementById('filtroTexto').value.toLowerCase();
    const elementosLi = document.querySelectorAll('#task-list li');

    let algumaTarefaVisivel = false; //Variável para verificar se alguma tarefa está visível após a filtragem.

    elementosLi.forEach(tarefaLi => { //Ele vai pegar todos os elementos <li> e verificar se eles vão aparecer ou não.

        //Pega o índice da tarefa a partir do atributo data-indice do elemento <li>.
        const indice = parseInt(tarefaLi.dataset.indice);
        if (isNaN(indice)) return; //Se o índice não for um número válido, sai da função.

        const tarefa = tarefas[indice]; //Pega a tarefa correspondente ao índice.
        if (!tarefa) return; //Se a tarefa não existir, ele interrompe a função.

        //Pega a prioridade da tarefa a partir do dataset do elemento li.
        const prioridade = tarefaLi.dataset.prioridade;
        const partes = tarefaLi.textContent.split('-'); //Separa o texto do elemento li em partes, pelo ifen.
        const descricaoDaTarefa = partes[0].trim().toLowerCase(); //Pega a descrição da tarefa e deixa em minúsculas.
        const temData = partes.length > 1 && partes[1].includes(':'); //Verifica se há uma data na tarefa.
        const dataDaTarefa = temData ? partes[1].split(':')[1].trim() : ''; //Pega a data da tarefa, se existir.

        const bateStatus = //Verifica se o status da tarefa bate com o filtro selecionado.
            statusValue === '' ||
            (statusValue === 'completa' && tarefa.concluida) ||
            (statusValue === 'pendente' && !tarefa.concluida);

        const batePrioridade = //Verifica se a prioridade da tarefa bate com o filtro selecionado.
            prioridadeValue === '' ||
            prioridadeValue === prioridade;

        const bateDescricaoEData = //Verifica se a descrição ou a data da tarefa bate com o filtro de texto.
            descricaoDaTarefa.includes(filtroTexto) ||
            dataDaTarefa.includes(filtroTexto);

        //Pega todas as condições para verificação.
        const deveFicarVisivel = bateStatus && batePrioridade && bateDescricaoEData;
        //Verifica se a tarefa estava visível antes da filtragem.
        const visivelAntes = tarefaLi.style.display !== 'none';

        if (deveFicarVisivel && !visivelAntes) { //If que executa a filtração de cada tarefa.
            tarefaLi.classList.remove('removendo'); //Remove a animação de remoção.
            tarefaLi.classList.add('aparecendo'); //Adiciona a animação de aparecimento.
            setTimeout(() => {
                tarefaLi.style.display = ''; //Define o display como vazio para que o CSS controle a visibilidade.
            }, 500);
        } else if (!deveFicarVisivel && visivelAntes) { //If que executa a remoção de cada tarefa na filtragem.
            tarefaLi.classList.remove('aparecendo'); //Remove a animação de aparecimento.
            tarefaLi.classList.add('removendo'); //Adiciona a animação de remoção.
            setTimeout(() => {
                tarefaLi.style.display = 'none'; //Define o display como 'none' para ocultar a tarefa.
            }, 500);
        }

        if (deveFicarVisivel) {
            algumaTarefaVisivel = true; //Se a tarefa deve ficar visível, define a variável como verdadeira.
        }
    });

    atualizarMensagemFiltro(); //Atualiza a mensagem de filtro com base nos filtros ativos.
    alertaFiltro(algumaTarefaVisivel); //Só chama isso depois de analisar TODAS.
}

const verificarFiltrosAtivos = () => {
    const statusValue = document.getElementById('filtroStatus').value; //Pega o valor do status selecionado.
    const prioridadeValue = document.getElementById('filtroPrioridade').value; //Pega o valor da prioridade selecionada.
    const filtroTexto = document.getElementById('filtroTexto').value; //Pega o valor do texto digitado no filtro.

    return statusValue || prioridadeValue || filtroTexto; //Verifica se algum filtro está ativo.
}

//Exibe uma mensagem de alerta se não houver tarefas visíveis após a filtragem.
const alertaFiltro = (algumaVisivel) => {
    let aviso = document.getElementById('aviso-filtro'); //Pega o elemento de aviso, se existir.
    if (!aviso) { //Se o aviso não existir, cria um novo elemento de aviso.
        aviso = document.createElement('li');
        //Configura o estilo do aviso.
        aviso.id = 'aviso-filtro';
        aviso.style.textAlign = 'left';
        aviso.style.color = '#888';
        aviso.style.fontStyle = 'italic';
        aviso.style.fontSize = '1.5rem';
        aviso.style.display = 'none';
        document.getElementById('task-list').appendChild(aviso); //Adiciona o aviso à lista de tarefas.
    }

    aviso.textContent = 'Nenhuma tarefa encontrada.'; //Define o texto do aviso.

    if (algumaVisivel === true) { //Se houver tarefas visíveis, esconde o aviso.
        aviso.classList.add('removendo'); //Adiciona a animação de desaparecer.
        aviso.classList.remove('aparecendo'); //Remove a animação de aparecer.
        setTimeout(() => { //Define o tempo de animação do aviso. (500ms).
            aviso.style.display = 'none';
        }, 500);
    } else { //Se não houver tarefas visíveis, exibe o aviso.
        setTimeout(() => { //Define o tempo de execução do código (500ms).
            aviso.style.display = '';
            void aviso.offsetWidth;
            aviso.classList.add('aparecendo'); //Adiciona a animação de aparecer.
            aviso.classList.remove('removendo'); //Remove a animação de desaparecer.
        }, 500);
    }
}

const atualizarMensagemFiltro = () => { //Atualiza a mensagem de filtro com base nos filtros ativos.
    const mensagem = document.getElementById('mensagemFiltro');
    const verificarValoresFiltros = verificarFiltrosAtivos();

    if (verificarValoresFiltros !== '') { //Verifica se algum filtro está ativo.
        mensagem.style.display = 'block'; //Exibe a mensagem de filtro se algum filtro estiver ativo.
        mensagem.classList.add('aparecendo'); //Adiciona a animação de aparecer.
        mensagem.classList.remove('removendo'); //Remove a animação de desaparacer.
    } else {
        mensagem.classList.add('removendo'); //Adiciona a animação de desaparecer.
        mensagem.classList.remove('aparecendo'); //Remove a animação de aparecer.

        setTimeout(() => { //Define o tempo de ativação do código em (500ms).
            mensagem.style.display = 'none'; //Desativa a visibilidade da mensagem.
        }, 500);
    }
}

//Adiciona eventos de input e change para os filtros, chamando a função de filtragem.
document.getElementById('filtroTexto').addEventListener('input', filtrarTarefas);
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
                filtrarTarefas(); //Chama a função de filtragem para atualizar a exibição.
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

    link.addEventListener("click", (e) => { //Adiciona um evento de clique ao botão.
        permitido = !permitido; //Inverte o estado de conclusão da tarefa.

        tarefas[indice].concluida = permitido; //Atualiza o objeto no array com base no novo estado.
        filtrarTarefas();
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

    exibirTarefaDoIndice(tarefas.length - 1, true); //Adiciona a tarefa ao array e exibe na lista.
    filtrarTarefas(); //Chama a função de filtragem para atualizar a exibição.
    inputTarefa.value = ''; //Limpa o campo de entrada após adicionar a tarefa.
    console.log(tarefas); //Log das tarefas.
};
//#endregion Adicionar Tarefa
//----------------------------------------------------
//#region Exibição das Tarefas
//Exibe as tarefas na lista HTML, criando elementos para cada tarefa e adicionando botões de ação.
const exibirTarefaDoIndice = (indice, animar = false) => { //Exibe as tarefas presentes no array tarefas.
    const { descricao, prioridade, data } = tarefas[indice]; //Pega as informações de cada tarefa individualmemnte.
    const [, , listaTarefas] = informacoes(); //Pega a div <ul> do HTML.

    const novaTarefa = document.createElement("li"); //Cria uma tag <li>.
    novaTarefa.classList.add('text-list'); //Adiciona uma classe na variável novaTarefa.
    novaTarefa.setAttribute('data-prioridade', `${prioridade} Prioridade`); //Adiciona um attribute à variável novaTarefa.
    novaTarefa.setAttribute('data-indice', indice); //Adiciona um attribute à variável novaTarefa.

    definirCorDaPrioridade(novaTarefa, prioridade); //Adiciona uma cor à prioridade de cada tarefa.
    aplicarEstiloMarcaDagua(novaTarefa); //Aplica os designs nas marcas d'águas.

    const texto = document.createElement("span"); //Cria um elemento para mostrar as informações da tarefa.
    texto.textContent = `${descricao} - ${data}`; //Coloca o texto da tag <span> como a descrição e data da tarefa.

    const containerBotoes = document.createElement("div"); //Cria uma tag <div> para os botões.
    //Estilo dos botões.
    containerBotoes.style.display = "flex";
    containerBotoes.style.gap = "8px";

    //Pegando os botões Remover e akterar Status e adicionando à div containerBotoes.
    const removerTarefa = botaoRemover(indice);
    const confirmar = botaoConfirmar(indice);
    containerBotoes.appendChild(confirmar);
    containerBotoes.appendChild(removerTarefa);

    //Adicionando as divs text e containerBotoes à tag <li>.
    novaTarefa.appendChild(texto);
    novaTarefa.appendChild(containerBotoes);

    if (animar) { //Verifica se a animação inicial está ativa ou não.
        novaTarefa.classList.add('aparecendo');
        setTimeout(() => {
            novaTarefa.classList.remove('aparecendo');
        }, 500);
    }

    listaTarefas.appendChild(novaTarefa); //Adiciona a tag <li> à tag <ul>.
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