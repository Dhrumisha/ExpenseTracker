// Toast.tsx
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastType = "success" | "error" | "info" | "warning" | "loading" | "dismiss";

type ToastProps =
  | { type: "dismiss"; id?: any; message?: string }
  | { message: string; type?: Exclude<ToastType, "dismiss">; id?: string };

export const showToast = (props: ToastProps) => {
  if (props.type === "dismiss") {
    toast.dismiss(props.id);
    return;
  }

  const { message, type = "info" } = props;

  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "warning":
      toast.warning(message);
      break;
    case "loading":
      toast.loading(message);
      break;
    default:
      toast.info(message);
  }
};

// Optional ToastContainer component to include once (e.g., in App.tsx)
export const ToastContainerWrapper = () => (
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    pauseOnHover
    draggable
  />
);
