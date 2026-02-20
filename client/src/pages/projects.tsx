import { useState } from "react";
import { useProjects, useCreateProject, useDeleteProject } from "@/hooks/use-projects";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Search, IndianRupee } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type InsertProject } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProjects = projects?.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Project Pipeline</h1>
            <p className="text-slate-500 mt-1">Manage incoming projects and requirements.</p>
          </div>
          
          <CreateProjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </div>

        <Card className="border-none shadow-md overflow-hidden bg-white">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none bg-transparent shadow-none focus-visible:ring-0 max-w-sm px-0 placeholder:text-slate-400"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[100px] font-semibold text-slate-700">ID</TableHead>
                  <TableHead className="font-semibold text-slate-700">Project Title</TableHead>
                  <TableHead className="font-semibold text-slate-700">Deadline (Days)</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Revenue (₹)</TableHead>
                  <TableHead className="w-[100px] text-right font-semibold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                      Loading projects...
                    </TableCell>
                  </TableRow>
                ) : filteredProjects?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-16 text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <BriefcaseIcon className="w-12 h-12 text-slate-200" />
                        <p>No projects found. Create one to get started.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects?.map((project) => (
                    <TableRow key={project.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-mono text-slate-500">#{project.id}</TableCell>
                      <TableCell className="font-medium text-slate-900">{project.title}</TableCell>
                      <TableCell>
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${project.deadlineDays <= 2 ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}
                        `}>
                          {project.deadlineDays} Days
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-900">
                        ₹{project.revenue.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this project?')) {
                              deleteProject.mutate(project.id);
                            }
                          }}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

function CreateProjectDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const createProject = useCreateProject();
  
  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      deadlineDays: 1,
      revenue: 0,
    },
  });

  const onSubmit = (data: InsertProject) => {
    createProject.mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 text-white rounded-xl px-6">
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Project</DialogTitle>
          <DialogDescription>
            Enter project details to add it to the pipeline.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label>Project Title</Label>
                  <FormControl>
                    <Input placeholder="e.g. Website Redesign" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deadlineDays"
                render={({ field }) => (
                  <FormItem>
                    <Label>Deadline (Days)</Label>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        max={5} 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="revenue"
                render={({ field }) => (
                  <FormItem>
                    <Label>Revenue (₹)</Label>
                    <FormControl>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input 
                          type="number" 
                          min={0} 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                          className="pl-9 rounded-xl"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                disabled={createProject.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-6"
              >
                {createProject.isPending ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
