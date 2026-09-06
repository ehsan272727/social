import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FileStat } from "@/types/file";
import { X } from "lucide-react";
import Image from "next/image";
import {
  ChangeEvent,
  Dispatch,
  RefObject,
  SetStateAction,
  useRef,
} from "react";

interface Props {
  files: FileStat[];
  setFiles: Dispatch<SetStateAction<FileStat[]>>;
}

export function FileInput({ files, setFiles }: Props) {
  const inputRef: HTMLInputElement | RefObject<null> = useRef(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputFiles = Array.from(e.target.files || []);
    if (inputFiles.length > 0) {
      setFiles(
        inputFiles.map((file) => {
          const fileObj: FileStat = {
            file,
            error: false,
            isDeleting: false,
            progress: 0,
            uploading: false,
            objectUrl: URL.createObjectURL(file),
          };
          return fileObj;
        }),
      );
    } else {
      setFiles([]);
    }
  };

  const handleRemoveFile = (targetFile: FileStat) => {
    setFiles((prev) =>
      prev.filter((file) => file.objectUrl !== targetFile.objectUrl),
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Field>
        <FieldLabel htmlFor="picture">Upload an image or clip</FieldLabel>
        <Input
          id="picture"
          ref={inputRef}
          type="file"
          accept="image/jpg, image/png, image/webp, image/svg, video/*"
          multiple={true}
          onChange={handleFileChange}
        />
      </Field>
      <div className="grid grid-cols-2">
        {files.length > 0 &&
          files.map((fileInfo) => {
            const fileType = fileInfo.file.type.split("/")[0] as
              | "image"
              | "video";
            return (
              <div key={fileInfo.file.name} className="w-fit flex gap-2">
                <div>
                  <Button
                    size="icon-sm"
                    variant="destructive"
                    onClick={() => handleRemoveFile(fileInfo)}
                  >
                    <X className="size-4 md:size-5" />
                  </Button>
                </div>
                <div className="w-40 h-40 relative rounded-md">
                  <div
                    className="top-0 left-0 w-full bg-gray-200 opacity-50"
                    style={{
                      display: fileInfo.uploading ? "absolute" : "none",
                      height: `${100 - fileInfo.progress}%`,
                    }}
                  ></div>
                  {fileType === "image" ? (
                    <Image
                      src={fileInfo.objectUrl}
                      alt="preview of the selected media"
                      width={160}
                      height={160}
                      className="w-full h-full bg-gray-100 object-contain rounded-md"
                    />
                  ) : (
                    <video
                      src={fileInfo.objectUrl}
                      controls
                      className="w-full h-full  object-contain rounded-md"
                    />
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
