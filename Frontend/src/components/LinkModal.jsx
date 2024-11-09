import React from "react";
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

export default function LinkModal({ flag, finalURL, expireAfterSeconds }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="ghost" onPress={onClose}>
                  Close
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
