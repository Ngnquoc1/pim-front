import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders project information management header', () => {
  const { getByText } = render(<App />);
  const headerElement = getByText(/Project Information Management/i);
  expect(headerElement).toBeInTheDocument();
});
