import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VideoCard } from '@/components/VideoCard';
import { YouTubeVideo } from '@/types';

const mockVideo: YouTubeVideo = {
  id: 'test-video-id',
  title: 'Test Video Title',
  description: 'Test video description',
  thumbnail: 'https://example.com/thumbnail.jpg',
  channelTitle: 'Test Channel',
  channelId: 'test-channel-id',
  publishedAt: '2023-01-01T00:00:00Z',
  duration: '5:30',
  viewCount: '1000000',
};

describe('VideoCard', () => {
  it('renders video information correctly', () => {
    render(<VideoCard video={mockVideo} />);
    
    expect(screen.getByText('Test Video Title')).toBeInTheDocument();
    expect(screen.getByText('Test Channel')).toBeInTheDocument();
    expect(screen.getByText('over 2 years ago')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<VideoCard video={mockVideo} onClick={mockOnClick} />);
    
    // Click on the entire card since it's clickable
    fireEvent.click(screen.getByText('Test Video Title').closest('div'));
    expect(mockOnClick).toHaveBeenCalledWith(mockVideo);
  });

  it('applies custom className', () => {
    const { container } = render(
      <VideoCard video={mockVideo} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles missing optional data gracefully', () => {
    const videoWithoutOptionalData: YouTubeVideo = {
      id: 'test-video-id',
      title: 'Test Video Title',
      description: 'Test video description',
      thumbnail: 'https://example.com/thumbnail.jpg',
      channelTitle: 'Test Channel',
      channelId: 'test-channel-id',
      publishedAt: '2023-01-01T00:00:00Z',
    };

    render(<VideoCard video={videoWithoutOptionalData} />);
    expect(screen.getByText('Test Video Title')).toBeInTheDocument();
  });
});
