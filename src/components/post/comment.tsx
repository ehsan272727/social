import { CommentWithInfo } from "@/types/comment";

interface Props {
  data: CommentWithInfo;
}

export function Comment({ data }: Props) {
  return (
    <div key={data.id} className="pb-2">
      <div>
        <h3 className="font-bold text-gray-500">{data.user.displayUsername}</h3>
        <p>{data.content}</p>
      </div>
    </div>
  );
}
