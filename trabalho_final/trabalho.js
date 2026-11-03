// ESPERAR QUE O HTML ESTEJA CARREGADO

document.addEventListener("DOMContentLoaded", function () {

    // SELECIONAR O FORMULÁRIO

    const formularioReserva =
        document.querySelector("#form_reserva");

    if (formularioReserva === null) {
        return;
    }


    // SELECIONAR OS CAMPOS PRINCIPAIS

    const servico =
        document.querySelector("#id_servico");

    const horario =
        document.querySelector("#id_horario");

    const horaInicio =
        document.querySelector("#hora_inicio");

    const horaFim =
        document.querySelector("#hora_fim");

    const concelho =
        document.querySelector("#concelho");

    const codigoPostal =
        document.querySelector("#codigo_postal");

    const estimativaPreco =
        document.querySelector("#estimativa_preco");


    // SELECIONAR A ESPÉCIE DO ANIMAL

    const especie =
        document.querySelector("#especie");

    const grupoOutraEspecie =
        document.querySelector("#grupo_outra_especie");

    const outraEspecie =
        document.querySelector("#outra_especie");


    // SELECIONAR A OPÇÃO DE ADICIONAR TAXI

    const grupoAdicionarTaxi =
        document.querySelector("#grupo_adicionar_taxi");

    const adicionarTaxi =
        document.querySelector("#adicionar_taxi");


    // SELECIONAR O GRUPO DOS DADOS DO TAXI

    const grupoDadosTaxi =
        document.querySelector("#grupo_dados_taxi");


    // SELECIONAR OS CAMPOS DO TAXI

    const origemTaxi =
        document.querySelector("#origem_taxi");

    const destinoTaxi =
        document.querySelector("#destino_taxi");

    const dataTaxi =
        document.querySelector("#data_taxi");

    const horaTaxi =
        document.querySelector("#hora_taxi");


    // GUARDAR AS DISPONIBILIDADES RECEBIDAS

    let horariosDisponiveis = [];


    // LER O SERVIÇO RECEBIDO PELO ENDEREÇO

    const parametros =
        new URLSearchParams(window.location.search);

    const servicoEscolhido =
        parametros.get("servico");


    // SE EXISTIR UM SERVIÇO ESCOLHIDO, SELECIONAR ESSA OPÇÃO

    if (servicoEscolhido !== null) {
        servico.value = servicoEscolhido;
    }


    // ATUALIZAR O CAMPO DE OUTRA ESPÉCIE

    function atualizarOutraEspecie() {

        if (
            grupoOutraEspecie === null ||
            outraEspecie === null
        ) {

            return;

        }


        // OUTRA ESPÉCIE SELECIONADA

        if (especie.value === "Outro") {

            grupoOutraEspecie.style.display =
                "block";

            outraEspecie.required =
                true;

        }


        // CÃO OU GATO

        else {

            grupoOutraEspecie.style.display =
                "none";

            outraEspecie.required =
                false;

            outraEspecie.value =
                "";

        }

    }


    // VALIDAR A OUTRA ESPÉCIE

    function validarOutraEspecie() {

        if (
            especie.value === "Outro" &&
            outraEspecie !== null &&
            outraEspecie.value.trim() === ""
        ) {

            alert(
                "Indica qual é a espécie do teu animal."
            );

            outraEspecie.focus();

            return false;

        }


        return true;

    }


    // OBTER A ESPÉCIE A GUARDAR

    function obterEspecieReserva() {

        if (
            especie.value === "Outro" &&
            outraEspecie !== null
        ) {

            return outraEspecie.value.trim();

        }


        return especie.value;

    }


    // TORNAR OS CAMPOS DO TAXI OBRIGATÓRIOS

    function tornarTaxiObrigatorio() {

        origemTaxi.required = true;

        destinoTaxi.required = true;

        dataTaxi.required = true;

        horaTaxi.required = true;

    }


    // RETIRAR A OBRIGATORIEDADE DOS CAMPOS DO TAXI

    function retirarTaxiObrigatorio() {

        origemTaxi.required = false;

        destinoTaxi.required = false;

        dataTaxi.required = false;

        horaTaxi.required = false;

    }


    // LIMPAR OS CAMPOS DO TAXI

    function limparTaxi() {

        origemTaxi.value = "";

        destinoTaxi.value = "";

        dataTaxi.value = "";

        horaTaxi.value = "";

    }


    // ATUALIZAR AS OPÇÕES DO TAXI

    function atualizarTaxi() {


        // NENHUM SERVIÇO SELECIONADO

        if (servico.value === "") {

            grupoAdicionarTaxi.style.display =
                "none";

            grupoDadosTaxi.style.display =
                "none";

            adicionarTaxi.checked =
                false;

            retirarTaxiObrigatorio();

            limparTaxi();

        }


        // TAXI COMO SERVIÇO PRINCIPAL

        else if (servico.value === "6") {

            grupoAdicionarTaxi.style.display =
                "none";

            adicionarTaxi.checked =
                false;

            grupoDadosTaxi.style.display =
                "block";

            tornarTaxiObrigatorio();

        }


        // OUTRO SERVIÇO OU PACK

        else {

            grupoAdicionarTaxi.style.display =
                "block";


            // TAXI ADICIONADO COMO EXTRA

            if (adicionarTaxi.checked === true) {

                grupoDadosTaxi.style.display =
                    "block";

                tornarTaxiObrigatorio();

            }


            // TAXI NÃO ADICIONADO

            else {

                grupoDadosTaxi.style.display =
                    "none";

                retirarTaxiObrigatorio();

                limparTaxi();

            }

        }


        atualizarEstimativaPreco();

    }


    // DESATIVAR OS CAMPOS DAS HORAS

    function desativarHoras() {

        horaInicio.disabled =
            true;

        horaFim.disabled =
            true;


        horaInicio.value =
            "";

        horaFim.value =
            "";


        horaInicio.removeAttribute(
            "min"
        );

        horaInicio.removeAttribute(
            "max"
        );

        horaFim.removeAttribute(
            "min"
        );

        horaFim.removeAttribute(
            "max"
        );


        atualizarEstimativaPreco();

    }


    // ATUALIZAR AS HORAS PERMITIDAS

    function atualizarHorasDisponiveis() {


        // SEM DISPONIBILIDADE SELECIONADA

        if (horario.value === "") {

            desativarHoras();

            return;

        }


        // PROCURAR A DISPONIBILIDADE ESCOLHIDA

        const horarioEscolhido =
            horariosDisponiveis.find(
                function (horarioDisponivel) {

                    return (
                        Number(
                            horarioDisponivel.id_horario
                        ) ===
                        Number(
                            horario.value
                        )
                    );

                }
            );


        // DISPONIBILIDADE NÃO ENCONTRADA

        if (horarioEscolhido === undefined) {

            desativarHoras();

            return;

        }


        // FORMATAR AS HORAS

        const horaMinima =
            horarioEscolhido.hora_inicio.slice(
                0,
                5
            );

        const horaMaxima =
            horarioEscolhido.hora_fim.slice(
                0,
                5
            );


        // ATIVAR OS CAMPOS

        horaInicio.disabled =
            false;

        horaFim.disabled =
            false;


        // DEFINIR OS LIMITES

        horaInicio.min =
            horaMinima;

        horaInicio.max =
            horaMaxima;

        horaFim.min =
            horaMinima;

        horaFim.max =
            horaMaxima;


        // LIMPAR HORAS ANTIGAS

        horaInicio.value =
            "";

        horaFim.value =
            "";


        atualizarEstimativaPreco();

    }


    // CONVERTER UMA HORA EM MINUTOS

    function converterHoraParaMinutos(hora) {

        if (hora === "") {

            return null;

        }


        const partesHora =
            hora.split(":");


        const horas =
            Number(
                partesHora[0]
            );

        const minutos =
            Number(
                partesHora[1]
            );


        return (
            horas * 60 +
            minutos
        );

    }


    // CALCULAR A DURAÇÃO DO SERVIÇO

    function calcularDuracaoMinutos() {

        const inicioEmMinutos =
            converterHoraParaMinutos(
                horaInicio.value
            );

        const fimEmMinutos =
            converterHoraParaMinutos(
                horaFim.value
            );


        if (
            inicioEmMinutos === null ||
            fimEmMinutos === null ||
            fimEmMinutos <= inicioEmMinutos
        ) {

            return null;

        }


        return (
            fimEmMinutos -
            inicioEmMinutos
        );

    }


    // FORMATAR UM VALOR EM EUROS

    function formatarPreco(valor) {

        if (Number.isInteger(valor)) {

            return valor + " €";

        }


        return (
            valor
                .toFixed(2)
                .replace(".", ",") +
            " €"
        );

    }


    // ADICIONAR A NOTA DO TAXI À ESTIMATIVA

    function adicionarNotaTaxi(texto) {

        if (
            adicionarTaxi.checked === true &&
            servico.value !== "6"
        ) {

            return (
                texto +
                " + Entre Patas Taxi, com valor a confirmar de acordo com a distância."
            );

        }


        return texto;

    }


    // ATUALIZAR A ESTIMATIVA DO PREÇO

    function atualizarEstimativaPreco() {

        if (estimativaPreco === null) {

            return;

        }


        const idServico =
            Number(
                servico.value
            );


        const duracaoMinutos =
            calcularDuracaoMinutos();


        // NENHUM SERVIÇO SELECIONADO

        if (servico.value === "") {

            estimativaPreco.textContent =
                "Seleciona o serviço e o horário para veres a estimativa do valor.";

            return;

        }


        // PET SITTING

        if (idServico === 1) {

            if (duracaoMinutos === null) {

                estimativaPreco.textContent =
                    "Pet Sitting: 8 € por hora. Seleciona a hora de início e de fim para calcular a estimativa.";

                return;

            }


            const duracaoHoras =
                duracaoMinutos / 60;


            const valorEstimado =
                duracaoHoras * 8;


            const texto =
                "Estimativa base do Pet Sitting: " +
                formatarPreco(
                    valorEstimado
                ) +
                ". Em períodos prolongados, o valor por hora poderá ser ajustado mediante acordo prévio.";


            estimativaPreco.textContent =
                adicionarNotaTaxi(
                    texto
                );


            return;

        }


        // PASSEIOS

        if (idServico === 2) {

            if (duracaoMinutos === null) {

                estimativaPreco.textContent =
                    "Passeio: 30 minutos — 6 € | 60 minutos — 10 €.";

                return;

            }


            if (duracaoMinutos === 30) {

                estimativaPreco.textContent =
                    adicionarNotaTaxi(
                        "Estimativa do passeio: 6 €."
                    );

                return;

            }


            if (duracaoMinutos === 60) {

                estimativaPreco.textContent =
                    adicionarNotaTaxi(
                        "Estimativa do passeio: 10 €."
                    );

                return;

            }


            estimativaPreco.textContent =
                "Os passeios disponíveis têm a duração de 30 ou 60 minutos.";

            return;

        }


        // PACK ESSENCIAL

        if (idServico === 3) {

            if (
                duracaoMinutos !== null &&
                duracaoMinutos > 360
            ) {

                estimativaPreco.textContent =
                    "O Pack Essencial inclui até 6 horas de acompanhamento. Escolhe um período até 6 horas ou outro pack.";

                return;

            }


            estimativaPreco.textContent =
                adicionarNotaTaxi(
                    "Valor do Pack Essencial: 45 € — até 6 horas, com passeio incluído."
                );


            return;

        }


        // PACK CONFORTO

        if (idServico === 4) {

            if (
                duracaoMinutos !== null &&
                duracaoMinutos > 480
            ) {

                estimativaPreco.textContent =
                    "O Pack Conforto inclui até 8 horas de acompanhamento. Escolhe um período até 8 horas ou o Pack Completo.";

                return;

            }


            estimativaPreco.textContent =
                adicionarNotaTaxi(
                    "Valor do Pack Conforto: 58 € — até 8 horas, com passeio e banho simples incluídos quando adequado e combinado previamente."
                );


            return;

        }


        // PACK COMPLETO

        if (idServico === 5) {

            if (
                duracaoMinutos !== null &&
                duracaoMinutos > 600
            ) {

                estimativaPreco.textContent =
                    "O Pack Completo inclui até 10 horas de acompanhamento. Para períodos superiores, entra em contacto para avaliar disponibilidade e orçamento.";

                return;

            }


            estimativaPreco.textContent =
                adicionarNotaTaxi(
                    "Valor do Pack Completo: 70 € — até 10 horas, com passeio, banho simples e cuidados básicos de higiene incluídos."
                );


            return;

        }


        // ENTRE PATAS TAXI

        if (idServico === 6) {

            estimativaPreco.textContent =
                "Entre Patas Taxi: o valor será confirmado de acordo com a distância da deslocação.";

        }

    }


    // VALIDAR A DURAÇÃO DO SERVIÇO

    function validarDuracaoServico() {

        const idServico =
            Number(
                servico.value
            );


        const duracaoMinutos =
            calcularDuracaoMinutos();


        if (duracaoMinutos === null) {

            return true;

        }


        // PASSEIOS DE 30 OU 60 MINUTOS

        if (
            idServico === 2 &&
            duracaoMinutos !== 30 &&
            duracaoMinutos !== 60
        ) {

            alert(
                "Para os passeios, escolhe uma duração de 30 ou 60 minutos."
            );


            horaFim.focus();


            return false;

        }


        // PACK ESSENCIAL ATÉ 6 HORAS

        if (
            idServico === 3 &&
            duracaoMinutos > 360
        ) {

            alert(
                "O Pack Essencial permite um máximo de 6 horas de acompanhamento."
            );


            horaFim.focus();


            return false;

        }


        // PACK CONFORTO ATÉ 8 HORAS

        if (
            idServico === 4 &&
            duracaoMinutos > 480
        ) {

            alert(
                "O Pack Conforto permite um máximo de 8 horas de acompanhamento."
            );


            horaFim.focus();


            return false;

        }


        // PACK COMPLETO ATÉ 10 HORAS

        if (
            idServico === 5 &&
            duracaoMinutos > 600
        ) {

            alert(
                "O Pack Completo permite um máximo de 10 horas de acompanhamento. Para períodos superiores, entra em contacto para avaliar disponibilidade e orçamento."
            );


            horaFim.focus();


            return false;

        }


        return true;

    }


    // CARREGAR OS HORÁRIOS DISPONÍVEIS

    async function carregarHorariosDisponiveis() {

        try {


            // MOSTRAR QUE AS DISPONIBILIDADES ESTÃO A CARREGAR

            horario.disabled =
                true;

            horario.innerHTML =
                "";


            const opcaoCarregar =
                document.createElement(
                    "option"
                );


            opcaoCarregar.value =
                "";

            opcaoCarregar.textContent =
                "A carregar disponibilidades...";


            horario.appendChild(
                opcaoCarregar
            );


            // DESATIVAR AS HORAS

            desativarHoras();


            // PEDIR OS HORÁRIOS AO BACKEND

            const resposta =
                await fetch(
                    "http://localhost:3000/api/horarios/disponiveis"
                );


            // LER A RESPOSTA DO BACKEND

            const dadosResposta =
                await resposta.json();


            // VERIFICAR SE EXISTIU ALGUM ERRO

            if (!resposta.ok) {

                throw new Error(
                    dadosResposta.mensagem ||
                    "Erro ao carregar as disponibilidades."
                );

            }


            // GUARDAR OS HORÁRIOS RECEBIDOS

            horariosDisponiveis =
                dadosResposta;


            // LIMPAR O SELECT

            horario.innerHTML =
                "";


            // VERIFICAR SE EXISTEM HORÁRIOS DISPONÍVEIS

            if (
                horariosDisponiveis.length === 0
            ) {

                const opcaoSemHorarios =
                    document.createElement(
                        "option"
                    );


                opcaoSemHorarios.value =
                    "";

                opcaoSemHorarios.textContent =
                    "Sem disponibilidades";


                horario.appendChild(
                    opcaoSemHorarios
                );


                horario.disabled =
                    true;


                return;

            }


            // ATIVAR O SELECT

            horario.disabled =
                false;


            // CRIAR A OPÇÃO INICIAL

            const opcaoInicial =
                document.createElement(
                    "option"
                );


            opcaoInicial.value =
                "";

            opcaoInicial.textContent =
                "Seleciona um dia";


            horario.appendChild(
                opcaoInicial
            );


            // CRIAR UMA OPÇÃO PARA CADA DISPONIBILIDADE

            horariosDisponiveis.forEach(
                function (horarioDisponivel) {


                    // CRIAR A OPÇÃO

                    const opcao =
                        document.createElement(
                            "option"
                        );


                    // FORMATAR A DATA

                    const partesData =
                        horarioDisponivel.data.split(
                            "-"
                        );


                    const dataFormatada =
                        partesData[2] +
                        "/" +
                        partesData[1] +
                        "/" +
                        partesData[0];


                    // FORMATAR A HORA DE INÍCIO

                    const horaInicioDisponivel =
                        horarioDisponivel.hora_inicio.slice(
                            0,
                            5
                        );


                    // FORMATAR A HORA DE FIM

                    const horaFimDisponivel =
                        horarioDisponivel.hora_fim.slice(
                            0,
                            5
                        );


                    // DEFINIR O VALOR DA OPÇÃO

                    opcao.value =
                        horarioDisponivel.id_horario;


                    // DEFINIR O TEXTO DA OPÇÃO

                    opcao.textContent =
                        dataFormatada +
                        " — disponível das " +
                        horaInicioDisponivel +
                        " às " +
                        horaFimDisponivel;


                    // ADICIONAR A OPÇÃO AO SELECT

                    horario.appendChild(
                        opcao
                    );

                }
            );

        }


        catch (erro) {

            console.log(
                "Erro ao carregar as disponibilidades:"
            );

            console.log(
                erro
            );


            // MOSTRAR O ERRO NO SELECT

            horario.innerHTML =
                "";


            const opcaoErro =
                document.createElement(
                    "option"
                );


            opcaoErro.value =
                "";

            opcaoErro.textContent =
                "Erro ao carregar disponibilidades";


            horario.appendChild(
                opcaoErro
            );


            horario.disabled =
                true;


            desativarHoras();

        }

    }


    // VALIDAR AS HORAS ESCOLHIDAS

    function validarHoras() {


        // VERIFICAR SE EXISTE DISPONIBILIDADE

        if (horario.value === "") {

            alert(
                "Seleciona primeiro um dia disponível."
            );


            return false;

        }


        // VERIFICAR SE AS HORAS FORAM PREENCHIDAS

        if (
            horaInicio.value === "" ||
            horaFim.value === ""
        ) {

            alert(
                "Seleciona a hora de início e a hora de fim."
            );


            return false;

        }


        // HORA DE FIM TEM DE SER POSTERIOR

        if (
            horaFim.value <=
            horaInicio.value
        ) {

            alert(
                "A hora de fim tem de ser posterior à hora de início."
            );


            return false;

        }


        // PROCURAR A DISPONIBILIDADE ESCOLHIDA

        const horarioEscolhido =
            horariosDisponiveis.find(
                function (horarioDisponivel) {

                    return (
                        Number(
                            horarioDisponivel.id_horario
                        ) ===
                        Number(
                            horario.value
                        )
                    );

                }
            );


        // DISPONIBILIDADE NÃO ENCONTRADA

        if (horarioEscolhido === undefined) {

            alert(
                "A disponibilidade escolhida já não está disponível."
            );


            return false;

        }


        // FORMATAR OS LIMITES

        const horaMinima =
            horarioEscolhido.hora_inicio.slice(
                0,
                5
            );

        const horaMaxima =
            horarioEscolhido.hora_fim.slice(
                0,
                5
            );


        // VERIFICAR SE AS HORAS CABEM NA DISPONIBILIDADE

        if (
            horaInicio.value <
                horaMinima ||
            horaFim.value >
                horaMaxima
        ) {

            alert(
                "Escolhe um período entre " +
                horaMinima +
                " e " +
                horaMaxima +
                "."
            );


            return false;

        }


        return true;

    }


    // VALIDAR O CÓDIGO POSTAL

    function validarCodigoPostal() {

        const formatoCodigoPostal =
            /^\d{4}-\d{3}$/;


        if (
            !formatoCodigoPostal.test(
                codigoPostal.value.trim()
            )
        ) {

            alert(
                "Indica um código postal válido no formato 0000-000."
            );


            codigoPostal.focus();


            return false;

        }


        return true;

    }


    // VERIFICAR QUANDO A PÁGINA ABRE

    atualizarTaxi();

    desativarHoras();

    carregarHorariosDisponiveis();

    atualizarEstimativaPreco();

    atualizarOutraEspecie();


    // VERIFICAR QUANDO A ESPÉCIE MUDA

    especie.addEventListener(
        "change",
        function () {

            atualizarOutraEspecie();

        }
    );


    // VERIFICAR QUANDO O SERVIÇO MUDA

    servico.addEventListener(
        "change",
        function () {

            adicionarTaxi.checked =
                false;


            atualizarTaxi();

            atualizarEstimativaPreco();

        }
    );


    // VERIFICAR QUANDO A OPÇÃO DO TAXI MUDA

    adicionarTaxi.addEventListener(
        "change",
        function () {

            atualizarTaxi();

            atualizarEstimativaPreco();

        }
    );


    // VERIFICAR QUANDO A DISPONIBILIDADE MUDA

    horario.addEventListener(
        "change",
        function () {

            atualizarHorasDisponiveis();

        }
    );


    // ATUALIZAR A ESTIMATIVA QUANDO A HORA DE INÍCIO MUDA

    horaInicio.addEventListener(
        "input",
        function () {

            atualizarEstimativaPreco();

        }
    );


    // ATUALIZAR A ESTIMATIVA QUANDO A HORA DE FIM MUDA

    horaFim.addEventListener(
        "input",
        function () {

            atualizarEstimativaPreco();

        }
    );


    // ENVIAR A RESERVA

    formularioReserva.addEventListener(
        "submit",
        async function (evento) {


            // IMPEDIR O FORMULÁRIO DE RECARREGAR A PÁGINA

            evento.preventDefault();


            // VALIDAR A ESPÉCIE

            if (
                validarOutraEspecie() ===
                false
            ) {

                return;

            }


            // VALIDAR AS HORAS

            if (
                validarHoras() ===
                false
            ) {

                return;

            }


            // VALIDAR A DURAÇÃO DO SERVIÇO

            if (
                validarDuracaoServico() ===
                false
            ) {

                return;

            }


            // VALIDAR O CÓDIGO POSTAL

            if (
                validarCodigoPostal() ===
                false
            ) {

                return;

            }


            // SELECIONAR O BOTÃO DE ENVIO

            const botaoEnviar =
                formularioReserva.querySelector(
                    'button[type="submit"]'
                );


            // BLOQUEAR O BOTÃO DURANTE O ENVIO

            botaoEnviar.disabled =
                true;

            botaoEnviar.textContent =
                "A enviar...";


            // RECOLHER OS DADOS DO FORMULÁRIO

            const dadosReserva = {

                id_servico:
                    Number(
                        servico.value
                    ),

                id_horario:
                    Number(
                        horario.value
                    ),

                hora_inicio:
                    horaInicio.value,

                hora_fim:
                    horaFim.value,

                nome_tutor:
                    document.querySelector(
                        "#nome_tutor"
                    ).value.trim(),

                telefone:
                    document.querySelector(
                        "#telefone"
                    ).value.trim(),

                email:
                    document.querySelector(
                        "#email"
                    ).value.trim(),

                nome_animal:
                    document.querySelector(
                        "#nome_animal"
                    ).value.trim(),

                especie:
                    obterEspecieReserva(),

                concelho:
                    concelho.value,

                morada_servico:
                    document.querySelector(
                        "#morada_servico"
                    ).value.trim(),

                codigo_postal:
                    codigoPostal.value.trim(),

                incluir_taxi:
                    adicionarTaxi.checked,

                origem_taxi:
                    origemTaxi.value.trim() ||
                    null,

                destino_taxi:
                    destinoTaxi.value.trim() ||
                    null,

                data_taxi:
                    dataTaxi.value ||
                    null,

                hora_taxi:
                    horaTaxi.value ||
                    null,

                observacoes:
                    document.querySelector(
                        "#observacoes"
                    ).value.trim() ||
                    null

            };


            try {


                // ENVIAR A RESERVA PARA O BACKEND

                const resposta =
                    await fetch(
                        "http://localhost:3000/api/reservas",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    dadosReserva
                                )

                        }
                    );


                // LER A RESPOSTA DO BACKEND

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


                // LIMPAR O FORMULÁRIO

                formularioReserva.reset();


                // ATUALIZAR A ESPÉCIE

                atualizarOutraEspecie();


                // RESTAURAR O SERVIÇO RECEBIDO PELO ENDEREÇO

                if (
                    servicoEscolhido !==
                    null
                ) {

                    servico.value =
                        servicoEscolhido;

                }


                // ATUALIZAR O TAXI

                atualizarTaxi();


                // DESATIVAR AS HORAS

                desativarHoras();


                // ATUALIZAR A ESTIMATIVA

                atualizarEstimativaPreco();


                // ATUALIZAR AS DISPONIBILIDADES

                await carregarHorariosDisponiveis();

            }


            catch (erro) {

                console.log(
                    "Erro ao enviar a reserva:"
                );

                console.log(
                    erro
                );


                alert(
                    "Não foi possível comunicar com o servidor."
                );

            }


            finally {


                // VOLTAR A ATIVAR O BOTÃO

                botaoEnviar.disabled =
                    false;

                botaoEnviar.textContent =
                    "Enviar pedido de marcação";

            }

        }
    );

});