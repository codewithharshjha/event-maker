import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function getUserIdFromRequest(req: NextRequest): string | null {
  
  const token = req.headers.get("x-auth-token");
console.log('auth token',req.headers)
  console.log('from getUserId',token)
  if (!token) return null;
console.log('from userid',process.env.JWT_SECRET)
  try {
    const decoded = jwt.verify(token, "hjha3987" as string) as {
      user: { id: string };
    };
    return decoded.user.id;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}
