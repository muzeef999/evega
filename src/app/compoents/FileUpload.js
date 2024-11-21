import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Modal, Button, Alert } from "react-bootstrap";
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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (fileData.length === 0) {
      setErrorMessage("No data available in the CSV file.");
    } else {
      setErrorMessage(""); // Clear the error when fileData is populated
    }
  }, [fileData]);

  useEffect(() => {
    // Trigger file read after hasHeaders has been set
    if (hasHeaders !== null && uploadedFile) {
      handleFileRead();
    }
  }, [hasHeaders]);  // This ensures file is processed after hasHeaders state changes

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        if (file.type !== "text/csv") {
          setErrorMessage("Please upload a valid CSV file.");
          setUploadedFile(null);
          setFileData([]);
          return;
        }
        setErrorMessage("");
        setUploadedFile(file);
        setShowModal(true);
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
      if (!csvString.trim()) {
        setErrorMessage("The file is empty. Please upload a valid CSV file.");
        return;
      }
      processCSV(csvString);
    };

    reader.onerror = (error) => {
      setErrorMessage("Error reading the file. Please try again" + error);
    };
    reader.readAsText(uploadedFile);
  };

  const handleModalClose = (selection) => {
    setHasHeaders(selection);
    setShowModal(false);
  };

  // Generate labels like A, B, ..., Z, AA, AB, ...
  const generateExcelColumnLabels = (index) => {
    let label = "";
    while (index >= 0) {
      label = String.fromCharCode((index % 26) + 65) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  };

  const handleLabelChange = (column, label) => {
    setLabels((prev) => ({
      ...prev,
      [column]: label,
    }));
  };

  const handleDone = () => {
    const mappedJson = fileData[0].reduce((acc, _, index) => {
      const column = generateExcelColumnLabels(index);
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
          <p>Drag and drop a CSV file <b>or</b> click to upload</p>
        )}
      </div>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <h6>Does your file have headers in the first row of the sheet?</h6>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-between">
            <button className="no" onClick={() => handleModalClose(true)}>
            <GiCancel /> No, Consider the 2<sup>nd</sup> row
            </button>
            <button className="yes" onClick={() => handleModalClose(false)}>
              
              <GrStatusGood /> Yes, Consider the 1<sup>st</sup> row
            </button>
          </div>
        </Modal.Body>
      </Modal>

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
                  <td>{generateExcelColumnLabels(colIndex)}</td>
                  <td>{fileData[0][colIndex]}</td>
                  <td>
                    <input
                      type="text"
                      placeholder="Enter label"
                      onChange={(e) =>
                        handleLabelChange(
                          generateExcelColumnLabels(colIndex),
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="primary" className="mt-3" onClick={handleDone}>
            <AiOutlineFileDone /> Finalize
          </Button>
        </div>
      )}

      {jsonOutput && (
        <div>
          <h4>Generated JSON:</h4>
          <pre>{JSON.stringify(jsonOutput, null, 2)}</pre>
          <Button variant="success" className="mt-3" onClick={downloadJSON}>
            <FaDownload /> Download JSON
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
