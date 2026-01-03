"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Grievance, UserRole, Priority, Category, Department } from "@/lib/types";
import { AlertTriangle, CheckCircle2, Clock, Search, Eye, Building2, MapPin, Calendar, User, Sparkles, Filter, Languages, Tag, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface OversightPanelProps {
  grievances: Grievance[];
  onUpdateStatus: (id: string, status: Grievance["status"]) => void;
}

const priorityConfig = {
  Critical: { color: "bg-red-500", textColor: "text-white", icon: AlertTriangle, ringColor: "ring-red-500" },
  High: { color: "bg-orange-500", textColor: "text-white", icon: Clock, ringColor: "ring-orange-500" },
  Medium: { color: "bg-yellow-500", textColor: "text-black", icon: Clock, ringColor: "ring-yellow-500" },
  Low: { color: "bg-green-500", textColor: "text-white", icon: CheckCircle2, ringColor: "ring-green-500" },
};

const statusConfig = {
  Pending: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300" },
  "In Progress": { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" },
  Resolved: { color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300" },
  Escalated: { color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300" },
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

function GrievanceDetailModal({ grievance, onUpdateStatus }: { grievance: Grievance; onUpdateStatus: (id: string, status: Grievance["status"]) => void }) {
  const config = priorityConfig[grievance.priority];

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <span className="font-mono text-muted-foreground">{grievance.id}</span>
          <Badge className={`${config.color} ${config.textColor}`}>{grievance.priority}</Badge>
          <Badge className={statusConfig[grievance.status].color}>{grievance.status}</Badge>
        </DialogTitle>
        <DialogDescription>Submitted on {format(grievance.submittedAt, "PPp")}</DialogDescription>
      </DialogHeader>

      <div className="space-y-6 pt-4">
        <div className="rounded-lg border p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Original Complaint</h4>
          <p className="text-base">{grievance.originalText}</p>
          {grievance.detectedLanguage !== "English" && (
            <div className="mt-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/30">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                <Languages className="h-4 w-4" />
                Detected: {grievance.detectedLanguage}
              </div>
              <p className="mt-1 text-sm text-blue-600 dark:text-blue-300">{grievance.translatedText}</p>
            </div>
          )}
        </div>

        {grievance.photoUrl && (
          <div className="rounded-lg border p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Photo Evidence</h4>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={grievance.photoUrl} alt="Grievance evidence photo" className="rounded-lg max-h-48 object-cover" />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg border p-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm text-muted-foreground">{grievance.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border p-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Submitted By</p>
              <p className="text-sm text-muted-foreground">{grievance.submittedBy}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-950/30">
          <h4 className="flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-400 mb-3">
            <Sparkles className="h-4 w-4" />
            AI Classification Analysis
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <div className="flex items-center gap-2">
                <span className="text-lg">{categoryIcons[grievance.category]}</span>
                <span className="capitalize font-medium">{grievance.category}</span>
              </div>
              <p className="text-sm text-indigo-600 dark:text-indigo-300 mt-1">{grievance.categoryReasoning}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Priority Reasoning</p>
              <p className="text-sm text-indigo-600 dark:text-indigo-300">{grievance.priorityReasoning}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/30">
          <h4 className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-3">
            <Building2 className="h-4 w-4" />
            Routing Decision
          </h4>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{grievance.department}</Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <Badge className={statusConfig[grievance.status].color}>{grievance.status}</Badge>
          </div>
          <p className="text-sm text-emerald-600 dark:text-emerald-300">{grievance.routingReasoning}</p>
          {grievance.associatedSchemes.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1">Relevant Schemes</p>
              <div className="flex flex-wrap gap-1">
                {grievance.associatedSchemes.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Update Status</h4>
          <div className="flex flex-wrap gap-2">
            {(["Pending", "In Progress", "Resolved", "Escalated"] as const).map((status) => (
              <Button
                key={status}
                variant={grievance.status === status ? "default" : "outline"}
                size="sm"
                onClick={() => onUpdateStatus(grievance.id, status)}
                className={grievance.status === status ? "" : ""}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export function OversightPanel({ grievances, onUpdateStatus }: OversightPanelProps) {
  const [role, setRole] = useState<UserRole>("Admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<Department | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Grievance["status"] | "all">("all");

  const filteredGrievances = useMemo(() => {
    return grievances.filter((g) => {
      if (role === "Department" && departmentFilter !== "all" && g.department !== departmentFilter) return false;
      if (priorityFilter !== "all" && g.priority !== priorityFilter) return false;
      if (categoryFilter !== "all" && g.category !== categoryFilter) return false;
      if (statusFilter !== "all" && g.status !== statusFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return g.id.toLowerCase().includes(query) ||
          g.originalText.toLowerCase().includes(query) ||
          g.translatedText.toLowerCase().includes(query) ||
          g.location.toLowerCase().includes(query);
      }
      return true;
    });
  }, [grievances, role, priorityFilter, categoryFilter, departmentFilter, statusFilter, searchQuery]);

  const sortedGrievances = useMemo(() => {
    const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return [...filteredGrievances].sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });
  }, [filteredGrievances]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Oversight & Review</CardTitle>
              <CardDescription>Review grievances, AI analysis, and routing decisions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View as:</span>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin View</SelectItem>
                  <SelectItem value="Government">Government View</SelectItem>
                  <SelectItem value="Department">Department View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as Priority | "all")}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as Category | "all")}>
                <SelectTrigger className="w-[140px]">
                  <Tag className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="roads">Roads</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="sanitation">Sanitation</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                </SelectContent>
              </Select>

              {role === "Department" && (
                <Select value={departmentFilter} onValueChange={(v) => setDepartmentFilter(v as Department | "all")}>
                  <SelectTrigger className="w-[160px]">
                    <Building2 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Public Works">Public Works</SelectItem>
                    <SelectItem value="Water Resources">Water Resources</SelectItem>
                    <SelectItem value="Sanitation & Waste">Sanitation & Waste</SelectItem>
                    <SelectItem value="Police">Police</SelectItem>
                    <SelectItem value="Health Department">Health Department</SelectItem>
                    <SelectItem value="Education Board">Education Board</SelectItem>
                    <SelectItem value="Municipal Office">Municipal Office</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as Grievance["status"] | "all")}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {sortedGrievances.length} of {grievances.length} grievances
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="h-[600px]">
        <div className="space-y-3 pr-4">
          {sortedGrievances.map((grievance) => {
            const config = priorityConfig[grievance.priority];
            const Icon = config.icon;
            return (
              <Card key={grievance.id} className={`border-l-4 transition-all hover:shadow-md ${
                grievance.priority === "Critical" ? "border-l-red-500" :
                grievance.priority === "High" ? "border-l-orange-500" :
                grievance.priority === "Medium" ? "border-l-yellow-500" :
                "border-l-green-500"
              }`}>
                <CardContent className="pt-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-medium">{grievance.id}</span>
                        <Badge className={`${config.color} ${config.textColor}`}>
                          <Icon className="h-3 w-3 mr-1" />
                          {grievance.priority}
                        </Badge>
                        <Badge className={statusConfig[grievance.status].color}>{grievance.status}</Badge>
                        <Badge variant="outline" className="capitalize">
                          {categoryIcons[grievance.category]} {grievance.category}
                        </Badge>
                      </div>
                      <p className="text-sm line-clamp-2">{grievance.translatedText}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {grievance.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {grievance.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(grievance.submittedAt, "PP")}
                        </span>
                        {grievance.detectedLanguage !== "English" && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <Languages className="h-3 w-3" />
                            {grievance.detectedLanguage}
                          </span>
                        )}
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <GrievanceDetailModal grievance={grievance} onUpdateStatus={onUpdateStatus} />
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {sortedGrievances.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No grievances match your filters</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
