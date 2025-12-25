import * as fs from "fs";
import * as path from "path";

// Server-side logging helper - writes directly to log file
function logToFile(data: any): void {
  try {
    // Find project root (same logic as constructor)
    let projectRoot = process.cwd();
    let currentDir = process.cwd();
    let found = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!found && attempts < maxAttempts) {
      const packageJsonPath = path.join(currentDir, "package.json");
      if (fs.existsSync(packageJsonPath)) {
        found = true;
        projectRoot = currentDir;
      } else {
        const parent = path.dirname(currentDir);
        if (parent === currentDir) break;
        currentDir = parent;
        attempts++;
      }
    }

    const logPath = path.join(projectRoot, ".cursor", "debug.log");
    const logDir = path.dirname(logPath);

    // Ensure directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logLine = JSON.stringify(data) + "\n";
    fs.appendFileSync(logPath, logLine, "utf-8");
  } catch (err) {
    // Silently fail if log file can't be written
    console.error("Failed to write debug log:", err);
  }
}

export interface TextReplacement {
  id: string;
  component: string;
  filePath: string;
  line: number;
  originalText: string;
  replacement: string;
  key: string;
  type: "jsx" | "attribute" | "other";
  context: string;
  selected: boolean;
}

export interface ScrubberResult {
  replacements: TextReplacement[];
  totalFound: number;
  componentsAffected: number;
  backupCreated: boolean;
  backupPath?: string;
}

/**
 * Text Scrubber - Automatically replace hardcoded text with translation keys
 */
export class TextScrubber {
  private projectRoot: string = process.cwd();
  private replacements: TextReplacement[] = [];
  private keyCounter: Map<string, number> = new Map();

  constructor(projectRoot?: string) {
    // Resolve project root - handle Next.js build directory issues
    if (projectRoot) {
      this.projectRoot = path.resolve(projectRoot);
    } else {
      // Try to find the actual project root by looking for package.json
      let currentDir = process.cwd();
      let found = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!found && attempts < maxAttempts) {
        const packageJsonPath = path.join(currentDir, "package.json");
        if (fs.existsSync(packageJsonPath)) {
          found = true;
          this.projectRoot = currentDir;
        } else {
          const parent = path.dirname(currentDir);
          if (parent === currentDir) break; // Reached filesystem root
          currentDir = parent;
          attempts++;
        }
      }

      if (!found) {
        // Fallback to process.cwd() but resolve it
        this.projectRoot = path.resolve(process.cwd());
      }
    }

    // #region agent log
    logToFile({
      location: "utils/textScrubber.ts:40",
      message: "TextScrubber initialized",
      data: {
        projectRoot: this.projectRoot,
        processCwd: process.cwd(),
        resolved: path.resolve(this.projectRoot),
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "A",
    });
    // #endregion
  }

