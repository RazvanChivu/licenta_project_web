import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId}, process.env.JWT_SECRET, {
    expiresIn: '20d' //expires in 20 days
  });

  //set JWT as HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 20 * 24 * 60 * 1000 // 20 days n
  });
}

export default generateToken;