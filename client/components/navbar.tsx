"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/submit", label: "Validate Idea", icon: PlusCircle },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 inset-x-0 z-50 p-4"
    >
      <nav className="max-w-6xl mx-auto glass rounded-2xl p-2 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="relative h-10 w-10 flex items-center justify-center bg-white/50 dark:bg-zinc-800/50 rounded-xl overflow-hidden shadow-sm floating"
          >
            <Image 
              src="/logo.png" 
              alt="AI Validator Logo" 
              width={40} 
              height={40}
              className="object-contain rounded-lg drop-shadow-md"
            />
          </motion.div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white bg-clip-text text-transparent">
            AI Validator
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "bg-slate-900/5 dark:bg-white/10 text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <link.icon size={16} />
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center">
          <Link href="/submit">
            <Button className="rounded-xl px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 btn-glow transition-all duration-300">
              Try Now
            </Button>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
