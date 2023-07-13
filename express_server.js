const cookieSession = require('cookie-session');
const express = require('express');
const crypto = require('crypto');
const {emailLookUp} = require('./helpers');

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bcrypt = require('bcryptjs');

const generateKeys = () => {
  const randomBytes = crypto.randomBytes(32);
  return [randomBytes.toString('hex')];
};

const key = generateKeys();

app.use(
  cookieSession({
    name: 'session',
    keys: key,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
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
function urlsForUserId(userId) {
  const filteredUrls = {};
  for (const shortURL in transformedUrlDatabase) {
    if (transformedUrlDatabase[shortURL].userID === userId) {
      filteredUrls[shortURL] = transformedUrlDatabase[shortURL];
    }
  }
  return filteredUrls;
}

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
  const userId = req.session.user_id;
  const user = users[userId];

  if (!userId) {
    res.render('splashLoginPage', { user: user });
  } else {
    const templateVars = {
      user: user,
      urls: urlsForUserId(userId)
    };
    res.render('urls_index', templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
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
    userID: req.session.user_id
  };
  const userId = req.session.user_id;

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
  const userId = req.session.user_id;
  const user = users[userId];
  const templateVars = { id: req.params.id, longURL: transformedUrlDatabase[req.params.id].longURL, user:user };
  if(!userId){
    res.render('splashLoginPage',{user:user})
  }
  res.render('urls_show.ejs', templateVars);
});
app.post("/urls/:id/delete", (req, res) => {
  const userId = req.session.user_id;
  const id = req.params.id;
  const url = transformedUrlDatabase[id];

  if (!url) {
    // Handle case where URL does not exist
    return res.status(404).send("URL not found");
  }

  if (url.userID !== userId) {
    // Handle case where user is not authorized to delete the URL
    return res.status(403).send("You are not authorized to delete this URL");
  }

  delete transformedUrlDatabase[id];
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  const userId = req.session.user_id;
  const id = req.params.id;
  const url = transformedUrlDatabase[id];

  if (!url) {
    // Handle case where URL does not exist
    return res.status(404).send("URL not found");
  }

  if (url.userID !== userId) {
    // Handle case where user is not authorized to edit the URL
    return res.status(403).send("You are not authorized to edit this URL");
  }

  url.longURL = req.body["newUrl"];
  res.redirect("/urls");
});
app.get('/login',(req,res)=>{
  const userId = req.session.user_id;
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
  let isEmailExist = emailLookUp(email,users);

  for (let userId in users) {
    if (!isEmailExist && bcrypt.compareSync(password, users[userId].hashedPassword)) {
      return res.status(403).send("403 error");
    }
    req.session.user_id = users[userId].id;
  }
  res.redirect("/urls");
});
app.post("/logout", (req, res) => {
  req.session = null;
  res.clearCookie("session");
  res.redirect("/login")
});
app.get('/register',(req,res)=>{
  const userId = req.session.user_id;
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
  const hashedPassword = bcrypt.hashSync(password,10);
  const userId = generateRandomStrings();
  //check for empty email or password
  if (email === "" || password === ""){
   return res.status(404).send("404 error")
  };
  //check if email already exists in users object
  let isEmailExist = emailLookUp(email,users);
  if(isEmailExist){
    return res.status(404).send("404 error");
  };

  //Add new user to the users object
    users[userId] = {
      id: userId,
      email,
      hashedPassword
    };

  //set user_id cookie 
  req.session.user_id = userId
   //redirect
    res.redirect("/urls");  
    console.log(users)
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});