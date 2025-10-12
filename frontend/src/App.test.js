import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  // Just check that the app renders without errors
  expect(document.body).toBeInTheDocument();
});
