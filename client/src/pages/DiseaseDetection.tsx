import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function DiseaseDetection() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    disease: string;
    confidence: number;
    severity: "Low" | "Moderate" | "Critical";
    recommendation: string;
  } | null>(null);
  const { toast } = useToast();

  const handleUpload = () => {
    setIsAnalyzing(true);
    // Mock analysis delay
    setTimeout(() => {
      setResult({
        disease: "Mange / Skin Infection",
        confidence: 87,
        severity: "Critical",
        recommendation: "Immediate veterinary attention required. This condition is highly contagious to other animals and causes severe distress. Isolate the animal and provide medicated baths as prescribed by a professional."
      });
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: "AI has identified a potential skin condition.",
      });
    }, 2000);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">AI Disease Detection</h1>
        <p className="text-muted-foreground text-lg">
          Upload a clear photo of the affected area for instant preliminary analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
          <CardContent 
            className="p-0"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            <div className="aspect-square relative flex flex-col items-center justify-center p-6 text-center">
              {image ? (
                <>
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <Button variant="secondary" onClick={() => setImage(null)}>
                      Change Image
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Drag and drop image</p>
                    <p className="text-sm text-muted-foreground">or click to browse from your device</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setImage(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-4 bg-muted/30 border-t">
            <Button 
              className="w-full h-12 text-base font-semibold" 
              disabled={!image || isAnalyzing}
              onClick={handleUpload}
            >
              {isAnalyzing ? "Analyzing with AI..." : "Analyze Image"}
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/10 rounded-2xl border border-border"
              >
                <div className="mb-4 p-4 bg-background rounded-full shadow-sm">
                  <Info className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready for Analysis</h3>
                <p className="text-muted-foreground">
                  Upload an image of a stray animal's skin condition to see the AI diagnostic results here.
                </p>
                <div className="mt-8 w-full max-w-xs">
                  <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-3 text-left">Sample Placeholder</p>
                  <img 
                    src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80" 
                    alt="Sample Dog" 
                    className="w-full h-40 object-cover rounded-xl grayscale opacity-50 border"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className="overflow-hidden border-2 border-primary/20 shadow-xl">
                  <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-2xl">Detection Result</CardTitle>
                      <Badge 
                        variant={result.severity === "Critical" ? "destructive" : result.severity === "Moderate" ? "secondary" : "default"}
                        className="px-3 py-1 text-sm font-bold uppercase tracking-wider"
                      >
                        {result.severity} Severity
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-tight mb-1">Detected Condition</p>
                        <p className="text-xl font-bold text-foreground">{result.disease}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-tight mb-1">AI Confidence</p>
                        <p className="text-2xl font-black text-primary">{result.confidence}%</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                        <h4>Professional Recommendation</h4>
                      </div>
                      <p className="text-muted-foreground leading-relaxed bg-primary/5 p-4 rounded-xl border border-primary/10 italic">
                        "{result.recommendation}"
                      </p>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setResult(null)}>
                        Clear Result
                      </Button>
                      <Link href="/ngo-locator" className="flex-1">
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          Find Nearest NGO
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex gap-3">
  <AlertCircle className="w-6 h-6 text-destructive shrink-0" />
  <p className="text-sm text-black font-medium">
    Disclaimer: This tool provides preliminary AI-based insights and is not a substitute for professional veterinary diagnosis.
  </p>
</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}