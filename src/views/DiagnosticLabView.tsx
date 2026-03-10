import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { GoogleGenAI } from '@google/genai';
import { Card } from '@/components/ui/Card';
import { FileUp, Loader2, ShieldCheck, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { motion } from 'motion/react';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY });

export function DiagnosticLabView() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isCritical, setIsCritical] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setAnalysisResult(null);
      setIsSaved(false);
      setIsCritical(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  } as any);

  const analyzeData = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setIsSaved(false);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // Get top 20 rows
          const top20Rows = results.data.slice(0, 20);
          const csvString = Papa.unparse(top20Rows);

          const prompt = `Here is the raw machine telemetry data (Top 20 rows):\n\n${csvString}`;

          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
              systemInstruction: 'You are an expert Reliability Engineer for Deutsche Bahn. Analyze the provided machine telemetry. Identify anomalies, calculate the likelihood of failure, and provide a 3-step maintenance action plan in accordance with DB safety standards. Also, explicitly state if there is a "CRITICAL RISK" detected.',
            }
          });

          const resultText = response.text || '';
          setAnalysisResult(resultText);
          
          // Determine if critical risk is detected based on the response
          if (resultText.toUpperCase().includes('CRITICAL RISK')) {
            setIsCritical(true);
          } else {
            setIsCritical(false);
          }
        } catch (error) {
          console.error('Error analyzing data:', error);
          setAnalysisResult('Error analyzing data. Please check your API key and try again.');
        } finally {
          setIsAnalyzing(false);
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setIsAnalyzing(false);
        setAnalysisResult('Error parsing CSV file.');
      }
    });
  };

  const handleSaveToVault = () => {
    // Simulate saving to WORM storage
    setTimeout(() => {
      setIsSaved(true);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Diagnostic Lab</h2>
          <p className="text-sm text-slate-500">AI-Powered Telemetry Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card title="Data Ingestion">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-[#f01414] bg-red-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}`}
            >
              <input {...getInputProps()} />
              <FileUp className="w-10 h-10 text-slate-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-sm font-medium text-[#f01414]">Drop the CSV file here...</p>
              ) : (
                <div>
                  <p className="text-sm font-medium text-slate-700">Drag & drop a CSV file here</p>
                  <p className="text-xs text-slate-500 mt-1">or click to select file</p>
                </div>
              )}
              <div className="mt-4 text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                Required: Timestamp, Machine_ID, Temperature, Vibration, Power_Draw
              </div>
            </div>

            {file && (
              <div className="mt-4 p-3 bg-slate-100 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Activity className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                </div>
                <span className="text-xs text-slate-500 shrink-0">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            )}

            <button
              onClick={analyzeData}
              disabled={!file || isAnalyzing}
              className="w-full mt-4 bg-[#f01414] hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Run AI Analysis'
              )}
            </button>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card 
            title="Management Summary" 
            className={`h-full transition-all duration-500 ${isAnalyzing ? 'animate-pulse border-blue-200 shadow-blue-100' : ''}`}
            action={
              analysisResult && !isAnalyzing && (
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${isCritical ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-700'}`}>
                  {isCritical ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                  {isCritical ? 'Critical Risk' : 'Normal'}
                </div>
              )
            }
          >
            <div className="min-h-[300px] flex flex-col">
              {isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                    <Activity className="w-12 h-12 text-blue-500 animate-pulse relative z-10" />
                  </div>
                  <p className="text-sm font-mono animate-pulse">Processing telemetry via Gemini AI...</p>
                </div>
              ) : analysisResult ? (
                <div className="flex-1 flex flex-col">
                  <div className="prose prose-sm prose-slate max-w-none flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300">
                    <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">
                      {analysisResult}
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-500 font-mono">
                      Layer 4 Compliance: Pending Vault Storage
                    </div>
                    <button
                      onClick={handleSaveToVault}
                      disabled={isSaved}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isSaved ? 'bg-green-100 text-green-700' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                    >
                      {isSaved ? (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          Saved to Vault
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          Sign and Save to Vault
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <Activity className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">Upload a CSV file and run analysis to view results.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
