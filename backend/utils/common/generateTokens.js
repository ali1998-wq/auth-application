const JWT = require("jsonwebtoken");

exports.generateTokens = (fistName, lastName, email, role, _id) => {
  const Token = JWT.sign(
    { fistName, lastName, email, role, _id },
    process.env.SECRET,
    { expiresIn: "1h" }
  );
  const RefreshToken = JWT.sign(
    { fistName, lastName, email, role, _id },
    process.env.SECRET,
    { expiresIn: "1d" }
  );
  return { Token, RefreshToken };
};
