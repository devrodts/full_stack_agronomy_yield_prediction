use actix_web::{error::ResponseError, http::StatusCode, HttpResponse};
use serde::Serialize;
use thiserror::Error;

use crate::models::JsonErrorResponsePayload;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("ML Model Inference Error: {0}")]
    ModelInference(String),

    #[error("Model Not Loaded: {0}")]
    ModelNotLoaded(String),

    #[error("Retraining Error: {0}")]
    RetrainingError(String),

    #[error("Internal Server Error: {0}")]
    InternalError(String),

}

impl ResponseError for AppError {
    fn status_code(&self) -> StatusCode {
        match self {
            AppError::ModelInference(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::ModelNotLoaded(_) => StatusCode::SERVICE_UNAVAILABLE,
            AppError::RetrainingError(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::InternalError(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> HttpResponse {
        let status = self.status_code();
        let error_type_str = match self {
            AppError::ModelInference(_) => "ModelInferenceError".to_string(),
            AppError::ModelNotLoaded(_) => "ModelNotLoadedError".to_string(),
            AppError::RetrainingError(_) => "RetrainingError".to_string(),
            AppError::InternalError(_) => "InternalServerError".to_string(),
        };

        let payload = JsonErrorResponsePayload {
            status_code: status.as_u16(),
            error_type: error_type_str,
            message: self.to_string(),
        };
        HttpResponse::build(status).json(payload)
    }
}
