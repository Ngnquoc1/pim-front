import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

jest.mock('../services/projectService', () => ({
  searchProjects: jest.fn().mockResolvedValue([]),
  getProjects: jest.fn().mockResolvedValue([]),
}));

test('renders project information management header', () => {
  const { getByText } = render(<App />);
  const headerElement = getByText(/Project Information Management/i);
  expect(headerElement).toBeInTheDocument();
});
