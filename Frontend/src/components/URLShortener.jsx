import React, { useState } from "react";
import { nanoid } from "nanoid";
import {
  Slider,
  Select,
  Tooltip,
  SelectItem,
  Button,
  Input,
} from "@nextui-org/react";
import LinkModal from "./LinkModal";

export default function URLShortener() {
  const [shortenedLength, setShortenedLength] = useState(5);
  const [expiryTime, setExpiryTime] = useState("null");
  const [isURLValid, setIsURLValid] = useState(true);
  const [originalURL, setOriginalURL] = useState("");
  const [shortenedURL, setShortenedURL] = useState(nanoid(shortenedLength));
  const [finalURL, setFinalURL] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formDetails, setFormDetails] = useState({
    shortURL: shortenedURL,
    longURL: originalURL,
    expireAfterSeconds: expiryTime,
  });

  const handleShortURLChange = (e) => {
    updateShortURL(e.target.value);
  };

  const handleSliderChange = (e) => {
    if (e !== shortenedLength) updateShortURL(nanoid(e));
  };

  function updateShortURL(value) {
    setShortenedURL(value);
    setShortenedLength(value.length);
    setFormDetails({
      ...formDetails,
      shortURL: value,
    });
  }

  const handleLongURLChange = (e) => {
    setOriginalURL(e.target.value);

    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

    setIsURLValid(urlPattern.test(e.target.value));

    if (urlPattern.test(e.target.value)) {
      setFormDetails({
        ...formDetails,
        longURL: e.target.value,
      });
    }
  };

  const handleExpiryTimeChange = (e) => {
    setExpiryTime(e.target.value);
    setFormDetails({
      ...formDetails,
      expireAfterSeconds: e.target.value,
    });
  };

  const ExpiryTimeSelector = () => {
    const expiryOptions = [
      { value: "null", label: "Never Expires" },
      { value: "60", label: "Expires After 1 Minute" },
      { value: "600", label: "Expires After 10 Minutes" },
      { value: "3600", label: "Expires After 1 Hour" },
      { value: "86400", label: "Expires After 1 Day" },
      { value: "604800", label: "Expires After 1 Week" },
      { value: "2629800", label: "Expires After 1 Month" },
    ];
    return (
      <>
        <Select
          label="Expires After"
          placeholder="Select an Expiration Time"
          variant="faded"
          name="expireAfterSeconds"
          onChange={handleExpiryTimeChange}
          selectedKeys={expiryTime ? [expiryTime] : ["null"]}
        >
          {expiryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </>
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setIsModalOpen(false);

    if (shortenedURL === "") updateShortURL(nanoid(5));

    if (formDetails.longURL !== "")
      try {
        setIsProcessing(true);

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/insert`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formDetails),
          }
        );

        if (!response.ok) {
          setIsProcessing(false);
          const errorData = await response.json();
          throw new Error(errorData.error);
        } else {
          setIsProcessing(false);
          setIsModalOpen(true);
          setFinalURL(
            `${process.env.REACT_APP_BACKEND_URL}/s/` + formDetails.shortURL
          );
        }
      } catch (error) {
        console.error("Error: ", error);
        alert(error.message || "Server Error Occurred!");
      }
    else {
      setIsURLValid(false);
    }
  };

  return (
    <>
      <form className="form flex flex-col gap-4" onSubmit={handleFormSubmit}>
        <Tooltip
          content="This is the URL you want to shorten"
          offset={20}
          placement="right-end"
          showArrow
          color="primary"
        >
          <Input
            key="longURL"
            type="url"
            label="Long URL"
            value={originalURL}
            onChange={handleLongURLChange}
            variant="faded"
            required
            className="w-full px-10"
            style={{ width: "30vw" }}
            size="md"
            color={!isURLValid ? "danger" : ""}
            errorMessage={!isURLValid && "Enter a valid URL"}
          />
        </Tooltip>
        <Tooltip
          content={
            <>
              Shortened would be:
              <b>
                {process.env.REACT_APP_BACKEND_URL}/s/{shortenedURL}
              </b>
            </>
          }
          offset={20}
          placement="right-end"
          showArrow
          color="default"
        >
          <Input
            key="shortURL"
            type="text"
            label="Shortened URL"
            value={shortenedURL}
            onChange={handleShortURLChange}
            variant="faded"
            required
            size="md"
          />
        </Tooltip>
        <Tooltip
          content="Change the Number of Characters used in the shortened link"
          offset={20}
          placement="right-end"
          showArrow
          color="default"
        >
          <Slider
            label={"Number of Characters"}
            maxValue={20}
            minValue={5}
            defaultValue={5}
            value={shortenedLength}
            onChange={handleSliderChange}
            size="md"
            showTooltip
          />
        </Tooltip>
        <ExpiryTimeSelector />

        <Button color="primary" type="submit" isLoading={isProcessing}>
          Shorten URL
        </Button>
      </form>

      <LinkModal
        flag={isModalOpen}
        finalURL={finalURL}
        expireAfterSeconds={expiryTime}
      />
    </>
  );
}
