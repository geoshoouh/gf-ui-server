import React, { useState, ChangeEvent } from 'react';

interface BulkRecordUploadProps {
  endpoint: string;
  token: string;
}

interface UploadResponse {
  message: string;
  totalRecords?: number;
  successfulRecords?: number;
  failedRecords?: number;
  errors?: string[];
}

const BulkRecordUpload: React.FC<BulkRecordUploadProps> = ({
  endpoint,
  token,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    setError(null);
    
    try {
      const response = await fetch(`${endpoint}/trainer/download/upload-template`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'exercise_records_template.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else if (response.status === 401) {
        setError('Unauthorized: Invalid or missing authentication token. Please log in again.');
      } else if (response.status === 404) {
        setError('Template not found. Please contact support.');
      } else if (response.status === 500) {
        setError('Server error occurred while downloading template. Please try again later.');
      } else {
        setError(`Failed to download template: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error downloading template:', err);
      setError('Failed to download template. Please check your connection and try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validExtensions = ['.xlsx', '.xls'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        setError('Invalid file type. Please select an Excel file (.xlsx or .xls).');
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${endpoint}/trainer/bulk/upload/records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header - browser will set it with boundary for FormData
        },
        body: formData,
      });

      if (response.ok) {
        const data: UploadResponse = await response.json();
        setUploadResult(data);
        
        // Clear the file input
        setSelectedFile(null);
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } else if (response.status === 401) {
        setError('Unauthorized: Invalid or missing authentication token. Please log in again.');
      } else if (response.status === 404) {
        setError('Upload endpoint not found. Please contact support.');
      } else if (response.status === 500) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Server error occurred during upload. Please try again later.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || `Upload failed: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please check your connection and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-auto">
          <div className="card shadow-lg border-0">
            <div className="card-header text-white" style={{ backgroundColor: 'var(--primary-navy)' }}>
              <h4 className="mb-0">
                <i className="bi bi-upload me-2"></i>
                Bulk Record Upload
              </h4>
              <p className="mb-0 text-white-50">Upload exercise records from an Excel file</p>
            </div>
            
            <div className="card-body p-4">
              {/* Download Template Section */}
              <div className="mb-4">
                <h5 className="mb-3 text-primary">
                  <i className="bi bi-download me-2"></i>
                  Step 1: Download Template
                </h5>
                <p className="mb-3" style={{ color: 'var(--text-light)' }}>
                  Download the Excel template file to see the required format for bulk uploads.
                  The template includes column headers and an example row.
                </p>
                <button 
                  type="button" 
                  className="btn btn-outline-primary btn-lg shadow-sm"
                  onClick={handleDownloadTemplate}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-download me-2"></i>
                      Download Template
                    </>
                  )}
                </button>
              </div>

              <hr className="my-4" />

              {/* Upload File Section */}
              <div className="mb-4">
                <h5 className="mb-3 text-primary">
                  <i className="bi bi-upload me-2"></i>
                  Step 2: Upload File
                </h5>
                <p className="mb-3" style={{ color: 'var(--text-light)' }}>
                  Select an Excel file (.xlsx or .xls) containing exercise records to upload.
                </p>
                
                <div className="mb-3">
                  <label htmlFor="fileInput" className="form-label fw-bold text-primary">
                    <i className="bi bi-file-earmark-excel me-1"></i>
                    Select Excel File
                  </label>
                  <input
                    type="file"
                    className="form-control form-control-lg border-2"
                    id="fileInput"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  {selectedFile && (
                    <div className="mt-2" style={{ color: 'var(--text-light)' }}>
                      <i className="bi bi-check-circle me-1"></i>
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </div>
                  )}
                </div>

                <div className="d-grid">
                  <button 
                    type="button" 
                    className="btn btn-primary btn-lg shadow-sm"
                    onClick={handleUpload}
                    disabled={isUploading || !selectedFile}
                  >
                    {isUploading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-upload me-2"></i>
                        Upload Records
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <strong>Error:</strong> {error}
                </div>
              )}

              {/* Upload Result Display */}
              {uploadResult && (
                <div className="mt-4">
                  <h5 className="mb-3 text-primary">
                    <i className="bi bi-clipboard-check me-2"></i>
                    Upload Report
                  </h5>
                  
                  <div className="alert alert-info mb-3" role="alert">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>{uploadResult.message}</strong>
                  </div>

                  {uploadResult.totalRecords !== undefined && (
                    <div className="row g-3 mb-3">
                      <div className="col-md-4">
                        <div className="card border-primary">
                          <div className="card-body text-center">
                            <h6 className="card-subtitle mb-2" style={{ color: 'var(--text-light)' }}>Total Records</h6>
                            <h3 className="card-title text-primary">{uploadResult.totalRecords}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border-success">
                          <div className="card-body text-center">
                            <h6 className="card-subtitle mb-2" style={{ color: 'var(--text-light)' }}>Successful</h6>
                            <h3 className="card-title text-success">{uploadResult.successfulRecords || 0}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border-danger">
                          <div className="card-body text-center">
                            <h6 className="card-subtitle mb-2" style={{ color: 'var(--text-light)' }}>Failed</h6>
                            <h3 className="card-title text-danger">{uploadResult.failedRecords || 0}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <div className="alert alert-warning" role="alert">
                      <h6 className="alert-heading">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Errors Found:
                      </h6>
                      <ul className="mb-0">
                        {uploadResult.errors.map((errorMsg, index) => (
                          <li key={index}>{errorMsg}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {uploadResult.successfulRecords !== undefined && 
                   uploadResult.successfulRecords > 0 && 
                   (!uploadResult.failedRecords || uploadResult.failedRecords === 0) && (
                    <div className="alert alert-success" role="alert">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      All records were uploaded successfully!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkRecordUpload;
