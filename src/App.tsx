import React, { useState } from "react";
import { Search, Loader2, Landmark, History, Github } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import FileUploader from "./components/FileUploader";
import BudgetDashboard from "./components/BudgetDashboard";
import ChatInterface from "./components/ChatInterface";
import { BudgetAnalysis } from "./types";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'fail'>('checking');

  React.useEffect(() => {
    fetch("/api/health")
      .then(res => res.ok ? setApiStatus('ok') : setApiStatus('fail'))
      .catch(() => setApiStatus('fail'));
  }, []);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setAnalysis(null);
    setError(null);
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("budgetPdf", selectedFile);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to analyze document");
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message);
      setFile(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAskQuestion = async (question: string) => {
    if (!file) return "Please upload a file first.";

    const formData = new FormData();
    formData.append("budgetPdf", file);
    formData.append("question", question);

    const response = await fetch("/api/ask", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to answer question");
    }

    const result = await response.json();
    return result.answer;
  };

  const clearFile = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-24 selection:bg-ink selection:text-bg">
      {/* Navigation Header */}
      <nav className="border-b border-ink/10 py-6 px-10 flex items-center justify-between sticky top-0 bg-bg/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-4">
          <div className="bg-ink p-2 px-3 flex items-center justify-center text-bg rounded font-bold text-xl tracking-tighter">
            <Landmark size={24} className="mr-2" />
            WDLOG
          </div>
          <div className="h-8 w-[1px] bg-ink/10 hidden sm:block" />
          <div className="hidden sm:block text-xs uppercase tracking-widest font-black opacity-40">
            County Budget Watchdog <br /> Citizen Transparency Tool
          </div>
        </div>
        {apiStatus === 'fail' && (
          <div className="bg-red-500 text-bg text-[10px] px-3 py-1 rounded-full animate-pulse font-bold">
            OFFLINE
          </div>
        )}
        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest opacity-60">
          <a href="#" className="hover:opacity-100 transition-opacity">Guidelines</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Archive</a>
          <button className="bg-ink text-bg px-4 py-2 rounded-full hover:scale-105 transition-transform cursor-pointer">
            Login
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        {/* Hero Section */}
        <header className="mb-16 max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl sm:text-8xl font-black tracking-tighter text-ink leading-[0.85] mb-8"
          >
            TRANSPARENCY <br/> IS NOT A <br/> PRIVILEGE.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-ink/70 leading-relaxed max-w-2xl font-medium"
          >
            Upload official county budget documents to immediately see where funds are allocated, 
            which wards are prioritized, and ask AI-assisted questions in plain English.
          </motion.p>
        </header>

        {/* Upload State */}
        <section className="mb-24">
          <FileUploader 
            onFileSelect={handleFileSelect} 
            selectedFile={file} 
            onClear={clearFile} 
          />
          
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 mt-12 p-12 border border-ink/5 rounded-2xl bg-white/50"
              >
                <Loader2 className="animate-spin text-ink" size={48} />
                <div className="text-center">
                  <p className="text-2xl font-black uppercase tracking-tighter">Analyzing Document</p>
                  <p className="text-xs opacity-50 uppercase tracking-widest font-bold">Scanning for allocations, wards, and key data points</p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 flex flex-col items-center gap-2"
              >
                <p className="font-bold">Extraction Error</p>
                <p className="text-sm">{error}</p>
                <button onClick={clearFile} className="mt-2 text-xs underline font-bold uppercase tracking-widest">Try another file</button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Results Area */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-24"
            >
              <section>
                <div className="flex items-end justify-between mb-8 pb-4 border-b-4 border-ink">
                  <div>
                    <h2 className="text-5xl font-black tracking-tighter uppercase italic">The Dashboard</h2>
                    <p className="text-sm uppercase tracking-widest opacity-50 font-bold">Key extracted budget data</p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-xs font-mono opacity-40">
                    <History size={14} />
                    <span>EXTRACTED ON {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <BudgetDashboard data={analysis} />
              </section>

              <section className="bg-zinc-900 -mx-6 px-6 py-24 sm:rounded-[3rem]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                      <h2 className="text-bg text-5xl font-black tracking-tighter uppercase mb-4">Questions?</h2>
                      <p className="text-bg/50 uppercase tracking-widest font-bold text-sm">Ask our AI watchdog about any detail in the budget</p>
                    </div>
                    <ChatInterface onAsk={handleAskQuestion} disabled={!file} />
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-24 px-10 py-12 border-t border-ink/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">
          © 2026 COUNTY WATCHDOG PROJECT • OPEN DATA INITIATIVE
        </div>
        <div className="flex items-center gap-8 opacity-40">
          <a href="#" className="hover:opacity-100 transition-opacity"><Github size={18} /></a>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Privacy</span>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Terms</span>
        </div>
      </footer>
    </div>
  );
}

