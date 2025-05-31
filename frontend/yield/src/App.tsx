
import React, { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { CropData, PredictionResponse, BackendErrorPayload, SuccessResponse } from './types';

// Helper to create a basic loading spinner or message
const LoadingIndicator: React.FC = () => (
  <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-md text-blue-700">
    Processing...
  </div>
);

interface ResponseDisplayProps {
  data: PredictionResponse | BackendErrorPayload | SuccessResponse | null;
  isError: boolean;
  isLoading: boolean;
}
const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ data, isError, isLoading }) => {
  if (isLoading) {
    return <LoadingIndicator />;
  }
  if (!data) return null;

  const baseClasses = "mt-4 p-4 border rounded-md shadow-sm text-sm";
  
  if (isError && data && 'error_type' in data) { // BackendErrorPayload
    const errorData = data as BackendErrorPayload;
    return (
      <div className={`${baseClasses} bg-red-100 border-red-400 text-red-700`}>
        <p className="font-semibold">Error (Status: {errorData.status_code})</p>
        <p><strong>Type:</strong> {errorData.error_type}</p>
        <p><strong>Message:</strong> {errorData.message}</p>
      </div>
    );
  } else if (!isError && data && 'predicted_yield' in data) { // PredictionResponse
     const successData = data as PredictionResponse;
    return (
      <div className={`${baseClasses} bg-green-100 border-green-400 text-green-700`}>
        <p className="font-semibold">{successData.message}</p>
        <p>{successData.predicted_yield}</p>
      </div>
    );
  } else if (!isError && data && 'status' in data && (data as SuccessResponse).status === 'success') { // SuccessResponse (e.g. for retrain)
    const successData = data as SuccessResponse;
    return (
      <div className={`${baseClasses} bg-green-100 border-green-400 text-green-700`}>
        <p className="font-semibold">Operation Successful</p>
        <p>{successData.message}</p>
      </div>
    );
  }

  // Fallback for generic string errors or unexpected structures
  return (
    <div className={`${baseClasses} ${isError ? 'bg-red-100 border-red-400 text-red-700' : 'bg-gray-100 border-gray-300 text-gray-700'}`}>
      <pre>{typeof data === 'string' ? data : JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};


function App() {
  const [formData, setFormData] = useState<CropData>({
    temperature: '',
    rainfall: '',
    soil_ph: '',
    crop_type: 'Corn', // Default crop type
  });
  const [apiResponse, setApiResponse] = useState<PredictionResponse | BackendErrorPayload | SuccessResponse | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setApiResponse(null);
    setIsError(false);

    const payload = {
      ...formData,
      temperature: parseFloat(formData.temperature as string),
      rainfall: parseFloat(formData.rainfall as string),
      soil_ph: parseFloat(formData.soil_ph as string),
    };

    // Basic validation
    if (isNaN(payload.temperature) || isNaN(payload.rainfall) || isNaN(payload.soil_ph)) {
        setApiResponse({ status_code: 400, error_type: "FrontendValidationError", message: "Temperature, rainfall, and soil pH must be valid numbers." } as BackendErrorPayload);
        setIsError(true);
        setIsLoading(false);
        return;
    }


    try {
      // Nginx will proxy /api/analyze to http://agri_ai_backend:8080/analyze
      const response = await axios.post<PredictionResponse>('/api/analyze', payload);
      setApiResponse(response.data);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<BackendErrorPayload>;
        if (axiosError.response && axiosError.response.data) {
          setApiResponse(axiosError.response.data);
        } else {
          setApiResponse({ status_code: 500, error_type: "NetworkError", message: axiosError.message } as BackendErrorPayload);
        }
      } else {
         setApiResponse({ status_code: 500, error_type: "UnknownError", message: "An unexpected error occurred." } as BackendErrorPayload);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrain = async () => {
    setIsLoading(true);
    setApiResponse(null);
    setIsError(false);
    try {
      // Nginx will proxy /api/retrain to http://agri_ai_backend:8080/retrain
      const response = await axios.get<SuccessResponse>('/api/retrain');
      setApiResponse(response.data);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<BackendErrorPayload>;
        if (axiosError.response && axiosError.response.data) {
          setApiResponse(axiosError.response.data);
        } else {
          setApiResponse({ status_code: 500, error_type: "NetworkError", message: axiosError.message } as BackendErrorPayload);
        }
      } else {
        setApiResponse({ status_code: 500, error_type: "UnknownError", message: "An unexpected error occurred while retraining." } as BackendErrorPayload);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none";
  const labelClass = "block text-sm font-medium text-slate-700";
  const buttonClass = "px-6 py-2.5 rounded-md shadow-md font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";


  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-sky-700 mb-8">
          Agri-AI Yield Predictor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="temperature" className={labelClass}>Temperature (°C):</label>
            <input type="number" name="temperature" id="temperature" value={formData.temperature} onChange={handleChange} required className={inputClass} step="0.1" />
          </div>
          <div>
            <label htmlFor="rainfall" className={labelClass}>Rainfall (mm):</label>
            <input type="number" name="rainfall" id="rainfall" value={formData.rainfall} onChange={handleChange} required className={inputClass} step="0.1" />
          </div>
          <div>
            <label htmlFor="soil_ph" className={labelClass}>Soil pH:</label>
            <input type="number" name="soil_ph" id="soil_ph" value={formData.soil_ph} onChange={handleChange} required className={inputClass} step="0.01" min="0" max="14"/>
          </div>
          <div>
            <label htmlFor="crop_type" className={labelClass}>Crop Type:</label>
            <select name="crop_type" id="crop_type" value={formData.crop_type} onChange={handleChange} required className={inputClass}>
              <option value="Corn">Corn</option>
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice</option>
              <option value="Soybean">Soybean</option>
              <option value="Potato">Potato</option>
            </select>
          </div>
          <button type="submit" disabled={isLoading} className={`${buttonClass} bg-sky-600 hover:bg-sky-700 focus:ring-sky-500 w-full`}>
            {isLoading ? 'Analyzing...' : 'Analyze Crop Yield'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200">
            <button onClick={handleRetrain} disabled={isLoading} className={`${buttonClass} bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 w-full`}>
            {isLoading ? 'Processing...' : 'Retrain Model'}
            </button>
        </div>
        
        <ResponseDisplay data={apiResponse} isError={isError} isLoading={isLoading} />

      </div>
      <footer className="mt-12 text-center text-sm text-slate-500">
        <p>Agri-AI Full-Stack Application Demo</p>
        <p>Backend: Rust (Actix-web) | Frontend: React (TypeScript, Vite)</p>
      </footer>
    </div>
  );
}

export default App;
