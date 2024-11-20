const express = require("express");
const app = express();
const port = 3000;

const posts = require("./db/posts");
console.log(posts[0].title);

// Asset statici
app.use(express.static("public"));

// Rotta Homepage
app.get("/", (req, res) => {
  console.log("homepage request received");
  res.send("Server del mio Blog");
});

// Rotta Bacheca
app.get("/bacheca", (req, res) => {
  console.log("dashboard request received");

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

app.listen(port, () => {
  console.log("server listening on port", port);
});
