// Service Worker Registration and Update Management
export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;
  private updateCallbacks: ((registration: ServiceWorkerRegistration) => void)[] = [];
  private currentVersion = 'balanzed-v0.1.9'; // Should match CACHE_VERSION in sw.js

  constructor() {
    this.loadStoredVersion();
    this.init();
  }

  private loadStoredVersion() {
    const stored = localStorage.getItem('appVersion');
    if (stored) {
      console.log('Service Worker: Loaded stored version:', stored);
    }
  }

  private saveCurrentVersion() {
    localStorage.setItem('appVersion', this.currentVersion);
    console.log('Service Worker: Saved version to localStorage:', this.currentVersion);
  }

  private async init() {
    if ('serviceWorker' in navigator) {
      try {
        // Register service worker
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('Service Worker registered:', this.registration);

        // Listen for updates
        this.registration.addEventListener('updatefound', () => {
          console.log('Service Worker: Update found event triggered');
          const newWorker = this.registration!.installing;
          if (newWorker) {
            console.log('Service Worker: New worker found, monitoring state...');
            newWorker.addEventListener('statechange', () => {
              console.log('Service Worker: Worker state changed to:', newWorker.state);
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('Service Worker: New version installed and ready, showing update notification');
                // New version available - always show notification when new SW is installed
                this.updateAvailable = true;
                this.notifyUpdateAvailable();
              }
            });
          }
        });

        // Also check for updates immediately and periodically
        this.checkForUpdates();
        setInterval(() => {
          this.checkForUpdates();
        }, 30000); // Check every 30 seconds instead of 60

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  private notifyUpdateAvailable() {
    this.updateCallbacks.forEach(callback => {
      if (this.registration) {
        callback(this.registration);
      }
    });
  }

  public onUpdateAvailable(callback: (registration: ServiceWorkerRegistration) => void) {
    this.updateCallbacks.push(callback);
    // If update is already available, call immediately
    if (this.updateAvailable && this.registration) {
      callback(this.registration);
    }
  }

  public async checkForUpdates() {
    if (this.registration) {
      try {
        console.log('Service Worker: Checking for updates...');
        await this.registration.update();
        console.log('Service Worker: Update check completed');
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    }
  }

  // Manual trigger for testing
  public triggerUpdateForTesting() {
    console.log('Service Worker: Manually triggering update notification for testing');
    // Force show update regardless of version check
    this.updateAvailable = true;
    this.notifyUpdateAvailable();
  }

  public applyUpdate() {
    console.log('Service Worker: Refreshing page and updating version...');
    // Save the current version before reload
    this.saveCurrentVersion();
    // Immediate page reload
    window.location.reload();
  }

  public isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }

  public async unregister() {
    if (this.registration) {
      await this.registration.unregister();
      this.registration = null;
    }
  }
}

// Create singleton instance
export const swManager = new ServiceWorkerManager();