import express from 'express';
import cors from 'cors';
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const app = express();
const port = 3000;

const memoryStore = new session.MemoryStore();
app.use(
    session({
        secret: 'your-secret',
        resave: false,
        saveUninitialized: true,
        store: memoryStore
    })
);

const kcConfig = {
    clientId: "redhand-ns",
    bearerOnly: true,
    serverUrl: "http://localhost:8080",
    realm: "redhand",
    realmPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArlRnh84SPyHYb+8QknWeIZtvar+bXN9kWLoVjHw1a6zZQs3TMlHd9bavxzp98+ZPoEmW8BonArWd2cQctyaRmIKfrdaltA0olmv80fkihwj2w1wrvdRt4vnKXwR2873KMlPq1MYb2peEVZ+rM5wGG6SVauZgfJceNiE4CW3Dd8ySZf3ruSHtnirI/uuL5kOx/X2jLEmNLf/h7rmLuoa7sqe4rPhSoeqz1gwHAmVK1ZgjI5wWnjZm3NPf3z0qHxAd1pIEXfjsiaTMALW638hFrSx6kcGXcQFQgYp2DWKkzHt10Mor8NYbPLIJY4NyZCzV7lq0hfHheCIXI0FTOoYWSwIDAQAB",
};

const keycloak = new Keycloak({ store: memoryStore }, kcConfig);
// protect all routes by default
const protectedRoutes = keycloak.protect();

app.use(
    cors(),
    keycloak.middleware(),
    protectedRoutes
);

app.get('/HelloWorld', (req, res) => {
  	console.log(`processing request`);
    res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

