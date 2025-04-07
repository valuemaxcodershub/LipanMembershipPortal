import { Modal } from "flowbite-react"; // Flowbite-React Modal
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import "@react-pdf-viewer/core/lib/styles/index.css"; // Core styles
import "@react-pdf-viewer/default-layout/lib/styles/index.css"; // Default viewer layout styles
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

interface ModalPropTypes {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
}

const PdfViewerModal = ({ isOpen, onClose, fileUrl }: ModalPropTypes) => {
     const toolbarPluginInstance = toolbarPlugin();
     const { Toolbar } = toolbarPluginInstance;
  return (
    <Modal
      show={isOpen}
      size="5xl"
      onClose={onClose}
      className="flex !h-full !w-full items-center justify-center" // Custom modal styles for fullscreen
    >
      {/* Custom Modal Content */}
      <div className="relative size-full rounded-lg bg-white shadow-lg">
        <button
          className="absolute right-4 top-4 z-50 rounded-full bg-gray-100 p-2 hover:bg-gray-200 focus:outline-none"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex h-full w-full flex-col">
          <div className="border-b bg-gray-100 p-4">
            <Toolbar />
          </div>
          <div className="flex-grow">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
            </Worker>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PdfViewerModal;
