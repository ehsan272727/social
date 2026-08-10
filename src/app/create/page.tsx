"use client";

import { FormInput } from "@/components/inputs";
import { TextareaInput } from "@/components/inputs/text-area-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createPost } from "./actions";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const maxTextCharacters = 400;

const PostFormSchema = z.object({
  title: z
    .string()
    .min(1, { error: "Title is required" })
    .max(200, { error: "200 characters at most" }),
  content: z
    .string()
    .max(maxTextCharacters, {
      error: `Text has exceeded the ${maxTextCharacters} limit`,
    })
    .optional(),
});

export default function Create() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSending, setIsSending] = useState(false);
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(data: z.output<typeof PostFormSchema>) {
    try {
      setIsSending(true);
      const result = await createPost(data);

      if ("error" in result) {
        toast.add({ type: "error", description: result.error });
      } else {
        toast.add({ type: "success", description: result.success_message });
        router.push("/");
      }
    } catch (error) {
      toast.add({ type: "error", description: "An unknown error(client)" });
    } finally {
      setIsSending(false);
    }
  }

  if (!isPending && !session) {
    return (
      <div className="mt-5 flex flex-col gap-2 items-center justify-center">
        <h1 className="md:text-xl">You are not signed in!</h1>
        <Link
          href="/sign-in"
          className="flex items-center gap-1 px-2 py-1.5 border rounded-md hover:bg-secondary"
        >
          Sign in to create posts
          <LogIn />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Create a post</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormInput formControl={control} name="title" label="Title" />
            <TextareaInput
              formControl={control}
              name="content"
              label="Content"
            />
            <Button
              type="submit"
              disabled={isSending}
              className="self-end flex items-center capitalize"
            >
              {!isSending ? (
                <>
                  post <Send />
                </>
              ) : (
                <>
                  posting
                  <Spinner />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
