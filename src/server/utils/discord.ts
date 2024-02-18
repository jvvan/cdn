import { getConfig } from "./getConfig";

const { discord } = getConfig();

export function createDiscordAuthorizeUri() {
  const url = new URL("https://discord.com/api/oauth2/authorize");
  url.searchParams.append("client_id", discord.client_id);
  url.searchParams.append("redirect_uri", discord.callback);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("scope", discord.scope.join(" "));
  url.searchParams.append("prompt", discord.prompt);

  return url.toString();
}

export async function getDiscordTokens(code: string) {
  const res = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: discord.client_id,
      client_secret: discord.client_secret,
      grant_type: "authorization_code",
      code,
      redirect_uri: discord.callback,
    }),
  });
  return await res.json();
}

export async function getDiscordUserInfo(token: string) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}
