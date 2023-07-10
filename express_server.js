const express = require('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
  "b2xVn2" : "http://www.lighthouselabas.ca",
  "9sm5xk": "http://www.google.ca"
};
const templateVars = {urls: urlDatabase};
app.set("view engine", "ejs");
app.get("/urls.json",(req,res)=>{
  res.json(urlDatabase);
});
app.get("/urls",(req,res)=>{
  res.render("urls_index",templateVars);
});
app.get("/urls/:id",(req,res)=>{
  const templateVars = {id:req.params.id, longURL : urlDatabase[req.params.id]};
  res.render('urls_show.ejs',templateVars);
});

app.listen(PORT, ()=>{
  console.log(`Example app listening on port ${PORT}!`)
})