import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "srichakra-default-secret-key-123456";

export function signToken(payload: { id: string; email: string; role: string; name: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { id: string; email: string; role: string; name: string };
  } catch (error) {
    return null;
  }
}
