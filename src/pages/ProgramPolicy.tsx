import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProgramPolicy = () => {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container-custom mx-auto max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-8">Program Policy</h1>
        
        <div className="prose prose-lg text-muted-foreground space-y-6">
          <ul className="list-disc pl-6 space-y-4">
            <li>This is a live group workout program conducted online.</li>
            <li>Participants must consult a doctor before joining if they have any medical condition.</li>
            <li>BALANZED is not responsible for injuries caused due to improper form or non-adherence to guidance.</li>
            <li>Participants must inform trainers about existing health issues before starting.</li>
          </ul>
        </div>
        
        <Link to="/">
          <Button variant="outline" className="mt-12 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProgramPolicy;
