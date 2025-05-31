
export interface CropData {
  temperature: number | string;
  rainfall: number | string;
  soil_ph: number | string;
  crop_type: string;
}

export interface PredictionResponse {
  message: string;
  predicted_yield: string;
}

export interface BackendErrorPayload {
  status_code: number;
  error_type: string;
  message: string;
}

export interface SuccessResponse {
    status: string;
    message: string;
}
