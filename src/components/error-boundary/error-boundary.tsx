import React, { ReactNode, ErrorInfo } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  errorMessage: string;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    errorMessage: '',
  };

  static getDerivedStateFromError(error: Error): State {
    return { errorMessage: error.toString() };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.log(error.toString(), info.componentStack);
  }

  refreshPage = () => {
    window.location.reload();
  };

  render() {
    if (this.state.errorMessage) {
      return (
        <React.Fragment>
          <p className="error-message">{this.state.errorMessage}</p>
          <button onClick={this.refreshPage}>Refresh Page</button>
        </React.Fragment>
      );
    }
    return this.props.children;
  }
}
