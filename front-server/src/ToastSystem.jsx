import React, { createContext, useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Types pour   le toaster
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Contexte du toaster
const ToastContext = createContext();

// Provider du toaster
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = TOAST_TYPES.INFO, duration = 4000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, duration) => addToast(message, TOAST_TYPES.SUCCESS, duration);
  const showError = (message, duration) => addToast(message, TOAST_TYPES.ERROR, duration);
  const showWarning = (message, duration) => addToast(message, TOAST_TYPES.WARNING, duration);
  const showInfo = (message, duration) => addToast(message, TOAST_TYPES.INFO, duration);

  return (
    <ToastContext.Provider value={{
      showSuccess,
      showError,
      showWarning,
      showInfo,
      removeToast
    }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook personnalisé pour utiliser le toaster
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast doit être utilisé dans un ToastProvider');
  }
  return context;
};

// Composant Toast individuel
const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getToastClass = (toast, isVisible) => {
    let base = "toast";
    if (isVisible) base += " show";

    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return base + " success";
      case TOAST_TYPES.ERROR:
        return base + " error";
      case TOAST_TYPES.WARNING:
        return base + " warning";
      case TOAST_TYPES.INFO:
      default:
        return base + " info";
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return <CheckCircle className="toast-icon toast-icon-success" />;
      case TOAST_TYPES.ERROR:
        return <AlertCircle className="toast-icon toast-icon-error" />;
      case TOAST_TYPES.WARNING:
        return <AlertTriangle className="toast-icon toast-icon-warning" />;
      case TOAST_TYPES.INFO:
      default:
        return <Info className="toast-icon toast-icon-info" />;
    }
  };

  return (
    <div className={getToastClass(toast, isVisible)}>
      {getIcon()}
      <span className="toast-message">{toast.message}</span>
      {/* <button
        onClick={handleRemove}
        className="toast-close-btn"
      >
        <X className="toast-close-icon" />
      </button> */}
    </div>
  );
};

// Container des toasts
const ToastContainer = ({ toasts, removeToast }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const toastContent = (
    <div className="toast-system">
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );

  // Utilise un portal pour rendre les toasts directement dans le body
  return createPortal(toastContent, document.body);
};