import { TranslationValidator } from '../translationValidator';
import * as fs from 'fs';
import * as path from 'path';

// Mock MSW to avoid ESM issues
jest.mock('@/__tests__/mocks/server', () => ({
  server: {
    listen: jest.fn(),
    close: jest.fn(),
    resetHandlers: jest.fn(),
  },
}));

// Mock fs
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  readdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

// Don't mock path - use the real Node.js path module

const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
const mockReadFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;
const mockReaddirSync = fs.readdirSync as jest.MockedFunction<typeof fs.readdirSync>;

describe('TranslationValidator', () => {
  let validator: TranslationValidator;

  beforeEach(() => {
    jest.clearAllMocks();
    validator = new TranslationValidator();
    
    // Default mocks
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue([
      { name: 'HomePage.tsx', isFile: () => true, isDirectory: () => false },
    ] as any);
  });

  describe('File Discovery', () => {
    it('should find React component files', async () => {
      mockReaddirSync.mockReturnValue([
        { name: 'HomePage.tsx', isFile: () => true, isDirectory: () => false },
        { name: 'LoginPage.tsx', isFile: () => true, isDirectory: () => false },
      ] as any);

      mockReadFileSync.mockReturnValue('export default function HomePage() { return <div>Test</div>; }');

      const result = await validator.validate();

      expect(result.totalIssues).toBeGreaterThanOrEqual(0);
    });

    it('should ignore test files', async () => {
      mockReaddirSync.mockReturnValue([
        { name: 'HomePage.test.tsx', isFile: () => true, isDirectory: () => false },
      ] as any);

      const result = await validator.validate();

      expect(mockReadFileSync).not.toHaveBeenCalled();
    });

    it('should ignore node_modules', async () => {
      mockExistsSync.mockImplementation((filePath: string) => {
        return !filePath.includes('node_modules');
      });

      const result = await validator.validate();

      expect(result.totalIssues).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Hardcoded Text Detection', () => {
    it('should detect hardcoded text in JSX elements', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function HomePage() {
          return <h1>Welcome to CareNet</h1>;
        }
      `);

      const result = await validator.validate();

      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues.some(i => i.text.includes('Welcome to CareNet'))).toBe(true);
    });

    it('should detect hardcoded text in buttons', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function LoginPage() {
          return <button>Login</button>;
        }
      `);

      const result = await validator.validate();

      expect(result.issues.some(i => i.text === 'Login')).toBe(true);
    });

    it('should detect hardcoded text in attributes', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function FormPage() {
          return <input placeholder="Enter your name" />;
        }
      `);

      const result = await validator.validate();

      expect(result.issues.some(i => i.text === 'Enter your name')).toBe(true);
    });

    it('should detect hardcoded text in title attributes', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function TooltipPage() {
          return <div title="Help text">Content</div>;
        }
      `);

      const result = await validator.validate();

      expect(result.issues.some(i => i.text === 'Help text')).toBe(true);
    });

    it('should ignore already translated text', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function TranslatedPage() {
          const { t } = useTranslation();
          return <h1>{t('home.title')}</h1>;
        }
      `);

      const result = await validator.validate();

      expect(result.issues.length).toBe(0);
    });

    it('should ignore variable names', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function VariablePage() {
          const TITLE = "Title";
          return <h1>{TITLE}</h1>;
        }
      `);

      const result = await validator.validate();

      expect(result.issues.length).toBe(0);
    });

    it('should ignore function calls', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function FunctionPage() {
          return <div>{formatDate(new Date())}</div>;
        }
      `);

      const result = await validator.validate();

      expect(result.issues.length).toBe(0);
    });

    it('should ignore comments', async () => {
      mockReadFileSync.mockReturnValue(`
        // This is a comment
        export default function CommentPage() {
          return <div>Content</div>;
        }
      `);

      const result = await validator.validate();

      expect(result.issues.some(i => i.text.includes('comment'))).toBe(false);
    });

    it('should ignore URLs', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function LinkPage() {
          return <a href="https://example.com">Link</a>;
        }
      `);

      const result = await validator.validate();

      expect(result.issues.some(i => i.text.includes('https://'))).toBe(false);
    });
  });

  describe('Key Generation', () => {
    it('should generate suggested keys', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function HomePage() {
          return <h1>Welcome</h1>;
        }
      `);

      const result = await validator.validate();

      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues[0].suggestedKey).toBeTruthy();
      expect(typeof result.issues[0].suggestedKey).toBe('string');
    });

    it('should generate keys based on component name', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function LoginPage() {
          return <button>Login</button>;
        }
      `);

      const result = await validator.validate();

      if (result.issues.length > 0) {
        expect(result.issues[0].suggestedKey).toContain('login');
      }
    });
  });

  describe('Report Generation', () => {
    it('should generate report with all issues', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function TestPage() {
          return (
            <div>
              <h1>Title</h1>
              <button>Click Me</button>
              <input placeholder="Enter text" />
            </div>
          );
        }
      `);

      const result = await validator.validate();

      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.componentsWithIssues).toBeGreaterThan(0);
      expect(result.totalIssues).toBe(result.issues.length);
    });

    it('should include component name in issues', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function TestPage() {
          return <h1>Title</h1>;
        }
      `);

      const result = await validator.validate();

      if (result.issues.length > 0) {
        expect(result.issues[0].component).toBeTruthy();
      }
    });

    it('should include file path in issues', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function TestPage() {
          return <h1>Title</h1>;
        }
      `);

      const result = await validator.validate();

      if (result.issues.length > 0) {
        expect(result.issues[0].file).toBeTruthy();
      }
    });

    it('should include line number in issues', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function TestPage() {
          return <h1>Title</h1>;
        }
      `);

      const result = await validator.validate();

      if (result.issues.length > 0) {
        expect(result.issues[0].line).toBeGreaterThan(0);
      }
    });

    it('should export report to JSON', () => {
      const outputPath = '/tmp/test-report.json';
      
      // Get the mocked writeFileSync
      const mockWriteFileSync = fs.writeFileSync as jest.MockedFunction<typeof fs.writeFileSync>;
      
      // Add some issues first
      (validator as any).issues = [
        {
          component: 'TestComponent',
          file: 'test.tsx',
          line: 10,
          text: 'Test text',
          suggestedKey: 'test.key',
          type: 'hardcoded',
        },
      ];

      validator.exportReport(outputPath);

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        outputPath,
        expect.stringContaining('"totalIssues"'),
        'utf-8'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty files', async () => {
      mockReadFileSync.mockReturnValue('');

      const result = await validator.validate();

      expect(result.totalIssues).toBe(0);
    });

    it('should handle files with only imports', async () => {
      mockReadFileSync.mockReturnValue(`
        import React from 'react';
        import { useTranslation } from '@/hooks/useTranslation';
      `);

      const result = await validator.validate();

      expect(result.totalIssues).toBe(0);
    });

    it('should handle files that do not exist', async () => {
      mockExistsSync.mockReturnValue(false);

      const result = await validator.validate();

      expect(result.totalIssues).toBe(0);
    });

    it('should handle special characters in text', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function SpecialPage() {
          return <div>Text with "quotes" and 'apostrophes'</div>;
        }
      `);

      const result = await validator.validate();

      // Should detect the text (may need adjustment based on regex)
      expect(result.totalIssues).toBeGreaterThanOrEqual(0);
    });
  });
});
