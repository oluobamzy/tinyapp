

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

module.exports = {users,urlDatabase,transformedUrlDatabase};