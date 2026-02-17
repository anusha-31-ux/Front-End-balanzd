import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';
import { swManager } from '@/utils/serviceWorker';

export const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    // Listen for service worker updates
    swManager.onUpdateAvailable(() => {
      setShowUpdate(true);
    });
  }, []);

  const handleUpdate = async () => {
    await swManager.applyUpdate();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-lg border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <RefreshCw className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  Update Available
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  A new version of the app is available. Refresh to get the latest features and fixes.
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex space-x-2">
            <Button
              onClick={handleUpdate}
              size="sm"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Now
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              size="sm"
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};