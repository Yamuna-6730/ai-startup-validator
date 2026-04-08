"use client";

import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, Target, Users, Code, Activity, 
  ShieldAlert, DollarSign, Rocket, Briefcase, 
  ChevronRight, Sparkles, AlertCircle 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getIdeaById, Idea } from "@/lib/api";

export default function IdeaDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const data = await getIdeaById(resolvedParams.id);
        setIdea(data);
      } catch (error) {
        console.error("Failed to fetch idea:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIdea();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-pulse mt-24">
        <div className="h-10 w-32 bg-slate-100 dark:bg-zinc-800 rounded-xl" />
        <div className="space-y-4">
          <div className="h-6 w-24 bg-slate-100 dark:bg-zinc-800 rounded-md" />
          <div className="h-12 w-3/4 bg-slate-100 dark:bg-zinc-800 rounded-xl" />
          <div className="h-20 w-full bg-slate-100 dark:bg-zinc-800 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-slate-100 dark:bg-zinc-800 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!idea || !idea.ai_report) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-6 mt-24">
        <div className="inline-flex p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analysis Data Missing</h1>
          <p className="text-slate-500 dark:text-slate-400">We couldn't retrieve the AI report for this idea.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="rounded-xl px-8 h-12">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const report = idea.ai_report;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 px-4">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-2 w-fit bg-white dark:bg-zinc-900 glass px-4 py-2 rounded-xl transition-all shadow-sm">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </motion.div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-sarvam text-white border-none px-4 py-1 font-bold text-xs uppercase tracking-widest shadow-lg">
            Validated Concept
          </Badge>
          <Badge variant="outline" className="text-xs px-4 py-1 rounded-full border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm font-bold">
            Analysis Reference: #{idea.id.slice(0, 8)}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {idea.title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
            {idea.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card h-full rounded-3xl overflow-hidden border-none relative group">
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl transition-transform group-hover:scale-110">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">The Problem</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{report.problem}</p>
            </div>
            <div className="absolute bottom-0 right-0 p-6 opacity-5 rotate-12 group-hover:opacity-10 transition-opacity">
              <Target size={120} />
            </div>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card h-full rounded-3xl overflow-hidden border-none relative group">
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-2xl transition-transform group-hover:scale-110">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Target Audience</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{report.customer}</p>
            </div>
            <div className="absolute bottom-0 right-0 p-6 opacity-5 -rotate-12 group-hover:opacity-10 transition-opacity">
              <Users size={120} />
            </div>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true }}
          transition={{ delay: 0.3 }} 
          className="md:col-span-2"
        >
          <Card className="bg-slate-900 dark:bg-zinc-900/80 rounded-3xl border-none text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
              <div className="space-y-6 w-full md:w-1/2">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-xl">
                    <ShieldAlert className="text-blue-400" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">AI Verdict: Risk Level</h3>
                    <p className={`text-3xl font-black uppercase tracking-tight ${report.risk_level.toLowerCase() === 'low' ? 'text-green-400' : 'text-orange-400'}`}>
                      {report.risk_level} Risk
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <DollarSign size={14} className="text-green-400" /> Potential Profitability
                    </span>
                    <span className="text-4xl font-black tracking-tighter">{report.profitability_score}<span className="text-xl text-slate-500 font-bold">/100</span></span>
                  </div>
                  <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${report.profitability_score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-green-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/3 bg-white/5 rounded-3xl p-6 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                  <Sparkles size={16} className="text-blue-400" />
                  <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">AI Justification</h4>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic font-medium">
                  "{report.justification}"
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card rounded-3xl overflow-hidden border-none h-full relative group">
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl transition-transform group-hover:scale-110">
                  <Activity size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Market Analysis</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{report.market}</p>
              
              <div className="space-y-4 pt-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-zinc-800 pb-2">Top Competitors</h4>
                <div className="space-y-3">
                  {report.competitor.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-slate-100/50 dark:border-white/5 hover:bg-white transition-colors duration-300">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-indigo-500/20">
                        {i + 1}
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card rounded-3xl overflow-hidden border-none h-full group">
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl transition-transform group-hover:scale-110">
                  <Code size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tech Blueprint</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {report.tech_stack.map((t, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-4 bg-white/40 dark:bg-white/5 rounded-2xl border border-slate-100/50 dark:border-white/5 shadow-sm group/item"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg group-hover/item:rotate-12 transition-transform">
                        <Rocket size={14} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{t}</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover/item:text-orange-500 transition-colors" />
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-sarvam rounded-3xl text-white shadow-2xl relative overflow-hidden group/cta">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/cta:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Briefcase size={20} />
                  </div>
                  <h4 className="font-bold tracking-tight">Execution Strategy</h4>
                </div>
                <p className="text-xs text-white/90 leading-relaxed font-medium relative z-10">
                  Optimized for speed-to-market and seamless pivoting. This blueprint ensures technical excellence.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
