import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MobileCareLog } from '../MobileCareLog';

// Mock child components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, size, variant }: any) => (
    <button onClick={onClick} className={className} data-size={size} data-variant={variant}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ label, value, onChange, placeholder, type, inputMode, step }: any) => {
    const id = label ? label.replace(/\s+/g, '-').toLowerCase() : undefined;
    return (
      <div>
        {label && <label htmlFor={id}>{label}</label>}
        <input
          id={id}
          type={type || 'text'}
          inputMode={inputMode}
          step={step}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  },
}));

jest.mock('@/components/ui/select', () => ({
  __esModule: true,
  default: ({ label, value, onChange, children }: any) => {
    const id = label ? label.replace(/\s+/g, '-').toLowerCase() : 'select';
    return (
      <div>
        {label && <label htmlFor={id}>{label}</label>}
        <select id={id} value={value} onChange={onChange}>
          {children}
        </select>
      </div>
    );
  },
}));

// Mock navigator.vibrate
const mockVibrate = jest.fn();
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  configurable: true,
  value: mockVibrate,
});

// Mock webkitSpeechRecognition
const mockSpeechRecognition = {
  continuous: false,
  interimResults: false,
  onstart: null as (() => void) | null,
  onresult: null as ((event: any) => void) | null,
  onend: null as (() => void) | null,
  start: jest.fn(),
};

Object.defineProperty(window, 'webkitSpeechRecognition', {
  writable: true,
  configurable: true,
  value: jest.fn(() => mockSpeechRecognition),
});

