import { Loader } from "@/components/ui/loader";

const PageLoader = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;
