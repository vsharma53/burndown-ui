import { useEffect, useState } from "react";
import { Toast, ToastContainer, Spinner } from "react-bootstrap";

export default function ApiNotifications() {
  const [loadingCount, setLoadingCount] = useState(0);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const onLoading = (e) => setLoadingCount(e?.detail?.inflight || 0);
    const onSuccess = (e) =>
      setToasts((prev) => [
        ...prev,
        { id: Date.now(), variant: "success", message: e?.detail?.message || "Success" }
      ]);
    const onError = (e) =>
      setToasts((prev) => [
        ...prev,
        { id: Date.now(), variant: "danger", message: e?.detail?.message || "Error" }
      ]);

    window.addEventListener("api:loading", onLoading);
    window.addEventListener("api:success", onSuccess);
    window.addEventListener("api:error", onError);
    return () => {
      window.removeEventListener("api:loading", onLoading);
      window.removeEventListener("api:success", onSuccess);
      window.removeEventListener("api:error", onError);
    };
  }, []);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <>
      {loadingCount > 0 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050
          }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      <ToastContainer position="top-end" className="p-3">
        {toasts.map((t) => (
          <Toast key={t.id} bg={t.variant} onClose={() => removeToast(t.id)} delay={3000} autohide>
            <Toast.Body className="text-white">{t.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </>
  );
}


