export interface ApiResponse<dataType> {
  error?: string;
  data?: dataType;
}
