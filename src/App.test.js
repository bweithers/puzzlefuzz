import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome screen', () => {
  render(<App />);
  expect(screen.getByText(/welcome to puzzle fuzz/i)).toBeInTheDocument();
  expect(screen.getByText(/create new game/i)).toBeInTheDocument();
  expect(screen.getByText(/join game/i)).toBeInTheDocument();
});
