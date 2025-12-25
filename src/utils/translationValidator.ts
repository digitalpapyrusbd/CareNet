import * as fs from 'fs';
import * as path from 'path';

interface ValidationIssue {
  component: string;
  file: string;
  line: number;
  text: string;
  suggestedKey: string;
  type: 'hardcoded' | 'missing-translation';
}

interface ValidationResult {
  issues: ValidationIssue[];
  totalIssues: number;
  componentsWithIssues: number;
}

/**
 * Validates that all text in components uses translation keys
 */
export class TranslationValidator {
  private projectRoot: string;
  private issues: ValidationIssue[] = [];

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Check for untranslated text in all components
   */
  async validate(): Promise<ValidationResult> {
    this.issues = [];

    // Find all React component files
    const componentFiles = await this.findComponentFiles();

    // Validate each file
    for (const file of componentFiles) {
      await this.validateFile(file);
    }

    const componentsWithIssues = new Set(this.issues.map(i => i.component)).size;

    return {
      issues: this.issues,
      totalIssues: this.issues.length,
      componentsWithIssues,
    };
  }

  /**
   * Find all React component files
   */
  private async findComponentFiles(): Promise<string[]> {
    const files: string[] = [];
    const directories = [
      path.join(this.projectRoot, 'src', 'app'),
      path.join(this.projectRoot, 'src', 'components'),
    ];

    const shouldIgnore = (filePath: string): boolean => {
      const normalized = filePath.replace(/\\/g, '/');
      return (
        normalized.includes('node_modules') ||
        normalized.includes('.next') ||
        normalized.includes('dist') ||
        normalized.includes('build') ||
        normalized.includes('.test.') ||
        normalized.includes('.spec.')
      );
    };

    const findFiles = (dir: string, baseDir: string = ''): void => {
      if (!fs.existsSync(dir)) return;

      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = baseDir ? path.join(baseDir, entry.name) : entry.name;

        if (shouldIgnore(fullPath)) continue;

        if (entry.isDirectory()) {
          findFiles(fullPath, relativePath);
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))) {
          files.push(path.join('src', relativePath).replace(/\\/g, '/'));
        }
      }
    };

    for (const dir of directories) {
      if (fs.existsSync(dir)) {
        const baseDir = path.relative(path.join(this.projectRoot, 'src'), dir);
        findFiles(dir, baseDir);
      }
    }

    return [...new Set(files)];
  }

  /**
   * Validate a single file
   */
  private async validateFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.projectRoot, filePath);
    
    if (!fs.existsSync(fullPath)) {
      return;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');
    const componentName = this.getComponentName(filePath);

    // Check if file already uses translations
    const usesTranslations = content.includes('useTranslation') || content.includes('t(');

    lines.forEach((line, index) => {
      // Skip comments
      if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
        return;
      }

      // Check for hardcoded text in JSX
      this.checkJSXText(line, index + 1, componentName, filePath, usesTranslations);
      
      // Check for hardcoded attributes
      this.checkAttributes(line, index + 1, componentName, filePath, usesTranslations);
    });
  }

  /**
   * Check for hardcoded text in JSX
   */
  private checkJSXText(
    line: string,
    lineNumber: number,
    componentName: string,
    filePath: string,
    usesTranslations: boolean
  ): void {
    // Skip lines that already use t()
    if (line.includes('t(') || line.includes('{t(')) {
      return;
    }

    // Check for text in JSX elements
    const jsxTextRegex = />([^<>{}\n]+)</g;
    let match;

    while ((match = jsxTextRegex.exec(line)) !== null) {
      const text = match[1].trim();
      if (this.isHardcodedText(text)) {
        const suggestedKey = this.generateKey(componentName, text);
        this.issues.push({
          component: componentName,
          file: filePath,
          line: lineNumber,
          text,
          suggestedKey,
          type: 'hardcoded',
        });
      }
    }
  }

  /**
   * Check for hardcoded attributes
   */
  private checkAttributes(
    line: string,
    lineNumber: number,
    componentName: string,
    filePath: string,
    usesTranslations: boolean
  ): void {
    // Skip lines that already use t()
    if (line.includes('t(') || line.includes('{t(')) {
      return;
    }

    // Check placeholder, title, alt, aria-label
    const attrRegex = /(placeholder|title|alt|aria-label)=["']([^"']+)["']/g;
    let match;

    while ((match = attrRegex.exec(line)) !== null) {
      const text = match[2].trim();
      if (this.isHardcodedText(text)) {
        const suggestedKey = this.generateKey(componentName, text);
        this.issues.push({
          component: componentName,
          file: filePath,
          line: lineNumber,
          text,
          suggestedKey,
          type: 'hardcoded',
        });
      }
    }
  }

  /**
   * Check if text is hardcoded (not a variable or function call)
   */
  private isHardcodedText(text: string): boolean {
    if (!text || text.length < 2) return false;
    
    // Exclude variables and function calls
    if (text.startsWith('{') && text.endsWith('}')) return false; // JSX expression
    if (text.includes('${')) return false; // Template literal
    if (/^[A-Z_][A-Z0-9_]*$/.test(text)) return false; // Constants
    if (/^[a-z]+\(/.test(text)) return false; // Function calls
    if (text.startsWith('http') || text.startsWith('//')) return false; // URLs
    if (text.includes('className') || text.includes('style=')) return false; // Code
    
    // Must contain at least one letter and look like user-facing text
    return /[a-zA-Z]/.test(text) && text.length > 1;
  }

  /**
   * Generate suggested translation key
   */
  private generateKey(componentName: string, text: string): string {
    const normalizedComponent = componentName
      .replace(/Page$/, '')
      .replace(/Component$/, '')
      .toLowerCase();
    
    const normalizedText = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .substring(0, 20);
    
    return `${normalizedComponent}.${normalizedText}`;
  }

  /**
   * Get component name from file path
   */
  private getComponentName(filePath: string): string {
    const fileName = path.basename(filePath, path.extname(filePath));
    return fileName;
  }

  /**
   * Export validation report to JSON
   */
  exportReport(outputPath: string): void {
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: this.issues.length,
      componentsWithIssues: new Set(this.issues.map(i => i.component)).size,
      issues: this.issues,
    };

    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
  }
}
