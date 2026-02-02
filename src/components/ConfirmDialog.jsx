import React, { useEffect } from 'react'

const ConfirmDialog = ({
    isOpen,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary',
    onConfirm,
    onCancel
}) => {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onCancel?.()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onCancel])

    if (!isOpen) return null

    const variantColors = {
        primary: {
            button: '#007bff',
            buttonHover: '#0056b3',
            icon: '#007bff'
        },
        danger: {
            button: '#dc3545',
            buttonHover: '#c82333',
            icon: '#dc3545'
        },
        warning: {
            button: '#ffc107',
            buttonHover: '#e0a800',
            icon: '#ffc107'
        }
    }

    const colors = variantColors[variant] || variantColors.primary

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onCancel?.()
        }
    }

    const getIcon = () => {
        if (variant === 'danger') {
            return (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
            )
        } else if (variant === 'warning') {
            return (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            )
        } else {
            return (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            )
        }
    }

    return (
        <div
            style={styles.backdrop}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-message"
        >
            <div style={styles.dialog}>
                <div style={styles.iconContainer}>
                    <svg
                        style={{ ...styles.icon, color: colors.icon }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {getIcon()}
                    </svg>
                </div>
                <h3 id="dialog-title" style={styles.title}>
                    {title}
                </h3>
                <p id="dialog-message" style={styles.message}>
                    {message}
                </p>
                <div style={styles.buttonContainer}>
                    <button
                        onClick={onCancel}
                        style={styles.cancelButton}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e2e6ea'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa'
                        }}
                        aria-label="Cancel action"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{ ...styles.confirmButton, backgroundColor: colors.button }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.buttonHover
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = colors.button
                        }}
                        aria-label="Confirm action"
                        autoFocus
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

const styles = {
    backdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
    },
    dialog: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        animation: 'slideIn 0.3s ease-out'
    },
    iconContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
    },
    icon: {
        width: '48px',
        height: '48px'
    },
    title: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#212529',
        marginBottom: '12px',
        textAlign: 'center',
        margin: '0 0 12px 0'
    },
    message: {
        fontSize: '16px',
        color: '#6c757d',
        marginBottom: '28px',
        lineHeight: '1.5',
        textAlign: 'center',
        margin: '0 0 28px 0'
    },
    buttonContainer: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
    },
    cancelButton: {
        backgroundColor: '#f8f9fa',
        color: '#495057',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '10px 24px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        outline: 'none'
    },
    confirmButton: {
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 24px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        outline: 'none'
    }
}

// Inject keyframes for animations
const styleSheet = document.createElement('style')
styleSheet.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideIn {
        from {
            transform: translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`
if (typeof document !== 'undefined' && !document.getElementById('confirm-dialog-styles')) {
    styleSheet.id = 'confirm-dialog-styles'
    document.head.appendChild(styleSheet)
}

export default ConfirmDialog
