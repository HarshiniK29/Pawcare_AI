import { useState } from "react";
import { useNgos, useCreateNgo } from "@/hooks/use-ngos";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Phone, Mail, Plus, Search, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNgoSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

export default function NgoLocator() {
  const { data: ngos, isLoading } = useNgos();
  const { mutate: createNgo, isPending } = useCreateNgo();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const form = useForm<z.infer<typeof insertNgoSchema>>({
    resolver: zodResolver(insertNgoSchema),
    defaultValues: { name: "", address: "", phone: "", email: "", description: "" },
  });

  const onSubmit = (data: z.infer<typeof insertNgoSchema>) => {
    createNgo(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  const filteredNgos = ngos?.filter(ngo => 
    ngo.name.toLowerCase().includes(search.toLowerCase()) || 
    ngo.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">NGO Locator</h1>
          <p className="text-muted-foreground mt-1">Connect with registered animal welfare organizations.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 rounded-xl shadow-md h-11">
              <Plus className="w-4 h-4 mr-2" /> Register NGO
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Register Organization</DialogTitle>
              <DialogDescription>Add a new animal welfare NGO to the public directory.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Organization Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel>Full Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea className="resize-none" rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full h-11 mt-2" disabled={isPending}>
                  {isPending ? "Registering..." : "Submit Registration"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search by name or location..." 
          className="pl-10 h-12 rounded-xl bg-card border-border/60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3,4,5].map(i => <div key={i} className="h-64 bg-card rounded-2xl animate-pulse"></div>)}
        </div>
      ) : filteredNgos?.length === 0 ? (
        <div className="text-center py-20">
          <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No NGOs found</h3>
          <p className="text-muted-foreground">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredNgos?.map((ngo) => (
            <Card key={ngo.id} className="overflow-hidden rounded-2xl hover-elevate border-border/50">
              <div className="h-2 bg-primary w-full"></div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground leading-tight pr-4">{ngo.name}</h3>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-6 line-clamp-2 min-h-[40px]">
                  {ngo.description}
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 text-foreground/80">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{ngo.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/80">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span>{ngo.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/80">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span>{ngo.email}</span>
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
