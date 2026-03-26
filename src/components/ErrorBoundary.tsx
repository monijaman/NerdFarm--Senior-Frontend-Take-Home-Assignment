"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // call optional handler and always log
    try {
      this.props.onError?.(error, info);
    } catch (e) {
      // swallow handler errors
      // eslint-disable-next-line no-console
      console.error("ErrorBoundary onError handler threw", e);
    }
    // eslint-disable-next-line no-console
    console.error("Uncaught error in subtree:", error, info);
  }

  reset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return <>{this.props.fallback}</>;

      return (
        <div className="p-6">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted/70 mt-2">An unexpected error occurred. Try refreshing or return later.</p>
          <div className="mt-4">
            <button onClick={this.reset} className="px-3 py-1 bg-primary text-white rounded">Try again</button>
          </div>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}

export default ErrorBoundary;
