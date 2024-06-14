import jwt from "jsonwebtoken";

export default function generateTokenAndSetCookie(userId, res) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    maxage: 15 * 24 * 60 * 60 * 1000, //Ms
    httpOnly: true, //Prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request foregry attacks
    secure:process.env.NODE_ENV !== "development"
  });
}
