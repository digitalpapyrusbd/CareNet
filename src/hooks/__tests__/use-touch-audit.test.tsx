// Extend test:a11y coverage to other user-facing patterns (e.g., Guardian dashboard cards, dispute tables, TouchTargetAuditPanel once we can safely toggle dev-only bits). Reuse the same suite so failures stay centralized.
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTouchTargetAudit } from '../use-touch-audit';

describe('useTouchTargetAudit', () => {
  const defaultStyle: Partial<CSSStyleDeclaration> = {
    paddingTop: '0px',
    paddingBottom: '0px',
    paddingLeft: '0px',
    paddingRight: '0px',
  };

  const createMockElement = (tag: string, { width, height }: { width: number; height: number }) => {
    const element = document.createElement(tag);

    Object.defineProperty(element, 'getBoundingClientRect', {
      value: () => ({
        width,
        height,
        top: 0,
        left: 0,
        right: width,
        bottom: height,
        x: 0,
        y: 0,
        toJSON: () => ({})
      }),
    });

    return element;
  };

  let querySpy: jest.SpyInstance;
  let styleSpy: jest.SpyInstance;

  beforeEach(() => {
    querySpy = jest.spyOn(document, 'querySelectorAll');
    styleSpy = jest.spyOn(window, 'getComputedStyle').mockImplementation(() => defaultStyle as CSSStyleDeclaration);
  });

  afterEach(() => {
    querySpy.mockRestore();
    styleSpy.mockRestore();
  });

  it('should start with empty results and counts', () => {
    const { result } = renderHook(() => useTouchTargetAudit());

    expect(result.current.results).toHaveLength(0);
    expect(result.current.invalidCount).toBe(0);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.isAuditing).toBe(false);
  });

  it('should audit interactive elements and flag invalid targets', async () => {
    const largeButton = createMockElement('button', { width: 60, height: 60 });
    const smallLink = createMockElement('a', { width: 30, height: 20 });

    querySpy.mockReturnValue([largeButton, smallLink] as unknown as NodeListOf<Element>);

    const { result } = renderHook(() => useTouchTargetAudit());

    await act(async () => {
      result.current.auditTouchTargets();
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.totalCount).toBe(2);
    });

    const [first, second] = result.current.results;
    expect(first.width).toBe(60);
    expect(first.isValid).toBe(true);
    expect(second.isValid).toBe(false);
    expect(result.current.invalidCount).toBe(1);
    expect(result.current.isAuditing).toBe(false);
  });

  it('should highlight invalid touch targets with outline and tooltip', async () => {
    const invalidButton = createMockElement('button', { width: 10, height: 10 }) as HTMLElement;
    querySpy.mockReturnValue([invalidButton] as unknown as NodeListOf<Element>);

    const { result } = renderHook(() => useTouchTargetAudit());

    await act(async () => {
      result.current.auditTouchTargets();
      await Promise.resolve();
    });

    act(() => {
      result.current.highlightInvalidTargets();
    });

    expect(invalidButton.style.outline).toBe('2px solid red');
    const tooltip = invalidButton.querySelector('div');
    expect(tooltip?.textContent).toBe('Touch target too small');
  });

  it('should clear highlights and tooltips', async () => {
    const invalidButton = createMockElement('button', { width: 10, height: 10 }) as HTMLElement;
    querySpy.mockReturnValue([invalidButton] as unknown as NodeListOf<Element>);

    const { result } = renderHook(() => useTouchTargetAudit());

    await act(async () => {
      result.current.auditTouchTargets();
      await Promise.resolve();
    });

    act(() => {
      result.current.highlightInvalidTargets();
    });

    act(() => {
      result.current.clearHighlights();
    });

    expect(invalidButton.style.outline).toBe('');
    const tooltip = invalidButton.querySelector('div');
    expect(tooltip).toBeNull();
  });
});
