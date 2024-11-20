const express = require("express");
const app = express();
const port = 3000;

const postsRouter = require("./routers/posts");

// Asset statici
app.use(express.static("public"));

// Rotta Homepage
app.get("/", (req, res) => {
  console.log("homepage request received");
  res.send("Server del mio Blog");
});

app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log("server listening on port", port);
});
