import jwt from "jsonwebtoken";
class Authentication {
  static requireSignIn = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (authorization) {
      const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
      jwt.verify(token, "secret", (err, decode) => {
        if (err) {
          res.status(401).send({ message: "Invalid Token" });
        } else {
          req.user = decode;
          next();
        }
      });
    } else {
      res.status(401).send({ message: "No Token" });
    }
  };
}
export default Authentication;

