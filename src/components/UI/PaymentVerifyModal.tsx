import { Modal, Spinner } from "flowbite-react";

interface PaymentVerificationModalProps {
  open: boolean;
  loading: boolean;
  reference?: string;
  errorMessage?: string;
  onClose: () => void;
}

export default function PaymentVerificationModal({
  open,
  loading,
  reference,
  errorMessage,
  onClose,
}: PaymentVerificationModalProps) {
  return (
    <Modal show={open} size="md" popup onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center flex flex-col items-center gap-4">
          {loading ? (
            <>
              <Spinner size="xl" />
              <h3 className="text-lg font-semibold">Verifying Payment...</h3>
              {reference && (
                <p className="text-sm text-gray-500">
                  Transaction Ref:{" "}
                  <span className="font-mono">{reference}</span>
                </p>
              )}
            </>
          ) : errorMessage ? (
            <>
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-red-600">
                Verification Failed
              </h3>
              <p className="text-sm text-gray-500">{errorMessage}</p>
              {reference && (
                <p className="text-xs text-gray-400">
                  Ref: <span className="font-mono">{reference}</span>
                </p>
              )}
            </>
          ) : (
            <>
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
                <span className="text-green-500 text-2xl">✔️</span>
              </div>
              <h3 className="text-lg font-semibold text-green-600">
                Payment Verified
              </h3>
              {reference && (
                <p className="text-sm text-gray-500">
                  Ref: <span className="font-mono">{reference}</span>
                </p>
              )}
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
