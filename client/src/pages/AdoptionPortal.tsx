import { useState } from "react";
import { usePets, useCreatePet, useUpdatePet } from "@/hooks/use-pets";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Search, Filter, Plus, Home } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPetSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { z } from "zod";

export default function AdoptionPortal() {
  const { data: pets, isLoading } = usePets();
  const { mutate: createPet, isPending: isCreating } = useCreatePet();
  const { mutate: updatePet } = useUpdatePet();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const form = useForm<z.infer<typeof insertPetSchema>>({
    resolver: zodResolver(insertPetSchema),
    defaultValues: { name: "", species: "", breed: "", age: "", description: "", imageUrl: "", status: "available" },
  });

  const onSubmit = (data: z.infer<typeof insertPetSchema>) => {
    createPet(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  const filteredPets = pets?.filter(pet => {
    const matchesFilter = filter === "all" || pet.status === filter;
    const matchesSearch = pet.name.toLowerCase().includes(search.toLowerCase()) || 
                          pet.breed?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">Find a Friend</h1>
          <p className="text-muted-foreground mt-2 text-lg">Give a rescued animal a second chance at happiness.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg shadow-amber-500/20 h-12 px-6">
              <Plus className="w-5 h-5 mr-2" /> List Pet for Adoption
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Add Pet</DialogTitle>
              <DialogDescription>List a rescued pet looking for a home.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="species" render={({ field }) => (
                    <FormItem><FormLabel>Species</FormLabel><FormControl><Input placeholder="Dog, Cat..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="breed" render={({ field }) => (
                    <FormItem><FormLabel>Breed (Optional)</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem><FormLabel>Age (Optional)</FormLabel><FormControl><Input placeholder="e.g. 2 years" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Image URL (Optional)</FormLabel><FormControl><Input placeholder="https://..." {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea className="resize-none" rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full h-11 mt-2 bg-amber-500 hover:bg-amber-600" disabled={isCreating}>
                  {isCreating ? "Adding..." : "Add to Portal"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-2 rounded-2xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by name or breed..." 
            className="pl-12 h-12 border-0 bg-transparent shadow-none focus-visible:ring-0 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-[1px] bg-border hidden sm:block mx-2"></div>
        <div className="w-full sm:w-48 shrink-0">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-12 border-0 bg-transparent shadow-none focus:ring-0">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pets</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="adopted">Adopted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-96 bg-card rounded-3xl animate-pulse border"></div>)}
        </div>
      ) : filteredPets?.length === 0 ? (
        <div className="text-center py-24 bg-card/50 rounded-3xl border border-dashed">
          <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-2xl font-display font-semibold">No pets found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters to see more animals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets?.map((pet) => (
            <Card key={pet.id} className="overflow-hidden rounded-3xl hover-elevate border-border/50 border flex flex-col shadow-md">
              <div className="h-60 w-full bg-muted relative group overflow-hidden">
                {pet.imageUrl ? (
                  <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary">
                    <Heart className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <StatusBadge status={pet.status} />
                </div>
                {pet.status === 'available' && (
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    <Button 
                      size="icon" 
                      className="rounded-full h-12 w-12 bg-white text-primary hover:bg-white/90 shadow-xl"
                      onClick={() => updatePet({ id: pet.id, status: 'adopted' })}
                      title="Mark as Adopted"
                    >
                      <Home className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6 flex-1 flex flex-col bg-card">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-display font-bold text-2xl text-foreground">{pet.name}</h3>
                  <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">{pet.age || 'Age Unknown'}</span>
                </div>
                <p className="text-primary font-medium text-sm mb-4">{pet.breed || pet.species}</p>
                
                <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-3 leading-relaxed">
                  {pet.description}
                </p>
                
                {pet.status === 'available' ? (
                  <Button className="w-full rounded-xl h-11 font-semibold group mt-auto">
                    <Heart className="w-4 h-4 mr-2 group-hover:fill-current group-hover:text-red-300 transition-colors" /> Inquire to Adopt
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full rounded-xl h-11 opacity-50 cursor-not-allowed mt-auto" disabled>
                    Already Adopted
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
