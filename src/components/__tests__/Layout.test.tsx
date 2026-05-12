import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '../Layout';

describe('Layout', () => {
  it('should render children', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </BrowserRouter>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render footer', () => {
    render(
      <BrowserRouter>
        <Layout><div>Content</div></Layout>
      </BrowserRouter>
    );
    expect(screen.getByText(/© 2026 Lucas Porto/)).toBeInTheDocument();
  });
});
