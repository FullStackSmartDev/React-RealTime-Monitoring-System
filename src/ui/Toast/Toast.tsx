import * as React from "react";
import styled from "styled-components";

interface Context {
  addToast: (params: ToastProps) => void;
}

export enum ToastType {
  SUCCESS,
  ERROR,
  INFO,
}

interface ToastProps {
  children: React.ReactNode;
  duration?: number;
  type?: ToastType;
}

const ToastContext = React.createContext<Context>({
  addToast: () => null,
});

const DEFAULT_TOAST_VISIBILITY_TIME = 3000;

export const Toast: React.FC<ToastProps> = ({
  children,
  type = ToastType.INFO,
  duration = DEFAULT_TOAST_VISIBILITY_TIME,
}) => {
  const [isVisible, setVisible] = React.useState(false);
  const [isInitialized, setInitialized] = React.useState(false);
  React.useEffect(() => {
    if (isInitialized) return;
    setVisible(true);
    setInitialized(true);

    setTimeout(() => {
      setVisible(false);
    }, duration - 250);
  }, [duration, isInitialized]);

  return (
    <ToastUI type={type} isVisible={isVisible}>
      {children}
    </ToastUI>
  );
};

export const useToast = () => {
  const toastContext = React.useContext(ToastContext);

  return {
    add: (data: ToastProps) => {
      toastContext.addToast(data);
    },
  };
};

export const ToastProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = React.useState<(ToastProps & { key: string })[]>(
    []
  );
  const addToast = React.useCallback(
    ({
      type = ToastType.INFO,
      duration = DEFAULT_TOAST_VISIBILITY_TIME,
      children,
    }) => {
      setToasts((data) => {
        const key = Math.random().toString();

        setTimeout(() => {
          setToasts((data) => {
            return data.filter((toast) => toast.key !== key);
          });
        }, duration);

        return data.concat({ type, duration, children, key });
      });
    },
    []
  );

  return (
    <ToastContext.Provider
      value={{
        addToast,
      }}
    >
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast {...toast} />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

const ToastContainer = styled.div`
  position: fixed;
  top: 40px;
  right: 0;
  padding: 1rem;
`;

const ToastUI = styled.div<{ type: ToastType; isVisible: boolean }>`
  position: relative;
  min-width: 300px;
  padding: 0.5rem;
  background: white;
  border-radius: 5px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
  color: white;

  ${(props) => {
    switch (props.type) {
      case ToastType.ERROR:
        return `background: #e74c3c;`;
      case ToastType.SUCCESS:
        return `background: #07bc0c;`;
      default:
        return `background: #3498db;`;
    }
  }}

  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: 0.25s all;

  & + & {
    margin-top: 1rem;
  }
`;
