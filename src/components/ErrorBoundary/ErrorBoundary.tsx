import React, { ErrorInfo, Fragment } from 'react';
import { ErrorBoundaryProps, ErrorBoundaryState } from '../../types/components';

export class ErrorBoundary extends React.Component<
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
        <Fragment>
          <p className="error-message">{this.state.errorMessage}</p>
          <button onClick={this.refreshPage}>Refresh Page</button>
        </Fragment>
      );
    }
    return this.props.children;
  }
}
