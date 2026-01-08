import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container-custom mx-auto max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-lg text-muted-foreground space-y-6">
          <p>By enrolling in any BALANZED program:</p>
          
          <ul className="list-disc pl-6 space-y-4">
            <li>You agree to follow trainer instructions.</li>
            <li>You understand results vary from person to person.</li>
            <li>You agree not to misuse content or session access links.</li>
            <li>Sharing live session links with others is strictly prohibited.</li>
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

export default TermsConditions;
