export function formatLikes(likes: number) {
  if (likes < 1000) {
    return likes;
  } else if (likes >= 1000 && likes < 1000000) {
    return `${(likes / 1000).toFixed(2)}K`;
  } else if (likes >= 1000000) {
    return `${(likes / 1000000).toFixed(2)}M`;
  }
}
