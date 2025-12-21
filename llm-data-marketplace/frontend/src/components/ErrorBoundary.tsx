import { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Logo } from './ui/Logo';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#0B0E11' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center space-y-8 max-w-md mx-auto px-4 text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <Logo size="md" />
            </motion.div>

            {/* Error Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(240, 185, 11, 0.1)' }}
            >
              <AlertTriangle className="h-8 w-8" style={{ color: '#F0B90B' }} />
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
              className="space-y-4"
            >
              <h1 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
                Something went wrong
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                We encountered an unexpected error. This might be due to a network issue or a temporary glitch.
                Please try refreshing the page.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm font-medium mb-2" style={{ color: '#F0B90B' }}>
                    Error Details (Development)
                  </summary>
                  <pre className="text-xs p-3 rounded-lg overflow-auto max-h-32"
                       style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.8)' }}>
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </motion.div>

            {/* Retry Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
            >
              <Button
                onClick={this.handleRetry}
                className="flex items-center space-x-2 px-6 py-3 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#F0B90B', color: '#0B0E11', fontWeight: '500' }}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </Button>
            </motion.div>

            {/* Additional Help */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
              className="text-xs"
              style={{ color: 'rgba(255, 255, 255, 0.5)' }}
            >
              If the problem persists, please contact our support team.
            </motion.p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;