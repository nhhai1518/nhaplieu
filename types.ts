
export interface AttendanceRecord {
  id: string;
  order: number;
  fullName: string;
  unit: string;
  note: string;
  timestamp: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}
