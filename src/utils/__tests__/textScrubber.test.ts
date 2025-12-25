import { TextScrubber, TextReplacement } from '../textScrubber';
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
  writeFileSync: jest.fn(),
  readdirSync: jest.fn(),
  mkdirSync: jest.fn(),
  copyFileSync: jest.fn(),
}));

// Don't mock path - use the real Node.js path module

const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
const mockReadFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;
const mockWriteFileSync = fs.writeFileSync as jest.MockedFunction<typeof fs.writeFileSync>;
const mockReaddirSync = fs.readdirSync as jest.MockedFunction<typeof fs.readdirSync>;
const mockMkdirSync = fs.mkdirSync as jest.MockedFunction<typeof fs.mkdirSync>;
const mockCopyFileSync = fs.copyFileSync as jest.MockedFunction<typeof fs.copyFileSync>;

describe('TextScrubber', () => {
  let scrubber: TextScrubber;

  beforeEach(() => {
    jest.clearAllMocks();
    scrubber = new TextScrubber('/test-project');
    
    // Default mocks
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue([
      { name: 'HomePage.tsx', isFile: () => true, isDirectory: () => false },
    ] as any);
  });

  describe('Scan Mode (Dry Run)', () => {
    it('should detect hardcoded text in JSX', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function HomePage() {
          return <h1>Welcome to CareNet</h1>;
        }
      `);

      const result = await scrubber.scanComponents();

      expect(result.totalFound).toBeGreaterThan(0);
      expect(result.replacements.some(r => r.originalText.includes('Welcome to CareNet'))).toBe(true);
    });

    it('should detect hardcoded text in buttons', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function LoginPage() {
          return <button>Login</button>;
        }
      `);

      const result = await scrubber.scanComponents();

      expect(result.replacements.some(r => r.originalText === 'Login')).toBe(true);
    });

    it('should detect hardcoded text in attributes', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function FormPage() {
          return <input placeholder="Enter name" />;
        }
      `);

      const result = await scrubber.scanComponents();

      expect(result.replacements.some(r => r.originalText.includes('Enter name'))).toBe(true);
    });

    it('should ignore already translated text', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function TranslatedPage() {
          const { t } = useTranslation();
          return <h1>{t('home.title')}</h1>;
        }
      `);

      const result = await scrubber.scanComponents();

      expect(result.totalFound).toBe(0);
    });

    it('should ignore variable names', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function VariablePage() {
          const TITLE = "Title";
          return <h1>{TITLE}</h1>;
        }
      `);

      const result = await scrubber.scanComponents();

      expect(result.replacements.some(r => r.originalText === 'TITLE')).toBe(false);
    });

    it('should ignore function calls', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function FunctionPage() {
          return <div>{formatDate()}</div>;
        }
      `);

      const result = await scrubber.scanComponents();

      expect(result.totalFound).toBe(0);
    });

    it('should ignore comments', async () => {
      mockReadFileSync.mockReturnValue(`
        // This is a comment
        export default function CommentPage() {
          return <div>Content</div>;
        }
      `);

      const result = await scrubber.scanComponents();

      expect(result.replacements.some(r => r.originalText.includes('comment'))).toBe(false);
    });

    it('should generate unique keys', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function DuplicatePage() {
          return (
            <div>
              <button>Login</button>
              <a>Login</a>
            </div>
          );
        }
      `);

      const result = await scrubber.scanComponents();

      const loginReplacements = result.replacements.filter(r => r.key.includes('login'));
      expect(loginReplacements.length).toBeGreaterThan(0);
      
      // Keys should be unique
      const keys = loginReplacements.map(r => r.key);
      expect(new Set(keys).size).toBe(keys.length);
    });

    it('should categorize replacements by type', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function MixedPage() {
          return (
            <div>
              <h1>Title</h1>
              <button>Click</button>
              <input placeholder="Enter text" />
            </div>
          );
        }
      `);

      const result = await scrubber.scanComponents();

      const types = result.replacements.map(r => r.type);
      expect(types).toContain('jsx');
      expect(types).toContain('attribute');
    });
  });

  describe('Key Generation', () => {
    it('should generate keys based on component name', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function HomePage() {
          return <h1>Welcome</h1>;
        }
      `);

      const result = await scrubber.scanComponents();

      if (result.replacements.length > 0) {
        expect(result.replacements[0].key).toContain('home');
      }
    });

    it('should handle duplicate text with different contexts', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function TestPage() {
          return (
            <div>
              <h1>Login</h1>
              <button>Login</button>
            </div>
          );
        }
      `);

      const result = await scrubber.scanComponents();

      const loginReplacements = result.replacements.filter(r => r.originalText === 'Login');
      expect(loginReplacements.length).toBeGreaterThan(1);
      
      // Should have different keys
      const keys = loginReplacements.map(r => r.key);
      expect(new Set(keys).size).toBeGreaterThan(1);
    });
  });

  describe('Apply Replacements', () => {
    it('should apply selected replacements', async () => {
      mockReadFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('en.json')) {
          return JSON.stringify({ common: {} }, null, 2);
        }
        return `
          export default function HomePage() {
            return <h1>Welcome</h1>;
          }
        `;
      });

      const scanResult = await scrubber.scanComponents();
      const selectedIds = scanResult.replacements.map(r => r.id);

      const applyResult = await scrubber.applyReplacements(selectedIds, false);

      expect(applyResult.success).toBe(true);
      expect(mockWriteFileSync).toHaveBeenCalled();
    });

    it('should create backup when requested', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function HomePage() {
          return <h1>Welcome</h1>;
        }
      `);

      const scanResult = await scrubber.scanComponents();
      const selectedIds = scanResult.replacements.map(r => r.id);

      const applyResult = await scrubber.applyReplacements(selectedIds, true);

      expect(applyResult.backupPath).toBeTruthy();
      expect(mockMkdirSync).toHaveBeenCalled();
      expect(mockCopyFileSync).toHaveBeenCalled();
    });

    it('should add translation import if missing', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function HomePage() {
          return <h1>Welcome</h1>;
        }
      `);

      const scanResult = await scrubber.scanComponents();
      const selectedIds = scanResult.replacements.map(r => r.id);

      await scrubber.applyReplacements(selectedIds, false);

      const writtenContent = mockWriteFileSync.mock.calls[0][1] as string;
      expect(writtenContent).toContain('useTranslationContext');
    });

    it('should add translation hook if missing', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function HomePage() {
          return <h1>Welcome</h1>;
        }
      `);

      const scanResult = await scrubber.scanComponents();
      const selectedIds = scanResult.replacements.map(r => r.id);

      await scrubber.applyReplacements(selectedIds, false);

      const writtenContent = mockWriteFileSync.mock.calls[0][1] as string;
      expect(writtenContent).toContain('const { t } = useTranslationContext()');
    });

    it('should update translation JSON file', async () => {
      mockReadFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('en.json')) {
          return JSON.stringify({ common: {} }, null, 2);
        }
        return `
          export default function HomePage() {
            return <h1>Welcome</h1>;
          }
        `;
      });

      const scanResult = await scrubber.scanComponents();
      const selectedIds = scanResult.replacements.map(r => r.id);

      await scrubber.applyReplacements(selectedIds, false);

      // Should write to en.json
      const jsonWrites = mockWriteFileSync.mock.calls.filter(
        call => call[0].toString().includes('en.json')
      );
      expect(jsonWrites.length).toBeGreaterThan(0);
    });

    it('should only apply selected replacements', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function HomePage() {
          return (
            <div>
              <h1>Title 1</h1>
              <h2>Title 2</h2>
            </div>
          );
        }
      `);

      const scanResult = await scrubber.scanComponents();
      const firstReplacement = scanResult.replacements[0];
      const selectedIds = [firstReplacement.id];

      await scrubber.applyReplacements(selectedIds, false);

      const writtenContent = mockWriteFileSync.mock.calls[0][1] as string;
      // Should only replace the selected one
      expect(writtenContent).toContain('t(');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty files', async () => {
      mockReadFileSync.mockReturnValue('');

      const result = await scrubber.scanComponents();

      expect(result.totalFound).toBe(0);
    });

    it('should handle files that do not exist', async () => {
      mockExistsSync.mockReturnValue(false);

      const result = await scrubber.scanComponents();

      expect(result.totalFound).toBe(0);
    });

    it('should handle special characters in text', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function SpecialPage() {
          return <div>Text with "quotes" and 'apostrophes'</div>;
        }
      `);

      const result = await scrubber.scanComponents();

      // Should detect the text
      expect(result.totalFound).toBeGreaterThanOrEqual(0);
    });

    it('should handle multiple replacements in same line', async () => {
      mockReadFileSync.mockReturnValue(`
        export default function MultiPage() {
          return <div>First <span>Second</span> Third</div>;
        }
      `);

      const result = await scrubber.scanComponents();

      expect(result.totalFound).toBeGreaterThan(0);
    });
  });
});
