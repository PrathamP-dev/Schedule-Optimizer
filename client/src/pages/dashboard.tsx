import { useProjects } from "@/hooks/use-projects";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Briefcase, CalendarCheck, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: projects, isLoading } = useProjects();

  const totalProjects = projects?.length || 0;
  const scheduledProjects = projects?.filter(p => p.scheduledDay !== null).length || 0;
  const totalRevenue = projects?.reduce((acc, curr) => acc + curr.revenue, 0) || 0;
  
  // Potential revenue if optimal schedule is generated (just a sum of top 5 highest revenue for simplicity of display here, though backend logic is smarter)
  // Actually, let's just show scheduled revenue vs total potential
  const scheduledRevenue = projects
    ?.filter(p => p.scheduledDay !== null)
    .reduce((acc, curr) => acc + curr.revenue, 0) || 0;

  const stats = [
    { 
      label: "Total Projects", 
      value: totalProjects, 
      icon: Briefcase, 
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      label: "Scheduled", 
      value: scheduledProjects, 
      icon: CalendarCheck, 
      color: "text-green-600",
      bg: "bg-green-50"
    },
    { 
      label: "Total Pipeline Value", 
      value: `₹${totalRevenue.toLocaleString('en-IN')}`, 
      icon: BarChart3, 
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    { 
      label: "Scheduled Revenue", 
      value: `₹${scheduledRevenue.toLocaleString('en-IN')}`, 
      icon: TrendingUp, 
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 animate-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Executive Dashboard</h1>
          <p className="text-slate-500">Welcome back. Here's an overview of your project portfolio.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-slate-900">{isLoading ? "..." : stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Hero Section / Call to Action */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-lg overflow-hidden relative bg-gradient-to-br from-slate-900 to-slate-800 text-white">
             {/* Abstract decorative circles */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            
            <CardHeader className="relative z-10 pb-0">
              <CardTitle className="text-white text-2xl">Project Management</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-4 space-y-6">
              <p className="text-slate-300 max-w-md">
                Add new potential projects to the pipeline. Define deadlines and expected revenue to optimize your workflow.
              </p>
              <Link href="/projects">
                <Button className="bg-white text-slate-900 hover:bg-blue-50 border-none">
                  Manage Projects <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg overflow-hidden relative bg-white">
            <CardHeader>
              <CardTitle className="text-slate-900 text-2xl">Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-500 max-w-md">
                Generate the optimal schedule for the upcoming week based on deadlines and revenue maximization.
              </p>
              <Link href="/schedule">
                <Button variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-900">
                  View Schedule <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
