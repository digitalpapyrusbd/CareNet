import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileUpload } from '../file-upload';
import { apiCall } from '@/lib/api-client';

// Mock the Button component
jest.mock('../button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

// Mock the API client
jest.mock('@/lib/api-client', () => ({
  apiCall: jest.fn(),
}));

const mockApiCall = apiCall as jest.MockedFunction<typeof apiCall>;

describe('FileUpload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization & Rendering', () => {
    it('should render file upload component', () => {
      render(<FileUpload />);
      expect(screen.getByText(/Drag & drop files here/i)).toBeInTheDocument();
    });

    it('should render custom children when provided', () => {
      render(
        <FileUpload>
          <div>Custom Upload Area</div>
        </FileUpload>
      );
      expect(screen.getByText('Custom Upload Area')).toBeInTheDocument();
      expect(screen.queryByText(/Drag & drop files here/i)).not.toBeInTheDocument();
    });

    it('should render default content with file icon', () => {
      render(<FileUpload />);
      expect(screen.getByText('📁')).toBeInTheDocument();
    });

    it('should render max file size information', () => {
      render(<FileUpload maxSize={5 * 1024 * 1024} />);
      expect(screen.getByText('Max file size: 5MB')).toBeInTheDocument();
    });

    it('should show "or click to browse" text', () => {
      render(<FileUpload />);
      expect(screen.getByText('or click to browse')).toBeInTheDocument();
    });

    it('should apply custom className to container', () => {
      const { container } = render(<FileUpload className="custom-upload" />);
      expect(container.querySelector('.custom-upload')).toBeInTheDocument();
    });

    it('should render hidden file input', () => {
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveClass('hidden');
    });
  });

  describe('File Input Attributes', () => {
    it('should set accept attribute from props', () => {
      const { container } = render(<FileUpload accept=".jpg,.png" />);
      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('accept', '.jpg,.png');
    });

    it('should use default accept attribute', () => {
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('accept', 'image/*,application/pdf,.doc,.docx');
    });

    it('should set multiple attribute when multiple is true', () => {
      const { container } = render(<FileUpload multiple={true} />);
      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('multiple');
    });

    it('should not set multiple attribute when multiple is false', () => {
      const { container } = render(<FileUpload multiple={false} />);
      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).not.toHaveAttribute('multiple');
    });

    it('should disable file input when disabled prop is true', () => {
      const { container } = render(<FileUpload disabled={true} />);
      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeDisabled();
    });
  });

  describe('File Selection via Input', () => {
    it('should handle single file selection', () => {
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      expect(screen.getByText('test.jpg')).toBeInTheDocument();
    });

    it('should handle multiple file selection when multiple is true', () => {
      const { container } = render(<FileUpload multiple={true} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const files = [
        new File(['content1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['content2'], 'test2.jpg', { type: 'image/jpeg' }),
      ];
      const fileList = createFileList(files);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      expect(screen.getByText('test1.jpg')).toBeInTheDocument();
      expect(screen.getByText('test2.jpg')).toBeInTheDocument();
    });

    it('should only keep first file when multiple is false', () => {
      const { container } = render(<FileUpload multiple={false} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const files = [
        new File(['content1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['content2'], 'test2.jpg', { type: 'image/jpeg' }),
      ];
      const fileList = createFileList(files);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      expect(screen.getByText('test1.jpg')).toBeInTheDocument();
      expect(screen.queryByText('test2.jpg')).not.toBeInTheDocument();
    });

    it('should display file size in KB', () => {
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['x'.repeat(2048)], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      expect(screen.getByText(/2\.00 KB/i)).toBeInTheDocument();
    });

    it('should show image icon for image files', () => {
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      expect(screen.getByText('🖼️')).toBeInTheDocument();
    });

    it('should show document icon for non-image files', () => {
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      expect(screen.getByText('📄')).toBeInTheDocument();
    });
  });

  describe('File Size Validation', () => {
    it('should reject files exceeding max size', () => {
      const onUploadError = jest.fn();
      const { container } = render(<FileUpload maxSize={1024} onUploadError={onUploadError} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['x'.repeat(2048)], 'large.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      expect(onUploadError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('exceeds size limit'),
        })
      );
      expect(screen.queryByText('large.jpg')).not.toBeInTheDocument();
    });

    it('should accept files within size limit', () => {
      const { container } = render(<FileUpload maxSize={10 * 1024 * 1024} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'small.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      expect(screen.getByText('small.jpg')).toBeInTheDocument();
    });
  });

  describe('Drag and Drop', () => {
    it('should activate drag state on drag enter', () => {
      const { container } = render(<FileUpload />);
      const dropZone = container.querySelector('.border-dashed') as HTMLElement;
      
      fireEvent.dragEnter(dropZone);
      
      expect(screen.getByText('Drop files here')).toBeInTheDocument();
      expect(dropZone).toHaveClass('border-blue-500');
      expect(dropZone).toHaveClass('bg-blue-50');
    });

    it('should deactivate drag state on drag leave', () => {
      const { container } = render(<FileUpload />);
      const dropZone = container.querySelector('.border-dashed') as HTMLElement;
      
      fireEvent.dragEnter(dropZone);
      fireEvent.dragLeave(dropZone);
      
      expect(screen.getByText('Drag & drop files here')).toBeInTheDocument();
      expect(dropZone).toHaveClass('border-gray-300');
    });

    it('should handle file drop', () => {
      const { container } = render(<FileUpload />);
      const dropZone = container.querySelector('.border-dashed') as HTMLElement;
      
      const file = new File(['content'], 'dropped.jpg', { type: 'image/jpeg' });
      const dataTransfer = {
        files: createFileList([file]),
      };
      
      fireEvent.drop(dropZone, { dataTransfer });
      
      expect(screen.getByText('dropped.jpg')).toBeInTheDocument();
    });

    it('should not handle drop when disabled', () => {
      const { container } = render(<FileUpload disabled={true} />);
      const dropZone = container.querySelector('.border-dashed') as HTMLElement;
      
      const file = new File(['content'], 'dropped.jpg', { type: 'image/jpeg' });
      const dataTransfer = {
        files: createFileList([file]),
      };
      
      fireEvent.drop(dropZone, { dataTransfer });
      
      expect(screen.queryByText('dropped.jpg')).not.toBeInTheDocument();
    });

    it('should handle drag over without error', () => {
      const { container } = render(<FileUpload />);
      const dropZone = container.querySelector('.border-dashed') as HTMLElement;
      
      expect(() => fireEvent.dragOver(dropZone)).not.toThrow();
    });
  });

  describe('Click to Browse', () => {
    it('should open file dialog on click', () => {
      const { container } = render(<FileUpload />);
      const dropZone = container.querySelector('.border-dashed') as HTMLElement;
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const clickSpy = jest.spyOn(fileInput, 'click');
      
      fireEvent.click(dropZone);
      
      expect(clickSpy).toHaveBeenCalled();
    });

    it('should not open file dialog when disabled', () => {
      const { container } = render(<FileUpload disabled={true} />);
      const dropZone = container.querySelector('.border-dashed') as HTMLElement;
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const clickSpy = jest.spyOn(fileInput, 'click');
      
      fireEvent.click(dropZone);
      
      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('File Management', () => {
    it('should show Remove button for each selected file', () => {
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      expect(screen.getByText('Remove')).toBeInTheDocument();
    });

    it('should remove file when Remove button clicked', () => {
      const { container } = render(<FileUpload multiple={true} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const files = [
        new File(['content1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['content2'], 'test2.jpg', { type: 'image/jpeg' }),
      ];
      const fileList = createFileList(files);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[0]);
      
      expect(screen.queryByText('test1.jpg')).not.toBeInTheDocument();
      expect(screen.getByText('test2.jpg')).toBeInTheDocument();
    });

    it('should show Clear button when files selected', () => {
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    it('should clear all files when Clear button clicked', () => {
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      fireEvent.click(screen.getByText('Clear'));
      
      expect(screen.queryByText('test.jpg')).not.toBeInTheDocument();
      expect(screen.queryByText('Clear')).not.toBeInTheDocument();
    });

    it('should show "Selected Files:" header when files selected', () => {
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      expect(screen.getByText('Selected Files:')).toBeInTheDocument();
    });
  });

  describe('Upload Functionality', () => {
    it('should show Upload button when files selected', () => {
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      expect(screen.getByText('Upload')).toBeInTheDocument();
    });

    it('should call apiCall on upload', async () => {
      mockApiCall.mockResolvedValue({ success: true, data: { url: 'https://example.com/file.jpg' } });
      
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      fireEvent.click(screen.getByText('Upload'));
      
      await waitFor(() => {
        expect(mockApiCall).toHaveBeenCalledWith('/upload', expect.objectContaining({
          method: 'POST',
          isFormData: true,
        }));
      });
    });

    it('should call onUploadSuccess on successful upload', async () => {
      const onUploadSuccess = jest.fn();
      mockApiCall.mockResolvedValue({ success: true, data: { url: 'https://example.com/file.jpg' } });
      
      const { container } = render(<FileUpload onUploadSuccess={onUploadSuccess} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      fireEvent.click(screen.getByText('Upload'));
      
      await waitFor(() => {
        expect(onUploadSuccess).toHaveBeenCalledWith('https://example.com/file.jpg', file);
      });
    });

    it('should call onUploadError on upload failure', async () => {
      const onUploadError = jest.fn();
      mockApiCall.mockResolvedValue({ success: false, error: 'Upload failed' });
      
      const { container } = render(<FileUpload onUploadError={onUploadError} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      fireEvent.click(screen.getByText('Upload'));
      
      await waitFor(() => {
        expect(onUploadError).toHaveBeenCalledWith(expect.any(Error));
      });
    });

    it('should show uploading state during upload', async () => {
      mockApiCall.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      fireEvent.click(screen.getByText('Upload'));
      
      await waitFor(() => {
        expect(screen.getByText(/Uploading\.\.\./i)).toBeInTheDocument();
      });
    });

    it('should clear selected files after successful upload', async () => {
      mockApiCall.mockResolvedValue({ success: true, data: { url: 'https://example.com/file.jpg' } });
      
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      fireEvent.click(screen.getByText('Upload'));
      
      await waitFor(() => {
        expect(screen.queryByText('test.jpg')).not.toBeInTheDocument();
      });
    });

    it('should disable Upload button when uploading', async () => {
      mockApiCall.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      const uploadButton = screen.getByText('Upload');
      fireEvent.click(uploadButton);
      
      await waitFor(() => {
        expect(uploadButton).toBeDisabled();
      });
    });

    it('should disable Clear button when uploading', async () => {
      mockApiCall.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      fireEvent.click(screen.getByText('Upload'));
      
      await waitFor(() => {
        expect(screen.getByText('Clear')).toBeDisabled();
      });
    });
  });

  describe('Error Display', () => {
    it('should display error message on upload failure', async () => {
      mockApiCall.mockResolvedValue({ success: false, error: 'Server error occurred' });
      
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      fireEvent.click(screen.getByText('Upload'));
      
      await waitFor(() => {
        expect(screen.getByText('Server error occurred')).toBeInTheDocument();
      });
    });

    it('should apply error styling to error message', async () => {
      mockApiCall.mockResolvedValue({ success: false, error: 'Error message' });
      
      const { container } = render(<FileUpload />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      fireEvent.click(screen.getByText('Upload'));
      
      await waitFor(() => {
        const errorDiv = container.querySelector('.bg-red-100');
        expect(errorDiv).toBeInTheDocument();
        expect(errorDiv).toHaveClass('border-red-400');
        expect(errorDiv).toHaveClass('text-red-700');
      });
    });
  });

  describe('Disabled State', () => {
    it('should apply disabled styling when disabled', () => {
      const { container } = render(<FileUpload disabled={true} />);
      const dropZone = container.querySelector('.border-dashed') as HTMLElement;
      
      expect(dropZone).toHaveClass('opacity-50');
      expect(dropZone).toHaveClass('cursor-not-allowed');
    });

    it('should disable Upload button when component disabled', () => {
      const { container } = render(<FileUpload disabled={true} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      expect(screen.getByText('Upload')).toBeDisabled();
    });
  });

  describe('Metadata Parameters', () => {
    it('should include folder in upload request', async () => {
      mockApiCall.mockResolvedValue({ success: true, data: { url: 'https://example.com/file.jpg' } });
      
      const { container } = render(<FileUpload folder="documents" />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      fireEvent.click(screen.getByText('Upload'));
      
      await waitFor(() => {
        const callArgs = mockApiCall.mock.calls[0];
        const formData = callArgs[1].body as FormData;
        expect(formData.get('folder')).toBe('documents');
      });
    });

    it('should include isPublic in upload request when true', async () => {
      mockApiCall.mockResolvedValue({ success: true, data: { url: 'https://example.com/file.jpg' } });
      
      const { container } = render(<FileUpload isPublic={true} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      fireEvent.click(screen.getByText('Upload'));
      
      await waitFor(() => {
        const callArgs = mockApiCall.mock.calls[0];
        const formData = callArgs[1].body as FormData;
        expect(formData.get('isPublic')).toBe('true');
      });
    });

    it('should include documentType in upload request', async () => {
      mockApiCall.mockResolvedValue({ success: true, data: { url: 'https://example.com/file.jpg' } });
      
      const { container } = render(<FileUpload documentType="verification" />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      fireEvent.click(screen.getByText('Upload'));
      
      await waitFor(() => {
        const callArgs = mockApiCall.mock.calls[0];
        const formData = callArgs[1].body as FormData;
        expect(formData.get('documentType')).toBe('verification');
      });
    });

    it('should include careLogId in upload request', async () => {
      mockApiCall.mockResolvedValue({ success: true, data: { url: 'https://example.com/file.jpg' } });
      
      const { container } = render(<FileUpload careLogId="log-123" />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const fileList = createFileList([file]);
      
      Object.defineProperty(fileInput, 'files', { value: fileList });
      fireEvent.change(fileInput);
      
      fireEvent.click(screen.getByText('Upload'));
      
      await waitFor(() => {
        const callArgs = mockApiCall.mock.calls[0];
        const formData = callArgs[1].body as FormData;
        expect(formData.get('careLogId')).toBe('log-123');
      });
    });
  });
});

// Helper function to create FileList from File array
function createFileList(files: File[]): FileList {
  const fileList = {
    length: files.length,
    item: (index: number) => files[index],
    [Symbol.iterator]: function* () {
      for (let i = 0; i < files.length; i++) {
        yield files[i];
      }
    },
  };
  
  files.forEach((file, index) => {
    (fileList as any)[index] = file;
  });
  
  return fileList as FileList;
}
