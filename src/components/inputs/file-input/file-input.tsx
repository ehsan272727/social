import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FileStat } from "@/types/file";
import clsx from "clsx";
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
    console.log(inputFiles);
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

  return (
    <div className="flex flex-col gap-2">
      <Field>
        <FieldLabel htmlFor="picture">Upload an image or clip</FieldLabel>
        <Input
          id="picture"
          ref={inputRef}
          type="file"
          accept="image/jpg, image/png, image/webp, image/svg video/*"
          multiple={true}
          onChange={handleFileChange}
        />
      </Field>
      {files.length > 0 &&
        files.map((fileInfo) => (
          <div
            key={fileInfo.file.name}
            className="w-40 h-40 relative rounded-md"
          >
            <div
              className={`h-${100 - fileInfo.progress}% absolute top-0 left-0 w-full bg-gray-200 opacity-50`}
            ></div>
            <Image
              src={fileInfo.objectUrl}
              alt="preview of the selected media"
              width={160}
              height={160}
              className="w-full h-full object-contain rounded-md"
            />
          </div>
        ))}
    </div>
  );
}
