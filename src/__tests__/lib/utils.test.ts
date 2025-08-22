import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('combines class names correctly', () => {
    const result = cn('class1', 'class2', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('handles conditional classes', () => {
    const result = cn('base', true && 'conditional', false && 'hidden');
    expect(result).toBe('base conditional');
  });

  it('merges Tailwind classes correctly', () => {
    const result = cn('p-4 p-2', 'bg-red-500 bg-blue-500');
    // Should keep the last conflicting class
    expect(result).toContain('p-2');
    expect(result).toContain('bg-blue-500');
    expect(result).not.toContain('p-4');
    expect(result).not.toContain('bg-red-500');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
    expect(cn(undefined, null, false)).toBe('');
  });

  it('handles arrays and objects', () => {
    const result = cn(['class1', 'class2'], { class3: true, class4: false });
    expect(result).toBe('class1 class2 class3');
  });
});
