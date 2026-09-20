import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

jest.mock('../services/projectService', () => ({
  searchProjects: jest.fn().mockResolvedValue([]),
  getProjects: jest.fn().mockResolvedValue([]),
  getProjectById: jest.fn().mockResolvedValue({}),
  createProject: jest.fn().mockResolvedValue({}),
  updateProject: jest.fn().mockResolvedValue({}),
  deleteProjects: jest.fn().mockResolvedValue({}),
}));

jest.mock('../services/groupService', () => ({
  getAllGroups: jest.fn().mockResolvedValue([]),
}));

test('renders project information management header', () => {
  const { getByText } = render(<App />);
  const headerElement = getByText(/Project Information Management/i);
  expect(headerElement).toBeInTheDocument();
});
