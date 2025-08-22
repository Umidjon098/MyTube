import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '@/components/SearchBar';

describe('SearchBar', () => {
  it('renders with default placeholder', () => {
    render(<SearchBar onSearch={jest.fn()} />);
    
    expect(screen.getByPlaceholderText('Search videos...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<SearchBar onSearch={jest.fn()} placeholder="Custom placeholder" />);
    
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('calls onSearch with debounced input', async () => {
    const mockOnSearch = jest.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'test query');
    
    // Should not call immediately due to debouncing
    expect(mockOnSearch).not.toHaveBeenCalled();
    
    // Should call after debounce delay
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    }, { timeout: 1000 });
  });

  it('displays initial value', () => {
    render(<SearchBar onSearch={jest.fn()} initialValue="initial search" />);
    
    expect(screen.getByDisplayValue('initial search')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <SearchBar onSearch={jest.fn()} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('clears search when input is empty', async () => {
    const mockOnSearch = jest.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockOnSearch} initialValue="initial" />);
    
    const input = screen.getByRole('textbox');
    await user.clear(input);
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('');
    }, { timeout: 1000 });
  });
});
