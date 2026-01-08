import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrizeChallengePolicy = () => {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container-custom mx-auto max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-8">Prize Challenge Policy</h1>
        
        <div className="prose prose-lg text-muted-foreground space-y-6">
          <h2 className="text-2xl font-display text-foreground">Consistency Challenge Policy</h2>
          
          <ul className="list-disc pl-6 space-y-4">
            <li>Cash prizes are applicable only for 6-month plan participants.</li>
            <li>Winners are selected based on consistency, participation, discipline, lab report and overall engagement.</li>
            <li>Decisions taken by BALANZED team regarding challenge results are final.</li>
            <li>This challenge is meant to motivate healthy habits, not extreme physical transformation.</li>
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

export default PrizeChallengePolicy;
