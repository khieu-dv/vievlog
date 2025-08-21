export interface InputRequirement {
  type: 'int' | 'float' | 'string' | 'char' | 'line';
  name?: string;
  count?: number;
  isArray?: boolean;
  description?: string;
}

export interface InputFormat {
  requirements: InputRequirement[];
  totalLines: number;
  examples: string[];
  errors: string[];
  confidence: number;
}

export class CodeInputAnalyzer {
  private static cPatterns = {
    scanf: /scanf\s*\(\s*["']([^"']+)["']\s*,\s*([^)]+)\)/g,
    scanfSingle: /scanf\s*\(\s*["']([^"']+)["']/g,
  };

  private static cppPatterns = {
    cin: /cin\s*>>\s*([a-zA-Z_][a-zA-Z0-9_]*(?:\[[^\]]*\])?)/g,
    cinMultiple: /cin\s*>>\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*>>\s*([a-zA-Z_][a-zA-Z0-9_]*)/g,
  };

  private static pythonPatterns = {
    input: /(\w+)\s*=\s*input\s*\(\s*([^)]*)\s*\)/g,
    intInput: /(\w+)\s*=\s*int\s*\(\s*input\s*\(\s*([^)]*)\s*\)\s*\)/g,
    floatInput: /(\w+)\s*=\s*float\s*\(\s*input\s*\(\s*([^)]*)\s*\)\s*\)/g,
    splitInput: /(\w+)\s*=\s*input\s*\(\s*([^)]*)\s*\)\.split\s*\(\s*([^)]*)\s*\)/g,
    mapInput: /(\w+)\s*=\s*(list\s*\(\s*)?map\s*\(\s*(\w+)\s*,\s*input\s*\(\s*([^)]*)\s*\)\.split\s*\(\s*([^)]*)\s*\)\s*(\))?/g,
  };

  private static javaPatterns = {
    scannerInt: /(\w+)\s*=\s*(\w+)\.nextInt\s*\(\s*\)/g,
    scannerDouble: /(\w+)\s*=\s*(\w+)\.nextDouble\s*\(\s*\)/g,
    scannerLine: /(\w+)\s*=\s*(\w+)\.nextLine\s*\(\s*\)/g,
    scannerString: /(\w+)\s*=\s*(\w+)\.next\s*\(\s*\)/g,
  };

  private static jsPatterns = {
    readline: /const\s+(\w+)\s*=\s*readline\s*\(\s*\)/g,
    prompt: /(\w+)\s*=\s*prompt\s*\(\s*([^)]*)\s*\)/g,
    processArgv: /process\.argv\[(\d+)\]/g,
    parseInt: /parseInt\s*\(\s*readline\s*\(\s*\)\s*\)/g,
    parseFloat: /parseFloat\s*\(\s*readline\s*\(\s*\)\s*\)/g,
  };

  private static kotlinPatterns = {
    readLine: /val\s+(\w+)\s*=\s*readLine\s*\(\s*\)/g,
    readLineInt: /val\s+(\w+)\s*=\s*readLine\s*\(\s*\)!!\s*\.toInt\s*\(\s*\)/g,
    readLineDouble: /val\s+(\w+)\s*=\s*readLine\s*\(\s*\)!!\s*\.toDouble\s*\(\s*\)/g,
    readLineSplit: /val\s+(\w+)\s*=\s*readLine\s*\(\s*\)!!\s*\.split\s*\(\s*([^)]*)\s*\)/g,
    readLineMap: /val\s+(\w+)\s*=\s*readLine\s*\(\s*\)!!\s*\.split\s*\(\s*([^)]*)\s*\)\.map\s*\{\s*it\.to(\w+)\s*\(\s*\)\s*\}/g,
  };

  private static csharpPatterns = {
    consoleReadLine: /(\w+)\s*=\s*Console\.ReadLine\s*\(\s*\)/g,
    intParse: /(\w+)\s*=\s*int\.Parse\s*\(\s*Console\.ReadLine\s*\(\s*\)\s*\)/g,
    doubleParse: /(\w+)\s*=\s*double\.Parse\s*\(\s*Console\.ReadLine\s*\(\s*\)\s*\)/g,
    convertToInt: /(\w+)\s*=\s*Convert\.ToInt32\s*\(\s*Console\.ReadLine\s*\(\s*\)\s*\)/g,
    convertToDouble: /(\w+)\s*=\s*Convert\.ToDouble\s*\(\s*Console\.ReadLine\s*\(\s*\)\s*\)/g,
    split: /(\w+)\s*=\s*Console\.ReadLine\s*\(\s*\)\.Split\s*\(\s*([^)]*)\s*\)/g,
  };

  private static goPatterns = {
    scanf: /fmt\.Scanf\s*\(\s*[\"']([^\"']+)[\"']\s*,\s*([^)]+)\s*\)/g,
    scanln: /fmt\.Scanln\s*\(\s*([^)]+)\s*\)/g,
    scan: /fmt\.Scan\s*\(\s*([^)]+)\s*\)/g,
    scanInt: /var\s+(\w+)\s+int[^;]*fmt\.Scan.*&(\w+)/g,
    scanFloat: /var\s+(\w+)\s+float[^;]*fmt\.Scan.*&(\w+)/g,
    scanString: /var\s+(\w+)\s+string[^;]*fmt\.Scan.*&(\w+)/g,
  };

  private static rustPatterns = {
    // Match: let mut variable = String::new();
    stringNew: /let\s+mut\s+(\w+)\s*=\s*String::new\s*\(\s*\)/g,
    // Match: io::stdin().read_line(&mut variable)
    readLine: /io::stdin\s*\(\s*\)\.read_line\s*\(\s*&mut\s+(\w+)\s*\)/g,
    // Match: let variable: type = other_var.trim().parse()
    parseInput: /let\s+(\w+):\s*(\w+)\s*=\s*(\w+)\.trim\s*\(\s*\)\.parse\s*\(\s*\)/g,
    // Match split_whitespace patterns
    splitWhitespace: /let\s+(\w+):\s*Vec<(\w+)>\s*=\s*(\w+)\s*\.split_whitespace\s*\(\s*\)\.map\s*\(\s*\|x\|\s*x\.parse\s*\(\s*\)\.unwrap\s*\(\s*\)\s*\)\.collect\s*\(\s*\)/g,
  };

  static analyzeCode(code: string, language: string): InputFormat {
    const result: InputFormat = {
      requirements: [],
      totalLines: 0,
      examples: [],
      errors: [],
      confidence: 0
    };

    try {
      switch (language.toLowerCase()) {
        case 'c':
          return this.analyzeCCode(code);
        case 'cpp':
        case 'c++':
          return this.analyzeCppCode(code);
        case 'python':
        case 'python3':
          return this.analyzePythonCode(code);
        case 'java':
          return this.analyzeJavaCode(code);
        case 'javascript':
        case 'js':
          return this.analyzeJavaScriptCode(code);
        case 'kotlin':
          return this.analyzeKotlinCode(code);
        case 'csharp':
        case 'c#':
          return this.analyzeCSharpCode(code);
        case 'go':
          return this.analyzeGoCode(code);
        case 'rust':
          return this.analyzeRustCode(code);
        default:
          result.errors.push(`Language ${language} not supported for input analysis`);
          return result;
      }
    } catch (error) {
      result.errors.push(`Error analyzing code: ${error}`);
      return result;
    }
  }

  private static analyzeCCode(code: string): InputFormat {
    const result: InputFormat = {
      requirements: [],
      totalLines: 0,
      examples: [],
      errors: [],
      confidence: 0.7
    };

    // Remove comments
    const cleanCode = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

    // Find scanf patterns
    const scanfMatches = [...cleanCode.matchAll(this.cPatterns.scanf)];
    
    for (const match of scanfMatches) {
      const format = match[1];
      const vars = match[2];
      
      // Parse format string
      const formatSpecs = format.match(/%[diouxXeEfFgGaAcsp]/g) || [];
      const varNames = vars.split(',').map(v => v.trim().replace(/&/, ''));

      formatSpecs.forEach((spec, index) => {
        const varName = varNames[index]?.replace(/\[.*\]/, '') || `var${index}`;
        let type: InputRequirement['type'] = 'string';

        switch (spec) {
          case '%d':
          case '%i':
          case '%o':
          case '%u':
          case '%x':
          case '%X':
            type = 'int';
            break;
          case '%f':
          case '%e':
          case '%E':
          case '%g':
          case '%G':
          case '%a':
          case '%A':
            type = 'float';
            break;
          case '%c':
            type = 'char';
            break;
          case '%s':
            type = 'string';
            break;
        }

        result.requirements.push({
          type,
          name: varName,
          description: `Input ${type} value for ${varName}`
        });
      });
    }

    result.totalLines = result.requirements.length > 0 ? Math.ceil(result.requirements.length / 2) : 1;
    result.examples = this.generateExamples(result.requirements);
    
    return result;
  }

  private static analyzeCppCode(code: string): InputFormat {
    const result: InputFormat = {
      requirements: [],
      totalLines: 0,
      examples: [],
      errors: [],
      confidence: 0.8
    };

    // Remove comments
    const cleanCode = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

    // Find cin patterns
    const cinMatches = [...cleanCode.matchAll(this.cppPatterns.cin)];
    
    for (const match of cinMatches) {
      const varName = match[1].replace(/\[.*\]/, '');
      
      // Try to infer type from variable declaration
      const varDeclRegex = new RegExp(`(int|float|double|char|string|long)\\s+${varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
      const typeMatch = cleanCode.match(varDeclRegex);
      
      let type: InputRequirement['type'] = 'string';
      if (typeMatch) {
        switch (typeMatch[1].toLowerCase()) {
          case 'int':
          case 'long':
            type = 'int';
            break;
          case 'float':
          case 'double':
            type = 'float';
            break;
          case 'char':
            type = 'char';
            break;
          case 'string':
            type = 'string';
            break;
        }
      }

      result.requirements.push({
        type,
        name: varName,
        isArray: match[1].includes('['),
        description: `Input ${type} value for ${varName}`
      });
    }

    result.totalLines = result.requirements.length > 0 ? Math.ceil(result.requirements.length / 2) : 1;
    result.examples = this.generateExamples(result.requirements);
    
    return result;
  }

  private static analyzePythonCode(code: string): InputFormat {
    const result: InputFormat = {
      requirements: [],
      totalLines: 0,
      examples: [],
      errors: [],
      confidence: 0.9
    };

    // Remove comments
    const cleanCode = code.replace(/#.*$/gm, '').replace(/"""[\s\S]*?"""/g, '').replace(/'''[\s\S]*?'''/g, '');

    // Find int(input()) patterns
    const intInputMatches = [...cleanCode.matchAll(this.pythonPatterns.intInput)];
    for (const match of intInputMatches) {
      result.requirements.push({
        type: 'int',
        name: match[1],
        description: `Input integer value for ${match[1]}`
      });
    }

    // Find float(input()) patterns
    const floatInputMatches = [...cleanCode.matchAll(this.pythonPatterns.floatInput)];
    for (const match of floatInputMatches) {
      result.requirements.push({
        type: 'float',
        name: match[1],
        description: `Input float value for ${match[1]}`
      });
    }

    // Find map(int, input().split()) patterns
    const mapInputMatches = [...cleanCode.matchAll(this.pythonPatterns.mapInput)];
    for (const match of mapInputMatches) {
      const type = match[3] === 'int' ? 'int' : match[3] === 'float' ? 'float' : 'string';
      result.requirements.push({
        type,
        name: match[1],
        isArray: true,
        description: `Input space-separated ${type} values for ${match[1]}`
      });
    }

    // Find input().split() patterns
    const splitInputMatches = [...cleanCode.matchAll(this.pythonPatterns.splitInput)];
    for (const match of splitInputMatches) {
      result.requirements.push({
        type: 'string',
        name: match[1],
        isArray: true,
        description: `Input space-separated string values for ${match[1]}`
      });
    }

    // Find simple input() patterns
    const inputMatches = [...cleanCode.matchAll(this.pythonPatterns.input)];
    for (const match of inputMatches) {
      // Skip if already processed by other patterns
      if (!result.requirements.some(req => req.name === match[1])) {
        result.requirements.push({
          type: 'string',
          name: match[1],
          description: `Input string value for ${match[1]}`
        });
      }
    }

    result.totalLines = result.requirements.filter(req => !req.isArray).length + 
                       result.requirements.filter(req => req.isArray).length;
    result.examples = this.generateExamples(result.requirements);
    
    return result;
  }

  private static analyzeJavaCode(code: string): InputFormat {
    const result: InputFormat = {
      requirements: [],
      totalLines: 0,
      examples: [],
      errors: [],
      confidence: 0.8
    };

    // Remove comments
    const cleanCode = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

    // Find Scanner.nextInt() patterns
    const intMatches = [...cleanCode.matchAll(this.javaPatterns.scannerInt)];
    for (const match of intMatches) {
      result.requirements.push({
        type: 'int',
        name: match[1],
        description: `Input integer value for ${match[1]}`
      });
    }

    // Find Scanner.nextDouble() patterns
    const doubleMatches = [...cleanCode.matchAll(this.javaPatterns.scannerDouble)];
    for (const match of doubleMatches) {
      result.requirements.push({
        type: 'float',
        name: match[1],
        description: `Input double value for ${match[1]}`
      });
    }

    // Find Scanner.nextLine() patterns
    const lineMatches = [...cleanCode.matchAll(this.javaPatterns.scannerLine)];
    for (const match of lineMatches) {
      result.requirements.push({
        type: 'line',
        name: match[1],
        description: `Input line of text for ${match[1]}`
      });
    }

    // Find Scanner.next() patterns
    const stringMatches = [...cleanCode.matchAll(this.javaPatterns.scannerString)];
    for (const match of stringMatches) {
      result.requirements.push({
        type: 'string',
        name: match[1],
        description: `Input string value for ${match[1]}`
      });
    }

    result.totalLines = result.requirements.length > 0 ? Math.ceil(result.requirements.length / 2) : 1;
    result.examples = this.generateExamples(result.requirements);
    
    return result;
  }

  private static analyzeJavaScriptCode(code: string): InputFormat {
    const result: InputFormat = {
      requirements: [],
      totalLines: 0,
      examples: [],
      errors: [],
      confidence: 0.7
    };

    // Remove comments
    const cleanCode = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

    // Find readline() patterns
    const readlineMatches = [...cleanCode.matchAll(this.jsPatterns.readline)];
    for (const match of readlineMatches) {
      result.requirements.push({
        type: 'string',
        name: match[1],
        description: `Input string value for ${match[1]}`
      });
    }

    // Find parseInt(readline()) patterns
    const parseIntMatches = [...cleanCode.matchAll(this.jsPatterns.parseInt)];
    parseIntMatches.forEach((_, index) => {
      result.requirements.push({
        type: 'int',
        name: `input${index + 1}`,
        description: `Input integer value`
      });
    });

    // Find parseFloat(readline()) patterns
    const parseFloatMatches = [...cleanCode.matchAll(this.jsPatterns.parseFloat)];
    parseFloatMatches.forEach((_, index) => {
      result.requirements.push({
        type: 'float',
        name: `input${index + 1}`,
        description: `Input float value`
      });
    });

    // Find prompt() patterns
    const promptMatches = [...cleanCode.matchAll(this.jsPatterns.prompt)];
    for (const match of promptMatches) {
      result.requirements.push({
        type: 'string',
        name: match[1],
        description: `Input value for ${match[1]}`
      });
    }

    result.totalLines = result.requirements.length > 0 ? result.requirements.length : 1;
    result.examples = this.generateExamples(result.requirements);
    
    return result;
  }

  private static analyzeKotlinCode(code: string): InputFormat {
    const result: InputFormat = {
      requirements: [],
      totalLines: 0,
      examples: [],
      errors: [],
      confidence: 0.8
    };

    // Remove comments
    const cleanCode = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

    // Find readLine!!.toInt() patterns
    const intMatches = [...cleanCode.matchAll(this.kotlinPatterns.readLineInt)];
    for (const match of intMatches) {
      result.requirements.push({
        type: 'int',
        name: match[1],
        description: `Input integer value for ${match[1]}`
      });
    }

    // Find readLine!!.toDouble() patterns
    const doubleMatches = [...cleanCode.matchAll(this.kotlinPatterns.readLineDouble)];
    for (const match of doubleMatches) {
      result.requirements.push({
        type: 'float',
        name: match[1],
        description: `Input double value for ${match[1]}`
      });
    }

    // Find readLine!!.split().map patterns
    const mapMatches = [...cleanCode.matchAll(this.kotlinPatterns.readLineMap)];
    for (const match of mapMatches) {
      const type = match[3].toLowerCase() === 'int' ? 'int' : match[3].toLowerCase() === 'double' ? 'float' : 'string';
      result.requirements.push({
        type,
        name: match[1],
        isArray: true,
        description: `Input space-separated ${type} values for ${match[1]}`
      });
    }

    // Find simple readLine() patterns
    const readLineMatches = [...cleanCode.matchAll(this.kotlinPatterns.readLine)];
    for (const match of readLineMatches) {
      if (!result.requirements.some(req => req.name === match[1])) {
        result.requirements.push({
          type: 'string',
          name: match[1],
          description: `Input string value for ${match[1]}`
        });
      }
    }

    result.totalLines = result.requirements.length > 0 ? result.requirements.length : 1;
    result.examples = this.generateExamples(result.requirements);
    
    return result;
  }

  private static analyzeCSharpCode(code: string): InputFormat {
    const result: InputFormat = {
      requirements: [],
      totalLines: 0,
      examples: [],
      errors: [],
      confidence: 0.8
    };

    // Remove comments
    const cleanCode = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

    // Find int.Parse(Console.ReadLine()) patterns
    const intParseMatches = [...cleanCode.matchAll(this.csharpPatterns.intParse)];
    for (const match of intParseMatches) {
      result.requirements.push({
        type: 'int',
        name: match[1],
        description: `Input integer value for ${match[1]}`
      });
    }

    // Find double.Parse(Console.ReadLine()) patterns
    const doubleParseMatches = [...cleanCode.matchAll(this.csharpPatterns.doubleParse)];
    for (const match of doubleParseMatches) {
      result.requirements.push({
        type: 'float',
        name: match[1],
        description: `Input double value for ${match[1]}`
      });
    }

    // Find Convert.ToInt32(Console.ReadLine()) patterns
    const convertIntMatches = [...cleanCode.matchAll(this.csharpPatterns.convertToInt)];
    for (const match of convertIntMatches) {
      if (!result.requirements.some(req => req.name === match[1])) {
        result.requirements.push({
          type: 'int',
          name: match[1],
          description: `Input integer value for ${match[1]}`
        });
      }
    }

    // Find Console.ReadLine().Split() patterns
    const splitMatches = [...cleanCode.matchAll(this.csharpPatterns.split)];
    for (const match of splitMatches) {
      result.requirements.push({
        type: 'string',
        name: match[1],
        isArray: true,
        description: `Input space-separated string values for ${match[1]}`
      });
    }

    // Find simple Console.ReadLine() patterns
    const readLineMatches = [...cleanCode.matchAll(this.csharpPatterns.consoleReadLine)];
    for (const match of readLineMatches) {
      if (!result.requirements.some(req => req.name === match[1])) {
        result.requirements.push({
          type: 'string',
          name: match[1],
          description: `Input string value for ${match[1]}`
        });
      }
    }

    result.totalLines = result.requirements.length > 0 ? result.requirements.length : 1;
    result.examples = this.generateExamples(result.requirements);
    
    return result;
  }

  private static analyzeGoCode(code: string): InputFormat {
    const result: InputFormat = {
      requirements: [],
      totalLines: 0,
      examples: [],
      errors: [],
      confidence: 0.7
    };

    // Remove comments
    const cleanCode = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

    // Find fmt.Scanf patterns
    const scanfMatches = [...cleanCode.matchAll(this.goPatterns.scanf)];
    for (const match of scanfMatches) {
      const format = match[1];
      const vars = match[2];
      
      // Parse format string
      const formatSpecs = format.match(/%[diouxXeEfFgGaAcsp]/g) || [];
      const varNames = vars.split(',').map(v => v.trim().replace(/&/, ''));

      formatSpecs.forEach((spec, index) => {
        const varName = varNames[index]?.replace(/\[.*\]/, '') || `var${index}`;
        let type: InputRequirement['type'] = 'string';

        switch (spec) {
          case '%d':
          case '%o':
          case '%x':
          case '%X':
            type = 'int';
            break;
          case '%f':
          case '%e':
          case '%E':
          case '%g':
          case '%G':
            type = 'float';
            break;
          case '%c':
            type = 'char';
            break;
          case '%s':
            type = 'string';
            break;
        }

        result.requirements.push({
          type,
          name: varName,
          description: `Input ${type} value for ${varName}`
        });
      });
    }

    // Find fmt.Scan patterns
    const scanMatches = [...cleanCode.matchAll(this.goPatterns.scan)];
    for (const match of scanMatches) {
      const vars = match[1].split(',').map(v => v.trim().replace(/&/, ''));
      
      for (const varName of vars) {
        // Try to infer type from variable declaration
        const varDeclRegex = new RegExp(`var\\s+${varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(int|float64|string)`, 'i');
        const typeMatch = cleanCode.match(varDeclRegex);
        
        let type: InputRequirement['type'] = 'string';
        if (typeMatch) {
          switch (typeMatch[1].toLowerCase()) {
            case 'int':
              type = 'int';
              break;
            case 'float64':
              type = 'float';
              break;
            case 'string':
              type = 'string';
              break;
          }
        }

        result.requirements.push({
          type,
          name: varName,
          description: `Input ${type} value for ${varName}`
        });
      }
    }

    result.totalLines = result.requirements.length > 0 ? Math.ceil(result.requirements.length / 2) : 1;
    result.examples = this.generateExamples(result.requirements);
    
    return result;
  }

  private static analyzeRustCode(code: string): InputFormat {
    const result: InputFormat = {
      requirements: [],
      totalLines: 0,
      examples: [],
      errors: [],
      confidence: 0.8
    };

    // Remove comments
    const cleanCode = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

    // Find String::new() declarations
    const stringNewMatches = [...cleanCode.matchAll(this.rustPatterns.stringNew)];
    const stringVars = new Set(stringNewMatches.map(match => match[1]));

    // Find read_line() calls and match with String variables
    const readLineMatches = [...cleanCode.matchAll(this.rustPatterns.readLine)];
    const usedStringVars = new Set<string>();

    for (const match of readLineMatches) {
      const varName = match[1];
      if (stringVars.has(varName)) {
        usedStringVars.add(varName);
      }
    }

    // Find .trim().parse() patterns and link to string variables
    const parseMatches = [...cleanCode.matchAll(this.rustPatterns.parseInput)];
    const processedVars = new Set<string>();

    for (const match of parseMatches) {
      const resultVar = match[1];
      const sourceVar = match[3];
      const typeStr = match[2];

      // Check if source variable is one of our input string variables
      if (usedStringVars.has(sourceVar) && !processedVars.has(resultVar)) {
        let type: InputRequirement['type'] = 'string';
        switch (typeStr.toLowerCase()) {
          case 'i32':
          case 'i64':
          case 'u32':
          case 'u64':
          case 'usize':
          case 'isize':
            type = 'int';
            break;
          case 'f32':
          case 'f64':
            type = 'float';
            break;
          case 'char':
            type = 'char';
            break;
          default:
            type = 'string';
        }

        result.requirements.push({
          type,
          name: resultVar,
          description: `Input ${type} value for ${resultVar}`
        });
        processedVars.add(resultVar);
      }
    }

    // If no parse patterns found, treat string inputs as string type
    if (result.requirements.length === 0 && usedStringVars.size > 0) {
      usedStringVars.forEach(varName => {
        result.requirements.push({
          type: 'string',
          name: varName,
          description: `Input string value for ${varName}`
        });
      });
    }

    // Find split_whitespace().map().collect() patterns
    const splitMatches = [...cleanCode.matchAll(this.rustPatterns.splitWhitespace)];
    for (const match of splitMatches) {
      const resultVar = match[1];
      const sourceVar = match[3];
      
      if (usedStringVars.has(sourceVar)) {
        let type: InputRequirement['type'] = 'string';
        switch (match[2].toLowerCase()) {
          case 'i32':
          case 'i64':
          case 'u32':
          case 'u64':
            type = 'int';
            break;
          case 'f32':
          case 'f64':
            type = 'float';
            break;
          default:
            type = 'string';
        }

        result.requirements.push({
          type,
          name: resultVar,
          isArray: true,
          description: `Input space-separated ${type} values for ${resultVar}`
        });
      }
    }

    result.totalLines = result.requirements.length > 0 ? result.requirements.length : 1;
    result.examples = this.generateExamples(result.requirements);
    
    return result;
  }

  private static generateExamples(requirements: InputRequirement[]): string[] {
    if (requirements.length === 0) return [''];

    const examples: string[] = [];
    
    // Generate 2-3 example inputs
    for (let i = 0; i < 3; i++) {
      const lines: string[] = [];
      
      for (const req of requirements) {
        if (req.isArray) {
          // Generate array input
          switch (req.type) {
            case 'int':
              lines.push('1 2 3 4 5');
              break;
            case 'float':
              lines.push('1.5 2.7 3.14 4.0 5.5');
              break;
            default:
              lines.push('apple banana cherry');
          }
        } else {
          // Generate single value input
          switch (req.type) {
            case 'int':
              lines.push(String(Math.floor(Math.random() * 100) + 1));
              break;
            case 'float':
              lines.push(String((Math.random() * 100).toFixed(2)));
              break;
            case 'char':
              lines.push('a');
              break;
            case 'line':
              lines.push('Hello World');
              break;
            default:
              lines.push('example');
          }
        }
      }
      
      examples.push(lines.join('\n'));
    }
    
    return examples;
  }

  static validateInput(input: string, format: InputFormat): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const lines = input.trim().split('\n');
    
    if (format.requirements.length === 0) {
      return { isValid: true, errors: [] };
    }

    let lineIndex = 0;
    
    for (const req of format.requirements) {
      if (lineIndex >= lines.length) {
        errors.push(`Missing input for ${req.name || 'variable'}`);
        continue;
      }
      
      const line = lines[lineIndex].trim();
      
      if (req.isArray) {
        const values = line.split(/\s+/);
        for (const value of values) {
          if (!this.isValidType(value, req.type)) {
            errors.push(`Invalid ${req.type} value: "${value}" in ${req.name || 'array'}`);
          }
        }
      } else {
        if (!this.isValidType(line, req.type)) {
          errors.push(`Invalid ${req.type} value: "${line}" for ${req.name || 'variable'}`);
        }
      }
      
      lineIndex++;
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static isValidType(value: string, type: InputRequirement['type']): boolean {
    switch (type) {
      case 'int':
        return /^-?\d+$/.test(value) && !isNaN(parseInt(value));
      case 'float':
        return /^-?\d*\.?\d+([eE][+-]?\d+)?$/.test(value) && !isNaN(parseFloat(value));
      case 'char':
        return value.length === 1;
      case 'string':
      case 'line':
        return true; // Any string is valid
      default:
        return true;
    }
  }

  static generateInputHints(format: InputFormat): string {
    if (format.requirements.length === 0) {
      return "No specific input format detected. You can enter any input.";
    }

    const hints: string[] = [];
    let lineNum = 1;

    for (const req of format.requirements) {
      if (req.isArray) {
        hints.push(`Line ${lineNum}: ${req.description} (space-separated)`);
      } else {
        hints.push(`Line ${lineNum}: ${req.description}`);
      }
      lineNum++;
    }

    return hints.join('\n');
  }
}