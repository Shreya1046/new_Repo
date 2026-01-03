"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Grievance, Category, Priority, Department } from "@/lib/types";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AlertTriangle, CheckCircle2, Clock, TrendingUp, Users, FileText, Building2, ShieldAlert } from "lucide-react";

interface DashboardProps {
  grievances: Grievance[];
}

const priorityColors = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#22c55e",
};

const categoryColors = {
  roads: "#6366f1",
  water: "#3b82f6",
  sanitation: "#10b981",
  safety: "#ef4444",
  healthcare: "#ec4899",
  education: "#8b5cf6",
  administrative: "#f59e0b",
};

const departmentColors = [
  "#6366f1", "#3b82f6", "#10b981", "#ef4444", "#ec4899", "#8b5cf6", "#f59e0b"
];

export function Dashboard({ grievances }: DashboardProps) {
  const stats = useMemo(() => {
    const priorityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    const categoryCounts: Record<Category, number> = {
      roads: 0, water: 0, sanitation: 0, safety: 0, healthcare: 0, education: 0, administrative: 0
    };
    const departmentCounts: Record<Department, number> = {
      "Public Works": 0, "Water Resources": 0, "Sanitation & Waste": 0, "Police": 0, "Health Department": 0, "Education Board": 0, "Municipal Office": 0
    };
    const statusCounts = { Pending: 0, "In Progress": 0, Resolved: 0, Escalated: 0 };

    grievances.forEach((g) => {
      priorityCounts[g.priority]++;
      categoryCounts[g.category]++;
      departmentCounts[g.department]++;
      statusCounts[g.status]++;
    });

    return { priorityCounts, categoryCounts, departmentCounts, statusCounts };
  }, [grievances]);

  const priorityData = Object.entries(stats.priorityCounts).map(([name, value]) => ({
    name,
    value,
    fill: priorityColors[name as Priority]
  }));

  const categoryData = Object.entries(stats.categoryCounts)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      fill: categoryColors[name as Category]
    }))
    .filter(d => d.value > 0);

  const departmentData = Object.entries(stats.departmentCounts)
    .map(([name, value], idx) => ({
      name: name.length > 12 ? name.substring(0, 12) + "..." : name,
      fullName: name,
      value,
      fill: departmentColors[idx % departmentColors.length]
    }))
    .filter(d => d.value > 0);

  const totalGrievances = grievances.length;
  const criticalCount = stats.priorityCounts.Critical;
  const pendingCount = stats.statusCounts.Pending;
  const resolvedCount = stats.statusCounts.Resolved;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Grievances</p>
                <p className="text-3xl font-bold">{totalGrievances}</p>
              </div>
              <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
                <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Issues</p>
                <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
              </div>
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/50">
                <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/50">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-3xl font-bold text-emerald-600">{resolvedCount}</p>
              </div>
              <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/50">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Grievances by Priority
            </CardTitle>
            <CardDescription>Distribution of grievances by urgency level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              Grievances by Category
            </CardTitle>
            <CardDescription>Types of issues reported by citizens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-500" />
              Grievances by Department
            </CardTitle>
            <CardDescription>Workload distribution across government departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name, props) => [value, props.payload.fullName]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            Quick Status Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(stats.statusCounts).map(([status, count]) => (
              <div
                key={status}
                className={`rounded-lg p-4 ${
                  status === "Pending" ? "bg-amber-50 dark:bg-amber-950/30" :
                  status === "In Progress" ? "bg-blue-50 dark:bg-blue-950/30" :
                  status === "Resolved" ? "bg-emerald-50 dark:bg-emerald-950/30" :
                  "bg-red-50 dark:bg-red-950/30"
                }`}
              >
                <p className="text-sm font-medium text-muted-foreground">{status}</p>
                <p className={`text-2xl font-bold ${
                  status === "Pending" ? "text-amber-600" :
                  status === "In Progress" ? "text-blue-600" :
                  status === "Resolved" ? "text-emerald-600" :
                  "text-red-600"
                }`}>{count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
