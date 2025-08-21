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
    gets: /gets\s*\(\s*([^)]+)\s*\)/g,
    fgets: /fgets\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*stdin\s*\)/g,
    getchar: /(\w+)\s*=\s*getchar\s*\(\s*\)/g,
    getc: /(\w+)\s*=\s*getc\s*\(\s*stdin\s*\)/g,
    fscanf: /fscanf\s*\(\s*stdin\s*,\s*["']([^"']+)["']\s*,\s*([^)]+)\)/g,
  };

  private static cppPatterns = {
    cin: /cin\s*>>\s*([a-zA-Z_][a-zA-Z0-9_]*(?:\[[^\]]*\])?)/g,
    cinMultiple: /cin\s*>>\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*>>\s*([a-zA-Z_][a-zA-Z0-9_]*)/g,
    getline: /getline\s*\(\s*cin\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)/g,
    getlineDelim: /getline\s*\(\s*cin\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*([^)]+)\s*\)/g,
    cinGet: /cin\.get\s*\(\s*([^)]+)\s*\)/g,
    cinGetline: /cin\.getline\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g,
  };

  private static pythonPatterns = {
    input: /(\w+)\s*=\s*input\s*\(\s*([^)]*)\s*\)/g,
    intInput: /(\w+)\s*=\s*int\s*\(\s*input\s*\(\s*([^)]*)\s*\)\s*\)/g,
    floatInput: /(\w+)\s*=\s*float\s*\(\s*input\s*\(\s*([^)]*)\s*\)\s*\)/g,
    splitInput: /(\w+)\s*=\s*input\s*\(\s*([^)]*)\s*\)\.split\s*\(\s*([^)]*)\s*\)/g,
    mapInput: /(\w+)\s*=\s*(list\s*\(\s*)?map\s*\(\s*(\w+)\s*,\s*input\s*\(\s*([^)]*)\s*\)\.split\s*\(\s*([^)]*)\s*\)\s*(\))?/g,
    sysStdin: /(\w+)\s*=\s*sys\.stdin\.readline\s*\(\s*\)/g,
    sysStdinStrip: /(\w+)\s*=\s*sys\.stdin\.readline\s*\(\s*\)\.strip\s*\(\s*\)/g,
    evalInput: /(\w+)\s*=\s*eval\s*\(\s*input\s*\(\s*([^)]*)\s*\)\s*\)/g,
    rawInput: /(\w+)\s*=\s*raw_input\s*\(\s*([^)]*)\s*\)/g,
    multipleAssign: /(\w+)\s*,\s*(\w+)(?:\s*,\s*(\w+))?\s*=\s*input\s*\(\s*([^)]*)\s*\)\.split\s*\(\s*([^)]*)\s*\)/g,
    comprehensionMap: /(\w+)\s*=\s*\[\s*(\w+)\s*\(\s*x\s*\)\s*for\s+x\s+in\s+input\s*\(\s*([^)]*)\s*\)\.split\s*\(\s*([^)]*)\s*\)\s*\]/g,
  };

  private static javaPatterns = {
    scannerInt: /(\w+)\s*=\s*(\w+)\.nextInt\s*\(\s*\)/g,
    scannerDouble: /(\w+)\s*=\s*(\w+)\.nextDouble\s*\(\s*\)/g,
    scannerFloat: /(\w+)\s*=\s*(\w+)\.nextFloat\s*\(\s*\)/g,
    scannerLong: /(\w+)\s*=\s*(\w+)\.nextLong\s*\(\s*\)/g,
    scannerByte: /(\w+)\s*=\s*(\w+)\.nextByte\s*\(\s*\)/g,
    scannerShort: /(\w+)\s*=\s*(\w+)\.nextShort\s*\(\s*\)/g,
    scannerBoolean: /(\w+)\s*=\s*(\w+)\.nextBoolean\s*\(\s*\)/g,
    scannerLine: /(\w+)\s*=\s*(\w+)\.nextLine\s*\(\s*\)/g,
    scannerString: /(\w+)\s*=\s*(\w+)\.next\s*\(\s*\)/g,
    bufferedReader: /(\w+)\s*=\s*(\w+)\.readLine\s*\(\s*\)/g,
    integerParseInt: /(\w+)\s*=\s*Integer\.parseInt\s*\(\s*([^)]+)\s*\)/g,
    doubleParseDouble: /(\w+)\s*=\s*Double\.parseDouble\s*\(\s*([^)]+)\s*\)/g,
    floatParseFloat: /(\w+)\s*=\s*Float\.parseFloat\s*\(\s*([^)]+)\s*\)/g,
    longParseLong: /(\w+)\s*=\s*Long\.parseLong\s*\(\s*([^)]+)\s*\)/g,
    systemIn: /System\.in\.read\s*\(\s*\)/g,
    inputStreamReader: /InputStreamReader\s*\(\s*System\.in\s*\)/g,
  };

  private static jsPatterns = {
    readline: /const\s+(\w+)\s*=\s*readline\s*\(\s*\)/g,
    readlineSync: /const\s+(\w+)\s*=\s*readlineSync\s*\(\s*\)/g,
    readlineSyncQuestion: /const\s+(\w+)\s*=\s*readlineSync\.question\s*\(\s*([^)]*)\s*\)/g,
    readlineSyncInt: /const\s+(\w+)\s*=\s*readlineSync\.questionInt\s*\(\s*([^)]*)\s*\)/g,
    readlineSyncFloat: /const\s+(\w+)\s*=\s*readlineSync\.questionFloat\s*\(\s*([^)]*)\s*\)/g,
    prompt: /(\w+)\s*=\s*prompt\s*\(\s*([^)]*)\s*\)/g,
    processArgv: /process\.argv\[(\d+)\]/g,
    parseInt: /parseInt\s*\(\s*readline\s*\(\s*\)\s*\)/g,
    parseFloat: /parseFloat\s*\(\s*readline\s*\(\s*\)\s*\)/g,
    parseIntPrompt: /parseInt\s*\(\s*prompt\s*\(\s*([^)]*)\s*\)\s*\)/g,
    parseFloatPrompt: /parseFloat\s*\(\s*prompt\s*\(\s*([^)]*)\s*\)\s*\)/g,
    stdinOn: /process\.stdin\.on\s*\(\s*['"]data['"]\s*,/g,
    stdinResume: /process\.stdin\.resume\s*\(\s*\)/g,
    readlineInterface: /readline\.createInterface\s*\(\s*\{[^}]*input:\s*process\.stdin/g,
    consoleReadline: /console\.readline\s*\(\s*\)/g,
  };

  private static kotlinPatterns = {
    readLine: /val\s+(\w+)\s*=\s*readLine\s*\(\s*\)/g,
    readLineInt: /val\s+(\w+)\s*=\s*readLine\s*\(\s*\)!!\s*\.toInt\s*\(\s*\)/g,
    readLineDouble: /val\s+(\w+)\s*=\s*readLine\s*\(\s*\)!!\s*\.toDouble\s*\(\s*\)/g,
    readLineFloat: /val\s+(\w+)\s*=\s*readLine\s*\(\s*\)!!\s*\.toFloat\s*\(\s*\)/g,
    readLineLong: /val\s+(\w+)\s*=\s*readLine\s*\(\s*\)!!\s*\.toLong\s*\(\s*\)/g,
    readLineBoolean: /val\s+(\w+)\s*=\s*readLine\s*\(\s*\)!!\s*\.toBoolean\s*\(\s*\)/g,
    readLineSplit: /val\s+(\w+)\s*=\s*readLine\s*\(\s*\)!!\s*\.split\s*\(\s*([^)]*)\s*\)/g,
    readLineMap: /val\s+(\w+)\s*=\s*readLine\s*\(\s*\)!!\s*\.split\s*\(\s*([^)]*)\s*\)\.map\s*\{\s*it\.to(\w+)\s*\(\s*\)\s*\}/g,
    readLineOrNull: /val\s+(\w+)\s*=\s*readLine\s*\(\s*\)\s*\?\.\w+\s*\(\s*\)/g,
    scannerNextInt: /val\s+(\w+)\s*=\s*(\w+)\.nextInt\s*\(\s*\)/g,
    scannerNextDouble: /val\s+(\w+)\s*=\s*(\w+)\.nextDouble\s*\(\s*\)/g,
    scannerNextLine: /val\s+(\w+)\s*=\s*(\w+)\.nextLine\s*\(\s*\)/g,
  };

  private static csharpPatterns = {
    consoleReadLine: /(\w+)\s*=\s*Console\.ReadLine\s*\(\s*\)/g,
    consoleRead: /(\w+)\s*=\s*Console\.Read\s*\(\s*\)/g,
    consoleReadKey: /(\w+)\s*=\s*Console\.ReadKey\s*\(\s*\)/g,
    intParse: /(\w+)\s*=\s*int\.Parse\s*\(\s*Console\.ReadLine\s*\(\s*\)\s*\)/g,
    doubleParse: /(\w+)\s*=\s*double\.Parse\s*\(\s*Console\.ReadLine\s*\(\s*\)\s*\)/g,
    floatParse: /(\w+)\s*=\s*float\.Parse\s*\(\s*Console\.ReadLine\s*\(\s*\)\s*\)/g,
    longParse: /(\w+)\s*=\s*long\.Parse\s*\(\s*Console\.ReadLine\s*\(\s*\)\s*\)/g,
    boolParse: /(\w+)\s*=\s*bool\.Parse\s*\(\s*Console\.ReadLine\s*\(\s*\)\s*\)/g,
    convertToInt: /(\w+)\s*=\s*Convert\.ToInt32\s*\(\s*Console\.ReadLine\s*\(\s*\)\s*\)/g,
    convertToDouble: /(\w+)\s*=\s*Convert\.ToDouble\s*\(\s*\(\s*\)\s*\)/g,
    convertToFloat: /(\w+)\s*=\s*Convert\.ToSingle\s*\(\s*Console\.ReadLine\s*\(\s*\)\s*\)/g,
    convertToLong: /(\w+)\s*=\s*Convert\.ToInt64\s*\(\s*Console\.ReadLine\s*\(\s*\)\s*\)/g,
    convertToBool: /(\w+)\s*=\s*Convert\.ToBoolean\s*\(\s*Console\.ReadLine\s*\(\s*\)\s*\)/g,
    split: /(\w+)\s*=\s*Console\.ReadLine\s*\(\s*\)\.Split\s*\(\s*([^)]*)\s*\)/g,
    textReaderReadLine: /(\w+)\s*=\s*(\w+)\.ReadLine\s*\(\s*\)/g,
    streamReaderReadLine: /(\w+)\s*=\s*(\w+)\.ReadLine\s*\(\s*\)/g,
    stringReaderReadLine: /(\w+)\s*=\s*(\w+)\.ReadLine\s*\(\s*\)/g,
    consoleIn: /Console\.In\.ReadLine\s*\(\s*\)/g,
    selectMany: /(\w+)\s*=\s*Console\.ReadLine\s*\(\s*\)\.Split\s*\(\s*([^)]*)\s*\)\.Select\s*\(\s*(\w+)\.Parse\s*\)/g,
  };

  private static goPatterns = {
    scanf: /fmt\.Scanf\s*\(\s*[\"']([^\"']+)[\"']\s*,\s*([^)]+)\s*\)/g,
    scanln: /fmt\.Scanln\s*\(\s*([^)]+)\s*\)/g,
    scan: /fmt\.Scan\s*\(\s*([^)]+)\s*\)/g,
    scanInt: /var\s+(\w+)\s+int[^;]*fmt\.Scan.*&(\w+)/g,
    scanFloat: /var\s+(\w+)\s+float[^;]*fmt\.Scan.*&(\w+)/g,
    scanString: /var\s+(\w+)\s+string[^;]*fmt\.Scan.*&(\w+)/g,
    bufioScanner: /(\w+)\s*:=\s*bufio\.NewScanner\s*\(\s*os\.Stdin\s*\)/g,
    scannerScan: /(\w+)\.Scan\s*\(\s*\)/g,
    scannerText: /(\w+)\s*:=\s*(\w+)\.Text\s*\(\s*\)/g,
    bufioReader: /(\w+)\s*:=\s*bufio\.NewReader\s*\(\s*os\.Stdin\s*\)/g,
    readerReadString: /(\w+)\s*,\s*\w*\s*:=\s*(\w+)\.ReadString\s*\(\s*([^)]+)\s*\)/g,
    readerReadLine: /(\w+)\s*,\s*\w*\s*:=\s*(\w+)\.ReadLine\s*\(\s*\)/g,
    strconvAtoi: /(\w+)\s*,\s*\w*\s*:=\s*strconv\.Atoi\s*\(\s*([^)]+)\s*\)/g,
    strconvParseFloat: /(\w+)\s*,\s*\w*\s*:=\s*strconv\.ParseFloat\s*\(\s*([^)]+)\s*,\s*\d+\s*\)/g,
    strconvParseInt: /(\w+)\s*,\s*\w*\s*:=\s*strconv\.ParseInt\s*\(\s*([^)]+)\s*,\s*\d+\s*,\s*\d+\s*\)/g,
    osStdin: /os\.Stdin\.Read\s*\(\s*([^)]+)\s*\)/g,
    ioReader: /io\.Reader/g,
  };

  private static rustPatterns = {
    // Match: let mut variable = String::new();
    stringNew: /let\s+mut\s+(\w+)\s*=\s*String::new\s*\(\s*\)/g,
    // Match: io::stdin().read_line(&mut variable)
    readLine: /io::stdin\s*\(\s*\)\.read_line\s*\(\s*&mut\s+(\w+)\s*\)/g,
    // Match: let variable: type = other_var.trim().parse()
    parseInput: /let\s+(\w+):\s*(\w+)\s*=\s*(\w+)\.trim\s*\(\s*\)\.parse\s*\(\s*\)/g,
    // Match: variable.trim().parse().unwrap()
    parseUnwrap: /(\w+)\.trim\s*\(\s*\)\.parse\s*\(\s*\)\.unwrap\s*\(\s*\)/g,
    // Match: variable.trim().parse().expect()
    parseExpect: /(\w+)\.trim\s*\(\s*\)\.parse\s*\(\s*\)\.expect\s*\(\s*([^)]*)\s*\)/g,
    // Match split_whitespace patterns
    splitWhitespace: /let\s+(\w+):\s*Vec<(\w+)>\s*=\s*(\w+)\s*\.split_whitespace\s*\(\s*\)\.map\s*\(\s*\|x\|\s*x\.parse\s*\(\s*\)\.unwrap\s*\(\s*\)\s*\)\.collect\s*\(\s*\)/g,
    // Match: stdin().read_to_string()
    readToString: /io::stdin\s*\(\s*\)\.read_to_string\s*\(\s*&mut\s+(\w+)\s*\)/g,
    // Match: BufReader patterns
    bufReader: /BufReader::new\s*\(\s*io::stdin\s*\(\s*\)\s*\)/g,
    bufReaderReadLine: /(\w+)\.read_line\s*\(\s*&mut\s+(\w+)\s*\)/g,
    // Match: lines() iterator
    stdinLines: /io::stdin\s*\(\s*\)\.lines\s*\(\s*\)/g,
    // Match: lock() patterns
    stdinLock: /io::stdin\s*\(\s*\)\.lock\s*\(\s*\)\.lines\s*\(\s*\)/g,
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

    // Find fscanf patterns (same as scanf but with stdin)
    const fscanfMatches = [...cleanCode.matchAll(this.cPatterns.fscanf)];
    for (const match of fscanfMatches) {
      const format = match[1];
      const vars = match[2];
      
      const formatSpecs = format.match(/%[diouxXeEfFgGaAcsp]/g) || [];
      const varNames = vars.split(',').map(v => v.trim().replace(/&/, ''));

      formatSpecs.forEach((spec, index) => {
        const varName = varNames[index]?.replace(/\[.*\]/, '') || `var${index}`;
        let type: InputRequirement['type'] = 'string';

        switch (spec) {
          case '%d': case '%i': case '%o': case '%u': case '%x': case '%X':
            type = 'int'; break;
          case '%f': case '%e': case '%E': case '%g': case '%G': case '%a': case '%A':
            type = 'float'; break;
          case '%c':
            type = 'char'; break;
          case '%s':
            type = 'string'; break;
        }

        result.requirements.push({
          type,
          name: varName,
          description: `Input ${type} value for ${varName}`
        });
      });
    }

    // Find gets() patterns
    const getsMatches = [...cleanCode.matchAll(this.cPatterns.gets)];
    for (const match of getsMatches) {
      const varName = match[1].trim();
      result.requirements.push({
        type: 'line',
        name: varName,
        description: `Input line of text for ${varName}`
      });
    }

    // Find fgets() patterns
    const fgetsMatches = [...cleanCode.matchAll(this.cPatterns.fgets)];
    for (const match of fgetsMatches) {
      const varName = match[1].trim();
      result.requirements.push({
        type: 'line',
        name: varName,
        description: `Input line of text for ${varName}`
      });
    }

    // Find getchar() patterns
    const getcharMatches = [...cleanCode.matchAll(this.cPatterns.getchar)];
    for (const match of getcharMatches) {
      result.requirements.push({
        type: 'char',
        name: match[1],
        description: `Input character for ${match[1]}`
      });
    }

    // Find getc() patterns
    const getcMatches = [...cleanCode.matchAll(this.cPatterns.getc)];
    for (const match of getcMatches) {
      result.requirements.push({
        type: 'char',
        name: match[1],
        description: `Input character for ${match[1]}`
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

    // Find getline patterns
    const getlineMatches = [...cleanCode.matchAll(this.cppPatterns.getline)];
    for (const match of getlineMatches) {
      const varName = match[1];
      result.requirements.push({
        type: 'line',
        name: varName,
        description: `Input line of text for ${varName}`
      });
    }

    // Find getline with delimiter patterns
    const getlineDelimMatches = [...cleanCode.matchAll(this.cppPatterns.getlineDelim)];
    for (const match of getlineDelimMatches) {
      const varName = match[1];
      result.requirements.push({
        type: 'line',
        name: varName,
        description: `Input line of text for ${varName} (with delimiter)`
      });
    }

    // Find cin.get patterns
    const cinGetMatches = [...cleanCode.matchAll(this.cppPatterns.cinGet)];
    for (const match of cinGetMatches) {
      const varName = match[1].trim();
      result.requirements.push({
        type: 'char',
        name: varName,
        description: `Input character for ${varName}`
      });
    }

    // Find cin.getline patterns
    const cinGetlineMatches = [...cleanCode.matchAll(this.cppPatterns.cinGetline)];
    for (const match of cinGetlineMatches) {
      const varName = match[1].trim();
      result.requirements.push({
        type: 'line',
        name: varName,
        description: `Input line of text for ${varName}`
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

    // Find eval(input()) patterns
    const evalInputMatches = [...cleanCode.matchAll(this.pythonPatterns.evalInput)];
    for (const match of evalInputMatches) {
      result.requirements.push({
        type: 'string',
        name: match[1],
        description: `Input expression for ${match[1]} (eval)`
      });
    }

    // Find raw_input() patterns (Python 2)
    const rawInputMatches = [...cleanCode.matchAll(this.pythonPatterns.rawInput)];
    for (const match of rawInputMatches) {
      result.requirements.push({
        type: 'string',
        name: match[1],
        description: `Input string value for ${match[1]}`
      });
    }

    // Find sys.stdin.readline() patterns
    const sysStdinMatches = [...cleanCode.matchAll(this.pythonPatterns.sysStdin)];
    for (const match of sysStdinMatches) {
      result.requirements.push({
        type: 'line',
        name: match[1],
        description: `Input line for ${match[1]}`
      });
    }

    // Find sys.stdin.readline().strip() patterns
    const sysStdinStripMatches = [...cleanCode.matchAll(this.pythonPatterns.sysStdinStrip)];
    for (const match of sysStdinStripMatches) {
      result.requirements.push({
        type: 'string',
        name: match[1],
        description: `Input line for ${match[1]} (stripped)`
      });
    }

    // Find multiple assignment patterns like: a, b = input().split()
    const multipleAssignMatches = [...cleanCode.matchAll(this.pythonPatterns.multipleAssign)];
    for (const match of multipleAssignMatches) {
      const vars = [match[1], match[2], match[3]].filter(Boolean);
      vars.forEach(varName => {
        result.requirements.push({
          type: 'string',
          name: varName,
          isArray: false,
          description: `Input value for ${varName} (from split)`
        });
      });
    }

    // Find list comprehension patterns like: nums = [int(x) for x in input().split()]
    const comprehensionMatches = [...cleanCode.matchAll(this.pythonPatterns.comprehensionMap)];
    for (const match of comprehensionMatches) {
      const type = match[2] === 'int' ? 'int' : match[2] === 'float' ? 'float' : 'string';
      result.requirements.push({
        type,
        name: match[1],
        isArray: true,
        description: `Input space-separated ${type} values for ${match[1]} (list comprehension)`
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
      if (!result.requirements.some(req => req.name === match[1])) {
        result.requirements.push({
          type: 'string',
          name: match[1],
          isArray: true,
          description: `Input space-separated string values for ${match[1]}`
        });
      }
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

    // Find Scanner patterns
    const scannerPatterns = [
      { pattern: this.javaPatterns.scannerInt, type: 'int' },
      { pattern: this.javaPatterns.scannerLong, type: 'int' },
      { pattern: this.javaPatterns.scannerByte, type: 'int' },
      { pattern: this.javaPatterns.scannerShort, type: 'int' },
      { pattern: this.javaPatterns.scannerDouble, type: 'float' },
      { pattern: this.javaPatterns.scannerFloat, type: 'float' },
      { pattern: this.javaPatterns.scannerBoolean, type: 'string' },
      { pattern: this.javaPatterns.scannerString, type: 'string' },
      { pattern: this.javaPatterns.scannerLine, type: 'line' }
    ];

    for (const { pattern, type } of scannerPatterns) {
      const matches = [...cleanCode.matchAll(pattern)];
      for (const match of matches) {
        result.requirements.push({
          type: type as InputRequirement['type'],
          name: match[1],
          description: `Input ${type} value for ${match[1]}`
        });
      }
    }

    // Find BufferedReader.readLine() patterns
    const bufferedReaderMatches = [...cleanCode.matchAll(this.javaPatterns.bufferedReader)];
    for (const match of bufferedReaderMatches) {
      result.requirements.push({
        type: 'line',
        name: match[1],
        description: `Input line for ${match[1]} (BufferedReader)`
      });
    }

    // Find Integer.parseInt() patterns
    const integerParseMatches = [...cleanCode.matchAll(this.javaPatterns.integerParseInt)];
    for (const match of integerParseMatches) {
      // Check if the source is a readLine() or similar input method
      const source = match[2];
      if (source.includes('readLine') || source.includes('next')) {
        result.requirements.push({
          type: 'int',
          name: match[1],
          description: `Input integer value for ${match[1]} (parsed)`
        });
      }
    }

    // Find Double.parseDouble() patterns
    const doubleParseMatches = [...cleanCode.matchAll(this.javaPatterns.doubleParseDouble)];
    for (const match of doubleParseMatches) {
      const source = match[2];
      if (source.includes('readLine') || source.includes('next')) {
        result.requirements.push({
          type: 'float',
          name: match[1],
          description: `Input double value for ${match[1]} (parsed)`
        });
      }
    }

    // Find Float.parseFloat() patterns
    const floatParseMatches = [...cleanCode.matchAll(this.javaPatterns.floatParseFloat)];
    for (const match of floatParseMatches) {
      const source = match[2];
      if (source.includes('readLine') || source.includes('next')) {
        result.requirements.push({
          type: 'float',
          name: match[1],
          description: `Input float value for ${match[1]} (parsed)`
        });
      }
    }

    // Find Long.parseLong() patterns
    const longParseMatches = [...cleanCode.matchAll(this.javaPatterns.longParseLong)];
    for (const match of longParseMatches) {
      const source = match[2];
      if (source.includes('readLine') || source.includes('next')) {
        result.requirements.push({
          type: 'int',
          name: match[1],
          description: `Input long value for ${match[1]} (parsed)`
        });
      }
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

    // Find readlineSync() patterns
    const readlineSyncMatches = [...cleanCode.matchAll(this.jsPatterns.readlineSync)];
    for (const match of readlineSyncMatches) {
      result.requirements.push({
        type: 'string',
        name: match[1],
        description: `Input string value for ${match[1]} (readline-sync)`
      });
    }

    // Find readlineSync.question() patterns
    const readlineSyncQuestionMatches = [...cleanCode.matchAll(this.jsPatterns.readlineSyncQuestion)];
    for (const match of readlineSyncQuestionMatches) {
      result.requirements.push({
        type: 'string',
        name: match[1],
        description: `Input string value for ${match[1]} (question)`
      });
    }

    // Find readlineSync.questionInt() patterns
    const readlineSyncIntMatches = [...cleanCode.matchAll(this.jsPatterns.readlineSyncInt)];
    for (const match of readlineSyncIntMatches) {
      result.requirements.push({
        type: 'int',
        name: match[1],
        description: `Input integer value for ${match[1]} (questionInt)`
      });
    }

    // Find readlineSync.questionFloat() patterns
    const readlineSyncFloatMatches = [...cleanCode.matchAll(this.jsPatterns.readlineSyncFloat)];
    for (const match of readlineSyncFloatMatches) {
      result.requirements.push({
        type: 'float',
        name: match[1],
        description: `Input float value for ${match[1]} (questionFloat)`
      });
    }

    // Find parseInt(readline()) patterns
    const parseIntMatches = [...cleanCode.matchAll(this.jsPatterns.parseInt)];
    parseIntMatches.forEach((_, index) => {
      result.requirements.push({
        type: 'int',
        name: `intInput${index + 1}`,
        description: `Input integer value`
      });
    });

    // Find parseFloat(readline()) patterns
    const parseFloatMatches = [...cleanCode.matchAll(this.jsPatterns.parseFloat)];
    parseFloatMatches.forEach((_, index) => {
      result.requirements.push({
        type: 'float',
        name: `floatInput${index + 1}`,
        description: `Input float value`
      });
    });

    // Find parseInt(prompt()) patterns
    const parseIntPromptMatches = [...cleanCode.matchAll(this.jsPatterns.parseIntPrompt)];
    parseIntPromptMatches.forEach((_, index) => {
      result.requirements.push({
        type: 'int',
        name: `promptInt${index + 1}`,
        description: `Input integer value (prompt)`
      });
    });

    // Find parseFloat(prompt()) patterns
    const parseFloatPromptMatches = [...cleanCode.matchAll(this.jsPatterns.parseFloatPrompt)];
    parseFloatPromptMatches.forEach((_, index) => {
      result.requirements.push({
        type: 'float',
        name: `promptFloat${index + 1}`,
        description: `Input float value (prompt)`
      });
    });

    // Find prompt() patterns
    const promptMatches = [...cleanCode.matchAll(this.jsPatterns.prompt)];
    for (const match of promptMatches) {
      if (!result.requirements.some(req => req.name === match[1])) {
        result.requirements.push({
          type: 'string',
          name: match[1],
          description: `Input value for ${match[1]} (prompt)`
        });
      }
    }

    // Check for process.stdin usage
    const stdinOnMatches = [...cleanCode.matchAll(this.jsPatterns.stdinOn)];
    const stdinResumeMatches = [...cleanCode.matchAll(this.jsPatterns.stdinResume)];
    const readlineInterfaceMatches = [...cleanCode.matchAll(this.jsPatterns.readlineInterface)];

    if (stdinOnMatches.length > 0 || stdinResumeMatches.length > 0 || readlineInterfaceMatches.length > 0) {
      result.requirements.push({
        type: 'string',
        name: 'stdinInput',
        description: `Input data from stdin`
      });
    }

    // Find process.argv patterns
    const processArgvMatches = [...cleanCode.matchAll(this.jsPatterns.processArgv)];
    processArgvMatches.forEach((match, index) => {
      result.requirements.push({
        type: 'string',
        name: `argv${match[1]}`,
        description: `Command line argument ${match[1]}`
      });
    });

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

    // Find typed readLine patterns
    const typedPatterns = [
      { pattern: this.kotlinPatterns.readLineInt, type: 'int' },
      { pattern: this.kotlinPatterns.readLineLong, type: 'int' },
      { pattern: this.kotlinPatterns.readLineDouble, type: 'float' },
      { pattern: this.kotlinPatterns.readLineFloat, type: 'float' },
      { pattern: this.kotlinPatterns.readLineBoolean, type: 'string' }
    ];

    for (const { pattern, type } of typedPatterns) {
      const matches = [...cleanCode.matchAll(pattern)];
      for (const match of matches) {
        result.requirements.push({
          type: type as InputRequirement['type'],
          name: match[1],
          description: `Input ${type} value for ${match[1]}`
        });
      }
    }

    // Find readLine!!.split().map patterns
    const mapMatches = [...cleanCode.matchAll(this.kotlinPatterns.readLineMap)];
    for (const match of mapMatches) {
      const typeStr = match[3].toLowerCase();
      const type = typeStr === 'int' || typeStr === 'long' ? 'int' : 
                   typeStr === 'double' || typeStr === 'float' ? 'float' : 'string';
      result.requirements.push({
        type,
        name: match[1],
        isArray: true,
        description: `Input space-separated ${type} values for ${match[1]}`
      });
    }

    // Find readLine!!.split() patterns (without map)
    const splitMatches = [...cleanCode.matchAll(this.kotlinPatterns.readLineSplit)];
    for (const match of splitMatches) {
      if (!result.requirements.some(req => req.name === match[1])) {
        result.requirements.push({
          type: 'string',
          name: match[1],
          isArray: true,
          description: `Input space-separated string values for ${match[1]}`
        });
      }
    }

    // Find Scanner patterns (if using Java Scanner in Kotlin)
    const scannerPatterns = [
      { pattern: this.kotlinPatterns.scannerNextInt, type: 'int' },
      { pattern: this.kotlinPatterns.scannerNextDouble, type: 'float' },
      { pattern: this.kotlinPatterns.scannerNextLine, type: 'line' }
    ];

    for (const { pattern, type } of scannerPatterns) {
      const matches = [...cleanCode.matchAll(pattern)];
      for (const match of matches) {
        result.requirements.push({
          type: type as InputRequirement['type'],
          name: match[1],
          description: `Input ${type} value for ${match[1]} (Scanner)`
        });
      }
    }

    // Find readLine?.toType() patterns (nullable)
    const readLineOrNullMatches = [...cleanCode.matchAll(this.kotlinPatterns.readLineOrNull)];
    for (const match of readLineOrNullMatches) {
      result.requirements.push({
        type: 'string',
        name: match[1],
        description: `Input value for ${match[1]} (nullable)`
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

    // Find Parse patterns
    const parsePatterns = [
      { pattern: this.csharpPatterns.intParse, type: 'int' },
      { pattern: this.csharpPatterns.longParse, type: 'int' },
      { pattern: this.csharpPatterns.doubleParse, type: 'float' },
      { pattern: this.csharpPatterns.floatParse, type: 'float' },
      { pattern: this.csharpPatterns.boolParse, type: 'string' }
    ];

    for (const { pattern, type } of parsePatterns) {
      const matches = [...cleanCode.matchAll(pattern)];
      for (const match of matches) {
        result.requirements.push({
          type: type as InputRequirement['type'],
          name: match[1],
          description: `Input ${type} value for ${match[1]} (Parse)`
        });
      }
    }

    // Find Convert patterns
    const convertPatterns = [
      { pattern: this.csharpPatterns.convertToInt, type: 'int' },
      { pattern: this.csharpPatterns.convertToLong, type: 'int' },
      { pattern: this.csharpPatterns.convertToDouble, type: 'float' },
      { pattern: this.csharpPatterns.convertToFloat, type: 'float' },
      { pattern: this.csharpPatterns.convertToBool, type: 'string' }
    ];

    for (const { pattern, type } of convertPatterns) {
      const matches = [...cleanCode.matchAll(pattern)];
      for (const match of matches) {
        if (!result.requirements.some(req => req.name === match[1])) {
          result.requirements.push({
            type: type as InputRequirement['type'],
            name: match[1],
            description: `Input ${type} value for ${match[1]} (Convert)`
          });
        }
      }
    }

    // Find Console.Read() patterns (single character)
    const consoleReadMatches = [...cleanCode.matchAll(this.csharpPatterns.consoleRead)];
    for (const match of consoleReadMatches) {
      result.requirements.push({
        type: 'char',
        name: match[1],
        description: `Input character for ${match[1]} (Console.Read)`
      });
    }

    // Find Console.ReadKey() patterns
    const consoleReadKeyMatches = [...cleanCode.matchAll(this.csharpPatterns.consoleReadKey)];
    for (const match of consoleReadKeyMatches) {
      result.requirements.push({
        type: 'char',
        name: match[1],
        description: `Input key for ${match[1]} (Console.ReadKey)`
      });
    }

    // Find TextReader/StreamReader/StringReader patterns
    const readerPatterns = [
      this.csharpPatterns.textReaderReadLine,
      this.csharpPatterns.streamReaderReadLine,
      this.csharpPatterns.stringReaderReadLine
    ];

    for (const pattern of readerPatterns) {
      const matches = [...cleanCode.matchAll(pattern)];
      for (const match of matches) {
        result.requirements.push({
          type: 'line',
          name: match[1],
          description: `Input line for ${match[1]} (Reader)`
        });
      }
    }

    // Find Console.ReadLine().Split().Select() patterns
    const selectManyMatches = [...cleanCode.matchAll(this.csharpPatterns.selectMany)];
    for (const match of selectManyMatches) {
      const parseType = match[3].toLowerCase();
      const type = parseType === 'int' ? 'int' : 
                   parseType === 'double' || parseType === 'float' ? 'float' : 'string';
      result.requirements.push({
        type,
        name: match[1],
        isArray: true,
        description: `Input space-separated ${type} values for ${match[1]} (Select Parse)`
      });
    }

    // Find Console.ReadLine().Split() patterns
    const splitMatches = [...cleanCode.matchAll(this.csharpPatterns.split)];
    for (const match of splitMatches) {
      if (!result.requirements.some(req => req.name === match[1])) {
        result.requirements.push({
          type: 'string',
          name: match[1],
          isArray: true,
          description: `Input space-separated string values for ${match[1]}`
        });
      }
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

    // Check for Console.In usage
    const consoleInMatches = [...cleanCode.matchAll(this.csharpPatterns.consoleIn)];
    if (consoleInMatches.length > 0) {
      result.requirements.push({
        type: 'string',
        name: 'consoleInput',
        description: `Input from Console.In`
      });
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
          case '%d': case '%o': case '%x': case '%X':
            type = 'int'; break;
          case '%f': case '%e': case '%E': case '%g': case '%G':
            type = 'float'; break;
          case '%c':
            type = 'char'; break;
          case '%s':
            type = 'string'; break;
        }

        result.requirements.push({
          type,
          name: varName,
          description: `Input ${type} value for ${varName} (fmt.Scanf)`
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
            case 'int': type = 'int'; break;
            case 'float64': type = 'float'; break;
            case 'string': type = 'string'; break;
          }
        }

        result.requirements.push({
          type,
          name: varName,
          description: `Input ${type} value for ${varName} (fmt.Scan)`
        });
      }
    }

    // Find fmt.Scanln patterns
    const scanlnMatches = [...cleanCode.matchAll(this.goPatterns.scanln)];
    for (const match of scanlnMatches) {
      const vars = match[1].split(',').map(v => v.trim().replace(/&/, ''));
      
      for (const varName of vars) {
        result.requirements.push({
          type: 'string',
          name: varName,
          description: `Input value for ${varName} (fmt.Scanln)`
        });
      }
    }

    // Find bufio.Scanner patterns
    const scannerMatches = [...cleanCode.matchAll(this.goPatterns.bufioScanner)];
    const scannerNames = new Set(scannerMatches.map(match => match[1]));

    // Find scanner.Scan() calls
    const scannerScanMatches = [...cleanCode.matchAll(this.goPatterns.scannerScan)];
    const scannerTextMatches = [...cleanCode.matchAll(this.goPatterns.scannerText)];

    if (scannerScanMatches.length > 0 || scannerTextMatches.length > 0) {
      for (const match of scannerTextMatches) {
        const varName = match[1];
        const scannerName = match[2];
        if (scannerNames.has(scannerName)) {
          result.requirements.push({
            type: 'string',
            name: varName,
            description: `Input line for ${varName} (bufio.Scanner)`
          });
        }
      }
    }

    // Find bufio.Reader patterns
    const readerMatches = [...cleanCode.matchAll(this.goPatterns.bufioReader)];
    const readerNames = new Set(readerMatches.map(match => match[1]));

    // Find reader.ReadString() patterns
    const readStringMatches = [...cleanCode.matchAll(this.goPatterns.readerReadString)];
    for (const match of readStringMatches) {
      const varName = match[1];
      const readerName = match[2];
      if (readerNames.has(readerName)) {
        result.requirements.push({
          type: 'string',
          name: varName,
          description: `Input string for ${varName} (bufio.Reader.ReadString)`
        });
      }
    }

    // Find reader.ReadLine() patterns
    const readLineMatches = [...cleanCode.matchAll(this.goPatterns.readerReadLine)];
    for (const match of readLineMatches) {
      const varName = match[1];
      const readerName = match[2];
      if (readerNames.has(readerName)) {
        result.requirements.push({
          type: 'line',
          name: varName,
          description: `Input line for ${varName} (bufio.Reader.ReadLine)`
        });
      }
    }

    // Find strconv.Atoi patterns
    const atoiMatches = [...cleanCode.matchAll(this.goPatterns.strconvAtoi)];
    for (const match of atoiMatches) {
      const varName = match[1];
      const source = match[2];
      if (source.includes('Text') || source.includes('ReadString') || source.includes('ReadLine')) {
        result.requirements.push({
          type: 'int',
          name: varName,
          description: `Input integer for ${varName} (strconv.Atoi)`
        });
      }
    }

    // Find strconv.ParseFloat patterns
    const parseFloatMatches = [...cleanCode.matchAll(this.goPatterns.strconvParseFloat)];
    for (const match of parseFloatMatches) {
      const varName = match[1];
      const source = match[2];
      if (source.includes('Text') || source.includes('ReadString') || source.includes('ReadLine')) {
        result.requirements.push({
          type: 'float',
          name: varName,
          description: `Input float for ${varName} (strconv.ParseFloat)`
        });
      }
    }

    // Find strconv.ParseInt patterns
    const parseIntMatches = [...cleanCode.matchAll(this.goPatterns.strconvParseInt)];
    for (const match of parseIntMatches) {
      const varName = match[1];
      const source = match[2];
      if (source.includes('Text') || source.includes('ReadString') || source.includes('ReadLine')) {
        result.requirements.push({
          type: 'int',
          name: varName,
          description: `Input integer for ${varName} (strconv.ParseInt)`
        });
      }
    }

    // Find os.Stdin.Read patterns
    const osStdinMatches = [...cleanCode.matchAll(this.goPatterns.osStdin)];
    if (osStdinMatches.length > 0) {
      result.requirements.push({
        type: 'string',
        name: 'stdinInput',
        description: `Input data from os.Stdin`
      });
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