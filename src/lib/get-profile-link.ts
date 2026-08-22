export function getProfileLink(username: string | null) {
  return username ? `/profile/${username}` : "#";
}