  /**
   * Scan all components for hardcoded text (dry-run mode)
   */
  async scanComponents(): Promise<ScrubberResult> {
    this.replacements = [];
    this.keyCounter.clear();

    const componentFiles = await this.findComponentFiles();

    // #region agent log
    logToFile({
      location: "utils/textScrubber.ts:110",
      message: "Starting scan of all files",
      data: {
        totalFiles: componentFiles.length,
        files: componentFiles.slice(0, 10),
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "O",
    });
    // #endregion

    for (const file of componentFiles) {
      try {
        await this.scanFile(file);
      } catch (error: any) {
        // #region agent log
        logToFile({
          location: "utils/textScrubber.ts:117",
          message: "Error in scanFile, continuing",
          data: { file, error: error.message },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "P",
        });
        // #endregion
        // Continue scanning other files even if one fails
        console.error(`Error scanning file ${file}:`, error.message);
      }
    }

    // #region agent log
    logToFile({
      location: "utils/textScrubber.ts:125",
      message: "Scan completed",
      data: {
        totalReplacements: this.replacements.length,
        filesScanned: componentFiles.length,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "Q",
    });
    // #endregion

    const componentsAffected = new Set(
      this.replacements.map((r) => r.component),
    ).size;

    return {
      replacements: this.replacements,
      totalFound: this.replacements.length,
      componentsAffected,
      backupCreated: false,
    };
  }

  /**
   * Apply replacements to files
   */
  async applyReplacements(
    selectedReplacements: string[],
    createBackup: boolean = true,
  ): Promise<{ success: boolean; backupPath?: string; errors: string[] }> {
    // #region agent log
    logToFile({
      location: "utils/textScrubber.ts:100",
      message: "applyReplacements started",
      data: {
        selectedReplacementsCount: selectedReplacements.length,
        totalReplacements: this.replacements.length,
        selectedIds: selectedReplacements.slice(0, 5),
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "T",
    });
    // #endregion

    const errors: string[] = [];
    let backupPath: string | undefined;

    // Group replacements by file
    const replacementsByFile = new Map<string, TextReplacement[]>();

    for (const replacement of this.replacements) {
      if (selectedReplacements.includes(replacement.id)) {
        if (!replacementsByFile.has(replacement.filePath)) {
          replacementsByFile.set(replacement.filePath, []);
        }
        replacementsByFile.get(replacement.filePath)!.push(replacement);
      }
    }

    // #region agent log
    logToFile({
      location: "utils/textScrubber.ts:120",
      message: "Replacements grouped by file",
      data: {
        filesToModify: Array.from(replacementsByFile.keys()),
        fileCount: replacementsByFile.size,
        totalReplacementsToApply: Array.from(replacementsByFile.values()).flat()
          .length,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "U",
    });
    // #endregion

    // Create backup if requested
    if (createBackup) {
      backupPath = await this.createBackup(
        Array.from(replacementsByFile.keys()),
      );
    }

    // Apply replacements to each file
    for (const [filePath, replacements] of replacementsByFile.entries()) {
      try {
        // #region agent log
        logToFile({
          location: "utils/textScrubber.ts:130",
          message: "Applying to file",
          data: {
            filePath,
            replacementsCount: replacements.length,
            replacements: replacements.map((r) => ({
              id: r.id,
              line: r.line,
              originalText: r.originalText.substring(0, 50),
            })),
          },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "V",
        });
        // #endregion
        await this.applyToFile(filePath, replacements);
        // #region agent log
        logToFile({
          location: "utils/textScrubber.ts:133",
          message: "File applied successfully",
          data: { filePath },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "W",
        });
        // #endregion
      } catch (error: any) {
        // #region agent log
        logToFile({
          location: "utils/textScrubber.ts:139",
          message: "Error applying to file",
          data: {
            filePath,
            error: error.message,
            errorStack: error.stack?.substring(0, 200),
          },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "X",
        });
        // #endregion
        errors.push(`Error in ${filePath}: ${error.message}`);
      }
    }

    // Update translation JSON files
    try {
      await this.updateTranslationFiles();
    } catch (error: any) {
      errors.push(`Error updating translation files: ${error.message}`);
    }

    const result = {
      success: errors.length === 0,
      backupPath,
      errors,
    };

    // #region agent log
    logToFile({
      location: "utils/textScrubber.ts:145",
      message: "applyReplacements completed",
      data: {
        success: result.success,
        errorsCount: result.errors.length,
        hasBackup: !!result.backupPath,
        errors: result.errors.slice(0, 3),
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "Y",
    });
    // #endregion

    return result;
  }

  /**
   * Find all React component files
   */
  private async findComponentFiles(): Promise<string[]> {
    const files: string[] = [];
    const directories = [
      path.join(this.projectRoot, "src", "app"),
      path.join(this.projectRoot, "src", "components"),
    ];

    const shouldIgnore = (filePath: string): boolean => {
      const normalized = filePath.replace(/\\/g, "/");
      return (
        normalized.includes("node_modules") ||
        normalized.includes(".next") ||
        normalized.includes("dist") ||
        normalized.includes("build") ||
        normalized.includes(".test.") ||
        normalized.includes(".spec.")
      );
    };

    const findFiles = (dir: string, baseDir: string = ""): void => {
      if (!fs.existsSync(dir)) return;

      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = baseDir
          ? path.join(baseDir, entry.name)
          : entry.name;

        if (shouldIgnore(fullPath)) continue;

        if (entry.isDirectory()) {
          findFiles(fullPath, relativePath);
        } else if (
          entry.isFile() &&
          (entry.name.endsWith(".tsx") || entry.name.endsWith(".jsx"))
        ) {
          files.push(path.join("src", relativePath).replace(/\\/g, "/"));
        }
      }
    };

    for (const dir of directories) {
      if (fs.existsSync(dir)) {
        const baseDir = path.relative(path.join(this.projectRoot, "src"), dir);
        findFiles(dir, baseDir);
      }
    }

    return [...new Set(files)];
  }

  /**
   * Scan a single file for hardcoded text
   */
  private async scanFile(filePath: string): Promise<void> {
    const fullPath = path.resolve(this.projectRoot, filePath);

    // #region agent log
    logToFile({
      location: "utils/textScrubber.ts:195",
      message: "Scanning file",
      data: {
        filePath,
        fullPath,
        exists: fs.existsSync(fullPath),
        projectRoot: this.projectRoot,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "K",
    });
    // #endregion

    try {
      if (!fs.existsSync(fullPath)) {
        // #region agent log
        logToFile({
          location: "utils/textScrubber.ts:200",
          message: "File not found during scan",
          data: { filePath, fullPath },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "L",
        });
        // #endregion
        return;
      }

      const content = fs.readFileSync(fullPath, "utf-8");
      const lines = content.split("\n");
      const componentName = this.getComponentName(filePath);
      const usesTranslation =
        content.includes("useTranslation") || content.includes("t(");

      lines.forEach((line, index) => {
        try {
          // Skip comments and imports
          if (
            line.trim().startsWith("//") ||
            line.trim().startsWith("/*") ||
            line.trim().startsWith("*") ||
            line.trim().startsWith("import")
          ) {
            return;
          }

          // Skip lines that already use t()
          if (line.includes("t(") || line.includes("{t(")) {
            return;
          }

          // Extract from JSX elements
          this.extractFromJSX(
            line,
            index + 1,
            componentName,
            filePath,
            usesTranslation,
          );

          // Extract from attributes
          this.extractFromAttributes(
            line,
            index + 1,
            componentName,
            filePath,
            usesTranslation,
          );
        } catch (lineError: any) {
          // #region agent log
          logToFile({
            location: "utils/textScrubber.ts:295",
            message: "Error processing line",
            data: {
              filePath,
              lineNumber: index + 1,
              error: lineError.message,
              line: line.substring(0, 100),
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "M",
          });
          // #endregion
          // Continue processing other lines even if one line fails
        }
      });
    } catch (error: any) {
      // #region agent log
      logToFile({
        location: "utils/textScrubber.ts:300",
        message: "Error scanning file",
        data: {
          filePath,
          fullPath,
          error: error.message,
          errorStack: error.stack?.substring(0, 300),
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "N",
      });
      // #endregion
      // Don't throw - continue scanning other files even if one file fails
      console.error(`Error scanning file ${filePath}:`, error.message);
    }
  }

  /**
   * Extract text from JSX elements
   */
  private extractFromJSX(
    line: string,
    lineNumber: number,
    componentName: string,
    filePath: string,
    usesTranslation: boolean,
  ): void {
    // Match headings: <h1>Text</h1> or <h1 ...>Text</h1>
    // Updated regex to capture the full tag including attributes
    const headingRegex = /<h([1-6])[^>]*>([^<{]+)<\/h[1-6]>/g;
    let match;
    while ((match = headingRegex.exec(line)) !== null) {
      const text = match[2].trim();
      if (this.isValidText(text)) {
        const key = this.generateKey(componentName, text, "heading");
        const replacement = `{t('${key}')}`;
        // Store the full tag match for better replacement
        const fullMatch = match[0];
        const tagStart = fullMatch.substring(0, fullMatch.indexOf(">") + 1);
        const tagEnd = fullMatch.substring(fullMatch.lastIndexOf("</"));
        // Store both the text and the full pattern for replacement
        this.addReplacement(
          componentName,
          filePath,
          lineNumber,
          text, // Store just the text for key generation
          replacement,
          key,
          "jsx",
          line,
          usesTranslation,
          fullMatch, // Pass the full match for better replacement
        );
      }
    }

    // Match buttons: <button>Text</button>
    const buttonRegex = /<button[^>]*>([^<{]+)<\/button>/g;
    while ((match = buttonRegex.exec(line)) !== null) {
      const text = match[1].trim();
      if (this.isValidText(text)) {
        const key = this.generateKey(componentName, text, "button");
        const replacement = `{t('${key}')}`;
        this.addReplacement(
          componentName,
          filePath,
          lineNumber,
          text,
          replacement,
          key,
          "jsx",
          line,
          usesTranslation,
        );
      }
    }

    // Match text in JSX: >Text<
    const jsxTextRegex = />([^<>{}\n]+)</g;
    while ((match = jsxTextRegex.exec(line)) !== null) {
      const text = match[1].trim();
      if (this.isValidText(text) && !text.match(/^[A-Z_][A-Z0-9_]*$/)) {
        const key = this.generateKey(componentName, text, "text");
        const replacement = `{t('${key}')}`;
        this.addReplacement(
          componentName,
          filePath,
          lineNumber,
          text,
          replacement,
          key,
          "jsx",
          line,
          usesTranslation,
        );
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
    filePath: string,
    usesTranslation: boolean,
  ): void {
    // Match placeholder="text"
    const placeholderRegex = /placeholder=["']([^"']+)["']/g;
    let match;
    while ((match = placeholderRegex.exec(line)) !== null) {
      const text = match[1].trim();
      if (this.isValidText(text)) {
        const key = this.generateKey(componentName, text, "placeholder");
        const replacement = `placeholder={t('${key}')}`;
        this.addReplacement(
          componentName,
          filePath,
          lineNumber,
          `placeholder="${text}"`,
          replacement,
          key,
          "attribute",
          line,
          usesTranslation,
        );
      }
    }

    // Match title="text", alt="text", aria-label="text"
    const attrRegex = /(title|alt|aria-label)=["']([^"']+)["']/g;
    while ((match = attrRegex.exec(line)) !== null) {
      const text = match[2].trim();
      if (this.isValidText(text)) {
        const key = this.generateKey(componentName, text, "label");
        const replacement = `${match[1]}={t('${key}')}`;
        this.addReplacement(
          componentName,
          filePath,
          lineNumber,
          `${match[1]}="${text}"`,
          replacement,
          key,
          "attribute",
          line,
          usesTranslation,
        );
      }
    }
  }

  /**
   * Check if text is valid for replacement
   */
  private isValidText(text: string): boolean {
    if (!text || text.length < 2) return false;

    // Exclude code-like strings
    if (/^[A-Z_][A-Z0-9_]*$/.test(text)) return false; // Constants
    if (/^[a-z]+\(/.test(text)) return false; // Function calls
    if (/^[0-9]+$/.test(text)) return false; // Numbers only
    if (text.startsWith("http") || text.startsWith("//")) return false; // URLs
    if (text.includes("className") || text.includes("style=")) return false; // Code
    if (text.includes("${") || text.includes("{")) return false; // Already has interpolation

    // Must contain at least one letter
    return /[a-zA-Z]/.test(text);
  }

  /**
   * Generate a unique translation key
   */
  private generateKey(
    componentName: string,
    text: string,
    type: string,
  ): string {
    const normalizedComponent = componentName
      .replace(/Page$/, "")
      .replace(/Component$/, "")
      .toLowerCase();

    const normalizedText = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .substring(0, 20);

    const baseKey = `${normalizedComponent}.${type}.${normalizedText}`;

    // Handle duplicates
    const count = this.keyCounter.get(baseKey) || 0;
    this.keyCounter.set(baseKey, count + 1);

    return count > 0 ? `${baseKey}${count}` : baseKey;
  }

  /**
   * Add a replacement to the list
   */
  private addReplacement(
    component: string,
    filePath: string,
    line: number,
    originalText: string,
    replacement: string,
    key: string,
    type: TextReplacement["type"],
    context: string,
    usesTranslation: boolean,
    fullMatch?: string, // Optional full match for better replacement
  ): void {
    const id = `${filePath}-${line}-${this.replacements.length}`;

    // If fullMatch is provided, use it for replacement; otherwise use originalText
    const replacementText = fullMatch || originalText;
    // For JSX, we need to replace the text within the tag
    let finalReplacement = replacement;
    if (fullMatch && type === "jsx") {
      // Replace the text portion within the full match
      // fullMatch is like: <h1 style={{...}}>Platform Analytics</h1>
      // We need: <h1 style={{...}}>{t('key')}</h1>
      const tagStart = fullMatch.substring(0, fullMatch.indexOf(">") + 1);
      const tagEnd = fullMatch.substring(fullMatch.lastIndexOf("</"));
      finalReplacement = `${tagStart}${replacement}${tagEnd}`;
    }

    // #region agent log
    logToFile({
      location: "utils/textScrubber.ts:480",
      message: "Adding replacement",
      data: {
        filePath,
        line,
        originalText: replacementText.substring(0, 100),
        replacement: finalReplacement.substring(0, 100),
        hasFullMatch: !!fullMatch,
        type,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "M",
    });
    // #endregion

    this.replacements.push({
      id,
      component,
      filePath,
      line,
      originalText: replacementText, // Store the full match if available
      replacement: finalReplacement,
      key,
      type,
      context: context.trim(),
      selected: true, // Default to selected
    });
  }

  /**
   * Apply replacements to a file
   */
  private async applyToFile(
    filePath: string,
    replacements: TextReplacement[],
  ): Promise<void> {
    const fullPath = path.resolve(this.projectRoot, filePath);

    // #region agent log
    logToFile({
      location: "utils/textScrubber.ts:505",
      message: "Before reading file",
      data: {
        filePath,
        fullPath,
        exists: fs.existsSync(fullPath),
        projectRoot: this.projectRoot,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "B",
    });
    // #endregion

    if (!fs.existsSync(fullPath)) {
      // #region agent log
      logToFile({
        location: "utils/textScrubber.ts:510",
        message: "File does not exist",
        data: { fullPath },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "C",
      });
      // #endregion
      throw new Error(`File not found: ${fullPath}`);
    }

    let content = fs.readFileSync(fullPath, "utf-8");
    const originalContent = content;
    const lines = content.split("\n");

    // #region agent log
    logToFile({
      location: "utils/textScrubber.ts:520",
      message: "After reading file",
      data: {
        filePath,
        fullPath,
        lineCount: lines.length,
        contentLength: content.length,
        firstLine: lines[0]?.substring(0, 50),
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "D",
    });
    // #endregion

    // Sort replacements by line number (descending) to avoid line number shifts
    const sortedReplacements = [...replacements].sort(
      (a, b) => b.line - a.line,
    );

    // #region agent log
    logToFile({
      location: "utils/textScrubber.ts:527",
      message: "Replacements to apply",
      data: {
        count: sortedReplacements.length,
        replacements: sortedReplacements.map((r) => ({
          line: r.line,
          originalText: r.originalText.substring(0, 50),
          replacement: r.replacement.substring(0, 50),
        })),
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "E",
    });
    // #endregion

    // Check if we need to add imports and hooks
    const needsTranslationImport = !content.includes("useTranslation");
    const needsTranslationHook =
      !content.includes("const { t } = useTranslation()") &&
      !content.includes("const { t } = useTranslationContext()");

    // Apply replacements
    for (const replacement of sortedReplacements) {
      const lineIndex = replacement.line - 1;
      if (lineIndex >= 0 && lineIndex < lines.length) {
        const originalLine = lines[lineIndex];
        let lineChanged = false;

        // Replace the text in the line
        if (replacement.type === "attribute") {
          // Replace attribute - use exact match first, then try regex
          if (lines[lineIndex].includes(replacement.originalText)) {
            lines[lineIndex] = lines[lineIndex].replace(
              replacement.originalText,
              replacement.replacement,
            );
            lineChanged = originalLine !== lines[lineIndex];
          } else {
            // Try regex replacement for attributes
            const escapedOriginal = replacement.originalText.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&",
            );
            const regex = new RegExp(escapedOriginal, "g");
            if (regex.test(lines[lineIndex])) {
              lines[lineIndex] = lines[lineIndex].replace(
                regex,
                replacement.replacement,
              );
              lineChanged = originalLine !== lines[lineIndex];
            }
          }
        } else {
          // Replace JSX text - handle different patterns
          // Check if originalText is a full tag match (starts with < and ends with >)
          if (
            replacement.originalText.startsWith("<") &&
            replacement.originalText.endsWith(">")
          ) {
            // Full tag replacement
            const escapedFull = replacement.originalText.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&",
            );
            const fullRegex = new RegExp(escapedFull, "g");
            if (fullRegex.test(lines[lineIndex])) {
              lines[lineIndex] = lines[lineIndex].replace(
                fullRegex,
                replacement.replacement,
              );
              lineChanged = originalLine !== lines[lineIndex];
            }
          } else {
            // Text-only replacement - try exact match first
            if (lines[lineIndex].includes(replacement.originalText)) {
              // Try to replace within JSX context: >Text< or >Text</tag>
              const escapedText = replacement.originalText.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&",
              );
              // Pattern: >Text< or >Text</tag> or >Text</h1> (but not already in {t(...)})
              const patterns = [
                new RegExp(`>${escapedText}<`, "g"),
                new RegExp(`>${escapedText}</`, "g"),
                new RegExp(`>${escapedText}</h[1-6]>`, "g"),
              ];

              let replaced = false;
              for (const pattern of patterns) {
                if (pattern.test(lines[lineIndex])) {
                  // Replace the text with translation key
                  lines[lineIndex] = lines[lineIndex].replace(
                    pattern,
                    (match) => {
                      return match.replace(
                        escapedText,
                        replacement.replacement,
                      );
                    },
                  );
                  replaced = true;
                  break;
                }
              }

              // If pattern matching didn't work, try simple replace
              if (!replaced) {
                lines[lineIndex] = lines[lineIndex].replace(
                  replacement.originalText,
                  replacement.replacement,
                );
              }

              lineChanged = originalLine !== lines[lineIndex];
            }
          }
        }

        // #region agent log
        if (lineChanged) {
          logToFile({
            location: "utils/textScrubber.ts:610",
            message: "Line replaced",
            data: {
              lineNumber: replacement.line,
              originalLine: originalLine.substring(0, 100),
              newLine: lines[lineIndex].substring(0, 100),
              originalText: replacement.originalText,
              replacement: replacement.replacement,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "F",
          });
        } else {
          logToFile({
            location: "utils/textScrubber.ts:612",
            message: "Line NOT replaced",
            data: {
              lineNumber: replacement.line,
              originalLine: originalLine.substring(0, 150),
              originalText: replacement.originalText,
              replacement: replacement.replacement,
              type: replacement.type,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "G",
          });
        }
        // #endregion
      }
    }

    // Add imports and hooks if needed
    if (needsTranslationImport || needsTranslationHook) {
      const importLine =
        "import { useTranslationContext } from '@/components/providers/TranslationProvider';";
      const hookLine = "  const { t } = useTranslationContext();";

      // Find the last import line
      let lastImportIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith("import ")) {
          lastImportIndex = i;
        } else if (lastImportIndex >= 0 && lines[i].trim() === "") {
          break;
        }
      }

      // Add import after last import
      if (needsTranslationImport && lastImportIndex >= 0) {
        lines.splice(lastImportIndex + 1, 0, importLine);
      }

      // Find component function start
      let componentStartIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (
          lines[i].includes("export default function") ||
          lines[i].includes("export function") ||
          lines[i].includes("function ")
        ) {
          // Find the opening brace
          for (let j = i; j < lines.length && j < i + 5; j++) {
            if (lines[j].includes("{")) {
              componentStartIndex = j + 1;
              break;
            }
          }
          break;
        }
      }

      // Add hook after component start
      if (needsTranslationHook && componentStartIndex >= 0) {
        lines.splice(componentStartIndex, 0, hookLine);
      }
    }

    // Write updated content
    content = lines.join("\n");

    // #region agent log
    logToFile({
      location: "utils/textScrubber.ts:665",
      message: "Before writing file",
      data: {
        filePath,
        fullPath,
        contentChanged: content !== originalContent,
        originalLength: originalContent.length,
        newLength: content.length,
        firstDiff:
          content.substring(0, 200) !== originalContent.substring(0, 200),
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "H",
    });
    // #endregion

    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, "utf-8");

      // #region agent log
      const writtenContent = fs.readFileSync(fullPath, "utf-8");
      logToFile({
        location: "utils/textScrubber.ts:674",
        message: "After writing file",
        data: {
          filePath,
          fullPath,
          written: true,
          fileExists: fs.existsSync(fullPath),
          verifyContent:
            writtenContent.substring(0, 200) === content.substring(0, 200),
          writtenLength: writtenContent.length,
          expectedLength: content.length,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "I",
      });
      // #endregion
    } else {
      // #region agent log
      logToFile({
        location: "utils/textScrubber.ts:675",
        message: "Content unchanged, skipping write",
        data: { filePath, fullPath },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "J",
      });
      // #endregion
    }
  }

  /**
   * Update translation JSON files with new keys
   */
  private async updateTranslationFiles(): Promise<void> {
    const localesDir = path.join(this.projectRoot, "src/lib/locales");
    const enFile = path.join(localesDir, "en.json");

    if (!fs.existsSync(enFile)) {
      return;
    }

    // Read existing translations
    const existing = JSON.parse(fs.readFileSync(enFile, "utf-8"));

    // Add new keys
    for (const replacement of this.replacements) {
      if (replacement.selected) {
        this.addKeyToObject(
          existing,
          replacement.key,
          replacement.originalText,
        );
      }
    }

    // Write updated translations
    fs.writeFileSync(enFile, JSON.stringify(existing, null, 2), "utf-8");
  }

  /**
   * Add a key to nested translation object
   */
  private addKeyToObject(obj: any, key: string, value: string): void {
    const parts = key.split(".");
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }

    // Only add if doesn't exist
    if (!current[parts[parts.length - 1]]) {
      current[parts[parts.length - 1]] = value;
    }
  }

  /**
   * Create backup of files
   */
  private async createBackup(filePaths: string[]): Promise<string> {
    const backupDir = path.join(
      this.projectRoot,
      ".backups",
      `scrubber-${Date.now()}`,
    );
    fs.mkdirSync(backupDir, { recursive: true });

    for (const filePath of filePaths) {
      const fullPath = path.join(this.projectRoot, filePath);
      if (fs.existsSync(fullPath)) {
        const backupPath = path.join(backupDir, filePath);
        const backupDirPath = path.dirname(backupPath);
        fs.mkdirSync(backupDirPath, { recursive: true });
        fs.copyFileSync(fullPath, backupPath);
      }
    }

    return backupDir;
  }

  /**
   * Get component name from file path
   */
  private getComponentName(filePath: string): string {
    const fileName = path.basename(filePath, path.extname(filePath));
    return fileName;
  }
}
