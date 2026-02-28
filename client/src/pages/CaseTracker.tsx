import { useState } from "react";
import { useCases, useCreateCase, useUpdateCase } from "@/hooks/use-cases";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MapPin, AlertTriangle, Clock, MoreVertical, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRescueCaseSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { format } from "date-fns";
import { z } from "zod";

export default function CaseTracker() {
  const { data: cases, isLoading } = useCases();
  const { mutate: createCase, isPending: isCreating } = useCreateCase();
  const { mutate: updateCase } = useUpdateCase();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof insertRescueCaseSchema>>({
    resolver: zodResolver(insertRescueCaseSchema),
    defaultValues: { title: "", description: "", location: "", imageUrl: "", status: "reported" },
  });

  const onSubmit = (data: z.infer<typeof insertRescueCaseSchema>) => {
    createCase(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  const handleStatusChange = (id: number, status: string) => {
    updateCase({ id, status });
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-red-50 p-6 rounded-2xl border border-red-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-red-900">Emergency Case Tracker</h1>
            <p className="text-red-700 mt-1 max-w-xl">Live board of ongoing animal rescue operations. Please report life-threatening situations immediately.</p>
          </div>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/20 h-12 px-6">
              Report Emergency
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Report Case
              </DialogTitle>
              <DialogDescription>Provide accurate details to help rescue teams respond faster.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Situation Title</FormLabel><FormControl><Input placeholder="e.g. Injured stray dog on highway" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem><FormLabel>Exact Location</FormLabel><FormControl><Input placeholder="Street name, landmarks..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Image URL (Optional)</FormLabel><FormControl><Input placeholder="https://..." {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Detailed Description</FormLabel><FormControl><Textarea className="resize-none" rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full h-11 mt-2 bg-red-600 hover:bg-red-700" disabled={isCreating}>
                  {isCreating ? "Submitting..." : "Submit Emergency Report"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-72 bg-card rounded-2xl animate-pulse border"></div>)}
        </div>
      ) : cases?.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl">
          <AlertTriangle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No active cases</h3>
          <p className="text-muted-foreground">There are currently no reported emergencies.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases?.map((rescue) => (
            <Card key={rescue.id} className="overflow-hidden rounded-2xl hover-elevate border-border/60 flex flex-col">
              {rescue.imageUrl ? (
                <div className="h-48 w-full bg-muted overflow-hidden relative group">
                  <img src={rescue.imageUrl} alt={rescue.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={rescue.status} />
                  </div>
                </div>
              ) : (
                <div className="h-48 w-full bg-muted/50 flex flex-col items-center justify-center text-muted-foreground border-b relative">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
                  <span className="text-sm opacity-50">No Image Provided</span>
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={rescue.status} />
                  </div>
                </div>
              )}
              
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-foreground line-clamp-2 pr-2">{rescue.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8 -mr-2 text-muted-foreground shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusChange(rescue.id, 'reported')}>Mark as Reported</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(rescue.id, 'in-progress')}>Mark In Progress</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(rescue.id, 'resolved')}>Mark Resolved</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-3">
                  {rescue.description}
                </p>
                
                <div className="pt-4 border-t border-border/50 space-y-2 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate">{rescue.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span>{rescue.reportedAt ? format(new Date(rescue.reportedAt), 'MMM d, h:mm a') : 'Unknown'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
