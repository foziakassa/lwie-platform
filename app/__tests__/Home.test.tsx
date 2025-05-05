// Home.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../page'; // Adjust the path
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom/extend-expect';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Home Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders the home page with featured items', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Comfortable Leather Sofa")).toBeInTheDocument();
    });
  });

  it('navigates to item detail on click', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Comfortable Leather Sofa")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Comfortable Leather Sofa"));
    expect(mockPush).toHaveBeenCalledWith('/products/comfortable-leather-sofa');
  });

  it('toggles like on button click', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Comfortable Leather Sofa")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /like/i }));
    expect(screen.getByRole('button', { name: /like/i })).toHaveClass('bg-rose-500');
  });
});