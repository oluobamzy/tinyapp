const getUserByEmail = (obj, email)=> {
  for (let userId in obj) {
    if (obj[userId].email === email) {
      return obj[userId];
    }
  }
  return null;
};
module.exports = {getUserByEmail};