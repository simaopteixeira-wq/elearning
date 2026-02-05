import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Navbar from './Navbar';
import React from 'react';

describe('Navbar Component', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    role: 'student' as const,
    avatar: 'https://example.com/avatar.jpg'
  };

  it('renders user name and role', () => {
    render(<Navbar user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('student')).toBeInTheDocument();
  });

  it('renders user avatar', () => {
    render(<Navbar user={mockUser} />);
    
    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockUser.avatar);
  });
});
