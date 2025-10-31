import jwt from "jsonwebtoken";

export class Auth {
  static generateTokens(user) {
    return [
      jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" }), // change this to be longer
      jwt.sign(user, process.env.REFRESH_TOKEN_SECRET),
    ];
  }
}
