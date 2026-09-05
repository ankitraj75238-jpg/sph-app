/**
 * Crash-Proof Global Error Logger & Event Bus
 * Captures uncaught JS errors, unhandled promise rejections, and native plugin errors.
 */

export interface AppErrorLog {
  id: string;
  timestamp: string;
  type: 'error' | 'unhandledrejection' | 'native' | 'info' | 'warn';
  message: string;
  stack?: string;
  source?: string;
}

type Listener = (logs: AppErrorLog[]) => void;

class GlobalErrorBus {
  private logs: AppErrorLog[] = [];
  private listeners: Set<Listener> = new Set();
  private isInitialized = false;

  public init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 1. Uncaught global JavaScript exceptions
    window.addEventListener('error', (event) => {
      this.addLog({
        type: 'error',
        message: event.message || 'Unknown window error',
        stack: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`,
        source: 'window.onerror',
      });
    });

    // 2. Unhandled promise rejections (common in async native Capacitor calls)
    window.addEventListener('unhandledrejection', (event) => {
      let reasonMsg = 'Unhandled Promise Rejection';
      let stack: string | undefined;

      if (event.reason instanceof Error) {
        reasonMsg = event.reason.message;
        stack = event.reason.stack;
      } else if (typeof event.reason === 'string') {
        reasonMsg = event.reason;
      } else if (event.reason && typeof event.reason === 'object') {
        try {
          reasonMsg = JSON.stringify(event.reason);
        } catch {
          reasonMsg = String(event.reason);
        }
      }

      this.addLog({
        type: 'unhandledrejection',
        message: reasonMsg,
        stack,
        source: 'window.onunhandledrejection',
      });
    });
  }

  public addLog(entry: Omit<AppErrorLog, 'id' | 'timestamp'>) {
    const newLog: AppErrorLog = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
    };

    this.logs = [newLog, ...this.logs.slice(0, 99)]; // retain last 100 entries
    this.notify();
    return newLog;
  }

  public getLogs(): AppErrorLog[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getLogs());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const current = this.getLogs();
    this.listeners.forEach((l) => {
      try {
        l(current);
      } catch (err) {
        console.warn('Error bus listener error:', err);
      }
    });
  }
}

export const globalErrorBus = new GlobalErrorBus();
