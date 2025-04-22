import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import connectDB from "../../../utils/db";
import User from "../../../models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

// Define an interface for the decoded JWT token
interface DecodedToken {
  userId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    // Use the DecodedToken type for the decoded value
    const decoded: DecodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}
