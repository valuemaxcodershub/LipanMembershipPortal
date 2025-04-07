import { Modal, Button, Table, Dropdown } from "flowbite-react";
import { FiPrinter, FiDownload, FiX, FiImage } from "react-icons/fi";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Transaction } from "../../types/_all";
import { BiDownload, BiImage, BiSolidFilePdf } from "react-icons/bi";
import { Logo } from "./Logo";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionReceiptModal = ({
  isOpen,
  onClose,
  transaction,
}: ReceiptModalProps) => {
  const [isPrinting, setIsPrinting] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const getImageData = async (): Promise<
    | {
        canvas: HTMLCanvasElement;
        imgData: string;
      }
    | undefined
  > => {
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    console.log(imgData);
    return { canvas, imgData };
  };

  const handleDownloadPIC = async () => {
    if (printRef.current) {
      const result = await getImageData();
      const link = document.createElement("a");
      link.href = result?.imgData as string;
      link.download = `Transaction_Receipt_${transaction?.id}.png`;
      link.click();
    }
  };

  const handleDownloadPDF = async () => {
    const result = await getImageData();
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const aspectRatio =
      (result?.canvas.width as number) / (result?.canvas.height as number);
    const pdfHeight = (pdfWidth - 30) / aspectRatio;

    pdf.addImage(
      result?.imgData as string,
      "PNG",
      10,
      10,
      pdfWidth - 20,
      pdfHeight
    );
    pdf.save(`Transaction_Receipt_${transaction?.id}.pdf`);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <div className="flex justify-between w-full">
          <span className="text-xl font-semibold dark:text-white">
            Transaction Receipt
          </span>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div
          ref={printRef}
          className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="flex flex-col justify-center gap-2 items-center mb-6 divide-y divide-gray-200 dark:divide-gray-700">
            <Logo className="bg-blue-600 rounded-lg p-2 !h-11" />
            <div className="text-center">
              <h2 className="text-lg font-semibold dark:text-white">
                LIPAN Payments
              </h2>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Official Transaction Receipt
              </p>
            </div>
          </div>

          <Table>
            <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
              <Table.Row>
                <Table.Cell className="font-semibold">
                  Transaction ID:
                </Table.Cell>
                <Table.Cell>{transaction?.id}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="font-semibold">Date & Time:</Table.Cell>
                <Table.Cell>
                  {transaction?.date} at {transaction?.time}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="font-semibold">Amount Paid:</Table.Cell>
                <Table.Cell className="font-semibold text-green-600 dark:text-green-400">
                  {transaction?.amount}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="font-semibold">
                  Transaction Fee:
                </Table.Cell>
                <Table.Cell>{transaction?.fee}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="font-semibold">Total Amount:</Table.Cell>
                <Table.Cell className="font-bold text-blue-600 dark:text-blue-400">
                  {transaction?.total}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="font-semibold">
                  Payment Method:
                </Table.Cell>
                <Table.Cell>{transaction?.paymentMethod}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="font-semibold">Recipient:</Table.Cell>
                <Table.Cell>{transaction?.recipient}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="font-semibold">
                  Authorization Code:
                </Table.Cell>
                <Table.Cell>{transaction?.authCode}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="font-semibold">Status:</Table.Cell>
                <Table.Cell
                  className={`font-semibold ${transaction?.status === "Success" ? "text-green-500" : "text-red-500"}`}
                >
                  {transaction?.status}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Dropdown
          label={
            <Button size="sm" gradientDuoTone="purpleToBlue">
              <div className="flex justify-center items-center">
                <BiDownload className="mr-2 text-lg" />
              </div>
            </Button>
          }
          arrowIcon={false}
          inline
          className="!min-w-[200px] p-3"
        >
          <Button as={Dropdown.Item} color="gray" onClick={handleDownloadPIC}>
            <div className="flex justify-center items-center">
              <BiImage className="mr-2 text-lg" /> Save as PNG
            </div>
          </Button>
          <Dropdown.Divider />
          <Button as={Dropdown.Item} color="gray" onClick={handleDownloadPDF}>
            <div className="flex justify-center items-center">
              <BiSolidFilePdf className="mr-2 text-lg" /> Save as PDF
            </div>
          </Button>
        </Dropdown>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionReceiptModal;
