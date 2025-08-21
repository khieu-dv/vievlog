import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Play, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { InputRequirement } from '~/lib/utils/codeInputAnalyzer';

interface InputStep {
  requirement: InputRequirement;
  value: string;
  isValid: boolean;
  error?: string;
}

interface InputPopupSequenceProps {
  requirements: InputRequirement[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: (finalInput: string) => void;
  onSkip: () => void;
  examples?: string[];
}

export const InputPopupSequence: React.FC<InputPopupSequenceProps> = ({
  requirements,
  isOpen,
  onClose,
  onComplete,
  onSkip,
  examples = []
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<InputStep[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize steps when requirements change OR when popup opens
  useEffect(() => {
    if (requirements.length > 0 && isOpen) {
      const initialSteps: InputStep[] = requirements.map(req => ({
        requirement: req,
        value: '',
        isValid: true,
        error: undefined
      }));
      setSteps(initialSteps);
      setCurrentStep(0);
      setIsCompleted(false);
    }
  }, [requirements, isOpen]);

  const currentInputStep = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  // Don't render if no requirements, not open, or current step is not ready
  if (!isOpen || requirements.length === 0 || !currentInputStep) {
    return null;
  }

  const validateInput = (value: string, requirement: InputRequirement): { isValid: boolean; error?: string } => {
    if (!value.trim()) {
      return { isValid: false, error: 'This field is required' };
    }

    if (requirement.isArray) {
      const values = value.trim().split(/\s+/);
      for (const val of values) {
        const validation = validateSingleValue(val, requirement.type);
        if (!validation.isValid) {
          return { isValid: false, error: `Invalid value "${val}": ${validation.error}` };
        }
      }
      return { isValid: true };
    } else {
      return validateSingleValue(value.trim(), requirement.type);
    }
  };

  const validateSingleValue = (value: string, type: InputRequirement['type']): { isValid: boolean; error?: string } => {
    switch (type) {
      case 'int':
        if (!/^-?\d+$/.test(value) || isNaN(parseInt(value))) {
          return { isValid: false, error: 'Must be a valid integer' };
        }
        break;
      case 'float':
        if (!/^-?\d*\.?\d+([eE][+-]?\d+)?$/.test(value) || isNaN(parseFloat(value))) {
          return { isValid: false, error: 'Must be a valid number' };
        }
        break;
      case 'char':
        if (value.length !== 1) {
          return { isValid: false, error: 'Must be exactly one character' };
        }
        break;
      case 'string':
      case 'line':
        // Any non-empty string is valid
        break;
    }
    return { isValid: true };
  };

  const handleInputChange = (value: string) => {
    const validation = validateInput(value, currentInputStep.requirement);
    
    setSteps(prev => prev.map((step, index) => 
      index === currentStep 
        ? { ...step, value, isValid: validation.isValid, error: validation.error }
        : step
    ));
  };

  const handleNext = () => {
    if (!currentInputStep.isValid) return;
    
    if (isLastStep) {
      // Complete the sequence
      const finalInput = steps.map(step => step.value).join('\n');
      setIsCompleted(true);
      setTimeout(() => {
        onComplete(finalInput);
        onClose();
      }, 1000);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkipAll = () => {
    onSkip();
    onClose();
  };

  const getPlaceholderText = (requirement: InputRequirement): string => {
    if (requirement.isArray) {
      switch (requirement.type) {
        case 'int':
          return 'Enter integers separated by spaces (e.g., 1 2 3 4)';
        case 'float':
          return 'Enter numbers separated by spaces (e.g., 1.5 2.7 3.14)';
        default:
          return 'Enter values separated by spaces';
      }
    } else {
      switch (requirement.type) {
        case 'int':
          return 'Enter an integer (e.g., 42)';
        case 'float':
          return 'Enter a number (e.g., 3.14)';
        case 'char':
          return 'Enter a single character (e.g., A)';
        case 'line':
          return 'Enter a line of text';
        default:
          return 'Enter a value';
      }
    }
  };

  const getSampleValue = (requirement: InputRequirement): string => {
    if (requirement.isArray) {
      switch (requirement.type) {
        case 'int':
          return '1 2 3 4 5';
        case 'float':
          return '1.5 2.7 3.14';
        default:
          return 'apple banana cherry';
      }
    } else {
      switch (requirement.type) {
        case 'int':
          return '42';
        case 'float':
          return '3.14';
        case 'char':
          return 'A';
        case 'line':
          return 'Hello World';
        default:
          return 'example';
      }
    }
  };

  const useSample = () => {
    const sampleValue = getSampleValue(currentInputStep.requirement);
    handleInputChange(sampleValue);
  };

  if (isCompleted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Input Complete!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            All inputs have been collected. Running your code...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Program Input
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {currentInputStep.requirement.description || `Input for ${currentInputStep.requirement.name}`}
            </label>
            
            {currentInputStep.requirement.isArray && (
              <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                  <Lightbulb className="w-4 h-4" />
                  <span>Enter multiple values separated by spaces</span>
                </div>
              </div>
            )}

            <div className="relative">
              <textarea
                value={currentInputStep.value}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={getPlaceholderText(currentInputStep.requirement)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                  currentInputStep.isValid 
                    ? 'border-gray-300 dark:border-gray-600' 
                    : 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                rows={currentInputStep.requirement.isArray ? 3 : 1}
                autoFocus
              />
              
              {/* Use Sample Button */}
              <button
                onClick={useSample}
                className="absolute top-2 right-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-2 py-1 rounded transition-colors"
              >
                Use sample
              </button>
            </div>

            {/* Error Message */}
            {!currentInputStep.isValid && currentInputStep.error && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>{currentInputStep.error}</span>
              </div>
            )}

            {/* Type Info */}
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Expected type: {currentInputStep.requirement.type}
              {currentInputStep.requirement.isArray && ' (array)'}
            </div>
          </div>

          {/* Examples */}
          {examples.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 font-mono text-sm">
                {getSampleValue(currentInputStep.requirement)}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={handleSkipAll}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Skip all inputs
              </button>
            </div>
            
            <div className="flex gap-2">
              {!isFirstStep && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
              )}
              
              <button
                onClick={handleNext}
                disabled={!currentInputStep.isValid}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {isLastStep ? 'Run Code' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};