const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

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

describe('getUsersByEmail', function() {
  it('should return userRandomID if a user exist', function() {
    const user = getUserByEmail(testUsers,"user@example.com").id;
    const expected = "userRandomID";
    // Write your assert statement here
    assert.strictEqual(user,expected);
  });
  it('should return null if a user does not exist', function() {
    const user = getUserByEmail(testUsers,"userrr@example.com")
    const expected = null;
    // Write your assert statement here
    assert.strictEqual(user,expected);
  });
});