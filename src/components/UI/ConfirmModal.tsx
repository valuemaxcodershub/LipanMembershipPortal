import React from "react";
import {
  Modal,
  Button,
  FlowbiteStateColors,
  FlowbiteGradientDuoToneColors,
} from "flowbite-react";
import { HiExclamationCircle } from "react-icons/hi";
import type { IconType } from "react-icons";
import { FaSpinner } from "react-icons/fa";
type Colors = FlowbiteStateColors & FlowbiteGradientDuoToneColors;
type ConfirmColors = Pick<Colors, "failure" | "warning" | "success" | "info">;
interface ConfirmationModalProps {
  open: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: React.ReactNode;
  message?: React.ReactNode;
  confirmText?: React.ReactNode;
  cancelText?:  React.ReactNode;
  theme?: keyof ConfirmColors;
  loading?: boolean;
  icon?: IconType;
  iconColor?: string;
  fullWidthButtons?: boolean;
  showButtons?: boolean;
}

const ConfirmationModal = ({
  open,
  onClose = ()=> {},
  onConfirm = ()=> {},
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  theme = "failure",
  loading = false,
  icon: Icon = HiExclamationCircle,
  fullWidthButtons = false,
  showButtons = true,
}: ConfirmationModalProps) => {
  const colorMapping: Record<keyof ConfirmColors, string> = {
    failure: "[#ff0000]",
    warning: "yellow-400",
    success: "green-500",
    info: "blue-600",
  };
  return (
    <Modal
      show={open}
      size="lg"
      onClose={onClose}
      popup
      position="center"
      aria-modal="true"
      role="dialog"
    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <div
            className={`bg-${colorMapping[theme]} bg-opacity-30 w-fit grid place-items-center mx-auto mb-4 p-5 rounded-full`}
          >
            {Icon && (
              <Icon
                className={`size-14 text-xl text-${colorMapping[theme]}`}
                aria-hidden="true"
              />
            )}
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
          {showButtons && (
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button
                color="light"
                onClick={onClose}
                fullSized={fullWidthButtons}
                className=""
              >
                {cancelText}
              </Button>
              <Button
                onClick={onConfirm}
                fullSized={fullWidthButtons}
                isProcessing={loading}
                className={`text-white !bg-${colorMapping[theme]}`}
              >
                {confirmText}
              </Button>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmationModal;
