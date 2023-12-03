const express = require("express");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const client = new OAuth2Client(
  "1062828160998-0sskrkgmv6r9fhvsr02b6pglr4mo1opv.apps.googleusercontent.com"
);

app.use(cors());
app.use(express.json());

app.post("/api/google-login", async (req, res) => {
  const ticket = await client.verifyIdToken({
    idToken: req.body.token,
  });

  res.status(200).json(ticket.getPayload());
});

app.listen(4001, () => {
  console.log(`Server is ready at 4001 port`);
});
