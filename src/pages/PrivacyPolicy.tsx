import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container-custom mx-auto max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg text-muted-foreground space-y-6">
          <ul className="list-disc pl-6 space-y-4">
            <li>
              User data such as name, phone number, and email will be used only for communication and program purposes.
            </li>
            <li>
              BALANZED does not sell or share personal data with third parties.
            </li>
            <li>
              Payment details are processed securely through third-party payment gateways.
            </li>
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

export default PrivacyPolicy;
