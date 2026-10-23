import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";

export async function getAuthorizedAdmin() {
  const user = await getChatGPTUser();
  if (!user) return null;
  if (env.ADMIN_EMAIL && user.email.toLowerCase() !== env.ADMIN_EMAIL.toLowerCase()) return null;
  return user;
}
