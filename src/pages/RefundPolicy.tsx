import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container-custom mx-auto max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-8">Refund Policy</h1>
        
        <div className="prose prose-lg text-muted-foreground space-y-6">
          <p className="text-xl font-semibold text-foreground">
            All purchases made on BALANZED are non-refundable.
          </p>
          
          <p>
            Once a program is activated, refunds will not be provided under any circumstances, including:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>Change of mind</li>
            <li>Schedule issues</li>
            <li>Non-attendance of sessions</li>
          </ul>
          
          <p>
            In case of genuine technical issues from our side that prevent access to sessions, users may contact our support team for resolution.
          </p>
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

export default RefundPolicy;
