export type ApiResponse<DataType> =
  | {
      data: DataType;
      error?: never;
    }
  | {
      data?: never;
      error: string;
    };
