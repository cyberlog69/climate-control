import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical Runtime Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#05070d",
          color: "#f8fafc",
          fontFamily: "sans-serif",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "1.4rem", color: "#06b6d4", marginBottom: "0.75rem" }}>
            ClimateSphere Initialization
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", maxWidth: "400px", marginBottom: "1.5rem" }}>
            An unexpected initialization issue occurred. Tap below to reload the real-time feeds.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.6rem 1.4rem",
              borderRadius: "20px",
              background: "#06b6d4",
              color: "#000",
              fontWeight: "700",
              border: "none",
              cursor: "pointer"
            }}
          >
            Reload ClimateSphere
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
