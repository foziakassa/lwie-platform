import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function signToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(JWT_SECRET))
  return token
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return verified.payload
  } catch (err) {
    throw new Error("Invalid token")
  }
}

export async function getSession() {
  const token = (await cookies()).get("session")?.value
  if (!token) return null
  try {
    return await verifyToken(token)
  } catch (err) {
    return null
  }
}

