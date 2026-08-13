import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaceGrinning, SendHorizonal } from "lucide-react";

export function CommentInput() {
  return (
    <div className="flex gap-1">
      <form className="flex-1 flex gap-1.5">
        <Textarea
          className="min-w-0 flex-1 resize-none field-sizing-fixed"
          placeholder="enter you comment here"
        ></Textarea>
        <div className="flex flex-col gap-1.5">
          <Button size="icon" variant="outline">
            <SendHorizonal className="size-6" />
          </Button>
          <Button size="icon" variant="outline">
            <FaceGrinning className="size-6" />
          </Button>
        </div>
      </form>
    </div>
  );
}
