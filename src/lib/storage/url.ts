export function appendBucketUrl(url: string) {
  const bucketUrl = process.env.NEXT_PUBLIC_BUCKET_URL;

  return `${bucketUrl}/${url}`;
}
