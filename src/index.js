import * as preferences from './repository/user-preferences.js';

import cors from 'cors';
import session from 'express-session';
import express from 'express';
import camelcase from 'express-camelcase-response-keys';

import KeycloakConnect from 'keycloak-connect';

const app = express();
const port = 3000;

const keycloak = new KeycloakConnect({
    clientId: "redhand-ns",
    bearerOnly: true,
    serverUrl: "http://localhost:8080",
    realm: "redhand",
    realmPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuFWYz1aUaYTiD+J8Ezoy0/pfkOd6LUT7yeOcFCEcwU0fzYckwnrByxFkXj3eToRSHnDTEAwndvsGaSETiEblCsR+KZp2CQjf5PzSqJWH2Wz3MroyBDxOpDCus/OA7Xo992FUBTpBPEzNzAzuuQ1amWsTh0FOTUA3ucR/T/8OBtwqUm+IPmQN1VAiBVrieUWTQV2+CzztYVif0BseSEW0X0R/ji0lGS4GZtBzU3elwuldPu4d7GphYWQbeVGlacGTt1t0AL8jLXPRZFCcjRANkSEiDt2zmjhxhQOPPZqUftIjh3qKM03GsjSWKQUwv7UF2quBelVGOD+5awto6JRlMQIDAQAB",
});

// protect all routes by default
const protectedRoutes = keycloak.protect();

const memoryStore = new session.MemoryStore();
app.use(
    session({
        secret: 'your-secret',
        resave: false,
        saveUninitialized: true,
        store: memoryStore
    })
);
app.use(
    cors(),
    keycloak.middleware(),
    protectedRoutes,
    camelcase({ deep: true }),
    express.json()
);

// endpoints
app.get('/preferences', async (req, res) => {
    const sub = req.kauth.grant.access_token.content.sub;
    res.send(await preferences.get(sub));
});

app.patch('/preferences', async (req, res) => {
    const sub = req.kauth.grant.access_token.content.sub;
    res.send(await preferences.patch(sub, req.body));
});



app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

