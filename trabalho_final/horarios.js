// ESPERAR QUE O HTML ESTEJA CARREGADO

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // SELECIONAR OS ELEMENTOS

        const listaHorarios =
            document.querySelector("#lista_horarios");

        const formularioHorario =
            document.querySelector("#form_horario");

        const campoData =
            document.querySelector("#data_horario");

        const campoHoraInicio =
            document.querySelector("#hora_inicio");

        const campoHoraFim =
            document.querySelector("#hora_fim");

        const botaoTerminarSessao =
            document.querySelector("#terminar_sessao");


        // RECEBER O TOKEN DO ADMINISTRADOR

        const tokenAdmin =
            localStorage.getItem("token_admin");


        // VERIFICAR SE EXISTE SESSÃO

        if (!tokenAdmin) {

            window.location.href =
                "login.html";

            return;

        }


        // TERMINAR SESSÃO

        function terminarSessao() {

            localStorage.removeItem(
                "token_admin"
            );

            window.location.href =
                "login.html";

        }


        // TERMINAR SESSÃO AO CLICAR

        botaoTerminarSessao.addEventListener(
            "click",
            function () {

                terminarSessao();

            }
        );


        // VERIFICAR SE A SESSÃO TERMINOU

        function verificarSessao(resposta) {

            if (
                resposta.status === 401 ||
                resposta.status === 403
            ) {

                terminarSessao();

                return false;

            }

            return true;

        }


        // FORMATAR A DATA

        function formatarData(data) {

            if (!data) {

                return "";

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

                return dataLimpa;

            }

            return (
                partesData[2] +
                "/" +
                partesData[1] +
                "/" +
                partesData[0]
            );

        }


        // FORMATAR A HORA

        function formatarHora(hora) {

            if (!hora) {

                return "";

            }

            return String(hora).slice(
                0,
                5
            );

        }


        // FORMATAR O ESTADO

        function formatarEstado(estado) {

            if (
                estado === "disponivel"
            ) {

                return "Disponível";

            }

            if (
                estado === "bloqueado"
            ) {

                return "Bloqueado";

            }

            return estado;

        }


        // ALTERAR O ESTADO DE UM HORÁRIO

        async function alterarEstadoHorario(
            idHorario,
            estadoAtual
        ) {


            // DEFINIR O NOVO ESTADO

            let novoEstado;

            if (
                estadoAtual ===
                "disponivel"
            ) {

                novoEstado =
                    "bloqueado";

            }

            else {

                novoEstado =
                    "disponivel";

            }


            try {


                // ENVIAR A ALTERAÇÃO PARA O BACKEND

                const resposta =
                    await fetch(
                        "http://localhost:3000/api/horarios/" +
                        idHorario,
                        {
                            method: "PUT",

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
                                        novoEstado
                                })

                        }
                    );


                // VERIFICAR A SESSÃO

                if (
                    verificarSessao(
                        resposta
                    ) === false
                ) {

                    return;

                }


                // LER A RESPOSTA

                const dadosResposta =
                    await resposta.json();


                // VERIFICAR SE EXISTIU ERRO

                if (!resposta.ok) {

                    alert(
                        dadosResposta.mensagem
                    );

                    return;

                }


                // ATUALIZAR A LISTA

                await carregarHorarios();

            }

            catch (erro) {

                console.log(
                    "Erro ao alterar o horário:"
                );

                console.log(erro);

                alert(
                    "Não foi possível alterar o estado do horário."
                );

            }

        }


        // EDITAR UM HORÁRIO

        async function editarHorario(
            idHorario,
            data,
            horaInicio,
            horaFim
        ) {


            // VALIDAR OS CAMPOS

            if (
                !data ||
                !horaInicio ||
                !horaFim
            ) {

                alert(
                    "Preenche a data, a hora de início e a hora de fim."
                );

                return;

            }


            // VALIDAR AS HORAS

            if (
                horaFim <=
                horaInicio
            ) {

                alert(
                    "A hora de fim tem de ser posterior à hora de início."
                );

                return;

            }


            try {


                // ENVIAR AS ALTERAÇÕES PARA O BACKEND

                const resposta =
                    await fetch(
                        "http://localhost:3000/api/horarios/" +
                        idHorario,
                        {
                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " +
                                    tokenAdmin

                            },

                            body:
                                JSON.stringify({

                                    data:
                                        data,

                                    hora_inicio:
                                        horaInicio,

                                    hora_fim:
                                        horaFim

                                })

                        }
                    );


                // VERIFICAR A SESSÃO

                if (
                    verificarSessao(
                        resposta
                    ) === false
                ) {

                    return;

                }


                // LER A RESPOSTA

                const dadosResposta =
                    await resposta.json();


                // VERIFICAR SE EXISTIU ERRO

                if (!resposta.ok) {

                    alert(
                        dadosResposta.mensagem
                    );

                    return;

                }


                // MOSTRAR CONFIRMAÇÃO

                alert(
                    dadosResposta.mensagem
                );


                // ATUALIZAR A LISTA

                await carregarHorarios();

            }

            catch (erro) {

                console.log(
                    "Erro ao editar o horário:"
                );

                console.log(erro);

                alert(
                    "Não foi possível editar o horário."
                );

            }

        }


        // ELIMINAR UM HORÁRIO

        async function eliminarHorario(
            idHorario
        ) {


            // PEDIR CONFIRMAÇÃO

            const confirmarEliminacao =
                confirm(
                    "Tens a certeza de que queres eliminar este horário?"
                );


            if (
                confirmarEliminacao ===
                false
            ) {

                return;

            }


            try {


                // PEDIR AO BACKEND PARA ELIMINAR

                const resposta =
                    await fetch(
                        "http://localhost:3000/api/horarios/" +
                        idHorario,
                        {
                            method: "DELETE",

                            headers: {

                                "Authorization":
                                    "Bearer " +
                                    tokenAdmin

                            }
                        }
                    );


                // VERIFICAR A SESSÃO

                if (
                    verificarSessao(
                        resposta
                    ) === false
                ) {

                    return;

                }


                // LER A RESPOSTA

                const dadosResposta =
                    await resposta.json();


                // VERIFICAR SE EXISTIU ERRO

                if (!resposta.ok) {

                    alert(
                        dadosResposta.mensagem
                    );

                    return;

                }


                // MOSTRAR CONFIRMAÇÃO

                alert(
                    dadosResposta.mensagem
                );


                // ATUALIZAR A LISTA

                await carregarHorarios();

            }

            catch (erro) {

                console.log(
                    "Erro ao eliminar o horário:"
                );

                console.log(erro);

                alert(
                    "Não foi possível eliminar o horário."
                );

            }

        }


        // CARREGAR OS HORÁRIOS

        async function carregarHorarios() {

            listaHorarios.innerHTML =
                "<p>A carregar horários...</p>";

            try {

                const resposta =
                    await fetch(
                        "http://localhost:3000/api/horarios",
                        {
                            headers: {

                                "Authorization":
                                    "Bearer " +
                                    tokenAdmin

                            }
                        }
                    );


                // VERIFICAR A SESSÃO

                if (
                    verificarSessao(
                        resposta
                    ) === false
                ) {

                    return;

                }


                // VERIFICAR SE EXISTIU ERRO

                if (!resposta.ok) {

                    throw new Error(
                        "Erro ao carregar os horários."
                    );

                }


                // RECEBER OS HORÁRIOS

                const horarios =
                    await resposta.json();


                // SEM HORÁRIOS

                if (
                    horarios.length === 0
                ) {

                    listaHorarios.innerHTML =
                        "<p>Não existem horários.</p>";

                    return;

                }


                // LIMPAR A LISTA

                listaHorarios.innerHTML =
                    "";


                // MOSTRAR OS HORÁRIOS

                horarios.forEach(
                    function (horario) {


                        // CRIAR O CARTÃO

                        const cartao =
                            document.createElement(
                                "article"
                            );

                        cartao.classList.add(
                            "horario-card"
                        );


                        // FORMATAR OS DADOS

                        const dataFormatada =
                            formatarData(
                                horario.data
                            );

                        const horaInicio =
                            formatarHora(
                                horario.hora_inicio
                            );

                        const horaFim =
                            formatarHora(
                                horario.hora_fim
                            );

                        const estadoFormatado =
                            formatarEstado(
                                horario.estado
                            );


                        // CRIAR O TÍTULO

                        const titulo =
                            document.createElement(
                                "h3"
                            );

                        titulo.textContent =
                            dataFormatada;


                        // CRIAR A HORA DE INÍCIO

                        const inicio =
                            document.createElement(
                                "p"
                            );

                        inicio.innerHTML =
                            "<strong>Início:</strong> " +
                            horaInicio;


                        // CRIAR A HORA DE FIM

                        const fim =
                            document.createElement(
                                "p"
                            );

                        fim.innerHTML =
                            "<strong>Fim:</strong> " +
                            horaFim;


                        // CRIAR O ESTADO

                        const estado =
                            document.createElement(
                                "p"
                            );

                        estado.innerHTML =
                            "<strong>Estado:</strong> " +
                            estadoFormatado;


                        // CRIAR A ZONA DE AÇÕES

                        const zonaAcoes =
                            document.createElement(
                                "div"
                            );

                        zonaAcoes.classList.add(
                            "horario-acoes"
                        );


                        // CRIAR O BOTÃO DE EDITAR

                        const botaoEditar =
                            document.createElement(
                                "button"
                            );

                        botaoEditar.type =
                            "button";

                        botaoEditar.classList.add(
                            "btn",
                            "btn-edit",
                            "botao-editar-horario"
                        );

                        botaoEditar.textContent =
                            "Editar";


                        // CRIAR O BOTÃO DO ESTADO

                        const botaoEstado =
                            document.createElement(
                                "button"
                            );

                        botaoEstado.type =
                            "button";

                        botaoEstado.classList.add(
                            "btn",
                            "btn-secondary",
                            "botao-estado-horario"
                        );

                        botaoEstado.textContent =
                            horario.estado ===
                            "disponivel"
                                ? "Bloquear"
                                : "Disponibilizar";


                        // CRIAR O BOTÃO DE ELIMINAR

                        const botaoEliminar =
                            document.createElement(
                                "button"
                            );

                        botaoEliminar.type =
                            "button";

                        botaoEliminar.classList.add(
                            "btn",
                            "btn-delete",
                            "botao-eliminar-horario"
                        );

                        botaoEliminar.textContent =
                            "Eliminar";


                        // ADICIONAR OS BOTÕES

                        zonaAcoes.appendChild(
                            botaoEditar
                        );

                        zonaAcoes.appendChild(
                            botaoEstado
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
                            "horario-edicao"
                        );

                        zonaEdicao.style.display =
                            "none";


                        // CRIAR O CAMPO DA DATA

                        const grupoData =
                            document.createElement(
                                "div"
                            );

                        grupoData.classList.add(
                            "form-group"
                        );

                        const labelData =
                            document.createElement(
                                "label"
                            );

                        const editarData =
                            document.createElement(
                                "input"
                            );

                        editarData.type =
                            "date";

                        editarData.id =
                            "editar_data_" +
                            horario.id_horario;

                        editarData.value =
                            String(
                                horario.data
                            ).slice(
                                0,
                                10
                            );

                        labelData.htmlFor =
                            editarData.id;

                        labelData.textContent =
                            "Data";

                        grupoData.appendChild(
                            labelData
                        );

                        grupoData.appendChild(
                            editarData
                        );


                        // CRIAR O CAMPO DA HORA DE INÍCIO

                        const grupoHoraInicio =
                            document.createElement(
                                "div"
                            );

                        grupoHoraInicio.classList.add(
                            "form-group"
                        );

                        const labelHoraInicio =
                            document.createElement(
                                "label"
                            );

                        const editarHoraInicio =
                            document.createElement(
                                "input"
                            );

                        editarHoraInicio.type =
                            "time";

                        editarHoraInicio.id =
                            "editar_inicio_" +
                            horario.id_horario;

                        editarHoraInicio.value =
                            horaInicio;

                        labelHoraInicio.htmlFor =
                            editarHoraInicio.id;

                        labelHoraInicio.textContent =
                            "Hora de início";

                        grupoHoraInicio.appendChild(
                            labelHoraInicio
                        );

                        grupoHoraInicio.appendChild(
                            editarHoraInicio
                        );


                        // CRIAR O CAMPO DA HORA DE FIM

                        const grupoHoraFim =
                            document.createElement(
                                "div"
                            );

                        grupoHoraFim.classList.add(
                            "form-group"
                        );

                        const labelHoraFim =
                            document.createElement(
                                "label"
                            );

                        const editarHoraFim =
                            document.createElement(
                                "input"
                            );

                        editarHoraFim.type =
                            "time";

                        editarHoraFim.id =
                            "editar_fim_" +
                            horario.id_horario;

                        editarHoraFim.value =
                            horaFim;

                        labelHoraFim.htmlFor =
                            editarHoraFim.id;

                        labelHoraFim.textContent =
                            "Hora de fim";

                        grupoHoraFim.appendChild(
                            labelHoraFim
                        );

                        grupoHoraFim.appendChild(
                            editarHoraFim
                        );


                        // CRIAR O BOTÃO DE GUARDAR

                        const botaoGuardar =
                            document.createElement(
                                "button"
                            );

                        botaoGuardar.type =
                            "button";

                        botaoGuardar.classList.add(
                            "btn",
                            "btn-primary"
                        );

                        botaoGuardar.textContent =
                            "Guardar alterações";


                        // ADICIONAR OS CAMPOS À EDIÇÃO

                        zonaEdicao.appendChild(
                            grupoData
                        );

                        zonaEdicao.appendChild(
                            grupoHoraInicio
                        );

                        zonaEdicao.appendChild(
                            grupoHoraFim
                        );

                        zonaEdicao.appendChild(
                            botaoGuardar
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
                                        "grid";

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

                                editarHorario(
                                    horario.id_horario,
                                    editarData.value,
                                    editarHoraInicio.value,
                                    editarHoraFim.value
                                );

                            }
                        );


                        // BLOQUEAR OU DISPONIBILIZAR

                        botaoEstado.addEventListener(
                            "click",
                            function () {

                                alterarEstadoHorario(
                                    horario.id_horario,
                                    horario.estado
                                );

                            }
                        );


                        // ELIMINAR O HORÁRIO

                        botaoEliminar.addEventListener(
                            "click",
                            function () {

                                eliminarHorario(
                                    horario.id_horario
                                );

                            }
                        );


                        // ADICIONAR OS DADOS AO CARTÃO

                        cartao.appendChild(
                            titulo
                        );

                        cartao.appendChild(
                            inicio
                        );

                        cartao.appendChild(
                            fim
                        );

                        cartao.appendChild(
                            estado
                        );

                        cartao.appendChild(
                            zonaAcoes
                        );

                        cartao.appendChild(
                            zonaEdicao
                        );


                        // ADICIONAR À LISTA

                        listaHorarios.appendChild(
                            cartao
                        );

                    }
                );

            }

            catch (erro) {

                console.log(
                    "Erro ao carregar os horários:"
                );

                console.log(erro);

                listaHorarios.innerHTML =
                    "<p>Erro ao carregar os horários.</p>";

            }

        }


        // CRIAR UM HORÁRIO

        async function criarHorario() {

            const dadosHorario = {

                data:
                    campoData.value,

                hora_inicio:
                    campoHoraInicio.value,

                hora_fim:
                    campoHoraFim.value

            };


            // VALIDAR AS HORAS

            if (
                dadosHorario.hora_fim <=
                dadosHorario.hora_inicio
            ) {

                alert(
                    "A hora de fim tem de ser posterior à hora de início."
                );

                return;

            }


            try {


                // ENVIAR O HORÁRIO PARA O BACKEND

                const resposta =
                    await fetch(
                        "http://localhost:3000/api/horarios",
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " +
                                    tokenAdmin

                            },

                            body:
                                JSON.stringify(
                                    dadosHorario
                                )

                        }
                    );


                // VERIFICAR A SESSÃO

                if (
                    verificarSessao(
                        resposta
                    ) === false
                ) {

                    return;

                }


                // LER A RESPOSTA

                const dadosResposta =
                    await resposta.json();


                // VERIFICAR SE EXISTIU ERRO

                if (!resposta.ok) {

                    alert(
                        dadosResposta.mensagem
                    );

                    return;

                }


                // MOSTRAR CONFIRMAÇÃO

                alert(
                    dadosResposta.mensagem
                );


                // LIMPAR O FORMULÁRIO

                formularioHorario.reset();


                // ATUALIZAR A LISTA

                await carregarHorarios();

            }

            catch (erro) {

                console.log(
                    "Erro ao criar o horário:"
                );

                console.log(erro);

                alert(
                    "Não foi possível criar o horário."
                );

            }

        }


        // CRIAR HORÁRIO AO ENVIAR O FORMULÁRIO

        formularioHorario.addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();

                criarHorario();

            }
        );


        // CARREGAR OS HORÁRIOS AO ABRIR A PÁGINA

        carregarHorarios();

    }
);