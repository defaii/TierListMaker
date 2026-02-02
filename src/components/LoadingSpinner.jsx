import React from 'react'

const LoadingSpinner = ({ size = 'medium', text = '', fullScreen = false }) => {
    const sizeMap = {
        small: '24px',
        medium: '48px',
        large: '72px'
    }

    const spinnerSize = sizeMap[size] || sizeMap.medium

    const containerStyle = fullScreen ? styles.fullScreenContainer : styles.container

    return (
        <div style={containerStyle}>
            <div style={styles.spinnerWrapper}>
                <svg
                    style={{ ...styles.spinner, width: spinnerSize, height: spinnerSize }}
                    viewBox="0 0 50 50"
                >
                    <circle
                        style={styles.spinnerCircle}
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        strokeWidth="4"
                    />
                </svg>
                {text && <p style={styles.text}>{text}</p>}
            </div>
            <style>{keyframes}</style>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
    },
    fullScreenContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999
    },
    spinnerWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
    },
    spinner: {
        animation: 'rotate 2s linear infinite'
    },
    spinnerCircle: {
        stroke: '#007bff',
        strokeLinecap: 'round',
        animation: 'dash 1.5s ease-in-out infinite'
    },
    text: {
        margin: 0,
        color: '#495057',
        fontSize: '16px',
        fontWeight: '500',
        textAlign: 'center'
    }
}

const keyframes = `
    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes dash {
        0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
        }
        100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
        }
    }
`

export default LoadingSpinner
