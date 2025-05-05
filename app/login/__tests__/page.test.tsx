// page.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../page'; // Adjust the path
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom/extend-expect';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Login Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders the login page correctly', () => {
    render(<Login />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles form submission', () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockPush).toHaveBeenCalledWith('/dashboard'); // Adjust according to your redirect
  });

  it('shows error message on invalid login', () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'invalid@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument(); // Adjust based on your implementation
  });
});