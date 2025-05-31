use actix_web::{web, App, HttpServer, middleware::Logger};
use std::sync::{Arc, Mutex};

mod handlers;
mod models;
mod ml_service;
mod errors;

use handlers::{analyze_crop_handler, retrain_model_handler, AppState};
use ml_service::MlModel;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logger
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    log::info!("Starting Agri-AI backend server...");

    // Load the ML model (or simulate loading)
    // This model will be shared across all worker threads
    let model = MlModel::load();
    let shared_model_state = web::Data::new(AppState {
        ml_model: Arc::new(Mutex::new(model)),
    });

    log::info!("Agri-AI backend server configuring routes and starting on http://127.0.0.1:8080");

    HttpServer::new(move || {
        App::new()
            .app_data(shared_model_state.clone())
            .wrap(Logger::default())
            .wrap(Logger::new("%a %{User-Agent}i")) 
            .service(
                web::resource("/analyze")
                    .route(web::post().to(analyze_crop_handler))
            )
            .service(
                web::resource("/retrain")
                    .route(web::get().to(retrain_model_handler)) 
            )
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
    