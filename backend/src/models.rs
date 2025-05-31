use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CropData {
    pub temperature: f32,
    pub rainfall: f32,
    pub soil_ph: f32,
    pub crop_type: String,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct PredictionResponse {
    pub message: String,
    pub predicted_yield: String, 
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SuccessResponse {
    pub status: String,
    pub message: String,
}

#[derive(Serialize)]
pub struct JsonErrorResponsePayload {
    pub status_code: u16,
    pub error_type: String,
    pub message: String,
}
