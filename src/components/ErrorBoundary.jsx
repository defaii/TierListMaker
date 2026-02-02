import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo)
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    handleReload = () => {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={styles.container}>
                    <div style={styles.card}>
                        <div style={styles.iconContainer}>
                            <svg
                                style={styles.icon}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2 style={styles.title}>Oops! Something went wrong</h2>
                        <p style={styles.message}>
                            We encountered an unexpected error. Please try reloading the page.
                        </p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details style={styles.details}>
                                <summary style={styles.summary}>Error Details</summary>
                                <pre style={styles.errorText}>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                        <button
                            onClick={this.handleReload}
                            style={styles.button}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = styles.button.backgroundColor
                            }}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        padding: '20px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center'
    },
    iconContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
    },
    icon: {
        width: '64px',
        height: '64px',
        color: '#dc3545'
    },
    title: {
        fontSize: '28px',
        fontWeight: '600',
        color: '#212529',
        marginBottom: '16px'
    },
    message: {
        fontSize: '16px',
        color: '#6c757d',
        marginBottom: '24px',
        lineHeight: '1.5'
    },
    details: {
        textAlign: 'left',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
    },
    summary: {
        cursor: 'pointer',
        fontWeight: '600',
        marginBottom: '12px',
        color: '#495057'
    },
    errorText: {
        fontSize: '12px',
        color: '#dc3545',
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 32px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        outline: 'none'
    },
    buttonHover: {
        backgroundColor: '#0056b3'
    }
}

export default ErrorBoundary
