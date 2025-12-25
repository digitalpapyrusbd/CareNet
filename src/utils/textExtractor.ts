import * as fs from 'fs';
import * as path from 'path';

interface ExtractedText {
  key: string;
  text: string;
  component: string;
  line: number;
  type: 'heading' | 'button' | 'label' | 'placeholder' | 'description' | 'error' | 'menu' | 'other';
  context: string;
}

interface TextExtractionResult {
  metadata: {
    languageCode: string;
    languageName: string;
    exportDate: string;
    version: string;
    totalStrings: number;
  };
  translations: Record<string, any>;
  report: {
    components: Array<{
      name: string;
      file: string;
      strings: ExtractedText[];
    }>;
  };
}

/**
 * Extract hardcoded text from React components
 */
export class TextExtractor {
  private projectRoot: string;
  private extractedTexts: Map<string, ExtractedText> = new Map();

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Scan all React components and extract hardcoded text
   */
  async extractAll(): Promise<TextExtractionResult> {
    this.extractedTexts.clear();

    // Find all React component files
    const componentFiles = await this.findComponentFiles();

    // Extract text from each file
    for (const file of componentFiles) {
      await this.extractFromFile(file);
    }

    // Organize into translation structure
    const translations = this.organizeTranslations();
    const report = this.generateReport(componentFiles);

    return {
      metadata: {
        languageCode: 'en',
        languageName: 'English',
        exportDate: new Date().toISOString().split('T')[0],
        version: '1.0',
        totalStrings: this.extractedTexts.size,
      },
      translations,
      report,
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
   * Extract text from a single file
   */
  private async extractFromFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.projectRoot, filePath);
    
    if (!fs.existsSync(fullPath)) {
      return;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');
    const componentName = this.getComponentName(filePath);

    // Extract text from JSX
    lines.forEach((line, index) => {
      // Skip comments and imports
      if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
        return;
      }

      // Extract text from JSX elements
      this.extractFromJSX(line, index + 1, componentName, filePath);
      
      // Extract from attributes (placeholder, title, alt, aria-label)
      this.extractFromAttributes(line, index + 1, componentName, filePath);
    });
  }

  /**
   * Extract text from JSX elements
   */
  private extractFromJSX(
    line: string,
    lineNumber: number,
    componentName: string,
    filePath: string
  ): void {
    // Match text content in JSX elements: <h1>Text</h1>, <button>Click</button>, etc.
    const jsxTextRegex = />([^<>{}\n]+)</g;
    let match;

    while ((match = jsxTextRegex.exec(line)) !== null) {
      const text = match[1].trim();
      if (this.isValidText(text)) {
        const key = this.generateKey(componentName, text, 'other');
        this.addExtractedText(key, text, componentName, lineNumber, 'other', filePath);
      }
    }

    // Match headings: <h1>Text</h1>, <h2>Text</h2>, etc.
    const headingRegex = /<h[1-6][^>]*>([^<]+)</g;
    while ((match = headingRegex.exec(line)) !== null) {
      const text = match[1].trim();
      if (this.isValidText(text)) {
        const key = this.generateKey(componentName, text, 'heading');
        this.addExtractedText(key, text, componentName, lineNumber, 'heading', filePath);
      }
    }

    // Match buttons: <button>Text</button>
    const buttonRegex = /<button[^>]*>([^<]+)</g;
    while ((match = buttonRegex.exec(line)) !== null) {
      const text = match[1].trim();
      if (this.isValidText(text)) {
        const key = this.generateKey(componentName, text, 'button');
        this.addExtractedText(key, text, componentName, lineNumber, 'button', filePath);
      }
    }
  }

  /**
   * Extract text from JSX attributes
   */
  private extractFromAttributes(
    line: string,
    lineNumber: number,
    componentName: string,
    filePath: string
  ): void {
    // Match placeholder="text"
    const placeholderRegex = /placeholder=["']([^"']+)["']/g;
    let match;
    while ((match = placeholderRegex.exec(line)) !== null) {
      const text = match[1].trim();
      if (this.isValidText(text)) {
        const key = this.generateKey(componentName, text, 'placeholder');
        this.addExtractedText(key, text, componentName, lineNumber, 'placeholder', filePath);
      }
    }

    // Match title="text", alt="text", aria-label="text"
    const attrRegex = /(title|alt|aria-label)=["']([^"']+)["']/g;
    while ((match = attrRegex.exec(line)) !== null) {
      const text = match[2].trim();
      if (this.isValidText(text)) {
        const key = this.generateKey(componentName, text, 'label');
        this.addExtractedText(key, text, componentName, lineNumber, 'label', filePath);
      }
    }
  }

  /**
   * Check if text is valid for extraction
   */
  private isValidText(text: string): boolean {
    if (!text || text.length < 2) return false;
    
    // Exclude code-like strings
    if (/^[A-Z_][A-Z0-9_]*$/.test(text)) return false; // Constants
    if (/^[a-z]+\(/.test(text)) return false; // Function calls
    if (/^[a-z]+\.[a-z]+/.test(text)) return false; // Object properties
    if (/^[0-9]+$/.test(text)) return false; // Numbers only
    if (/^[#@$%&*]+$/.test(text)) return false; // Special chars only
    if (text.startsWith('http') || text.startsWith('//')) return false; // URLs
    if (text.includes('className') || text.includes('style=')) return false; // Code
    
    // Must contain at least one letter
    return /[a-zA-Z]/.test(text);
  }

  /**
   * Generate a translation key
   */
  private generateKey(componentName: string, text: string, type: ExtractedText['type']): string {
    const normalizedComponent = componentName
      .replace(/Page$/, '')
      .replace(/Component$/, '')
      .toLowerCase();
    
    const normalizedText = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .substring(0, 20);
    
    return `${normalizedComponent}.${type}.${normalizedText}`;
  }

  /**
   * Add extracted text to collection
   */
  private addExtractedText(
    key: string,
    text: string,
    component: string,
    line: number,
    type: ExtractedText['type'],
    filePath: string
  ): void {
    // Use existing entry if key exists, otherwise create new
    if (!this.extractedTexts.has(key)) {
      this.extractedTexts.set(key, {
        key,
        text,
        component,
        line,
        type,
        context: filePath,
      });
    }
  }

  /**
   * Get component name from file path
   */
  private getComponentName(filePath: string): string {
    const fileName = path.basename(filePath, path.extname(filePath));
    return fileName;
  }

  /**
   * Organize extracted texts into translation structure
   */
  private organizeTranslations(): Record<string, any> {
    const translations: Record<string, any> = {};

    this.extractedTexts.forEach((extracted) => {
      const [section, type, ...rest] = extracted.key.split('.');
      
      if (!translations[section]) {
        translations[section] = {};
      }
      
      if (!translations[section][type]) {
        translations[section][type] = {};
      }
      
      const descriptor = rest.join('.');
      translations[section][type][descriptor] = extracted.text;
    });

    return translations;
  }

  /**
   * Generate report of extracted texts
   */
  private generateReport(files: string[]): TextExtractionResult['report'] {
    const components = new Map<string, ExtractedText[]>();

    this.extractedTexts.forEach((extracted) => {
      if (!components.has(extracted.component)) {
        components.set(extracted.component, []);
      }
      components.get(extracted.component)!.push(extracted);
    });

    return {
      components: Array.from(components.entries()).map(([name, strings]) => ({
        name,
        file: strings[0]?.context || '',
        strings,
      })),
    };
  }

  /**
   * Export to JSON file
   */
  async exportToFile(outputPath: string): Promise<void> {
    const result = await this.extractAll();
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
  }
}
