export interface FileStat {
  file: File;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl: string;
}

export interface S3ResponseObject {
  presignedUrl: string;
  key: string;
}
