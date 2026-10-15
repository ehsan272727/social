"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { isAPIError } from "better-auth/api";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";
import { postsApi } from "@/lib/api/axios-instance";
import { ApiResponse } from "@/types/api/response";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@/components/post/post";
import { PostWithInfo } from "@/types/post";
import { use } from "react";
import { ProfileImage } from "@/components/profile/profile-image/profile-image";

const getPosts = async ({ username }: { username: string }) => {
  const params = new URLSearchParams({
    username,
  });

  const response: ApiResponse<PostWithInfo[]> = (
    await postsApi.get(`?${params}`)
  ).data;
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

export default function Profile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const {
    data: session,
    isPending: isAuthPending,
    error,
  } = authClient.useSession();
  const router = useRouter();
  const { username: queryUsername } = use(params);

  const {
    data: posts,
    isPending,
    isError,
    refetch: refetchPosts,
  } = useQuery({
    queryFn: () => getPosts({ username: queryUsername as string }),
    queryKey: ["posts", "username", queryUsername as string],
    enabled: !!queryUsername && queryUsername.length > 0,
  });

  const printName = session?.user.displayUsername
    ? session.user.displayUsername
    : session?.user.username;

  async function handleSignOut() {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    } catch (error) {
      if (isAPIError(error)) {
        toast.add({ type: "error", description: error.message });
      }
    }
  }

  if (!queryUsername) {
    return <div>no Username was in the url</div>;
  }

  if (isAuthPending) {
    return (
      <div className="mt-5 flex justify-center items-center gap-2">
        Checking user
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!isPending && !session) {
    return (
      <div className="mt-5 flex items-center justify-center gap-2">
        Redirecting to sign in page
        <Spinner className="size-5" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b pb-2 mb-4">
        <div className="flex items-center gap-3">
          <ProfileImage session={session} />
          <h1 className="font-bold">{printName}</h1>
        </div>
        <Button onClick={handleSignOut} className="flex items-center">
          <span>Sign out</span>
          <LogOut />
        </Button>
      </div>

      <section>
        {posts && (
          <div className="flex flex-col">
            {posts?.map((post) => (
              <Post
                key={post.id}
                post={post}
                user={session?.user}
                refetchPosts={refetchPosts}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
