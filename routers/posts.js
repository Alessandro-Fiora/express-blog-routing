const express = require("express");
const router = express.Router();

const posts = require("../db/posts");

// INDEX
router.get("/", (req, res) => {
  console.log("Richiesta index posts");

  // FILTRO POST PER KEYWORD NEI TAGS
  let filteredPosts = posts;

  // SE C'E' UNA KEY DO A TERM IL VALORE DELLA KEY, ALTRIMENTI DO VALORE NULLO
  const term = req.query.term ?? "";

  // SE TERM HA UN VALORE FILTRO I POST PER QUELLI CHE INCLUDONO IL VALORE TRA I TAG
  if (term) {
    filteredPosts = posts.filter((post) => {
      let isTermIncluded = false;
      // PER OGNI POST CONTROLLO SE OGNI TAG CONTIENE TERM
      post.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(term.toLowerCase()))
          isTermIncluded = true;
      });
      return isTermIncluded;
    });
  }

  res.json({ filteredPosts, postNumber: filteredPosts.length });
});
// SHOW
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // Controllo per ID non valido
  if (isNaN(id)) {
    res.status(400).json({
      error: "id not valid",
    });
    return;
  }

  const post = posts.find((post) => post.id === id);

  // Controllo per ID non presente nella lista
  if (!post) {
    res.status(404).json({
      error: "Resource not found",
    });
    return;
  }

  res.json(post);
});
// STORE
router.post("/", (req, res) => {
  res.json("Crea nuovo post");
});
// UPDATE
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  res.json(`Modifica integrale del post ${id}`);
});
// MODIFY
router.patch("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  res.json(`Modifica parziale del post ${id}`);
});
// DESTROY
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // Controllo per ID non valido
  if (isNaN(id)) {
    res.status(400).json({
      error: "id not valid",
    });
    return;
  }

  let toDeleteIndex;
  // Salvo l'elemento che sto eliminando
  const deleted = posts.find((post, index) => {
    // Se trovo l'elemento con l'id che corrisponde mi salvo l'indice e ritorno true al find
    if (post.id === id) {
      toDeleteIndex = index;
      return true;
    } else return false;
  });

  // Controllo per ID non presente nella lista
  if (!deleted) {
    res.status(404).json({
      error: "Resource not found",
    });
    return;
  }
  // Se l'indice dell'el da cancellare è definito vuol dire che l'ho trovato nell'array, quindi lo cancello
  if (toDeleteIndex) posts.splice(toDeleteIndex, 1);
  // Ritorno alla chiamata sia l'elemento eliminato che il nuovo array di elementi
  res.json({
    deleted,
    posts,
  });
});

module.exports = router;
