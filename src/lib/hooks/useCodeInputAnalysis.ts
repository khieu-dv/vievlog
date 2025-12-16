import { useState, useEffect, useMemo } from 'react';
import { CodeInputAnalyzer, InputFormat } from '@/lib/utils/codeInputAnalyzer';

export interface UseCodeInputAnalysisReturn {
  inputFormat: InputFormat;
  isAnalyzing: boolean;
  inputHints: string;
  validateUserInput: (input: string) => { isValid: boolean; errors: string[] };
  generateSampleInput: () => string;
}

export function useCodeInputAnalysis(code: string, language: string): UseCodeInputAnalysisReturn {
  const [inputFormat, setInputFormat] = useState<InputFormat>({
    requirements: [],
    totalLines: 0,
    examples: [],
    errors: [],
    confidence: 0
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!code.trim() || !language) {
      setInputFormat({
        requirements: [],
        totalLines: 0,
        examples: [],
        errors: [],
        confidence: 0
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Debounce analysis to avoid excessive processing
    const timeoutId = setTimeout(() => {
      try {
        const format = CodeInputAnalyzer.analyzeCode(code, language);
        setInputFormat(format);
      } catch (error) {
        setInputFormat({
          requirements: [],
          totalLines: 0,
          examples: [],
          errors: [`Analysis failed: ${error}`],
          confidence: 0
        });
      } finally {
        setIsAnalyzing(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      setIsAnalyzing(false);
    };
  }, [code, language]);

  const inputHints = useMemo(() => {
    return CodeInputAnalyzer.generateInputHints(inputFormat);
  }, [inputFormat]);

  const validateUserInput = useMemo(() => {
    return (input: string) => {
      return CodeInputAnalyzer.validateInput(input, inputFormat);
    };
  }, [inputFormat]);

  const generateSampleInput = useMemo(() => {
    return () => {
      if (inputFormat.examples.length > 0) {
        // Return a random example
        const randomIndex = Math.floor(Math.random() * inputFormat.examples.length);
        return inputFormat.examples[randomIndex];
      }
      return '';
    };
  }, [inputFormat]);

  return {
    inputFormat,
    isAnalyzing,
    inputHints,
    validateUserInput,
    generateSampleInput
  };
}