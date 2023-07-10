const express = require('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
  "b2xVn2" : "http://www.lighthouselabas.ca",
  "9sm5xk": "http://www.google.ca"
};

app.get("/",(req,res)=>{
  res.send("Hello!");
});
app.get("/hello",(req,res)=>{
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls.json",(req,res)=>{
  res.json(urlDatabase);
});

app.listen(PORT, ()=>{
  console.log(`Example app listening on port ${PORT}!`)
})