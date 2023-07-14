const getUserByEmail = (obj, email)=> {
  for (let userId in obj) {
    if (obj[userId].email === email) {
      return obj[userId];
    }
  }
  return null;
};

const generateRandomStrings = () => {//randomly generating userid for url database

  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = 6;

  for (let i = 0; i < charactersLength; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;

};

module.exports = {getUserByEmail,generateRandomStrings};