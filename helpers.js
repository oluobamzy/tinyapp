const emailLookUp = (email,users)=>{
  for (const userId in users) {
    if (users[userId].email === email) {
      return true; // Email already exists
    }
  }
  return false; // Email does not exist
};
module.exports = {emailLookUp};