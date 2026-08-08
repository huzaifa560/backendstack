import jwt from "jsonwebtoken";

// Creates a signed JWT for the given user and attaches it to the
// response as an HTTP-only cookie. Because the cookie is HTTP-only,
// client-side JavaScript cannot read it, which protects against XSS
// token theft.
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // inaccessible to JS on the client (document.cookie)
    secure: process.env.NODE_ENV === "production", // only sent over HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" is required for cross-site cookies (different domains) in production; "lax" works for local dev
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days, in milliseconds
  });

  return token;
};

export default generateToken;
