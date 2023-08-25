const crypto = require("crypto");

const saltBuf = crypto.randomBytes(16);
const salt = saltBuf.toString("base64");

const password = process.argv[2];

crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
    if (err) throw err;
    console.log("hash: " + derivedKey.toString("base64"));
    console.log("salt: " + salt);
});
