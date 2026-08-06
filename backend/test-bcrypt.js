const bcrypt = require("bcryptjs");

const password = "mySecretPassword";
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log("Hash:", hash);

const isMatch = bcrypt.compareSync(password, hash);
console.log("Password matches:", isMatch);
