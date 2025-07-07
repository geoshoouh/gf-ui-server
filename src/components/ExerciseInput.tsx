import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import type { ExerciseRecord, Client } from '../types/Interfaces';

type ExerciseInputProps = {
  endpoint: string;
  token: string;
  onSubmit: (record: ExerciseRecord) => void;
};

const ExerciseInput: React.FC<ExerciseInputProps> = ({
  endpoint,
  token,
  onSubmit,
}) => {
  const [formState, setFormState] = useState<ExerciseRecord>({
    client: '',
    equipment: '',
    exercise: '',
    params: ['', '', '', '', ''],
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [equipmentTypes, setEquipmentTypes] = useState<string[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientLocked, setClientLocked] = useState(false);

  const exerciseParamLabels = [
    'Resistance',
    'Seat Setting',
    'Pad Setting',
    'Right Arm',
    'Left Arm'
  ];

  // Fetch data from server on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all data in a single request using the /trainer/get/all endpoint
        const response = await fetch(`${endpoint}/trainer/get/all`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Store full client objects
          const clientObjects = data.clients || [];
          
          setClients(clientObjects);
          setEquipmentTypes(data.equipmentTypes || []);
          setExerciseTypes(data.exerciseTypes || []);
        } else {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load exercise data. Please try again.');
        
        // Fallback to mock data for development
        setClients([
          { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
          { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
          { firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@example.com' },
          { firstName: 'Sarah', lastName: 'Wilson', email: 'sarah.wilson@example.com' },
          { firstName: 'Alex', lastName: 'Brown', email: 'alex.brown@example.com' },
          { firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@example.com' }
        ]);
        setEquipmentTypes(['ARX', 'NAUTILUS', 'KINESIS', 'KEISER', 'DUMBELL', 'BODY_WEIGHT']);
        setExerciseTypes(['BICEP_CURL', 'LEG_PRESS', 'SQUAT', 'CHEST_PRESS', 'REVERSE_FLY', 'OVERHEAD_PRESS']);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint, token]);

  const handleInputChange = (index: number, value: string) => {
    const newParams = [...formState.params];
    newParams[index] = value;
    setFormState({ ...formState, params: newParams });
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
    // Only fetch latest record if client is locked and all fields are selected
    if (clientLocked && name !== 'client') {
      const newFormState = { ...formState, [name]: value };
      if (newFormState.client && newFormState.equipment && newFormState.exercise) {
        fetchLatestRecord(newFormState.client, newFormState.equipment, newFormState.exercise);
      } else {
        setFormState(prev => ({ ...prev, params: ['', '', '', '', ''] }));
      }
    }
  };

  const handleClientSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormState({
      client: e.target.value,
      equipment: '',
      exercise: '',
      params: ['', '', '', '', ''],
    });
    setClientLocked(false);
  };

  const handleLockClient = () => {
    if (formState.client) {
      setClientLocked(true);
    }
  };

  const handleUnlockClient = () => {
    setClientLocked(false);
    setFormState({
      client: formState.client,
      equipment: '',
      exercise: '',
      params: ['', '', '', '', ''],
    });
  };

  const fetchLatestRecord = async (client: string, equipment: string, exercise: string) => {
    try {
      const response = await fetch(`${endpoint}/trainer/get/record/latest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client: {
            email: client
          },
          equipmentType: equipment,
          exerciseType: exercise
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.exerciseRecord) {
          // Auto-populate parameters with latest record values
          const latestParams = [
            data.exerciseRecord.resistance?.toString() || '',
            data.exerciseRecord.seatSetting?.toString() || '',
            data.exerciseRecord.padSetting?.toString() || '',
            data.exerciseRecord.rightArm?.toString() || '',
            data.exerciseRecord.leftArm?.toString() || ''
          ];
          setFormState(prev => ({ ...prev, params: latestParams }));
        } else {
          // Clear parameters if no record found
          setFormState(prev => ({ ...prev, params: ['', '', '', '', ''] }));
        }
      } else {
        // Clear parameters if request failed
        setFormState(prev => ({ ...prev, params: ['', '', '', '', ''] }));
      }
    } catch (error) {
      console.error('Error fetching latest record:', error);
      // Clear parameters if fetch fails
      setFormState(prev => ({ ...prev, params: ['', '', '', '', ''] }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formState);
      
      // Keep client, equipment, and exercise selected, but clear parameters
      setFormState({
        client: formState.client, // Keep the same client
        equipment: formState.equipment, // Keep the same equipment
        exercise: formState.exercise, // Keep the same exercise
        params: ['', '', '', '', ''],
      });
      // Keep clientLocked as true so the form stays open
    } catch (err) {
      console.error('Error submitting exercise record:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading exercise data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
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
                <i className="bi bi-plus-circle me-2"></i>
                Exercise Record
              </h4>
              <p className="mb-0 text-white-50">Log your exercise data during workout</p>
            </div>
            <div className="card-body p-4">
              {/* Client Selection Row */}
              <div className="mb-4">
                <label className="form-label fw-bold text-primary">
                  <i className="bi bi-person me-1"></i>
                  Client
                </label>
                <div className="d-flex align-items-center gap-3">
                  <select
                    className="form-select form-select-lg border-2"
                    name="client"
                    value={formState.client}
                    onChange={handleClientSelect}
                    disabled={clientLocked}
                    required
                    style={{ 
                      width: 'auto',
                      minWidth: '250px'
                    }}
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
                    {!clientLocked && (
                      <button
                        type="button"
                        className="btn btn-lg d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ 
                          backgroundColor: '#FFD700', 
                          color: 'var(--primary-navy)', 
                          fontWeight: 700, 
                          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)', 
                          border: '2px solid #FFD700',
                          width: '60px',
                          height: '48px'
                        }}
                        onClick={handleLockClient}
                        disabled={!formState.client}
                      >
                        <i className="bi bi-unlock-fill"></i>
                      </button>
                    )}
                    {clientLocked && (
                      <button
                        type="button"
                        className="btn btn-lg d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ 
                          backgroundColor: '#FFD700', 
                          color: 'var(--primary-navy)', 
                          fontWeight: 700, 
                          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)', 
                          border: '2px solid #FFD700',
                          width: '60px',
                          height: '48px'
                        }}
                        onClick={handleUnlockClient}
                      >
                        <i className="bi bi-lock-fill"></i>
                      </button>
                    )}
                  </div>
                </div>
              {/* Only show the rest of the form if client is locked */}
              {clientLocked && (
                <form onSubmit={handleSubmit}>
                  {/* Main Selection Row (equipment, exercise) */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-primary">
                        <i className="bi bi-gear me-1"></i>
                        Equipment
                      </label>
                      <select
                        className="form-select form-select-lg border-2"
                        name="equipment"
                        value={formState.equipment}
                        onChange={handleChange}
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
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-primary">
                        <i className="bi bi-activity me-1"></i>
                        Exercise
                      </label>
                      <select
                        className="form-select form-select-lg border-2"
                        name="exercise"
                        value={formState.exercise}
                        onChange={handleChange}
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
                  {/* Parameters Section */}
                  <div className="mb-4">
                    <h5 className="text-primary mb-3">
                      <i className="bi bi-sliders me-2"></i>
                      Exercise Parameters
                    </h5>
                    <div className="row g-3">
                      {formState.params.map((param, index) => (
                        <div className="col-md-2 col-sm-4" key={index}>
                          <label className="form-label fw-semibold text-secondary small">
                            {exerciseParamLabels[index]}
                          </label>
                          <input
                            type="text"
                            className="form-control border-2"
                            placeholder="Value"
                            value={param}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Submit Button */}
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg shadow-sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Save Exercise Record
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseInput;