describe('MobileCareLog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSpeechRecognition.onstart = null;
    mockSpeechRecognition.onresult = null;
    mockSpeechRecognition.onend = null;
    mockSpeechRecognition.start.mockClear();
  });

  describe('Initialization', () => {
    it('should render with vitals tab active by default', () => {
      render(<MobileCareLog />);
      expect(screen.getByText('Record Vitals')).toBeInTheDocument();
    });

    it('should render all tab buttons', () => {
      render(<MobileCareLog />);
      expect(screen.getByText('Vitals')).toBeInTheDocument();
      expect(screen.getByText('Meds')).toBeInTheDocument();
      expect(screen.getByText('Meals')).toBeInTheDocument();
      expect(screen.getByText('Incident')).toBeInTheDocument();
    });

    it('should show vitals tab as active', () => {
      render(<MobileCareLog />);
      const vitalsTab = screen.getByText('Vitals').closest('button');
      expect(vitalsTab).toHaveClass('bg-primary-600');
    });
  });

  describe('Tab Navigation', () => {
    it('should switch to medication tab when clicked', () => {
      render(<MobileCareLog />);
      const medsTab = screen.getByText('Meds');
      fireEvent.click(medsTab);
      expect(screen.getByText('Medication Log')).toBeInTheDocument();
    });

    it('should switch to meals tab when clicked', () => {
      render(<MobileCareLog />);
      const mealsTab = screen.getByText('Meals');
      fireEvent.click(mealsTab);
      expect(screen.getByText('Meal Log')).toBeInTheDocument();
    });

    it('should switch to incident tab when clicked', () => {
      render(<MobileCareLog />);
      const incidentTab = screen.getByText('Incident');
      fireEvent.click(incidentTab);
      expect(screen.getByText('Incident Report')).toBeInTheDocument();
    });

    it('should update active tab styling', () => {
      render(<MobileCareLog />);
      const medsTab = screen.getByText('Meds').closest('button');
      fireEvent.click(medsTab!);
      expect(medsTab).toHaveClass('bg-primary-600');
    });
  });

  describe('Vitals Tab', () => {
    it('should render all vital sign inputs', () => {
      render(<MobileCareLog />);
      expect(screen.getByPlaceholderText('Systolic')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Diastolic')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('72')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('98.6')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('100')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('98')).toBeInTheDocument();
    });

    it('should update blood pressure systolic value', () => {
      render(<MobileCareLog />);
      const systolicInput = screen.getByPlaceholderText('Systolic') as HTMLInputElement;
      fireEvent.change(systolicInput, { target: { value: '120' } });
      expect(systolicInput.value).toBe('120');
    });

    it('should update blood pressure diastolic value', () => {
      render(<MobileCareLog />);
      const diastolicInput = screen.getByPlaceholderText('Diastolic') as HTMLInputElement;
      fireEvent.change(diastolicInput, { target: { value: '80' } });
      expect(diastolicInput.value).toBe('80');
    });

    it('should update heart rate value', () => {
      render(<MobileCareLog />);
      const heartRateInput = screen.getByPlaceholderText('72') as HTMLInputElement;
      fireEvent.change(heartRateInput, { target: { value: '75' } });
      expect(heartRateInput.value).toBe('75');
    });

    it('should update temperature value', () => {
      render(<MobileCareLog />);
      const tempInput = screen.getByPlaceholderText('98.6') as HTMLInputElement;
      fireEvent.change(tempInput, { target: { value: '99.2' } });
      expect(tempInput.value).toBe('99.2');
    });

    it('should update glucose value', () => {
      render(<MobileCareLog />);
      const glucoseInput = screen.getByPlaceholderText('100') as HTMLInputElement;
      fireEvent.change(glucoseInput, { target: { value: '105' } });
      expect(glucoseInput.value).toBe('105');
    });

    it('should update oxygen saturation value', () => {
      render(<MobileCareLog />);
      const oxygenInput = screen.getByPlaceholderText('98') as HTMLInputElement;
      fireEvent.change(oxygenInput, { target: { value: '97' } });
      expect(oxygenInput.value).toBe('97');
    });

    it('should trigger vibration when Save Vitals clicked', () => {
      render(<MobileCareLog />);
      const saveButton = screen.getByText('Save Vitals');
      fireEvent.click(saveButton);
      expect(mockVibrate).toHaveBeenCalledWith(10);
    });

    it('should log vitals data on submit', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      render(<MobileCareLog />);
      
      // Fill in some vitals
      fireEvent.change(screen.getByPlaceholderText('Systolic'), { target: { value: '120' } });
      fireEvent.change(screen.getByPlaceholderText('72'), { target: { value: '75' } });
      
      const saveButton = screen.getByText('Save Vitals');
      fireEvent.click(saveButton);
      
      expect(consoleSpy).toHaveBeenCalledWith('Submitting vitals:', expect.objectContaining({
        bloodPressureSystolic: '120',
        heartRate: '75',
      }));
      
      consoleSpy.mockRestore();
    });
  });

  describe('Medication Tab', () => {
    beforeEach(() => {
      render(<MobileCareLog />);
      const medsTab = screen.getByText('Meds');
      fireEvent.click(medsTab);
    });

    it('should show medication checklist', () => {
      expect(screen.getByText('Morning Pills')).toBeInTheDocument();
      expect(screen.getByText('Insulin Shot')).toBeInTheDocument();
      expect(screen.getByText('Blood Thinner')).toBeInTheDocument();
      expect(screen.getByText('Vitamins')).toBeInTheDocument();
    });

    it('should render checkboxes for medications', () => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(4);
    });

    it('should allow checking medication checkboxes', () => {
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      expect(checkboxes[0]).toBeChecked();
    });

    it('should render add custom medication button', () => {
      expect(screen.getByText('Add Custom Medication')).toBeInTheDocument();
    });

    it('should display current time for each medication', () => {
      const timePattern = /\d{1,2}:\d{2}\s?(AM|PM)?/i;
      const timeElements = screen.getAllByText(timePattern);
      expect(timeElements.length).toBeGreaterThan(0);
    });
  });

  describe('Meals Tab', () => {
    beforeEach(() => {
      render(<MobileCareLog />);
      const mealsTab = screen.getByText('Meals');
      fireEvent.click(mealsTab);
    });

    it('should render meal type select', () => {
      expect(screen.getByLabelText('Meal Type')).toBeInTheDocument();
    });

    it('should have breakfast selected by default', () => {
      const select = screen.getByLabelText('Meal Type') as HTMLSelectElement;
      expect(select.value).toBe('breakfast');
    });

    it('should allow changing meal type', () => {
      const select = screen.getByLabelText('Meal Type') as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'lunch' } });
      expect(select.value).toBe('lunch');
    });

    it('should render description textarea', () => {
      expect(screen.getByPlaceholderText('Describe what was served...')).toBeInTheDocument();
    });

    it('should update description value', () => {
      const textarea = screen.getByPlaceholderText('Describe what was served...') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'Chicken soup with rice' } });
      expect(textarea.value).toBe('Chicken soup with rice');
    });

    it('should render amount consumed slider', () => {
      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider).toBeInTheDocument();
      expect(slider.type).toBe('range');
    });

    it('should have 100% consumed by default', () => {
      expect(screen.getByText('Amount Consumed: 100%')).toBeInTheDocument();
    });

    it('should update consumed percentage', () => {
      const slider = screen.getByRole('slider') as HTMLInputElement;
      fireEvent.change(slider, { target: { value: '50' } });
      expect(screen.getByText('Amount Consumed: 50%')).toBeInTheDocument();
    });

    it('should render save button', () => {
      expect(screen.getByText('Save Meal Log')).toBeInTheDocument();
    });
  });

  describe('Incident Tab', () => {
    beforeEach(() => {
      render(<MobileCareLog />);
      const incidentTab = screen.getByText('Incident');
      fireEvent.click(incidentTab);
    });

    it('should render incident type select', () => {
      expect(screen.getByLabelText('Incident Type')).toBeInTheDocument();
    });

    it('should have fall selected by default', () => {
      const select = screen.getByLabelText('Incident Type') as HTMLSelectElement;
      expect(select.value).toBe('fall');
    });

    it('should allow changing incident type', () => {
      const select = screen.getByLabelText('Incident Type') as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'medication_error' } });
      expect(select.value).toBe('medication_error');
    });

    it('should render severity select', () => {
      expect(screen.getByLabelText('Severity')).toBeInTheDocument();
    });

    it('should have low severity by default', () => {
      const select = screen.getByLabelText('Severity') as HTMLSelectElement;
      expect(select.value).toBe('low');
    });

    it('should allow changing severity', () => {
      const select = screen.getByLabelText('Severity') as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'high' } });
      expect(select.value).toBe('high');
    });

    it('should render description textarea', () => {
      expect(screen.getByPlaceholderText('Describe what happened...')).toBeInTheDocument();
    });

    it('should update description value', () => {
      const textarea = screen.getByPlaceholderText('Describe what happened...') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'Patient slipped in bathroom' } });
      expect(textarea.value).toBe('Patient slipped in bathroom');
    });

    it('should render voice note button', () => {
      expect(screen.getByText('Add Voice Note')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      expect(screen.getByText('Submit Incident Report')).toBeInTheDocument();
    });
  });

  describe('Voice Note Feature', () => {
    beforeEach(() => {
      render(<MobileCareLog />);
      const incidentTab = screen.getByText('Incident');
      fireEvent.click(incidentTab);
    });

    it('should start speech recognition when voice button clicked', () => {
      const voiceButton = screen.getByText('Add Voice Note');
      fireEvent.click(voiceButton);
      expect(mockSpeechRecognition.start).toHaveBeenCalled();
    });

    it('should show recording state when started', async () => {
      const voiceButton = screen.getByText('Add Voice Note');
      fireEvent.click(voiceButton);
      
      // Trigger onstart callback
      if (mockSpeechRecognition.onstart) {
        mockSpeechRecognition.onstart();
      }
      
      await waitFor(() => {
        expect(screen.getByText('Recording...')).toBeInTheDocument();
      });
    });

    it('should trigger vibration on recording start', async () => {
      const voiceButton = screen.getByText('Add Voice Note');
      fireEvent.click(voiceButton);
      
      if (mockSpeechRecognition.onstart) {
        mockSpeechRecognition.onstart();
      }
      
      await waitFor(() => {
        expect(mockVibrate).toHaveBeenCalledWith(10);
      });
    });

    it('should append transcript to description', async () => {
      const voiceButton = screen.getByText('Add Voice Note');
      fireEvent.click(voiceButton);
      
      // Simulate speech recognition result
      if (mockSpeechRecognition.onresult) {
        const mockEvent = {
          results: [[{ transcript: 'Patient fell near bed' }]],
        };
        mockSpeechRecognition.onresult(mockEvent);
      }
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Describe what happened...') as HTMLTextAreaElement;
        expect(textarea.value).toContain('Patient fell near bed');
      });
    });

    it('should stop recording state when ended', async () => {
      const voiceButton = screen.getByText('Add Voice Note');
      fireEvent.click(voiceButton);
      
      if (mockSpeechRecognition.onstart) {
        mockSpeechRecognition.onstart();
      }
      
      await waitFor(() => {
        expect(screen.getByText('Recording...')).toBeInTheDocument();
      });
      
      if (mockSpeechRecognition.onend) {
        mockSpeechRecognition.onend();
      }
      
      await waitFor(() => {
        expect(screen.getByText('Add Voice Note')).toBeInTheDocument();
      });
    });

    it('should trigger vibration pattern on recording end', async () => {
      const voiceButton = screen.getByText('Add Voice Note');
      fireEvent.click(voiceButton);
      
      if (mockSpeechRecognition.onend) {
        mockSpeechRecognition.onend();
      }
      
      await waitFor(() => {
        expect(mockVibrate).toHaveBeenCalledWith([10, 50, 10]);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have sufficient touch target sizes for tabs', () => {
      render(<MobileCareLog />);
      const tabs = screen.getAllByRole('button');
      const tabButtons = tabs.slice(0, 4); // First 4 are tab buttons
      
      tabButtons.forEach(tab => {
        expect(tab).toHaveClass('min-h-[56px]');
      });
    });

    it('should have accessible labels for inputs', () => {
      render(<MobileCareLog />);
      expect(screen.getByLabelText('Heart Rate (bpm)')).toBeInTheDocument();
      expect(screen.getByLabelText('Temperature (°F)')).toBeInTheDocument();
      expect(screen.getByLabelText('Blood Glucose (mg/dL)')).toBeInTheDocument();
      expect(screen.getByLabelText('Oxygen Saturation (%)')).toBeInTheDocument();
    });

    it('should have accessible meal type select', () => {
      render(<MobileCareLog />);
      fireEvent.click(screen.getByText('Meals'));
      expect(screen.getByLabelText('Meal Type')).toBeInTheDocument();
    });

    it('should have accessible incident selects', () => {
      render(<MobileCareLog />);
      fireEvent.click(screen.getByText('Incident'));
      expect(screen.getByLabelText('Incident Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Severity')).toBeInTheDocument();
    });
  });
});
