import { CircleHelp } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ADMIN_WHATSAPP_NUMBER = "919019893582";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.1.55 4.14 1.6 5.95L0 24l6.34-1.75a11.85 11.85 0 0 0 5.73 1.47h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.15-3.44-8.36Zm-8.44 18.2h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.22-3.76 1.04 1-3.66-.24-.38a9.88 9.88 0 0 1-1.52-5.2c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.12 1.03 6.98 2.89a9.8 9.8 0 0 1 2.9 6.98c0 5.46-4.44 9.9-9.9 9.9Zm5.43-7.42c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.69.15-.2.3-.79.98-.96 1.18-.18.2-.35.23-.65.08-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.51-1.8-1.69-2.1-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.69-1.66-.95-2.28-.25-.59-.5-.5-.69-.5h-.58c-.2 0-.53.08-.81.38-.28.3-1.06 1.04-1.06 2.54 0 1.5 1.09 2.95 1.24 3.16.15.2 2.14 3.27 5.18 4.58.72.31 1.28.5 1.72.65.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.07-.13-.28-.2-.58-.35Z" />
  </svg>
);

export const NeedHelpWidget = () => {
  const { pathname } = useLocation();

  // Keep the admin area free from public help prompts.
  if (pathname.startsWith("/admin") || pathname.startsWith("/login/admin-portal")) {
    return null;
  }

  const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="fixed bottom-5 right-4 z-40 h-14 w-14 rounded-full bg-primary p-0 text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 [&_svg]:!h-7 [&_svg]:!w-7 sm:bottom-6 sm:right-6"
          aria-label="Need help"
        >
          <CircleHelp />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm [-webkit-text-size-adjust:100%]">
        <DialogHeader className="items-center text-center sm:text-center">
          <DialogTitle className="font-sans text-xl tracking-normal">Need Help?</DialogTitle>
          <DialogDescription className="font-sans text-sm leading-relaxed">
            Connect with our team instantly on WhatsApp for quick support.
          </DialogDescription>
        </DialogHeader>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-green-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-green-600"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Chat on WhatsApp
        </a>
      </DialogContent>
    </Dialog>
  );
};
