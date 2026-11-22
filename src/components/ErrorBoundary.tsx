import React, { Component } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidMount() {
    if (typeof (window as any).__PG_MARK_MOUNTED__ === 'function') {
      (window as any).__PG_MARK_MOUNTED__();
    } else {
      (window as any).__PG_APP_MOUNTED__ = true;
    }
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    if (typeof (window as any).__PG_MARK_MOUNTED__ === 'function') {
      (window as any).__PG_MARK_MOUNTED__();
    } else {
      (window as any).__PG_APP_MOUNTED__ = true;
    }
    console.error('PlantGrowth AI ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('plantPredictorHistory');
      localStorage.removeItem('plantGuruFavorites');
    } catch {}
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 botanical-canvas text-[#122b16] font-sans">
          <div className="max-w-md w-full botanical-glass-panel rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 text-[#1c521b] shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-[#122b16] tracking-tight mb-2">
              PlantGrowth AI Restored
            </h2>
            
            <p className="text-sm text-[#456449] mb-6 leading-relaxed">
              We detected a display glitch and prevented a blank screen. Tap below to reload fresh plant data and continue smoothly.
            </p>

            <div className="w-full flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-[#1c521b] to-[#2e7224] hover:from-[#164215] hover:to-[#245b1c] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload App</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="py-3 px-4 rounded-full botanical-glass-card text-[#163d1a] font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
