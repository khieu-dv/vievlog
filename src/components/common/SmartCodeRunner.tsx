import React from 'react';
import { Play } from 'lucide-react';
import { InputPopupSequence } from './InputPopupSequence';
import { useInputPopupFlow } from '~/lib/hooks/useInputPopupFlow';

interface SmartCodeRunnerProps {
  code: string;
  language: string;
  onRun: (input: string) => void;
  isRunning?: boolean;
  disabled?: boolean;
  className?: string;
  buttonText?: string;
  children?: React.ReactNode;
}

export const SmartCodeRunner: React.FC<SmartCodeRunnerProps> = ({
  code,
  language,
  onRun,
  isRunning = false,
  disabled = false,
  className = "",
  buttonText = "Run Code",
  children
}) => {
  const {
    isPopupOpen,
    shouldShowPopup,
    openInputPopup,
    closeInputPopup,
    handleInputComplete,
    handleInputSkip,
    inputFormat
  } = useInputPopupFlow({
    code,
    language,
    onInputReady: (input) => onRun(input),
    onDirectRun: () => onRun('')
  });

  const handleRunClick = () => {
    if (disabled || isRunning) return;
    openInputPopup();
  };

  return (
    <>
      {/* Run Button or Custom Trigger */}
      {children ? (
        <div onClick={handleRunClick} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <button
          onClick={handleRunClick}
          disabled={disabled || isRunning}
          className={`
            flex items-center gap-2 text-white rounded font-medium transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
        >
          <Play className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Running...' : buttonText}
          {shouldShowPopup && (
            <span className="ml-1 px-1.5 py-0.5 bg-blue-500 text-xs rounded-full">
              {inputFormat.requirements.length}
            </span>
          )}
        </button>
      )}

      {/* Input Popup Sequence */}
      <InputPopupSequence
        requirements={inputFormat.requirements}
        isOpen={isPopupOpen}
        onClose={closeInputPopup}
        onComplete={handleInputComplete}
        onSkip={handleInputSkip}
        examples={inputFormat.examples}
      />
    </>
  );
};