const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
    jwksUri: 'https://YOUR_AUTH0_DOMAIN/.well-known/jwks.json'
});

const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
};

jwt.verify(token, getKey, {
    audience: 'YOUR_CLIENT_ID',
    issuer: 'https://YOUR_AUTH0_DOMAIN/',
}, (err, decoded) => {
    if (err) {
        console.error('Token verification failed:', err);
    } else {
        console.log('Decoded token:', decoded);
    }
});
