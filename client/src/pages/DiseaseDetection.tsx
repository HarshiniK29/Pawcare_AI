import { useState } from "react";
import { useForm } from "react-hook-form";
import { useScans, useCreateScan } from "@/hooks/use-scans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ImageIcon, UploadCloud, CheckCircle2, History } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const scanSchema = z.object({
  imageUrl: z.string().min(1, "Please provide an image URL"),
});

export default function DiseaseDetection() {
  const { data: scans, isLoading } = useScans();
  const { mutate: createScan, isPending } = useCreateScan();
  const { toast } = useToast();
  const [activePreview, setActivePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof scanSchema>>({
    resolver: zodResolver(scanSchema),
    defaultValues: {
      imageUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof scanSchema>) {
    setActivePreview(values.imageUrl);
    createScan(values, {
      onSuccess: () => {
        toast({
          title: "Analysis Complete",
          description: "The AI has finished reviewing the image.",
        });
        form.reset();
      },
    });
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">AI Disease Detection</h1>
          <p className="text-muted-foreground mt-1">Upload an image to instantly screen for dermatological and visible ailments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Card */}
        <Card className="shadow-lg shadow-black/5 border-border/50 overflow-hidden">
          <CardHeader className="bg-primary/5 pb-8">
            <CardTitle className="flex items-center gap-2 text-primary">
              <UploadCloud className="w-5 h-5" />
              New Analysis
            </CardTitle>
            <CardDescription>Paste an image URL of the affected area to start.</CardDescription>
          </CardHeader>
          <CardContent className="-mt-4 relative z-10">
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {activePreview && (
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center">
                      <img 
                        src={activePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={() => setActivePreview(null)}
                      />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <ImageIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input 
                              placeholder="https://example.com/image.jpg" 
                              className="pl-10 h-12 rounded-xl"
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                setActivePreview(e.target.value);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isPending} 
                    className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 hover:-translate-y-0.5 transition-transform"
                  >
                    {isPending ? "Analyzing Image..." : "Analyze Image"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 flex items-start gap-3 bg-amber-50 text-amber-800 p-4 rounded-lg text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p><strong>Disclaimer:</strong> AI analysis is for preliminary screening only and does not replace a professional veterinary diagnosis.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History / Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-muted-foreground" />
            Recent Scans
          </h2>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-24 bg-card rounded-xl border animate-pulse"></div>
              ))}
            </div>
          ) : !scans || scans.length === 0 ? (
            <div className="text-center p-12 bg-card rounded-xl border border-dashed border-border">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No scans history available.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scans.map((scan, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={scan.id} 
                  className="bg-card rounded-xl border border-border/50 overflow-hidden flex shadow-sm hover-elevate"
                >
                  <div className="w-24 h-24 shrink-0 bg-muted">
                    <img src={scan.imageUrl} alt="Scan result" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        {scan.scannedAt ? format(new Date(scan.scannedAt), 'MMM d, yyyy') : 'Unknown date'}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h4 className="font-semibold text-foreground capitalize">{scan.result}</h4>
                    {scan.notes && <p className="text-sm text-muted-foreground truncate mt-1">{scan.notes}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
