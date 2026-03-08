import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export const VisitorScanQR = ({
  onScan,
  fps = 10,
  qrbox = 250,
  elementId = "reader",
}) => {
  const scannerRef = useRef(null);
  const onScanRef = useRef(onScan);
  const [statusMessage, setStatusMessage] = useState("Waiting for camera permission...");

  // Keep a ref to the latest onScan callback so we can safely refer to it from the scanner callback.
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    const containerId = elementId;

    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(containerId, {
        fps,
        qrbox,
        // Optional: Disable the torch button if desired
        // rememberLastUsedCamera: true,
      });
    }

    const scanner = scannerRef.current;

    scanner.render(
      (decodedText) => {
        setStatusMessage("Scan successful");
        if (typeof onScanRef.current === "function") {
          onScanRef.current(decodedText);
        }
      },
      (errorMessage) => {
        setStatusMessage("Scanning... (point camera at a QR code)");
        console.debug("QR scan error:", errorMessage);
      }
    );

    return () => {
      scanner
        .clear()
        .then(() => setStatusMessage("Scanner stopped"))
        .catch(() => {
          /* ignore */
        });
    };
  }, [fps, qrbox, elementId]);

  return (
    <div className="max-w-120">
      <div id={elementId} style={{ width: "100%" }} />
      <p className="mt-2 text-sm text-gray-500">{statusMessage}</p>
    </div>
  );
};
