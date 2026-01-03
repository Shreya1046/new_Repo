export type Priority = "Critical" | "High" | "Medium" | "Low";
export type Category = "roads" | "water" | "sanitation" | "safety" | "healthcare" | "education" | "administrative";
export type Department = "Public Works" | "Water Resources" | "Sanitation & Waste" | "Police" | "Health Department" | "Education Board" | "Municipal Office";
export type GrievanceStatus = "Pending" | "In Progress" | "Resolved" | "Escalated";
export type Language = "English" | "Hindi" | "Tamil" | "Bengali" | "Telugu" | "Marathi" | "Gujarati" | "Kannada";

export interface Grievance {
  id: string;
  originalText: string;
  translatedText: string;
  detectedLanguage: Language;
  location: string;
  photoUrl?: string;
  category: Category;
  categoryReasoning: string;
  priority: Priority;
  priorityReasoning: string;
  department: Department;
  routingReasoning: string;
  associatedSchemes: string[];
  status: GrievanceStatus;
  submittedAt: Date;
  submittedBy?: string;
}

export interface ClassificationResult {
  category: Category;
  categoryReasoning: string;
  priority: Priority;
  priorityReasoning: string;
  department: Department;
  routingReasoning: string;
  associatedSchemes: string[];
  detectedLanguage: Language;
  translatedText: string;
}

export type UserRole = "Citizen" | "Admin" | "Government" | "Department";
