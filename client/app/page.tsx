"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle, Rocket, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl space-y-10 relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-zinc-900 glass rounded-[2rem] p-4 shadow-2xl flex items-center justify-center border-none relative overflow-hidden group"
            >
              <Image 
                src="/logo.png" 
                alt="AI Validator Logo" 
                width={120} 
                height={120}
                className="object-contain rounded-2xl transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </div>

          <div className="inline-flex py-1.5 px-4 rounded-full bg-slate-900/5 dark:bg-white/5 text-slate-900 dark:text-slate-100 text-xs font-bold items-center gap-2 border border-slate-200/50 dark:border-white/10 backdrop-blur-sm tracking-widest uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Next-Gen Startup Intelligence
          </div>
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white">
            Validate Before <br /> You <span className="text-gradient">Build.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
            AI-powered market analysis, competitor discovery, and profitability scoring in seconds. Build with confidence, not luck.
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col justify-center gap-4 sm:flex-row pt-4"
        >
          <Link href="/submit">
            <Button size="lg" className="w-full sm:w-auto text-lg h-16 px-10 gap-2 group bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 font-bold btn-glow">
              Start Validating
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-16 px-10 rounded-2xl bg-white/50 dark:bg-zinc-900/50 glass border-slate-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 transition-all font-bold">
              View Catalog
            </Button>
          </Link>
        </motion.div>

        <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { title: "Market Analysis", icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
            { title: "Competitor Discovery", icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-500/10" },
            { title: "Profitability Scoring", icon: Rocket, color: "text-indigo-500", bg: "bg-indigo-500/10" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex items-center gap-4 glass-card rounded-2xl p-5 group cursor-default"
            >
              <div className={`p-3 rounded-xl transition-all duration-300 ${feature.bg} ${feature.color} group-hover:scale-110`}>
                <feature.icon size={20} />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200 tracking-tight">{feature.title}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
