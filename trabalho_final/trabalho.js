// ESPERAR QUE O HTML ESTEJA CARREGADO

document.addEventListener("DOMContentLoaded", function () {


    // SELECIONAR O SERVIÇO

    const servico = document.querySelector("#id_servico");


    // SELECIONAR A OPÇÃO DE ADICIONAR TAXI

    const grupoAdicionarTaxi = document.querySelector("#grupo_adicionar_taxi");

    const adicionarTaxi = document.querySelector("#adicionar_taxi");


    // SELECIONAR O GRUPO DOS DADOS DO TAXI

    const grupoDadosTaxi = document.querySelector("#grupo_dados_taxi");


    // SELECIONAR OS CAMPOS DO TAXI

    const origemTaxi = document.querySelector("#origem_taxi");

    const destinoTaxi = document.querySelector("#destino_taxi");

    const dataTaxi = document.querySelector("#data_taxi");

    const horaTaxi = document.querySelector("#hora_taxi");


    // LER O SERVIÇO RECEBIDO PELO ENDEREÇO

    const parametros = new URLSearchParams(window.location.search);

    const servicoEscolhido = parametros.get("servico");


    // SE EXISTIR UM SERVIÇO ESCOLHIDO, SELECIONAR ESSA OPÇÃO

    if (servicoEscolhido !== null) {

        servico.value = servicoEscolhido;

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

            grupoAdicionarTaxi.style.display = "none";

            grupoDadosTaxi.style.display = "none";

            adicionarTaxi.checked = false;

            retirarTaxiObrigatorio();

            limparTaxi();

        }


        // TAXI COMO SERVIÇO PRINCIPAL

        else if (servico.value === "6") {

            grupoAdicionarTaxi.style.display = "none";

            adicionarTaxi.checked = false;

            grupoDadosTaxi.style.display = "block";

            tornarTaxiObrigatorio();

        }


        // OUTRO SERVIÇO OU PACK

        else {

            grupoAdicionarTaxi.style.display = "block";


            // TAXI ADICIONADO COMO EXTRA

            if (adicionarTaxi.checked === true) {

                grupoDadosTaxi.style.display = "block";

                tornarTaxiObrigatorio();

            }


            // TAXI NÃO ADICIONADO

            else {

                grupoDadosTaxi.style.display = "none";

                retirarTaxiObrigatorio();

                limparTaxi();

            }

        }

    }


    // VERIFICAR QUANDO A PÁGINA ABRE

    atualizarTaxi();


    // VERIFICAR QUANDO O SERVIÇO MUDA

    servico.addEventListener("change", function () {

        adicionarTaxi.checked = false;

        atualizarTaxi();

    });


    // VERIFICAR QUANDO A OPÇÃO DO TAXI MUDA

    adicionarTaxi.addEventListener("change", function () {

        atualizarTaxi();

    });

});