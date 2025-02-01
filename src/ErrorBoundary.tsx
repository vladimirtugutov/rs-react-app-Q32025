import React, { ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  errorMessage: string;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    errorMessage: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { errorMessage: error.toString() };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.logErrorToServices(error.toString(), info.componentStack);
  }

  logErrorToServices = console.log;

  refreshPage = () => {
    history.go(0);
  };

  render() {
    if (this.state.errorMessage) {
      return (
        <>
          <p style={{ color: 'red' }}>{this.state.errorMessage}</p>
          <button onClick={this.refreshPage}>Refresh Page</button>
        </>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
