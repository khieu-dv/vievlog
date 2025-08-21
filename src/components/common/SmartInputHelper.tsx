import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, HelpCircle, Lightbulb, Copy, RefreshCw } from 'lucide-react';
import { useCodeInputAnalysis } from '~/lib/hooks/useCodeInputAnalysis';

interface SmartInputHelperProps {
  code: string;
  language: string;
  input: string;
  onInputChange: (input: string) => void;
  className?: string;
}

export const SmartInputHelper: React.FC<SmartInputHelperProps> = ({
  code,
  language,
  input,
  onInputChange,
  className = ""
}) => {
  const { inputFormat, isAnalyzing, inputHints, validateUserInput, generateSampleInput } = useCodeInputAnalysis(code, language);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[] }>({ isValid: true, errors: [] });
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    if (input.trim()) {
      const result = validateUserInput(input);
      setValidationResult(result);
    } else {
      setValidationResult({ isValid: true, errors: [] });
    }
  }, [input, validateUserInput]);

  const handleGenerateSample = () => {
    const sample = generateSampleInput();
    if (sample) {
      onInputChange(sample);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const hasRequirements = inputFormat.requirements.length > 0;
  const hasValidationErrors = !validationResult.isValid && validationResult.errors.length > 0;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Analysis Status */}
      {isAnalyzing && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Analyzing code for input requirements...</span>
        </div>
      )}

      {/* Input Requirements Detection */}
      {hasRequirements && !isAnalyzing && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              Input Format Detected
            </h4>
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
              {Math.round(inputFormat.confidence * 100)}% confidence
            </span>
          </div>
          
          <div className="text-sm text-blue-800 dark:text-blue-200 mb-3">
            <div className="font-medium mb-2">Expected Input:</div>
            {inputFormat.requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></span>
                <span>{req.description}</span>
                {req.isArray && <span className="text-xs bg-blue-200 dark:bg-blue-800 px-1 rounded">array</span>}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 flex items-center gap-1"
            >
              <HelpCircle className="h-3 w-3" />
              {showHints ? 'Hide' : 'Show'} detailed hints
            </button>
            {inputFormat.examples.length > 0 && (
              <button
                onClick={handleGenerateSample}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 flex items-center gap-1"
              >
                <Lightbulb className="h-3 w-3" />
                Generate sample input
              </button>
            )}
          </div>

          {showHints && (
            <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/50 rounded border text-xs text-blue-800 dark:text-blue-200">
              <div className="font-medium mb-2">Input Format Guide:</div>
              <pre className="whitespace-pre-wrap">{inputHints}</pre>
            </div>
          )}
        </div>
      )}

      {/* Sample Examples */}
      {inputFormat.examples.length > 0 && hasRequirements && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sample Inputs:</span>
          </div>
          <div className="space-y-2">
            {inputFormat.examples.slice(0, 2).map((example, index) => (
              <div key={index} className="group relative">
                <pre className="text-xs bg-white dark:bg-gray-800 border rounded p-2 font-mono text-gray-800 dark:text-gray-200">
                  {example}
                </pre>
                <button
                  onClick={() => copyToClipboard(example)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Copy to clipboard"
                >
                  <Copy className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {hasValidationErrors && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h4 className="font-medium text-red-900 dark:text-red-100">Input Validation Errors</h4>
          </div>
          <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
            {validationResult.errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-xs text-red-700 dark:text-red-300">
            💡 Please fix these errors before running your code to avoid issues with Judge0.
          </div>
        </div>
      )}

      {/* Analysis Errors */}
      {inputFormat.errors.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Analysis Warnings</h4>
          </div>
          <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
            {inputFormat.errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1 h-1 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No Requirements Detected */}
      {!hasRequirements && !isAnalyzing && !inputFormat.errors.length && (
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h4 className="font-medium text-gray-700 dark:text-gray-300">No Input Requirements Detected</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your code doesn't seem to require any specific input format. You can enter any input or leave it empty.
          </p>
        </div>
      )}
    </div>
  );
};