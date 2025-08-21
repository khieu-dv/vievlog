import { useState, useCallback } from 'react';
import { useCodeInputAnalysis } from './useCodeInputAnalysis';

interface UseInputPopupFlowReturn {
  isPopupOpen: boolean;
  shouldShowPopup: boolean;
  openInputPopup: () => void;
  closeInputPopup: () => void;
  handleInputComplete: (input: string) => void;
  handleInputSkip: () => void;
  inputFormat: any;
}

interface UseInputPopupFlowProps {
  code: string;
  language: string;
  onInputReady: (input: string) => void;
  onDirectRun: () => void;
}

export function useInputPopupFlow({
  code,
  language,
  onInputReady,
  onDirectRun
}: UseInputPopupFlowProps): UseInputPopupFlowReturn {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { inputFormat, isAnalyzing } = useCodeInputAnalysis(code, language);

  const shouldShowPopup = inputFormat.requirements.length > 0 && !isAnalyzing;

  const openInputPopup = useCallback(() => {
    if (shouldShowPopup) {
      setIsPopupOpen(true);
    } else {
      // No input required, run directly
      onDirectRun();
    }
  }, [shouldShowPopup, onDirectRun]);

  const closeInputPopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  const handleInputComplete = useCallback((input: string) => {
    onInputReady(input);
    setIsPopupOpen(false);
  }, [onInputReady]);

  const handleInputSkip = useCallback(() => {
    onInputReady(''); // Run with empty input
    setIsPopupOpen(false);
  }, [onInputReady]);

  return {
    isPopupOpen,
    shouldShowPopup,
    openInputPopup,
    closeInputPopup,
    handleInputComplete,
    handleInputSkip,
    inputFormat
  };
}