const { assert } = require('chai');

const { emailLookUp } = require('../helpers.js');

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

describe('emailLookUp', function() {
  it('should return true if a user exist', function() {
    const user = emailLookUp("user@example.com", testUsers)
    const expected = true;
    // Write your assert statement here
    assert.strictEqual(user,expected);
  });
  it('should return false if a user does not exist', function() {
    const user = emailLookUp("userrr@example.com", testUsers)
    const expected = false;
    // Write your assert statement here
    assert.strictEqual(user,expected);
  });
});