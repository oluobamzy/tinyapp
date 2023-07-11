const express = require('express');
const app = express();
const PORT = 8080;
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const generateRandomStrings = ()=>{
 
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = 6;
  
    for (let i = 0; i < charactersLength; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  
};

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
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
   }
  res.render("urls_index",templateVars);
});
app.get("/urls/new", (req, res) => {
  const longURL = req.body["longURL"]
  res.render("urls_new");
});
app.post("/urls", (req, res) => {
  // console.log(req.body); // Log the POST request body to the console
   let newId = generateRandomStrings();
   urlDatabase[newId] = req.body["longURL"];
   //console.log(req.body);
   //console.log(urlDatabase);
   res.redirect(`/urls/${newId}`);
 });
 app.get("/u/:id", (req, res) => {
  // const longURL = ...
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
});
app.get("/urls/:id",(req,res)=>{
  const templateVars = {id:req.params.id, longURL : urlDatabase[req.params.id]};
  res.render('urls_show.ejs',templateVars);
});
app.post("/urls/:id/delete",(req,res)=>{
  let id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});
app.post("/urls/:id/edit",(req,res)=>{
  let id = req.params.id;
  urlDatabase[id] = req.body["newUrl"];
  res.redirect("/urls")
});
app.post("/login",(req,res)=>{
  res.cookie("username",req.body.username);
  res.redirect("/urls");
})


app.listen(PORT, ()=>{
  console.log(`Example app listening on port ${PORT}!`)
})