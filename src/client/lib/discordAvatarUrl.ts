export function discordAvatarUrl(userId: string, avatarHash: string) {
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=512`;
}
