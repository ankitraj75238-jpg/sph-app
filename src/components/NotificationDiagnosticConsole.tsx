import React, { useState, useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { 
  Bell, 
  Play, 
  Trash2, 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Smartphone, 
  Globe, 
  Key, 
  Terminal, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { globalErrorBus, AppErrorLog } from '../utils/errorLogger';

interface DiagnosticLog {
  id: string;
  time: string;
  step?: number;
  type: 'info' | 'success' | 'warn' | 'error';
  text: string;
  details?: string;
}

export const NotificationDiagnosticConsole: React.FC = () => {
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [platformName, setPlatformName] = useState<string>('Detecting...');
  const [isNative, setIsNative] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('Not Requested');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isCopiedToken, setIsCopiedToken] = useState<boolean>(false);
  const [isCopiedLogs, setIsCopiedLogs] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  
  const [logs, setLogs] = useState<DiagnosticLog[]>([
    {
      id: 'init-0',
      time: new Date().toLocaleTimeString(),
      type: 'info',
      text: 'Notification Diagnostic Console ready. Press "Test & Initialize Push Notifications" to begin diagnostics.',
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Initialize platform detection on mount
  useEffect(() => {
    try {
      const native = Capacitor.isNativePlatform();
      const platform = Capacitor.getPlatform();
      setIsNative(native);
      setPlatformName(native ? `Native Android (${platform})` : `Web Browser / Preview (${platform})`);
    } catch (e: any) {
      setPlatformName('Unknown Environment');
      addLog('warn', `Platform detection warning: ${e?.message || e}`);
    }

    // Subscribe to global uncaught error bus
    const unsubscribe = globalErrorBus.subscribe((globalLogs: AppErrorLog[]) => {
      const latest = globalLogs[0];
      if (latest && (latest.type === 'error' || latest.type === 'unhandledrejection')) {
        addLog('error', `[Caught Unhandled]: ${latest.message}`, latest.stack);
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto-scroll terminal to newest log
  useEffect(() => {
    if (!isCollapsed && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isCollapsed]);

  const addLog = (
    type: 'info' | 'success' | 'warn' | 'error',
    text: string,
    details?: string,
    step?: number
  ) => {
    const entry: DiagnosticLog = {
      id: Math.random().toString(36).substring(2, 9),
      time: new Date().toLocaleTimeString(),
      step,
      type,
      text,
      details,
    };
    setLogs((prev) => [...prev, entry]);
  };

  const handleClearLogs = () => {
    setLogs([
      {
        id: Math.random().toString(36).substring(2, 9),
        time: new Date().toLocaleTimeString(),
        type: 'info',
        text: 'Console logs cleared.',
      },
    ]);
  };

  const handleCopyLogs = () => {
    const textOutput = logs
      .map((l) => `[${l.time}] [${l.type.toUpperCase()}] ${l.step ? `Step ${l.step}: ` : ''}${l.text}${l.details ? `\n--> Details: ${l.details}` : ''}`)
      .join('\n');
    navigator.clipboard?.writeText?.(textOutput);
    setIsCopiedLogs(true);
    setTimeout(() => setIsCopiedLogs(false), 2000);
  };

  const handleCopyToken = () => {
    if (!fcmToken) return;
    navigator.clipboard?.writeText?.(fcmToken);
    setIsCopiedToken(true);
    setTimeout(() => setIsCopiedToken(false), 2000);
  };

  // Step-by-Step Diagnostic Trigger (100% Crash-Proof)
  const runDiagnosticTest = async () => {
    if (isRunningTest) return;
    setIsRunningTest(true);
    if (navigator.vibrate) navigator.vibrate(25);

    addLog('info', '==================================================');
    addLog('info', 'Starting Safe Push Notification Diagnostics Session...');

    try {
      // -------------------------------------------------------------
      // Step 1: Checking Platform
      // -------------------------------------------------------------
      addLog('info', 'Checking platform runtime...', undefined, 1);
      const native = Capacitor.isNativePlatform();
      const platform = Capacitor.getPlatform();
      setIsNative(native);

      if (!native) {
        addLog(
          'warn',
          `Platform is '${platform}' (Non-Native / Web Preview). Push Notifications require native Android runtime (APK), but simulation will continue safely.`,
          undefined,
          1
        );
      } else {
        addLog('success', `Platform verified as Native Android (${platform}) with Capacitor core initialized.`, undefined, 1);
      }

      // -------------------------------------------------------------
      // Step 2: Creating Notification Channel 'sph_debug_channel'
      // -------------------------------------------------------------
      addLog('info', "Creating Android high-importance notification channel 'sph_debug_channel'...", undefined, 2);
      try {
        if (typeof PushNotifications.createChannel === 'function') {
          await PushNotifications.createChannel({
            id: 'sph_debug_channel',
            name: 'SPH Diagnostic Channel',
            description: 'Silent Preparation Hub Diagnostic and Testing Channel',
            importance: 5, // MAX importance
            visibility: 1, // Public on Lock Screen
            sound: 'default',
            vibration: true,
            lights: true,
            lightColor: '#10B981',
          });
          addLog('success', "Notification channel 'sph_debug_channel' created and verified successfully.", undefined, 2);
        } else {
          addLog('warn', "PushNotifications.createChannel is not available in current environment (expected in browser preview).", undefined, 2);
        }
      } catch (channelError: any) {
        addLog(
          'error',
          `Channel creation failed: ${channelError?.message || channelError}`,
          channelError?.stack || JSON.stringify(channelError),
          2
        );
      }

      // -------------------------------------------------------------
      // Step 3: Requesting Permissions
      // -------------------------------------------------------------
      addLog('info', 'Checking & requesting notification permissions...', undefined, 3);
      try {
        let permStatus = await PushNotifications.checkPermissions();
        addLog('info', `Initial permission status: ${permStatus?.receive || 'unknown'}`);

        if (permStatus?.receive !== 'granted') {
          addLog('info', 'Requesting runtime notification permissions from user OS...', undefined, 3);
          permStatus = await PushNotifications.requestPermissions();
        }

        const finalStatus = permStatus?.receive || 'denied';
        setPermissionStatus(finalStatus === 'granted' ? 'Granted' : 'Denied');

        if (finalStatus === 'granted') {
          addLog('success', 'Notification permissions granted by user/system!', undefined, 3);
        } else {
          addLog('warn', `Notification permission was '${finalStatus}'. User or OS policy has not granted push access.`, undefined, 3);
        }
      } catch (permError: any) {
        setPermissionStatus('Error / Denied');
        addLog(
          'error',
          `Permission request error: ${permError?.message || permError}`,
          permError?.stack || JSON.stringify(permError),
          3
        );
      }

      // -------------------------------------------------------------
      // Step 4: Calling PushNotifications.register()
      // -------------------------------------------------------------
      addLog('info', 'Calling PushNotifications.register() to obtain FCM token...', undefined, 4);
      try {
        // Attach listener for registration success
        let registrationListener: any = null;
        let registrationErrorListener: any = null;

        try {
          registrationListener = await PushNotifications.addListener('registration', (token) => {
            const tokenVal = token.value;
            setFcmToken(tokenVal);
            addLog('success', `FCM Registration Token received: ${tokenVal.substring(0, 18)}...`, tokenVal, 4);
          });

          registrationErrorListener = await PushNotifications.addListener('registrationError', (error: any) => {
            addLog(
              'error',
              `FCM Registration Error: ${error?.error || error?.message || JSON.stringify(error)}`,
              JSON.stringify(error),
              4
            );
          });

        } catch (listenerError: any) {
          addLog('warn', `Could not attach native listeners: ${listenerError?.message || listenerError}`);
        }

        await PushNotifications.register();
        addLog('success', 'PushNotifications.register() invoked without native rejection.', undefined, 4);

        // If native token doesn't arrive within 4 seconds, inform the user
        setTimeout(() => {
          if (!fcmToken) {
            addLog(
              'info',
              native 
                ? 'Token Pending: If running on Android device, verify Google Play Services and google-services.json are active.'
                : 'Note: Web browser preview does not generate FCM native tokens. Test inside the compiled Android APK.',
              undefined,
              4
            );
          }
        }, 4000);

      } catch (regError: any) {
        addLog(
          'error',
          `PushNotifications.register() encountered an error: ${regError?.message || regError}`,
          regError?.stack || JSON.stringify(regError),
          4
        );
      }

      addLog('info', 'Push notification diagnostic cycle completed safely.');
      addLog('info', '==================================================');
    } catch (globalCatchError: any) {
      // Catch-all safety guard to prevent ANY application shutdown
      addLog(
        'error',
        `Intercepted uncaught diagnostic exception: ${globalCatchError?.message || globalCatchError}`,
        globalCatchError?.stack || JSON.stringify(globalCatchError)
      );
    } finally {
      setIsRunningTest(false);
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-200 mt-6 select-none hw-accelerate">
      {/* Header Bar */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="px-5 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-950 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white tracking-tight">
                Notification Diagnostic Console
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Crash-Proof
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Real-time Native Android FCM & Permission Debugger
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-5 flex flex-col gap-5">
          {/* Status Indicator Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Platform Check */}
            <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-3.5 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isNative ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
              }`}>
                {isNative ? <Smartphone className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Platform
                </span>
                <span className="text-xs font-black text-slate-200 truncate block">
                  {platformName}
                </span>
              </div>
            </div>

            {/* 2. Permission Status */}
            <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-3.5 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                permissionStatus === 'Granted' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : permissionStatus === 'Denied' || permissionStatus.includes('Error')
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                {permissionStatus === 'Granted' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : permissionStatus === 'Denied' || permissionStatus.includes('Error') ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Permissions
                </span>
                <span className={`text-xs font-black truncate block ${
                  permissionStatus === 'Granted' 
                    ? 'text-emerald-400' 
                    : permissionStatus === 'Denied' 
                    ? 'text-rose-400' 
                    : 'text-amber-400'
                }`}>
                  {permissionStatus}
                </span>
              </div>
            </div>

            {/* 3. FCM Token Status */}
            <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-3.5 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                fcmToken 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                <Key className="w-4 h-4" />
              </div>
              <div className="overflow-hidden flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    FCM Token
                  </span>
                  {fcmToken && (
                    <button
                      type="button"
                      onClick={handleCopyToken}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                    >
                      {isCopiedToken ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopiedToken ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <span className="text-xs font-mono font-bold text-slate-200 truncate block">
                  {fcmToken ? `${fcmToken.substring(0, 16)}...` : 'Token Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              id="btn-test-push-notifications"
              type="button"
              disabled={isRunningTest}
              onClick={runDiagnosticTest}
              className={`px-5 py-3 rounded-2xl font-black text-xs tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg ${
                isRunningTest
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-emerald-950/40'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${isRunningTest ? 'animate-spin' : 'fill-current'}`} />
              <span>{isRunningTest ? 'Testing in Progress...' : 'Test & Initialize Push Notifications'}</span>
            </button>

            <button
              type="button"
              onClick={handleClearLogs}
              className="px-3.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5 active:scale-95 border border-slate-700/60"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Clear</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLogs}
              className="px-3.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5 active:scale-95 border border-slate-700/60 ml-auto"
            >
              {isCopiedLogs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isCopiedLogs ? 'Copied' : 'Copy Logs'}</span>
            </button>
          </div>

          {/* Dark Terminal Output Console */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex flex-col">
            {/* Terminal Header */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between font-mono text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-1.5 ml-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-slate-300">sph_debug_terminal</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500">{logs.length} events logged</span>
            </div>

            {/* Terminal Body */}
            <div className="p-4 font-mono text-[11px] leading-relaxed max-h-64 overflow-y-auto flex flex-col gap-2 scrollbar-thin scrollbar-thumb-slate-800">
              {logs.map((log) => {
                const isError = log.type === 'error';
                const isSuccess = log.type === 'success';
                const isWarn = log.type === 'warn';

                return (
                  <div 
                    key={log.id} 
                    className={`p-2 rounded-lg border ${
                      isError 
                        ? 'bg-rose-950/40 border-rose-800/60 text-rose-300' 
                        : isSuccess
                        ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                        : isWarn
                        ? 'bg-amber-950/30 border-amber-800/50 text-amber-300'
                        : 'bg-slate-900/40 border-slate-800/40 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-slate-500 select-none shrink-0 font-sans text-[10px] mt-0.5">
                        [{log.time}]
                      </span>

                      {log.step && (
                        <span className={`px-1.5 py-0.2 rounded font-sans text-[10px] font-black shrink-0 ${
                          isError ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-200'
                        }`}>
                          STEP {log.step}
                        </span>
                      )}

                      <div className="flex-1 break-words">
                        <span className={isError ? 'font-bold text-rose-200' : ''}>
                          {log.text}
                        </span>

                        {log.details && (
                          <pre className="mt-1.5 text-[10px] text-rose-400/90 whitespace-pre-wrap font-mono p-2 bg-slate-950/80 rounded border border-rose-900/40 overflow-x-auto">
                            {log.details}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
