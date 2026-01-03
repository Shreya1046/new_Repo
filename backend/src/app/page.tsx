"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GrievanceForm } from "@/components/GrievanceForm";
import { Dashboard } from "@/components/Dashboard";
import { OversightPanel } from "@/components/OversightPanel";
import { sampleGrievances } from "@/lib/sample-data";
import { Grievance } from "@/lib/types";
import { FileText, BarChart3, Eye, Sparkles, Shield } from "lucide-react";

export default function HomePage() {
  const [grievances, setGrievances] = useState<Grievance[]>(sampleGrievances);
  const [activeTab, setActiveTab] = useState("submit");

  const handleSubmit = (newGrievance: Grievance) => {
    setGrievances((prev) => [newGrievance, ...prev]);
  };

  const handleUpdateStatus = (id: string, status: Grievance["status"]) => {
    setGrievances((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status } : g))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-950 dark:via-indigo-950/20 dark:to-purple-950/20">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      
      <header className="relative border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  GrievanceAI
                </h1>
                <p className="text-xs text-muted-foreground">Intelligent Citizen Complaint System</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-indigo-100/80 px-3 py-1.5 dark:bg-indigo-900/30">
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">AI-Powered Classification</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container relative mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Citizen Grievance Management
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Report your concerns in any language. Our AI automatically understands, prioritizes, and routes your grievance to the correct department.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 h-12">
            <TabsTrigger value="submit" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Submit</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="oversight" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Oversight</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="mt-6">
            <GrievanceForm onSubmit={handleSubmit} />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-6">
            <Dashboard grievances={grievances} />
          </TabsContent>

          <TabsContent value="oversight" className="mt-6">
            <OversightPanel grievances={grievances} onUpdateStatus={handleUpdateStatus} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="relative border-t bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Demo System - Intelligent Grievance Management Platform
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                System Active
              </span>
              <span>{grievances.length} Grievances Tracked</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
