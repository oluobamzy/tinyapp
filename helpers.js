const getUserByEmail = (obj, email)=> {
  for (let userId in obj) {
    if (obj[userId].email === email) {
      return obj[userId];
    }
  }
  return null;
};
const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};
console.log(getUserByEmail(testUsers,"user@example.com"));
module.exports = {getUserByEmail};