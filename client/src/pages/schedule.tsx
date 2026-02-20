import { useProjects, useGenerateSchedule } from "@/hooks/use-projects";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Zap, Calendar, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

export default function Schedule() {
  const { data: projects, isLoading } = useProjects();
  const generateSchedule = useGenerateSchedule();

  // Filter scheduled projects and sort by day
  const scheduledProjects = projects
    ?.filter(p => p.scheduledDay !== null)
    .sort((a, b) => (a.scheduledDay || 0) - (b.scheduledDay || 0));

  const days = [
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
  ];

  const totalScheduledRevenue = scheduledProjects?.reduce((acc, curr) => acc + curr.revenue, 0) || 0;

  return (
    <Layout>
      <div className="space-y-8 animate-in pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Weekly Schedule</h1>
            <p className="text-slate-500 mt-1">
              Optimized project allocation for maximum revenue.
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 flex flex-col items-end">
                <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Projected Revenue</span>
                <span className="text-lg font-bold text-green-800">₹{totalScheduledRevenue.toLocaleString('en-IN')}</span>
             </div>

            <Button
              onClick={() => generateSchedule.mutate()}
              disabled={generateSchedule.isPending || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 rounded-xl px-6 py-6"
            >
              {generateSchedule.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Zap className="w-5 h-5 mr-2" />
              )}
              {generateSchedule.isPending ? "Optimizing..." : "Generate Schedule"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {days.map((day, index) => {
            const project = scheduledProjects?.find(p => p.scheduledDay === day.id);
            const isAssigned = !!project;

            return (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col h-full"
              >
                <div className="bg-slate-900 text-white py-3 px-4 rounded-t-xl font-medium flex justify-between items-center text-sm">
                  <span>{day.name}</span>
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                
                <Card className={`
                  flex-1 rounded-t-none rounded-b-xl border-t-0 shadow-md 
                  ${isAssigned ? 'bg-white' : 'bg-slate-50 border-dashed'}
                  transition-all duration-300 hover:shadow-lg
                `}>
                  <CardContent className="p-5 h-full flex flex-col justify-center min-h-[160px]">
                    {isAssigned ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-lg text-slate-900 leading-tight mb-2">
                            {project.title}
                          </h4>
                          <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                             ID: #{project.id}
                          </span>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100">
                           <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-500">Revenue</span>
                             <span className="font-bold text-green-600">₹{project.revenue.toLocaleString('en-IN')}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm mt-1">
                             <span className="text-slate-500">Deadline</span>
                             <span className="font-medium text-slate-700">{project.deadlineDays} Days</span>
                           </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400">
                        <p className="text-sm">No project assigned</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        
        {(!projects || projects.length === 0) && (
          <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
             <h3 className="text-lg font-medium text-slate-900">No Projects Available</h3>
             <p className="text-slate-500 max-w-md mx-auto mt-2">
               Add projects in the "Projects" tab to start generating schedules.
             </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
