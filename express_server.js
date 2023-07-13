const express = require('express');
const app = express();
const PORT = 8080;
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const generateRandomStrings = () => {

  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = 6;

  for (let i = 0; i < charactersLength; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;

};

const emailLookUp = (email)=>{
  for (const userId in users) {
    if (users[userId].email === email) {
      return true; // Email already exists
    }
  }
  return false; // Email does not exist
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  a: {
    id: "a",
    email: "a@a.com",
    password: "a",
  },
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabas.ca",
  "9sm5xk": "http://www.google.ca"
};
//const templateVars = { urls: urlDatabase };
app.set("view engine", "ejs");
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = {
    user: user,
    urls: urlDatabase
  }
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const longURL = req.body["longURL"];
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
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render('urls_show.ejs', templateVars);
});
app.post("/urls/:id/delete", (req, res) => {
  let id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});
app.post("/urls/:id/edit", (req, res) => {
  let id = req.params.id;
  urlDatabase[id] = req.body["newUrl"];
  res.redirect("/urls")
});
app.post("/login", (req, res) => {
  res.cookie("user_id", req.body.id);
  res.redirect("/urls");
});
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls")
});
app.get('/register',(req,res)=>{

  res.render('urls_register');
});
app.post("/register",(req,res)=>{
  const email = req.body.email;
  const password = req.body.password;
  const userId = generateRandomStrings();
  //check for empty email or password
  if (email === "" || password === ""){
   return res.status(404).send("404 error")
  };
  //check if email already exists in users object
  let isEmailExist = emailLookUp(email);
  if(isEmailExist){
    return res.status(404).send("404 error");
  };

  //Add new user to the users object
    users[userId] = {
      id: userId,
      email,
      password
    };

  //set user_id cookie 
   res.cookie("user_id",userId);
   //redirect
    res.redirect("/urls");  
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});