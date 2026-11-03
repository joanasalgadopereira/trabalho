
  // ESPERAR QUE O HTML ESTEJA CARREGADO

document.addEventListener("DOMContentLoaded", function () {


    // SELECIONAR A LISTA DE RESERVAS

    const listaReservas =
        document.querySelector("#lista_reservas");


    // SELECIONAR OS ELEMENTOS DA SESSÃO

    const botaoEntrar =
        document.querySelector("#entrar_admin");

    const botaoTerminarSessao =
        document.querySelector("#terminar_sessao");

    const botaoVoltarPainel =
        document.querySelector("#voltar_painel");

    const textoAreaReservas =
        document.querySelector("#texto_area_reservas");


    // SELECIONAR OS FILTROS

    const filtrosReservas =
        document.querySelector("#filtros_reservas");

    const pesquisaReserva =
        document.querySelector("#pesquisa_reserva");

    const filtroEstado =
        document.querySelector("#filtro_estado");

    const ordenarReservas =
        document.querySelector("#ordenar_reservas");


    // RECEBER O TOKEN DO ADMINISTRADOR

    const tokenAdmin =
        localStorage.getItem(
            "token_admin"
        );


    // GUARDAR AS RESERVAS RECEBIDAS

    let reservasCarregadas = [];



    // NORMALIZAR TEXTO PARA PESQUISA

    function normalizarTexto(valor) {

        return String(
            valor || ""
        )
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );

    }



    // FORMATAR UMA DATA

    function formatarData(data) {

        if (!data) {

            return "Não indicada";

        }


        const dataLimpa =
            String(data).slice(
                0,
                10
            );


        const partesData =
            dataLimpa.split("-");


        if (
            partesData.length !== 3
        ) {

            return data;

        }


        return (
            partesData[2] +
            "/" +
            partesData[1] +
            "/" +
            partesData[0]
        );

    }



    // FORMATAR UMA HORA

    function formatarHora(hora) {

        if (!hora) {

            return "Não indicada";

        }


        return String(
            hora
        ).slice(
            0,
            5
        );

    }



    // FORMATAR O ESTADO

    function formatarEstado(estado) {

        if (
            estado === "pendente"
        ) {

            return "Pendente";

        }


        if (
            estado === "confirmada"
        ) {

            return "Confirmada";

        }


        if (
            estado === "concluida"
        ) {

            return "Concluída";

        }


        return estado;

    }



    // VERIFICAR SE A RESERVA TEM TAXI

    function reservaTemTaxi(reserva) {

        const taxiAdicionado =
            reserva.incluir_taxi === true ||
            Number(
                reserva.incluir_taxi
            ) === 1;


        const servicoTaxi =
            normalizarTexto(
                reserva.servico
            ).includes(
                "taxi"
            );


        return (
            taxiAdicionado ||
            servicoTaxi
        );

    }



    // MOSTRAR A ÁREA SEM SESSÃO

    function mostrarAreaSemSessao() {

        botaoEntrar.hidden =
            false;

        botaoTerminarSessao.hidden =
            true;

        botaoVoltarPainel.hidden =
            true;


        filtrosReservas.style.display =
            "none";


        textoAreaReservas.textContent =
            "Inicia sessão para consultar e gerir as reservas.";


        listaReservas.innerHTML =
            "";

    }



    // MOSTRAR A ÁREA COM SESSÃO

    function mostrarAreaComSessao() {

        botaoEntrar.hidden =
            true;

        botaoTerminarSessao.hidden =
            false;

        botaoVoltarPainel.hidden =
            false;


        filtrosReservas.style.display =
            "grid";


        textoAreaReservas.textContent =
            "Consulta e gere as marcações do Entre Patas.";

    }



    // TERMINAR A SESSÃO

    function terminarSessao() {

        localStorage.removeItem(
            "token_admin"
        );


        reservasCarregadas =
            [];


        window.location.href =
            "login.html";

    }



    // TERMINAR A SESSÃO AO CLICAR

    botaoTerminarSessao.addEventListener(
        "click",
        function () {

            terminarSessao();

        }
    );



    // EDITAR UMA RESERVA

    async function editarReserva(
        idReserva,
        estado,
        observacoes
    ) {

        try {


            // ENVIAR AS ALTERAÇÕES PARA O BACKEND

            const resposta =
                await fetch(
                    "http://localhost:3000/api/reservas/" +
                    idReserva,
                    {

                        method:
                            "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " +
                                tokenAdmin

                        },

                        body:
                            JSON.stringify({

                                estado:
                                    estado,

                                observacoes:
                                    observacoes

                            })

                    }
                );


            // VERIFICAR SE A SESSÃO TERMINOU

            if (
                resposta.status === 401 ||
                resposta.status === 403
            ) {

                terminarSessao();

                return;

            }


            // LER A RESPOSTA

            const dadosResposta =
                await resposta.json();


            // VERIFICAR SE EXISTIU ALGUM ERRO

            if (!resposta.ok) {

                alert(
                    dadosResposta.mensagem
                );

                return;

            }


            // MOSTRAR A CONFIRMAÇÃO

            alert(
                dadosResposta.mensagem
            );


            // ATUALIZAR A LISTA

            await carregarReservas();

        }


        catch (erro) {

            console.log(
                "Erro ao editar a reserva:"
            );

            console.log(
                erro
            );


            alert(
                "Não foi possível editar a reserva."
            );

        }

    }



    // ELIMINAR UMA RESERVA

    async function eliminarReserva(
        idReserva
    ) {


        // PEDIR CONFIRMAÇÃO

        const confirmarEliminacao =
            confirm(
                "Tens a certeza de que queres eliminar esta reserva?"
            );


        if (
            confirmarEliminacao === false
        ) {

            return;

        }


        try {


            // PEDIR AO BACKEND PARA ELIMINAR

            const resposta =
                await fetch(
                    "http://localhost:3000/api/reservas/" +
                    idReserva,
                    {

                        method:
                            "DELETE",

                        headers: {

                            "Authorization":
                                "Bearer " +
                                tokenAdmin

                        }

                    }
                );


            // VERIFICAR SE A SESSÃO TERMINOU

            if (
                resposta.status === 401 ||
                resposta.status === 403
            ) {

                terminarSessao();

                return;

            }


            // LER A RESPOSTA

            const dadosResposta =
                await resposta.json();


            // VERIFICAR SE EXISTIU ALGUM ERRO

            if (!resposta.ok) {

                alert(
                    dadosResposta.mensagem
                );

                return;

            }


            // MOSTRAR A CONFIRMAÇÃO

            alert(
                dadosResposta.mensagem
            );


            // ATUALIZAR A LISTA

            await carregarReservas();

        }


        catch (erro) {

            console.log(
                "Erro ao eliminar a reserva:"
            );

            console.log(
                erro
            );


            alert(
                "Não foi possível eliminar a reserva."
            );

        }

    }



    // MOSTRAR AS RESERVAS

    function mostrarReservas(reservas) {


        // LIMPAR A LISTA

        listaReservas.innerHTML =
            "";


        // VERIFICAR SE EXISTEM RESERVAS

        if (
            reservas.length === 0
        ) {

            const mensagem =
                document.createElement(
                    "p"
                );


            mensagem.textContent =
                "Nenhuma reserva encontrada.";


            listaReservas.appendChild(
                mensagem
            );


            return;

        }



        // CRIAR UM CARTÃO PARA CADA RESERVA

        reservas.forEach(
            function (reserva) {


                // CRIAR O CARTÃO

                const cartao =
                    document.createElement(
                        "article"
                    );


                cartao.classList.add(
                    "reserva-card"
                );



                // CRIAR O CABEÇALHO

                const cabecalho =
                    document.createElement(
                        "div"
                    );


                cabecalho.classList.add(
                    "reserva-card-header"
                );



                // CRIAR O TÍTULO

                const titulo =
                    document.createElement(
                        "h2"
                    );


                titulo.textContent =
                    reserva.nome_animal +
                    " — " +
                    reserva.servico;



                // CRIAR O ESTADO

                const estado =
                    document.createElement(
                        "p"
                    );


                estado.classList.add(
                    "reserva-estado",
                    "reserva-estado-" +
                        reserva.estado
                );


                estado.textContent =
                    formatarEstado(
                        reserva.estado
                    );



                cabecalho.appendChild(
                    titulo
                );


                cabecalho.appendChild(
                    estado
                );



                // CRIAR O NÚMERO DA RESERVA

                const numeroReserva =
                    document.createElement(
                        "p"
                    );


                numeroReserva.textContent =
                    "Reserva #" +
                    reserva.id_reserva;



                // CRIAR O NOME DO TUTOR

                const tutor =
                    document.createElement(
                        "p"
                    );


                tutor.textContent =
                    "Tutor: " +
                    reserva.nome_tutor;



                // CRIAR O TELEFONE

                const telefone =
                    document.createElement(
                        "p"
                    );


                telefone.textContent =
                    "Telefone: " +
                    (
                        reserva.telefone ||
                        "Não indicado"
                    );



                // CRIAR O EMAIL

                const email =
                    document.createElement(
                        "p"
                    );


                email.textContent =
                    "Email: " +
                    (
                        reserva.email ||
                        "Não indicado"
                    );



                // CRIAR A ESPÉCIE

                const especie =
                    document.createElement(
                        "p"
                    );


                especie.textContent =
                    "Espécie: " +
                    reserva.especie;



                // CRIAR O HORÁRIO

                const horarioReserva =
                    document.createElement(
                        "p"
                    );


                horarioReserva.textContent =
                    "Horário: " +
                    formatarData(
                        reserva.data
                    ) +
                    " — " +
                    formatarHora(
                        reserva.hora_inicio
                    ) +
                    " às " +
                    formatarHora(
                        reserva.hora_fim
                    );



                // CRIAR A LOCALIZAÇÃO

                const localizacao =
                    document.createElement(
                        "p"
                    );


                let textoLocalizacao =
                    reserva.morada_servico;


                if (
                    reserva.codigo_postal
                ) {

                    textoLocalizacao +=
                        ", " +
                        reserva.codigo_postal;

                }


                if (
                    reserva.concelho
                ) {

                    textoLocalizacao +=
                        " — " +
                        reserva.concelho;

                }


                localizacao.textContent =
                    "Local: " +
                    textoLocalizacao;



                // CRIAR AS OBSERVAÇÕES

                const observacoes =
                    document.createElement(
                        "p"
                    );


                observacoes.textContent =
                    "Observações: " +
                    (
                        reserva.observacoes ||
                        "Sem observações"
                    );



                // CRIAR A ZONA DO TAXI

                let blocoTaxi =
                    null;


                if (
                    reservaTemTaxi(
                        reserva
                    )
                ) {

                    blocoTaxi =
                        document.createElement(
                            "div"
                        );


                    blocoTaxi.classList.add(
                        "reserva-taxi"
                    );


                    const tituloTaxi =
                        document.createElement(
                            "h3"
                        );


                    tituloTaxi.textContent =
                        "Entre Patas Taxi";



                    const origemTaxi =
                        document.createElement(
                            "p"
                        );


                    origemTaxi.textContent =
                        "Origem: " +
                        (
                            reserva.origem_taxi ||
                            "Não indicada"
                        );



                    const destinoTaxi =
                        document.createElement(
                            "p"
                        );


                    destinoTaxi.textContent =
                        "Destino: " +
                        (
                            reserva.destino_taxi ||
                            "Não indicado"
                        );



                    const dataHoraTaxi =
                        document.createElement(
                            "p"
                        );


                    dataHoraTaxi.textContent =
                        "Data e hora: " +
                        formatarData(
                            reserva.data_taxi
                        ) +
                        " — " +
                        formatarHora(
                            reserva.hora_taxi
                        );



                    blocoTaxi.appendChild(
                        tituloTaxi
                    );


                    blocoTaxi.appendChild(
                        origemTaxi
                    );


                    blocoTaxi.appendChild(
                        destinoTaxi
                    );


                    blocoTaxi.appendChild(
                        dataHoraTaxi
                    );

                }



                // CRIAR A ZONA DOS BOTÕES

                const zonaAcoes =
                    document.createElement(
                        "div"
                    );


                zonaAcoes.classList.add(
                    "reserva-acoes"
                );



                // CRIAR O BOTÃO DE EDITAR

                const botaoEditar =
                    document.createElement(
                        "button"
                    );


                botaoEditar.type =
                    "button";


                botaoEditar.textContent =
                    "Editar";


                botaoEditar.classList.add(
                    "btn",
                    "btn-edit"
                );



                // CRIAR O BOTÃO DE ELIMINAR

                const botaoEliminar =
                    document.createElement(
                        "button"
                    );


                botaoEliminar.type =
                    "button";


                botaoEliminar.textContent =
                    "Eliminar";


                botaoEliminar.classList.add(
                    "btn",
                    "btn-delete"
                );



                zonaAcoes.appendChild(
                    botaoEditar
                );


                zonaAcoes.appendChild(
                    botaoEliminar
                );



                // CRIAR A ZONA DE EDIÇÃO

                const zonaEdicao =
                    document.createElement(
                        "div"
                    );


                zonaEdicao.classList.add(
                    "reserva-edicao"
                );


                zonaEdicao.style.display =
                    "none";



                // CRIAR O GRUPO DO ESTADO

                const grupoEstado =
                    document.createElement(
                        "div"
                    );


                grupoEstado.classList.add(
                    "form-group"
                );



                const labelEstado =
                    document.createElement(
                        "label"
                    );


                const selecionarEstado =
                    document.createElement(
                        "select"
                    );


                selecionarEstado.id =
                    "estado_reserva_" +
                    reserva.id_reserva;


                labelEstado.htmlFor =
                    selecionarEstado.id;


                labelEstado.textContent =
                    "Estado";



                // CRIAR OS ESTADOS POSSÍVEIS

                const estados = [

                    {
                        valor:
                            "pendente",

                        texto:
                            "Pendente"
                    },

                    {
                        valor:
                            "confirmada",

                        texto:
                            "Confirmada"
                    },

                    {
                        valor:
                            "concluida",

                        texto:
                            "Concluída"
                    }

                ];



                estados.forEach(
                    function (
                        estadoReserva
                    ) {


                        const opcao =
                            document.createElement(
                                "option"
                            );


                        opcao.value =
                            estadoReserva.valor;


                        opcao.textContent =
                            estadoReserva.texto;



                        if (
                            estadoReserva.valor ===
                            reserva.estado
                        ) {

                            opcao.selected =
                                true;

                        }


                        selecionarEstado.appendChild(
                            opcao
                        );

                    }
                );



                grupoEstado.appendChild(
                    labelEstado
                );


                grupoEstado.appendChild(
                    selecionarEstado
                );



                // CRIAR O GRUPO DAS OBSERVAÇÕES

                const grupoObservacoes =
                    document.createElement(
                        "div"
                    );


                grupoObservacoes.classList.add(
                    "form-group"
                );



                const labelObservacoes =
                    document.createElement(
                        "label"
                    );


                const campoObservacoes =
                    document.createElement(
                        "textarea"
                    );


                campoObservacoes.id =
                    "observacoes_reserva_" +
                    reserva.id_reserva;


                labelObservacoes.htmlFor =
                    campoObservacoes.id;


                labelObservacoes.textContent =
                    "Observações";


                campoObservacoes.value =
                    reserva.observacoes ||
                    "";


                campoObservacoes.placeholder =
                    "Observações";


                campoObservacoes.rows =
                    4;



                grupoObservacoes.appendChild(
                    labelObservacoes
                );


                grupoObservacoes.appendChild(
                    campoObservacoes
                );



                // CRIAR O BOTÃO DE GUARDAR

                const botaoGuardar =
                    document.createElement(
                        "button"
                    );


                botaoGuardar.type =
                    "button";


                botaoGuardar.textContent =
                    "Guardar alterações";


                botaoGuardar.classList.add(
                    "btn",
                    "btn-primary"
                );



                // MOSTRAR OU ESCONDER A EDIÇÃO

                botaoEditar.addEventListener(
                    "click",
                    function () {


                        if (
                            zonaEdicao.style.display ===
                            "none"
                        ) {

                            zonaEdicao.style.display =
                                "block";


                            botaoEditar.textContent =
                                "Cancelar edição";

                        }


                        else {

                            zonaEdicao.style.display =
                                "none";


                            botaoEditar.textContent =
                                "Editar";

                        }

                    }
                );



                // GUARDAR AS ALTERAÇÕES

                botaoGuardar.addEventListener(
                    "click",
                    function () {

                        editarReserva(
                            reserva.id_reserva,
                            selecionarEstado.value,
                            campoObservacoes.value.trim()
                        );

                    }
                );



                // ELIMINAR A RESERVA

                botaoEliminar.addEventListener(
                    "click",
                    function () {

                        eliminarReserva(
                            reserva.id_reserva
                        );

                    }
                );



                // ADICIONAR À ZONA DE EDIÇÃO

                zonaEdicao.appendChild(
                    grupoEstado
                );


                zonaEdicao.appendChild(
                    grupoObservacoes
                );


                zonaEdicao.appendChild(
                    botaoGuardar
                );



                // ADICIONAR OS DADOS AO CARTÃO

                cartao.appendChild(
                    cabecalho
                );


                cartao.appendChild(
                    numeroReserva
                );


                cartao.appendChild(
                    tutor
                );


                cartao.appendChild(
                    telefone
                );


                cartao.appendChild(
                    email
                );


                cartao.appendChild(
                    especie
                );


                cartao.appendChild(
                    horarioReserva
                );


                cartao.appendChild(
                    localizacao
                );


                if (
                    blocoTaxi !== null
                ) {

                    cartao.appendChild(
                        blocoTaxi
                    );

                }


                cartao.appendChild(
                    observacoes
                );


                cartao.appendChild(
                    zonaAcoes
                );


                cartao.appendChild(
                    zonaEdicao
                );



                // ADICIONAR O CARTÃO À LISTA

                listaReservas.appendChild(
                    cartao
                );

            }
        );

    }



    // APLICAR A PESQUISA, FILTRO E ORDENAÇÃO

    function aplicarFiltros() {


        // RECEBER O TEXTO DA PESQUISA

        const textoPesquisa =
            normalizarTexto(
                pesquisaReserva.value.trim()
            );


        // RECEBER O ESTADO ESCOLHIDO

        const estadoEscolhido =
            filtroEstado.value;



        // FILTRAR AS RESERVAS

        const reservasFiltradas =
            reservasCarregadas.filter(
                function (reserva) {


                    const camposPesquisa = [

                        reserva.nome_tutor,

                        reserva.nome_animal,

                        reserva.telefone,

                        reserva.email,

                        reserva.especie,

                        reserva.servico,

                        reserva.concelho,

                        reserva.codigo_postal

                    ];



                    const pesquisaCorresponde =
                        textoPesquisa === "" ||
                        camposPesquisa.some(
                            function (campo) {

                                return normalizarTexto(
                                    campo
                                ).includes(
                                    textoPesquisa
                                );

                            }
                        );



                    const estadoCorresponde =
                        estadoEscolhido === "" ||
                        reserva.estado ===
                        estadoEscolhido;



                    return (
                        pesquisaCorresponde &&
                        estadoCorresponde
                    );

                }
            );



        // ORDENAR POR DATA MAIS PRÓXIMA

        if (
            ordenarReservas.value ===
            "data_asc"
        ) {

            reservasFiltradas.sort(
                function (
                    reservaA,
                    reservaB
                ) {


                    const dataHoraA =
                        reservaA.data +
                        reservaA.hora_inicio;


                    const dataHoraB =
                        reservaB.data +
                        reservaB.hora_inicio;


                    return dataHoraA.localeCompare(
                        dataHoraB
                    );

                }
            );

        }



        // ORDENAR POR DATA MAIS DISTANTE

        else if (
            ordenarReservas.value ===
            "data_desc"
        ) {

            reservasFiltradas.sort(
                function (
                    reservaA,
                    reservaB
                ) {


                    const dataHoraA =
                        reservaA.data +
                        reservaA.hora_inicio;


                    const dataHoraB =
                        reservaB.data +
                        reservaB.hora_inicio;


                    return dataHoraB.localeCompare(
                        dataHoraA
                    );

                }
            );

        }



        // ORDENAR PELO NOME DO ANIMAL

        else if (
            ordenarReservas.value ===
            "animal"
        ) {

            reservasFiltradas.sort(
                function (
                    reservaA,
                    reservaB
                ) {

                    return reservaA.nome_animal
                        .localeCompare(
                            reservaB.nome_animal,
                            "pt"
                        );

                }
            );

        }



        // ORDENAR PELO NOME DO TUTOR

        else if (
            ordenarReservas.value ===
            "tutor"
        ) {

            reservasFiltradas.sort(
                function (
                    reservaA,
                    reservaB
                ) {

                    return reservaA.nome_tutor
                        .localeCompare(
                            reservaB.nome_tutor,
                            "pt"
                        );

                }
            );

        }



        // MOSTRAR O RESULTADO

        mostrarReservas(
            reservasFiltradas
        );

    }



    // CARREGAR AS RESERVAS

    async function carregarReservas() {

        try {


            // MOSTRAR QUE AS RESERVAS ESTÃO A CARREGAR

            listaReservas.innerHTML =
                "";


            const mensagemCarregar =
                document.createElement(
                    "p"
                );


            mensagemCarregar.textContent =
                "A carregar reservas...";


            listaReservas.appendChild(
                mensagemCarregar
            );



            // PEDIR AS RESERVAS AO BACKEND

            const resposta =
                await fetch(
                    "http://localhost:3000/api/reservas",
                    {

                        headers: {

                            "Authorization":
                                "Bearer " +
                                tokenAdmin

                        }

                    }
                );



            // VERIFICAR SE A SESSÃO TERMINOU

            if (
                resposta.status === 401 ||
                resposta.status === 403
            ) {

                terminarSessao();

                return;

            }



            // VERIFICAR SE EXISTIU ALGUM ERRO

            if (!resposta.ok) {

                throw new Error(
                    "Erro ao carregar as reservas."
                );

            }



            // GUARDAR AS RESERVAS RECEBIDAS

            reservasCarregadas =
                await resposta.json();



            // APLICAR OS FILTROS

            aplicarFiltros();

        }


        catch (erro) {

            console.log(
                "Erro ao carregar as reservas:"
            );


            console.log(
                erro
            );


            listaReservas.innerHTML =
                "";


            const mensagemErro =
                document.createElement(
                    "p"
                );


            mensagemErro.textContent =
                "Não foi possível carregar as reservas.";


            listaReservas.appendChild(
                mensagemErro
            );

        }

    }



    // PESQUISAR ENQUANTO ESCREVE

    pesquisaReserva.addEventListener(
        "input",
        function () {

            aplicarFiltros();

        }
    );



    // FILTRAR QUANDO O ESTADO MUDA

    filtroEstado.addEventListener(
        "change",
        function () {

            aplicarFiltros();

        }
    );



    // ORDENAR QUANDO A OPÇÃO MUDA

    ordenarReservas.addEventListener(
        "change",
        function () {

            aplicarFiltros();

        }
    );



    // VERIFICAR A SESSÃO QUANDO A PÁGINA ABRE

    if (
        tokenAdmin === null
    ) {

        mostrarAreaSemSessao();

    }


    else {

        mostrarAreaComSessao();

        carregarReservas();

    }


});