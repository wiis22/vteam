const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// // Validating Auth0 tokens
// const verifyJwt = jwt({
//   // Get the signing keys from Auth0
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://YOUR_AUTH0_DOMAIN/.well-known/jwks.json`,
//   }),
// 
//   audience: "YOUR_API_IDENTIFIER",
//   issuer: `https://YOUR_AUTH0_DOMAIN/`,
//   algorithms: ["RS256"], // Will probably use this one, have to make sure we're using this one though
// });

// placeholder middleweare that is always bypassed
const verifyJwt = (req, res, next) => {
    next();
}

module.exports = verifyJwt;
