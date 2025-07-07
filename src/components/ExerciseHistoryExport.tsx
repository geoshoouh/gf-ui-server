import React, { useState, useEffect, ChangeEvent } from 'react';
import type { Client } from '../types/Interfaces';

interface ExerciseHistoryExportProps {
  endpoint: string;
  token: string;
}

interface ExerciseRecord {
  id: number;
  client: Client;
  equipmentType: string;
  exercise: string;
  resistance?: number;
  seatSetting?: number;
  padSetting?: number;
  rightArm?: number;
  leftArm?: number;
  dateTime: string;
}

interface HistoryResponse {
  message: string;
  exerciseRecords: ExerciseRecord[];
}

const ExerciseHistoryExport: React.FC<ExerciseHistoryExportProps> = ({
  endpoint,
  token,
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [equipmentTypes, setEquipmentTypes] = useState<string[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch dropdown data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${endpoint}/trainer/get/all`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setClients(data.clients || []);
          setEquipmentTypes(data.equipmentTypes || []);
          setExerciseTypes(data.exerciseTypes || []);
        } else {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        
        // Fallback to mock data for development
        setClients([
          { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
          { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
        ]);
        setEquipmentTypes(['ARX', 'NAUTILUS', 'KINESIS', 'KEISER', 'DUMBELL', 'BODY_WEIGHT']);
        setExerciseTypes(['BICEP_CURL', 'LEG_PRESS', 'SQUAT', 'CHEST_PRESS', 'REVERSE_FLY', 'OVERHEAD_PRESS']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint, token]);

  const handleExport = async () => {
    if (!selectedClient || !selectedEquipment || !selectedExercise || !fromDate) {
      setError('Please fill in all fields before exporting.');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      // Convert date to Unix timestamp (milliseconds)
      const timestamp = new Date(fromDate).getTime();

      const response = await fetch(`${endpoint}/trainer/get/record/history`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client: {
            email: selectedClient
          },
          equipmentType: selectedEquipment,
          exerciseType: selectedExercise,
          afterDate: timestamp
        }),
      });

      if (response.ok) {
        const data: HistoryResponse = await response.json();
        
        if (data.exerciseRecords && data.exerciseRecords.length > 0) {
          // Generate CSV content
          const csvContent = generateCSV(data.exerciseRecords);
          
          // Create and download the file
          downloadCSV(csvContent, `exercise_history_${selectedClient}_${selectedEquipment}_${selectedExercise}.csv`);
        } else {
          setError('No exercise records found for the selected criteria.');
        }
      } else {
        throw new Error(`Failed to fetch history: ${response.status}`);
      }
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const generateCSV = (records: ExerciseRecord[]): string => {
    const headers = [
      'Date/Time',
      'Client',
      'Equipment',
      'Exercise',
      'Resistance',
      'Seat Setting',
      'Pad Setting',
      'Right Arm',
      'Left Arm'
    ];

    const rows = records.map(record => [
      new Date(record.dateTime).toLocaleString(),
      `${record.client.lastName || ''}, ${record.client.firstName || ''}`.trim(),
      record.equipmentType,
      record.exercise,
      record.resistance || '',
      record.seatSetting || '',
      record.padSetting || '',
      record.rightArm || '',
      record.leftArm || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading export data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-auto">
          <div className="card shadow-lg border-0">
            <div className="card-header text-white" style={{ backgroundColor: 'var(--primary-navy)' }}>
              <h4 className="mb-0">
                <i className="bi bi-download me-2"></i>
                Export Exercise History
              </h4>
              <p className="mb-0 text-white-50">Download historical exercise data as CSV</p>
            </div>
            
            <div className="card-body p-4">
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold text-primary">
                    <i className="bi bi-person me-1"></i>
                    Client
                  </label>
                  <select
                    className="form-select form-select-lg border-2"
                    value={selectedClient}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedClient(e.target.value)}
                    required
                  >
                    <option value="">Select Client</option>
                    {clients.map((client, idx) => (
                      <option key={idx} value={client.email || ''}>
                        {client.lastName && client.firstName
                          ? `${client.lastName}, ${client.firstName}`
                          : client.email || 'Unknown Client'
                        }
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-primary">
                    <i className="bi bi-calendar me-1"></i>
                    From Date
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-lg border-2"
                    value={fromDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFromDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold text-primary">
                    <i className="bi bi-gear me-1"></i>
                    Equipment
                  </label>
                  <select
                    className="form-select form-select-lg border-2"
                    value={selectedEquipment}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedEquipment(e.target.value)}
                    required
                  >
                    <option value="">Select Equipment</option>
                    {equipmentTypes.map((type, idx) => (
                      <option key={idx} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-primary">
                    <i className="bi bi-activity me-1"></i>
                    Exercise
                  </label>
                  <select
                    className="form-select form-select-lg border-2"
                    value={selectedExercise}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedExercise(e.target.value)}
                    required
                  >
                    <option value="">Select Exercise</option>
                    {exerciseTypes.map((type, idx) => (
                      <option key={idx} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="alert alert-warning mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <div className="d-grid">
                <button 
                  type="button" 
                  className="btn btn-primary btn-lg shadow-sm"
                  onClick={handleExport}
                  disabled={isExporting || !selectedClient || !selectedEquipment || !selectedExercise || !fromDate}
                >
                  {isExporting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-download me-2"></i>
                      Export to CSV
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseHistoryExport; 