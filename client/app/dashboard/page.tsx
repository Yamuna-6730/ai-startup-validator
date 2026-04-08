"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, ArrowRight, LayoutGrid, List as ListIcon, Search, Calendar, ChevronRight, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getIdeas, Idea } from "@/lib/api";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const data = await getIdeas();
        setIdeas(data);
      } catch (error) {
        console.error("Failed to fetch ideas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  const filteredIdeas = ideas.filter(idea => 
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Badge className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-none px-3 py-1 font-bold text-[10px] tracking-widest uppercase">
            Workspace
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Your Startup <span className="text-gradient">Catalog</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Manage and review your AI-validated concepts.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="Search ideas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 w-full md:w-64 bg-white/50 dark:bg-zinc-900/50 rounded-xl border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500/20 glass transition-all"
            />
          </div>
          <Link href="/submit">
            <Button className="h-12 px-6 gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:scale-105 btn-glow transition-all font-bold">
              <Plus size={18} />
              <span className="hidden sm:inline">New Idea</span>
            </Button>
          </Link>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-100 dark:bg-zinc-900/50 shimmer animate-pulse" />
            ))}
          </motion.div>
        ) : filteredIdeas.length > 0 ? (
          <motion.div 
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredIdeas.map((idea) => (
              <motion.div key={idea.id} variants={itemVariants}>
                <Link href={`/ideas/${idea.id}`} className="block h-full">
                  <div className="h-full glass-card hover:bg-white/80 dark:hover:bg-zinc-800/80 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl flex flex-col cursor-pointer group relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Rocket size={80} className="-rotate-12" />
                    </div>

                    <div className="flex justify-between items-start mb-5 relative z-10">
                      <Badge 
                        className={`
                          px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-none
                          ${(idea.ai_report?.profitability_score || 0) > 70 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                            : (idea.ai_report?.profitability_score || 0) > 50 
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" 
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }
                        `}
                      >
                        Score: {idea.ai_report?.profitability_score || "??"}/100
                      </Badge>
                      <div className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-xl opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <ChevronRight size={16} className="text-slate-600 dark:text-slate-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 relative z-10 flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{idea.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                        {idea.description}
                      </p>
                    </div>
                    
                    <div className="mt-8 pt-5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
                        <Calendar size={12} />
                        {new Date(idea.created_at).toLocaleDateString()}
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-widest ${
                        idea.ai_report?.risk_level?.toLowerCase() === 'low' 
                        ? 'text-blue-500' : 'text-orange-500'
                      }`}>
                        {idea.ai_report?.risk_level || "Analyzing"}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-4 glass-card rounded-3xl"
          >
            <div className="p-6 bg-slate-100 dark:bg-zinc-800 rounded-full text-slate-400">
              <Plus size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-gradient">No Ideas Found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Start your journey by validating your first startup concept.
              </p>
            </div>
            <Link href="/submit">
              <Button className="mt-4 bg-sarvam text-white border-none rounded-xl h-12 px-8 font-bold hover:scale-105 transition-all">
                Validate Your First Idea
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
