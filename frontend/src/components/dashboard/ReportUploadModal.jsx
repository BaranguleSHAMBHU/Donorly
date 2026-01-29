import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Check, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReportUploadModal = ({ isOpen, onClose, donationId, onSuccess }) => {
  const [mode, setMode] = useState('select'); // 'select', 'camera', 'preview'
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // 1. Handle File Selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setMode('preview');
    }
  };

  // 2. Start Camera
  const startCamera = async () => {
    setMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error("Camera access denied");
      setMode('select');
    }
  };

  // 3. Take Photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const capturedFile = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        setFile(capturedFile);
        setPreview(canvas.toDataURL('image/jpeg'));
        setMode('preview');
        
        // Stop stream
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }, 'image/jpeg');
    }
  };

  // 4. Upload to Backend
  const handleUpload = async () => {
    if (!file || !donationId) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('report', file);
    formData.append('donationId', donationId);

    try {
      const token = localStorage.getItem("orgToken");
      await axios.post('http://localhost:5000/api/camps/upload-report', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      toast.success("Medical Report Sent!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border dark:border-slate-800">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold dark:text-white">Upload Medical Report</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
            <X className="w-5 h-5 dark:text-slate-400" />
          </button>
        </div>

        <div className="min-h-[300px] bg-gray-50 dark:bg-slate-950 rounded-2xl flex flex-col items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 dark:border-slate-800 relative">
          
          {/* VIEW: SELECT MODE */}
          {mode === 'select' && (
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-sm hover:scale-105 transition-transform"
              >
                <Upload className="w-5 h-5 text-blue-500" />
                <span className="font-bold dark:text-white">Select File / PDF</span>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />

              <div className="text-gray-400 text-sm font-medium">OR</div>

              <button 
                onClick={startCamera}
                className="flex items-center gap-3 px-6 py-3 bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-500/30 hover:scale-105 transition-transform"
              >
                <Camera className="w-5 h-5" />
                <span className="font-bold">Take Photo</span>
              </button>
            </div>
          )}

          {/* VIEW: CAMERA ACTIVE */}
          {mode === 'camera' && (
            <div className="relative w-full h-full flex flex-col">
              <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
              <button 
                onClick={capturePhoto}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-rose-500 flex items-center justify-center shadow-lg"
              >
                <div className="w-12 h-12 bg-rose-500 rounded-full"></div>
              </button>
            </div>
          )}

          {/* VIEW: PREVIEW */}
          {mode === 'preview' && (
            <div className="relative w-full h-full p-4">
              {file.type.includes('pdf') ? (
                 <div className="h-full flex items-center justify-center text-red-500 font-bold">PDF Selected</div>
              ) : (
                 <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
              )}
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                 <button 
                   onClick={() => setMode('select')}
                   className="p-3 bg-gray-600 text-white rounded-full shadow-lg"
                 >
                   <RefreshCw className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={handleUpload}
                   disabled={uploading}
                   className="px-6 py-3 bg-emerald-500 text-white rounded-full shadow-lg font-bold flex items-center gap-2"
                 >
                   {uploading ? 'Sending...' : <><Check className="w-5 h-5" /> Confirm & Send</>}
                 </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ReportUploadModal;