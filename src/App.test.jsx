// @vitest-environment jsdom
import { expect, describe, it, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

beforeAll(async () => {
  globalThis.expect = expect;
  await import('@testing-library/jest-dom');
});

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Check if the login screen appears by default
    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/Chaskys/i)).toBeInTheDocument();
  });
});
