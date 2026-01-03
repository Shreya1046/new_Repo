"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { locations } from "@/lib/sample-data";
import { classifyGrievance } from "@/lib/classification";
import { ClassificationResult, Grievance } from "@/lib/types";
import { Upload, Send, Sparkles, AlertTriangle, CheckCircle2, Clock, Loader2, Languages, Building2, FileText, Tag, MapPin, ImageIcon } from "lucide-react";

interface GrievanceFormProps {
  onSubmit: (grievance: Grievance) => void;
}

const priorityConfig = {
  Critical: { color: "bg-red-500", textColor: "text-white", icon: AlertTriangle },
  High: { color: "bg-orange-500", textColor: "text-white", icon: Clock },
  Medium: { color: "bg-yellow-500", textColor: "text-black", icon: Clock },
  Low: { color: "bg-green-500", textColor: "text-white", icon: CheckCircle2 },
};

const categoryIcons: Record<string, string> = {
  roads: "🛣️",
  water: "💧",
  sanitation: "🧹",
  safety: "🚨",
  healthcare: "🏥",
  education: "📚",
  administrative: "📋",
};

export function GrievanceForm({ onSubmit }: GrievanceFormProps) {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!description.trim() || !location) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = classifyGrievance(description, location);
      setClassification(result);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSubmit = () => {
    if (!classification) return;
    const newGrievance: Grievance = {
      id: `GRV-${Date.now().toString().slice(-6)}`,
      originalText: description,
      translatedText: classification.translatedText,
      detectedLanguage: classification.detectedLanguage,
      location,
      photoUrl: photoPreview || undefined,
      category: classification.category,
      categoryReasoning: classification.categoryReasoning,
      priority: classification.priority,
      priorityReasoning: classification.priorityReasoning,
      department: classification.department,
      routingReasoning: classification.routingReasoning,
      associatedSchemes: classification.associatedSchemes,
      status: classification.priority === "Critical" ? "Escalated" : "Pending",
      submittedAt: new Date(),
      submittedBy: `Citizen-${Math.floor(Math.random() * 10000)}`,
    };
    onSubmit(newGrievance);
    setIsSubmitted(true);
    setTimeout(() => {
      setDescription("");
      setLocation("");
      setPhotoPreview(null);
      setClassification(null);
      setIsSubmitted(false);
    }, 3000);
  };

  const resetForm = () => {
    setDescription("");
    setLocation("");
    setPhotoPreview(null);
    setClassification(null);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <Card className="border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-25" />
            <CheckCircle2 className="relative h-20 w-20 text-emerald-500" />
          </div>
          <h3 className="mt-6 text-2xl font-bold text-emerald-700 dark:text-emerald-400">Grievance Submitted Successfully!</h3>
          <p className="mt-2 text-center text-muted-foreground">Your complaint has been automatically classified and routed to {classification?.department}</p>
          <Button onClick={resetForm} className="mt-6" variant="outline">
            Submit Another Grievance
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report a Grievance
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Simply describe your problem. Our AI will handle categorization and routing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              Describe Your Problem (Any Language)
            </Label>
            <Textarea
              id="description"
              placeholder="Type your grievance in any language... e.g., 'There is a large pothole on the main road causing accidents' or 'सड़क में बड़ा गड्ढा है'"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setClassification(null);
              }}
              className="min-h-[140px] resize-none text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Select Location
            </Label>
            <Select value={location} onValueChange={(val) => { setLocation(val); setClassification(null); }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your area" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              Photo Evidence (Optional)
            </Label>
            <div className="flex items-center gap-4">
              <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-indigo-500 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/30">
                <Upload className="h-8 w-8 text-slate-400" />
                <span className="mt-1 text-xs text-slate-500">Upload</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
              {photoPreview && (
                <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoPreview} alt="Uploaded evidence preview" className="h-full w-full object-cover" />
                  <button onClick={() => setPhotoPreview(null)} className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleAnalyze} disabled={!description.trim() || !location || isAnalyzing} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze & Classify
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className={`border-2 transition-all duration-500 ${classification ? "border-indigo-500/50 shadow-lg shadow-indigo-500/10" : "border-dashed border-slate-300 dark:border-slate-700"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            AI Classification Results
          </CardTitle>
          <CardDescription>
            {classification ? "Analysis complete. Review the results below." : "Fill the form and click analyze to see AI classification."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!classification ? (
            <div className="flex h-[300px] flex-col items-center justify-center text-center">
              <div className="rounded-full bg-slate-100 p-6 dark:bg-slate-800">
                <Sparkles className="h-12 w-12 text-slate-400" />
              </div>
              <p className="mt-4 text-muted-foreground">AI analysis results will appear here</p>
            </div>
          ) : (
            <div className="space-y-5">
              {classification.detectedLanguage !== "English" && (
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                    <Languages className="h-4 w-4" />
                    Language Detected: {classification.detectedLanguage}
                  </div>
                  <p className="mt-2 text-sm text-blue-600 dark:text-blue-300">
                    <span className="font-medium">Translation:</span> {classification.translatedText}
                  </p>
                </div>
              )}

              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/50">
                    <Tag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Category</span>
                      <Badge variant="outline" className="capitalize">
                        {categoryIcons[classification.category]} {classification.category}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{classification.categoryReasoning}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 ${priorityConfig[classification.priority].color}`}>
                    {(() => {
                      const Icon = priorityConfig[classification.priority].icon;
                      return <Icon className={`h-5 w-5 ${priorityConfig[classification.priority].textColor}`} />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Priority</span>
                      <Badge className={`${priorityConfig[classification.priority].color} ${priorityConfig[classification.priority].textColor}`}>
                        {classification.priority}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{classification.priorityReasoning}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/50">
                    <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Routed To</span>
                      <Badge variant="secondary">{classification.department}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{classification.routingReasoning}</p>
                  </div>
                </div>

                {classification.associatedSchemes.length > 0 && (
                  <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Relevant Government Schemes:</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {classification.associatedSchemes.map((scheme) => (
                        <Badge key={scheme} variant="outline" className="text-xs border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400">
                          {scheme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                <Send className="mr-2 h-4 w-4" />
                Submit Grievance
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
