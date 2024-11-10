import React, { useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Link,
} from "@nextui-org/react";
import { QRCodeCanvas } from "qrcode.react"; // Import QRCodeCanvas instead of default QRCode

export default function LinkModal({ flag, finalURL, expireAfterSeconds }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const qrCodeRef = useRef(null); // Ref for the QR Code canvas

  function calculateTime() {
    if (expireAfterSeconds !== "null")
      return (
        "Expires at " +
        new Date(new Date().getTime() + expireAfterSeconds * 1000).toString()
      );
    else return "Never Expires";
  }

  React.useEffect(() => {
    if (flag) onOpen();
  }, [flag, onOpen]);

  const copyUrl = () => {
    navigator.clipboard.writeText(finalURL);
    alert("Copied to Clipboard!");
  };

  const downloadQRCode = () => {
    const qrCodeURL = qrCodeRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = qrCodeURL;
    a.download = "qrcode.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <Modal isOpen={isOpen} backdrop="blur" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Successfully Shortened Link!
              </ModalHeader>
              <ModalBody>
                <b>{finalURL}</b>
                <br></br>
                {calculateTime()}
                <br />
                <QRCodeCanvas value={finalURL} size={128} ref={qrCodeRef} />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="success"
                  variant="ghost"
                  onPress={downloadQRCode}
                >
                  Download QR Code
                </Button>

                <Button
                  href={finalURL}
                  as={Link}
                  showAnchorIcon
                  variant="solid"
                  isExternal
                />

                <Button color="primary" variant="solid" onClick={copyUrl}>
                  Copy to Clipboard
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
