use actix_web::{web, HttpResponse, Responder};
use std::sync::{Arc, Mutex}; 

use crate::models::{CropData, PredictionResponse, SuccessResponse};
use crate::ml_service::MlModel;
use crate::errors::AppError;

pub struct AppState {
    pub ml_model: Arc<Mutex<MlModel>>,
}

pub async fn analyze_crop_handler(
    data: web::Json<CropData>,
    app_state: web::Data<AppState>, // Access shared state
) -> Result<impl Responder, AppError> {
    log::info!("Received /analyze request for crop: {}", data.crop_type);

    let model_gaurd = app_state.ml_model.lock().map_err(|e| {
        log::error!("Failed to acquire model lock: {}", e);
        AppError::InternalError("Failed to acquire model lock".to_string())
    })?;
    
    let crop_data_cloned = data.into_inner();

    match model_gaurd.predict(&crop_data_cloned) {
        Ok(prediction_text) => {
            log::info!("Prediction successful: {}", prediction_text);
            Ok(HttpResponse::Ok().json(PredictionResponse {
                message: "Analysis successful".to_string(),
                predicted_yield: prediction_text,
            }))
        }

        Err(e) => {
            log::error!("Prediction error: {}", e);
            Err(e)
        }
        
    }
}

pub async fn retrain_model_handler(
    app_state: web::Data<AppState>,
) -> Result<impl Responder, AppError> {
    log::info!("Received /retrain request");

    let mut model_gaurd = app_state.ml_model.lock().map_err(|e| {
        log::error!("Failed to acquire model lock for retraining: {}", e);
        AppError::InternalError("Failed to acquire model lock for retraining".to_string())
    })?;

    match model_gaurd.retrain() {
        Ok(retrain_message) => {
            log::info!("Retraining successful: {}", retrain_message);
            Ok(HttpResponse::Ok().json(SuccessResponse {
                status: "success".to_string(),
                message: retrain_message,
            }))
        }
        Err(e) => {
            log::error!("Retraining error: {}", e);
            Err(e)
        }
    }
}
