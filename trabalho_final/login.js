// ESPERAR QUE O HTML ESTEJA CARREGADO

document.addEventListener("DOMContentLoaded", function () {


    // SELECIONAR O FORMULÁRIO

    const formularioLogin =
        document.querySelector("#form_login");


    // SELECIONAR A MENSAGEM

    const mensagemLogin =
        document.querySelector("#mensagem_login");


    // SELECIONAR O CAMPO DA PASSWORD

    const campoPassword =
        document.querySelector("#password");


    // SELECIONAR A OPÇÃO DE MOSTRAR A PASSWORD

    const mostrarPassword =
        document.querySelector("#mostrar_password");


    // MOSTRAR OU ESCONDER A PASSWORD

    mostrarPassword.addEventListener(
        "change",
        function () {

            if (mostrarPassword.checked === true) {

                campoPassword.type = "text";

            } else {

                campoPassword.type = "password";

            }

        }
    );


    // ENVIAR O LOGIN

    formularioLogin.addEventListener(
        "submit",
        async function (evento) {


            // IMPEDIR O FORMULÁRIO DE RECARREGAR A PÁGINA

            evento.preventDefault();


            // RECOLHER OS DADOS

            const utilizador =
                document.querySelector(
                    "#utilizador"
                ).value.trim();

            const password =
                campoPassword.value;


            try {


                // ENVIAR OS DADOS PARA O BACKEND

                const resposta = await fetch(
                    "http://localhost:3000/api/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            utilizador:
                                utilizador,

                            password:
                                password
                        })
                    }
                );


                // LER A RESPOSTA

                const dadosResposta =
                    await resposta.json();


                // VERIFICAR SE EXISTIU ERRO

                if (!resposta.ok) {

                    mensagemLogin.textContent =
                        dadosResposta.mensagem;

                    return;

                }


                // GUARDAR O TOKEN

                localStorage.setItem(
                    "token_admin",
                    dadosResposta.token
                );


                // IR PARA A PÁGINA DE RESERVAS

                window.location.href =
                    "admin.html";

            }


            catch (erro) {

                console.log(
                    "Erro ao iniciar sessão:"
                );

                console.log(erro);

                mensagemLogin.textContent =
                    "Não foi possível comunicar com o servidor.";

            }

        }
    );

});