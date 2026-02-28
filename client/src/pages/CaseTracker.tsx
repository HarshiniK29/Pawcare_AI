import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MOCK_CASES = [
  { id: "RC-001", type: "Dog", disease: "Mange", status: "Reported", date: "2025-05-10" },
  { id: "RC-002", type: "Cat", disease: "Eye Infection", status: "Assigned", date: "2025-05-11" },
  { id: "RC-003", type: "Dog", disease: "Leg Injury", status: "Rescued", date: "2025-05-12" },
  { id: "RC-004", type: "Cow", disease: "Lumpy Skin", status: "Treated", date: "2025-05-13" },
  { id: "RC-005", type: "Dog", disease: "Distemper", status: "Recovered", date: "2025-05-14" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Reported": return "bg-gray-100 text-gray-600 border-gray-200";
    case "Assigned": return "bg-blue-100 text-blue-600 border-blue-200";
    case "Rescued": return "bg-orange-100 text-orange-600 border-orange-200";
    case "Treated": return "bg-purple-100 text-purple-600 border-purple-200";
    case "Recovered": return "bg-green-100 text-green-600 border-green-200";
    default: return "bg-gray-100 text-gray-600";
  }
};

export default function CaseTracker() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCases = MOCK_CASES.filter(c => 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.disease.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-1">Rescue Case Tracker</h1>
          <p className="text-muted-foreground">Monitor real-time rescue and recovery operations.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by ID, animal or disease..." 
            className="pl-10 h-11 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-black/5 overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold py-4">Case ID</TableHead>
                <TableHead className="font-bold">Animal Type</TableHead>
                <TableHead className="font-bold">Disease</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((c) => (
                <TableRow key={c.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium py-4">{c.id}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell>{c.disease}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-semibold px-3 py-1 ${getStatusColor(c.status)}`}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.date}</TableCell>
                </TableRow>
              ))}
              {filteredCases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 opacity-20" />
                      <p>No rescue cases found matching your search.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}