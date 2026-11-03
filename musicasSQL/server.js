//Importação
const express = require("express");
//INIT EXPRESS
const app = express();
//defenir a porta
const PORT = 3000;
//importar o mysql2
const mysql = require("mysql2/promise");
//injetar as variaveis de ambiente
require("dotenv").config();


app.use(express.json());

// configuração do mysql
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
})
 

app.get(("/"), (req, res) => {
    res.send("Olá Mundo");
});
//get (api/musicas)
app.get("/api/musicas", async (req, res) => {
  try {
    const [musicas] = await pool.execute("SELECT * FROM musica");
    console.log(musicas);
    res.status(200).json(musicas);
  } catch (error) {
    console.log("Erro GET /api/musicas", error.message);
    res.status(500).json({ Erro: "Erro ao tentar encontrar a música" });
  }
});
 

//get (api/musicas) encontar musica em especifico

app.get("/api/musicas/:id", async (req, res) => {
const id = Number(req.params.id);
  try {
  
  const [musicas] = await pool.execute(
      "SELECT * FROM musica WHERE id = ?",
      [id]
    );

    if (musicas.length === 0) {
      return res.status(404).json({
        error: "Música não encontrada"
      });
    }
    console.log(musicas);
    res.status(200).json(musicas);

  } catch (error) {
    console.log("Erro GET /api/musicas/:id", error.message);

    res.status(500).json({
      error: "Erro ao tentar encontrar a música"
    });
  }
});

//post (api/musicas) criar uma nova musica 

app.post("/api/musicas", async (req, res) => {
  const { titulo, artista, genero, ano } = req.body;
 
  if (!titulo || !artista || !genero || !ano) {
    res.status(400).json({ msg: "Insira todos os dados" });
  }
 
  try {
    const [resultado] = await pool.execute(
      `INSERT INTO musica (titulo, artista, genero, ano) VALUES(?, ?, ?, ?)`,
      [titulo, artista, genero, ano],
    );
    res.status(200).json(resultado);
  } catch (error) {
    console.log("Erro POST /api/musicas", error.message);
    res.status(500).json({ Erro: "Erro ao tentar encontrar a música" });
  }
 
  res.status(201).json({});
});
 


//get (api/musicas) atualizar uma musica existente

app.put("/api/musicas/:id", async (req, res) => {
  const id = Number(req.params.id);
  // VAMOS PROCURAR NA BD SE EXISTE A MÚSICA OU NÃO
  try {
    const [musica] = await pool.execute(`SELECT * FROM musica WHERE id = ?`, [
      id,
    ]);
    if (musica.length === 0) {
      res.status(404).json({ msg: "Música não existe" });
    }
 
    //res.status(200).json(musica);
  } catch (error) {
    console.log("Erro PUT /api/musicas/id", error.message);
    res.status(500).json({ Erro: "Erro ao tentar encontrar a música" });
  }
  // VAMOS BUSCAR OS DADOS AO BODY PARA ATUALIZAR NA BD
  const { titulo, artista, genero, ano } = req.body;
 
  if (!titulo || !artista || !genero || !ano) {
    console.log(req.body);
    return res
      .status(400)
      .json({ msg: "Insira todos os dados", musica: musica });
  }
 
  try {
    const [resultado] = await pool.execute(
      "UPDATE musica SET titulo = ?, artista = ?, genero = ?, ano = ? WHERE id = ?",
      [titulo, artista, genero, ano, id],
    );
    console.log(resultado);
    res.status(200).json({ msg: "Música foi atualizada", musica: req.body });
  } catch (error) {
    console.log("Erro PUT /api/musicas/id", error.message);
    res.status(500).json({ Erro: "Erro ao tentar atualizar a música" });
  }
});

// --- PATCH /api/musicas/:id/favorita ---
 
app.patch("/api/musicas/:id/favorita", async (req, res) => {
  const id = Number(req.params.id);
  // VAMOS PROCURAR NA BD SE EXISTE A MÚSICA OU NÃO
  let favorita;
  try {
    const [musica] = await pool.execute(`SELECT * FROM musica WHERE id = ?`, [
      id,
    ]);
    if (musica.length === 0) {
      res.status(404).json({ msg: "Música não existe" });
    }
 
    favorita = musica[0].favorita;
  } catch (error) {
    console.log("Erro PUT /api/musicas/id", error.message);
    res.status(500).json({ Erro: "Erro ao tentar encontrar a música" });
  }
  // VAMOS BUSCAR OS DADOS AO BODY PARA ATUALIZAR NA BD
 
  try {
    const [resultado] = await pool.execute(
      "UPDATE musica SET favorita = ? WHERE id = ?",
      [!favorita, id],
    );
 
    res.status(200).json({ msg: "Música foi atualizada", favorita });
  } catch (error) {
    console.log("Erro PUT /api/musicas/id", error.message);
    res.status(500).json({ Erro: "Erro ao tentar atualizar a música" });
  }
});

// --- DELETE /api/musicas/:id ---

app.delete("/api/musicas/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [existe] = await pool.execute("SELECT * FROM musica WHERE id = ?", [
      id,
    ]);
    if (!existe) return res.status(404).json({ msg: "Música não existe" });
 
    await pool.execute("DELETE FROM musica WHERE id = ?", [id]);
    res.status(200).json({ msg: "Música exterminada", musica: existe[0] });
  } catch (error) {}
});





app.listen(PORT, async () => {
  console.log(`Servidor a rolar na porta ${PORT}`);
  try {
    await pool.execute("SELECT 1");
    console.log("Ligação ao MYSQL efetuada com sucesso");
  } catch (error) {
    console.log(error);
  }
});

