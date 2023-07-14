const cookieSession = require('cookie-session');
const express = require('express');
const crypto = require('crypto');// i tried using math.round to generate my own key but i kept getting errors...found this via google search.
const {getUserByEmail,generateRandomStrings} = require('./helpers');//importing my helper function

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));

const bcrypt = require('bcryptjs');
const generateKeys = () => {//generating the cookie-session key
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
}
const urlsForUserId = (userId)=> {//getting urls that are in the datatbase
  const filteredUrls = {};
  for (const shortURL in transformedUrlDatabase) {
    if (transformedUrlDatabase[shortURL].userID === userId) {
      filteredUrls[shortURL] = transformedUrlDatabase[shortURL];
    }
  }
  return filteredUrls;
};

//ROUTES
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
  if (!userId) {
    res.redirect('/login');
  } else {
    res.render("urls_new",{user: user});
  }
  
});
app.post("/urls", (req, res) => {
  let newId = generateRandomStrings();
  const userId = req.session.user_id;
  transformedUrlDatabase[newId] = {
    longURL: req.body["longURL"],
    userID: req.session.user_id
  };
  if (!userId) {
    return res.send("You cannot post because you are not logged in");
  } else {
    res.redirect(`/urls/${newId}`);
  }
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const urlEntry = transformedUrlDatabase[shortURL];
  if (urlEntry) {
    const longURL = urlEntry.longURL;
    res.redirect(longURL);
  } else {
    res.status(404).send("The URL does not exist. Please provide a valid URL.");
  }
});

app.get("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  const urlEntry = transformedUrlDatabase[req.params.id];
  if (!userId) {
    res.render('splashLoginPage', { user: user });
  } else if (!urlEntry) {
    res.status(404).send("Not found");
  } else {
    const templateVars = {
      id: req.params.id,
      longURL: urlEntry.longURL,
      user: user
    };
    res.render('urls_show.ejs', templateVars);
  }
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

app.get('/login', (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  if (user) {
    res.redirect("/urls");
  } else {
    const templateVars = { user };
    res.render('urls_login', templateVars);
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);
  if (!user) {
    // Handle case where the user with the provided email does not exist
    return res.render('unsuccesful_login',{user:user});
  }
  if (!bcrypt.compareSync(password, user.hashedPassword)) {
    // Handle case where the provided password is incorrect
    return res.status(403).send("Invalid email or password");
  }
  req.session.user_id = user.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
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
  
  //check for empty email or password
  if (email === "" || password === "") {
    return res.status(404).send("404 error");
  }
  //check if email already exists in users object
  const user = getUserByEmail(users,email);
  if (user) {
    return res.render('emailExist');
  }
  const userId = generateRandomStrings();
  const hashedPassword = bcrypt.hashSync(password,10);
  //Add new user to the users object
  users[userId] = {
    id: userId,
    email,
    hashedPassword
  };
  //set user_id cookie
  req.session.user_id = userId;
  //redirect
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});