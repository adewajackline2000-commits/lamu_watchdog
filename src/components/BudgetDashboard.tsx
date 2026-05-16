import React from "react";
import { BudgetAnalysis } from "../types";
import { Building2, MapPin, Briefcase, Info } from "lucide-react";
import { motion } from "motion/react";

interface BudgetDashboardProps {
  data: BudgetAnalysis;
}

export default function BudgetDashboard({ data }: BudgetDashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="col-span-full bg-white border border-line rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="flex items-center gap-2 p-6 border-bottom border-line bg-zinc-50">
          <Info className="text-ink" size={20} />
          <h2 className="text-sm font-bold uppercase tracking-wider">Executive Summary</h2>
        </div>
        <div className="p-8 italic text-lg leading-relaxed text-ink/80">
          "{data.summary}"
        </div>
      </motion.div>

      {/* Departments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm flex flex-col"
      >
        <div className="flex items-center gap-2 p-4 border-bottom border-line bg-zinc-50">
          <Building2 className="text-ink" size={18} />
          <h3 className="text-xs font-bold uppercase tracking-wider">Departmental Allocations</h3>
        </div>
        <div className="flex-1">
          <div className="data-row grid-cols-[1fr_auto] col-header opacity-100! font-bold!">
            <span>Department</span>
            <span>Allocation</span>
          </div>
          {data.departments.map((dept, i) => (
            <div key={i} className="data-row grid-cols-[1fr_auto]">
              <div className="flex flex-col">
                <span className="font-semibold">{dept.name}</span>
                {dept.description && <span className="text-xs opacity-50">{dept.description}</span>}
              </div>
              <span className="data-value font-bold text-ink">{dept.allocation}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Key Projects Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm flex flex-col"
      >
        <div className="flex items-center gap-2 p-4 border-bottom border-line bg-zinc-50">
          <Briefcase className="text-ink" size={18} />
          <h3 className="text-xs font-bold uppercase tracking-wider">Major Projects</h3>
        </div>
        <div className="flex-1">
          {data.keyProjects.map((project, i) => (
            <div key={i} className="data-row flex flex-col gap-2 p-6">
              <div className="flex justify-between items-start gap-4">
                <span className="text-lg font-bold leading-tight">{project.title}</span>
                <span className="data-value bg-ink text-bg px-2 py-0.5 text-sm rounded">
                  {project.cost}
                </span>
              </div>
              <p className="text-sm opacity-70 leading-relaxed">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Ward Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="col-span-full bg-white border border-line rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="flex items-center gap-2 p-4 border-bottom border-line bg-zinc-50">
          <MapPin className="text-ink" size={18} />
          <h3 className="text-xs font-bold uppercase tracking-wider">Ward Projects & Focus Areas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-line">
          {data.wards.map((ward, i) => (
            <div key={i} className="p-6 border-r border-b border-line last:border-r-0">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-ink rounded-full"></span>
                {ward.name}
              </h4>
              <ul className="space-y-2">
                {ward.projects?.map((item, j) => (
                  <li key={j} className="text-sm border-l-2 border-line pl-3 py-1 opacity-80">
                    {item}
                  </li>
                ))}
                {(!ward.projects || ward.projects.length === 0) && (
                  <li className="text-xs opacity-40 italic">No specific projects identified</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
