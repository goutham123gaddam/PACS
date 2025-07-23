import React, { useState, useEffect } from 'react';

interface MIPThicknessInputProps {
  currentThickness: number;
  minThickness: number;
  maxThickness: number;
  onThicknessChange: (thickness: number) => void;
  disabled?: boolean;
  className?: string;
}

const MIPThicknessInput: React.FC<MIPThicknessInputProps> = ({
  currentThickness,
  minThickness,
  maxThickness,
  onThicknessChange,
  disabled = false,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState(currentThickness.toString());
  const [isValid, setIsValid] = useState(true);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    setInputValue(currentThickness.toString());
  }, [currentThickness]);

  const validateThickness = (value: string): boolean => {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= minThickness && numValue <= maxThickness;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsValid(validateThickness(value));
  };

  const handleApply = () => {
    if (isValid) {
      const thickness = parseFloat(inputValue);
      onThicknessChange(thickness);
      setShowInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    } else if (e.key === 'Escape') {
      setInputValue(currentThickness.toString());
      setIsValid(true);
      setShowInput(false);
    }
  };

  const handleCancel = () => {
    setInputValue(currentThickness.toString());
    setIsValid(true);
    setShowInput(false);
  };

  return (
    <div className={`mip-thickness-control ${className}`}>
      {!showInput ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-white">
            Thickness: {currentThickness.toFixed(1)}mm
          </span>
          <button
            onClick={() => setShowInput(true)}
            disabled={disabled}
            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition-colors"
            title="Click to enter custom thickness"
          >
            ✏️
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-2 bg-gray-800 rounded border">
          <div className="flex flex-col gap-1">
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder={`${minThickness}-${maxThickness}mm`}
              className={`w-20 text-sm px-2 py-1 rounded ${
                !isValid ? 'border-red-500 bg-red-900' : 'border-blue-400 bg-gray-700'
              } text-white`}
              min={minThickness}
              max={maxThickness}
              step="0.1"
              autoFocus
            />
            {!isValid && (
              <span className="text-xs text-red-400">
                Range: {minThickness}-{maxThickness}mm
              </span>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleApply}
              disabled={!isValid}
              className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MIPThicknessInput;
