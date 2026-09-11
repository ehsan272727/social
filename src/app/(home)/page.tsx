import { PostWithInfo } from "@/types/post";
import { ClientPage } from "./client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPosts } from "./getPosts";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery<PostWithInfo[] | undefined>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  return (
    <div className="">
      <main className="m-5">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ClientPage />
        </HydrationBoundary>
      </main>
    </div>
  );
}
