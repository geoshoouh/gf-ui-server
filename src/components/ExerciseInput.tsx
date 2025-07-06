import React, { useState, ChangeEvent, FormEvent } from 'react';

type ExerciseRecord = {
  client: string;
  equipment: string;
  exercise: string;
  params: string[];
};

type ExerciseInputProps = {
  clients: string[];
  equipmentTypes: string[];
  exerciseTypes: string[];
  onSubmit: (record: ExerciseRecord) => void;
};

const ExerciseInput: React.FC<ExerciseInputProps> = ({
  clients,
  equipmentTypes,
  exerciseTypes,
  onSubmit,
}) => {
  const [formState, setFormState] = useState<ExerciseRecord>({
    client: '',
    equipment: '',
    exercise: '',
    params: ['', '', '', '', ''],
  });

  const exerciseParamLabels = [
    'Resistance',
    'Seat Setting',
    'Pad Setting',
    'Right Arm',
    'Left Arm'
  ];

  const handleInputChange = (index: number, value: string) => {
    const newParams = [...formState.params];
    newParams[index] = value;
    setFormState({ ...formState, params: newParams });
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-2">
              <label className="form-label mb-1">Client</label>
              <select
                className="form-select"
                name="client"
                value={formState.client}
                onChange={handleChange}
                required
              >
                <option value="">Client</option>
                {clients.map((client, idx) => (
                  <option key={idx} value={client}>
                    {client}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label mb-1">Equipment</label>
              <select
                className="form-select"
                name="equipment"
                value={formState.equipment}
                onChange={handleChange}
                required
              >
                <option value="">Equipment</option>
                {equipmentTypes.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label mb-1">Exercise</label>
              <select
                className="form-select"
                name="exercise"
                value={formState.exercise}
                onChange={handleChange}
                required
              >
                <option value="">Exercise</option>
                {exerciseTypes.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {formState.params.map((param, index) => (
              <div className="col-md-1" key={index}>
                <label className="form-label mb-1">{ exerciseParamLabels[index] }</label>
                <input
                  type="text"
                  className="form-control"
                  value={param}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </div>
            ))}

            <div className="col-md-auto">
              <button type="submit" className="btn btn-primary w-100">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ExerciseInput;
