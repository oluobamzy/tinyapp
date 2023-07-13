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
//change the urldatabase to transformed database
const transformedUrlDatabase = {};

for (const url_id in urlDatabase) {
  transformedUrlDatabase[url_id] = {
    longURL: urlDatabase[url_id],
    userID: ""
  };
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
    urls: transformedUrlDatabase
   }
  res.render("urls_index",templateVars);
});
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const longURL = req.body["longURL"];
  if(!userId){
    res.redirect('/login')
  }else{
    res.render("urls_new",{user: user});
  }
  
});
app.post("/urls", (req, res) => {
  let newId = generateRandomStrings();
  transformedUrlDatabase[newId] = {
    longURL: req.body["longURL"],
    userID: req.cookies["user_id"]
  };
  const userId = req.cookies["user_id"];

  if (!userId) {
    return res.send("You cannot post because you are not logged in");
  } else {
    res.redirect(`/urls/${newId}`);
  }
});
app.get("/u/:id", (req, res) => {
  // const longURL = ...
  const longURL = transformedUrlDatabase[req.params.id].longURL
  for(let shortUrl in transformedUrlDatabase){
    if(shortUrl !== req.params.id){
      return res.status(404).send("Not found");
    }
  }
  res.redirect(longURL);
});
app.get("/urls/:id", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = { id: req.params.id, longURL: transformedUrlDatabase[req.params.id].longURL, user:user };
  res.render('urls_show.ejs', templateVars);
});
app.post("/urls/:id/delete", (req, res) => {
  let id = req.params.id;
  delete transformedUrlDatabase[id];
  res.redirect("/urls");
});
app.post("/urls/:id/edit", (req, res) => {
  let id = req.params.id;
  transformedUrlDatabase[id].longURL = req.body["newUrl"];
  res.redirect("/urls")
});
app.get('/login',(req,res)=>{
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = { user:user };
    if (userId) {
      res.redirect("/urls");
    } else {
      res.render('urls_login',templateVars)
    }
})
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let isEmailExist = emailLookUp(email);
  for(let userId in users){
    if(!isEmailExist && users[userId].password !== password){
       return res.status(403).send("403 error");
    }
    res.cookie("user_id", users[userId].id);
  };
   res.redirect("/urls");
});
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login")
});
app.get('/register',(req,res)=>{
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = {user:user};
  if (userId) {
    res.redirect("/urls");
  } else {
    res.render('urls_register',templateVars);
  }
 
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