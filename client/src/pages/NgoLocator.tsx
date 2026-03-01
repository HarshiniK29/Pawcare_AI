import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_NGOS = [
  {
    id: 1,
    name: "Blue Cross of India",
    distance: "1.2 km away",
    phone: "+91 44 2235 4959",
    address: "72, Velachery Rd, Guindy, Chennai"
  },
  {
    id: 2,
    name: "PFA Chennai",
    distance: "3.5 km away",
    phone: "+91 44 2496 5555",
    address: "Besant Nagar, Chennai"
  },
  {
    id: 3,
    name: "Scan Foundation",
    distance: "5.8 km away",
    phone: "+91 94444 44444",
    address: "Kilpauk, Chennai"
  }
];

export default function NgoLocator() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-primary mb-2">NGO Locator</h1>
        <p className="text-muted-foreground">Find and notify nearby animal welfare organizations in Chennai.</p>
      </div>

      <Card className="overflow-hidden border-2 shadow-lg">
        <div className="aspect-video w-full min-h-[400px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124403.24355755141!2d80.1411394553228!3d13.04752545585501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1709123456789!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_NGOS.map((ngo) => (
          <Card key={ngo.id} className="hover-elevate border-border/50">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold">{ngo.name}</CardTitle>
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                  {ngo.distance}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{ngo.address}</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{ngo.phone}</span>
                </div>
              </div>
              <Link href="/cases" className="w-full">
                <Button className="w-full bg-[#1F4E79] hover:bg-[#1F4E79]/90 text-white gap-2 font-semibold h-11">
                  <Bell className="w-4 h-4" />
                  Notify NGO
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}