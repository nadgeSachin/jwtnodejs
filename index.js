const express = require("express");

const jwt = require('jsonwebtoken');
const app = express();

// Secret key used to sign the tokens (it should be kept secret in a production environment)
const secretKey = 'your_secret_key';

app.get("/", (req, res) => {
    res.json({
        message: "sample api for testing"
    })
})




// Sample user data for creating the token
const user = {
    id: 123,
    username: 'example_user',
    role: 'admin',
};

// Function to create a JWT
function createToken(user) {
    return jwt.sign(user, secretKey, { expiresIn: '1h' }); // Token will expire in 1 hour
}

// Function to verify a JWT
function verifyToken(req,res,next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        res.send({ message: "Token Invailid.." })
    }
}

app.post("/login", (req, res) => {
    console.log("Hello Nadge..");
    const token = createToken(user);
    res.json({ token })
})

app.post("/profile", verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            res.send({ result: "Invailid token.." })
        }
        else {
            res.json({
                message: "Profile access",
                authData
            })
        }
    })
})
app.listen(5000, () => {
    console.log("App running on 5000 port..")
})