"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Loader2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { createIdea } from "@/lib/api";
import FileUpload from "@/components/file-upload";

export default function SubmitIdea() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Analyzing your idea...");
  const router = useRouter();

  // Fake progress animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          // Change message based on progress
          if (prev > 70) setStatusMessage("Generating market insights...");
          else if (prev > 40) setStatusMessage("Extracting key details...");
          else if (prev > 10) setStatusMessage("Processing data with AI...");
          
          return prev + Math.random() * 5;
        });
      }, 500);
    } else {
      setProgress(0);
      setStatusMessage("Analyzing your idea...");
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (file) {
        formData.append("file", file);
      }

      const result = await createIdea(formData);
      setProgress(100);
      setStatusMessage("Success! Redirecting...");
      
      setTimeout(() => {
        router.push(`/ideas/${result.id}`);
      }, 1000);
    } catch (error) {
      console.error("Submission failed:", error);
      setIsLoading(false);
      alert("Something went wrong. Please check if your backend is running.");
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl"
      >
        <Card className="glass-card overflow-hidden rounded-3xl border-none shadow-2xl relative">
          {isLoading && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-orange-400 to-blue-600 z-10 transition-all duration-300"
            />
          )}

          <CardContent className="p-0 flex flex-col md:flex-row">
            {/* Sidebar info */}
            <div className="md:w-1/3 bg-slate-900/5 dark:bg-zinc-900/50 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200/50 dark:border-zinc-800/50">
              <div className="space-y-6">
                <div className="bg-sarvam w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg floating">
                  <Rocket size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Validate Your Idea</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Our AI evaluates your concept against millions of data points to give you a clear roadmap to success.
                  </p>
                </div>
                
                <ul className="space-y-4 pt-4">
                  {[
                    { icon: Sparkles, text: "Instant AI Report" },
                    { icon: ShieldCheck, text: "Competitor Analysis" },
                    { icon: ShieldCheck, text: "Risk Evaluation" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <div className="p-1 px-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-md text-blue-600 dark:text-blue-400">
                        <item.icon size={14} />
                      </div>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-zinc-800 hidden md:block">
                <p className="text-xs text-slate-500 font-medium tracking-wider uppercase mb-2">Trusted by builders</p>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-[10px] font-bold">
                    +120
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="md:w-2/3 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                    What's your project name?
                  </label>
                  <Input
                    placeholder="e.g. HealthAI"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading}
                    className="h-12 bg-white/50 dark:bg-zinc-900/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 border-slate-200 dark:border-zinc-800 transition-all font-medium"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                    Describe your vision
                  </label>
                  <Textarea
                    placeholder="Describe the problem, solution, and your unique approach..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                    className="bg-white/50 dark:bg-zinc-900/50 rounded-xl resize-none h-40 focus:ring-2 focus:ring-blue-500/20 border-slate-200 dark:border-zinc-800 transition-all font-medium"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 block">
                    Upload documents <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                  </label>
                  <FileUpload 
                    onFileSelect={setFile} 
                    disabled={isLoading}
                  />
                </div>

                <div className="pt-4">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full flex flex-col items-center gap-4"
                      >
                        <div className="flex items-center gap-3 py-3 px-6 bg-slate-100 dark:bg-zinc-800 rounded-2xl w-full justify-center">
                          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{statusMessage}</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="submit-btn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Button 
                          type="submit" 
                          className="w-full h-14 text-lg font-bold shadow-xl hover:shadow-2xl transition-all bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl gap-2 group hover:scale-[1.01] btn-glow"
                        >
                          Validate Idea Now
                          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <p className="text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                  We respect your privacy. Your data is processed securely via encrypted AI channels.
                </p>
              </form>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
