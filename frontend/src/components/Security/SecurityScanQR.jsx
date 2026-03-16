import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export const SecurityScanQR = ({
  onScan,
  fps = 10,
  qrbox = 250,
  elementId = "reader",
}) => {
  const scannerRef = useRef(null);
  const onScanRef = useRef(onScan);
  const transitionRef = useRef(Promise.resolve());
  const [statusMessage, setStatusMessage] = useState("Waiting for camera permission...");

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    let cancelled = false;

    const mountScanner = async () => {
      await transitionRef.current;
      if (cancelled) {
        return;
      }

      const scanner = new Html5QrcodeScanner(elementId, {
        fps,
        qrbox,
      });

      scannerRef.current = scanner;

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
    };

    mountScanner();

    return () => {
      cancelled = true;
      const scanner = scannerRef.current;
      scannerRef.current = null;

      if (scanner) {
        transitionRef.current = scanner.clear().catch(() => {
        });
      }
    };
  }, [fps, qrbox, elementId]);

  return (
    <div className="max-w-120">
      <div id={elementId} style={{ width: "100%" }} />
      <p className="mt-2 text-sm text-gray-500">{statusMessage}</p>
    </div>
  );
};
