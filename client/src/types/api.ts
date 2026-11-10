// Mirrors the Express response shape: { success, data, meta? } or { success: false, message, errors? }.
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: FieldError[];
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}
