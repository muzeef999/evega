import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Modal, Button } from "react-bootstrap";
import { GiCancel } from "react-icons/gi";
import { GrStatusGood } from "react-icons/gr";
import { FaDownload } from "react-icons/fa6";
import { AiOutlineFileDone } from "react-icons/ai";

const FileUpload = () => {
  const [fileData, setFileData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [hasHeaders, setHasHeaders] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [labels, setLabels] = useState({});
  const [jsonOutput, setJsonOutput] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setUploadedFile(file);
        setShowModal(true); // Show modal to ask if the file has headers
      }
    },
    accept: ".csv",
  });

  const processCSV = (csvString) => {
    const rows = csvString
      .trim()
      .split("\n")
      .map((row) => row.split(",").map((cell) => cell.trim()));

    if (rows.length === 0) return;

    if (hasHeaders) {
      setHeaders(rows[0]);
      setFileData(rows.slice(1));
    } else {
      setHeaders([]);
      setFileData(rows);
    }
  };

  const handleFileRead = () => {
    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvString = event.target.result;
      processCSV(csvString);
    };
    reader.readAsText(uploadedFile);
  };

  const handleModalClose = (selection) => {
    setHasHeaders(selection);
    setShowModal(false);
    handleFileRead();
  };

  const handleLabelChange = (column, label) => {
    setLabels((prev) => ({
      ...prev,
      [column]: label,
    }));
  };

  const handleDone = () => {
    const mappedJson = fileData[0].reduce((acc, _, index) => {
      const column = String.fromCharCode(65 + index); // Generate A, B, C...
      acc[column] = labels[column] || `No Label`;
      return acc;
    }, {});
    setJsonOutput(mappedJson);
  };

  const downloadJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(jsonOutput, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "output.json";
    link.click();
  };

  return (
    <div>
      {/* File Drop Area */}
      <div
        {...getRootProps()}
        className="file-dropzone"
        style={{
          border: "2px dotted #000",
          padding: "20px",
          marginBottom: "10px",
          borderRadius: "10px",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop your file here...</p>
        ) : (
          <p>
            Drag and drop a CSV file <b>or</b> click to upload
          </p>
        )}
      </div>

      {/* Modal to confirm if file has headers */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>File Header Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-between">
            <button
              className="yes"
              onClick={() => handleModalClose(true)}
            >
              <GrStatusGood /> Yes, Consider the 2<sup>nd</sup> row 
            </button>
            <button
              className="no"
              onClick={() => handleModalClose(false)}
            >
              <GiCancel /> No, Consider the 1<sup>st</sup> row 
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Table Display */}
      {fileData.length > 0 && (
        <div>
          <h4>CSV Data:</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Column</th>
                <th>Sample Value</th>
                <th>Label (Editable)</th>
              </tr>
            </thead>
            <tbody>
              {fileData[0].map((_, colIndex) => (
                <tr key={colIndex}>
                  <td>{String.fromCharCode(65 + colIndex)}</td>
                  <td>{fileData[0][colIndex]}</td>
                  <td>
                    <input
                      type="text"
                      placeholder="Enter label"
                      onChange={(e) =>
                        handleLabelChange(String.fromCharCode(65 + colIndex), e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            variant="primary"
            className="mt-3"
            onClick={handleDone}
            aria-label="Finalize Labels"
          >
            <AiOutlineFileDone /> Finalize
          </Button>
        </div>
      )}

      {/* JSON Output */}
      {jsonOutput && (
        <div>
          <h4>Generated JSON:</h4>
          <pre>{JSON.stringify(jsonOutput, null, 2)}</pre>
          <Button
            variant="success"
            className="mt-3"
            onClick={downloadJSON}
            aria-label="Download JSON"
          >
            <FaDownload /> Download JSON
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;