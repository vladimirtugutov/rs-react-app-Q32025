import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { NotFound } from './NotFound';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NotFound', () => {
  it('should render 404 error code prominently', () => {
    renderWithRouter(<NotFound />);

    const errorCode = screen.getByRole('heading', { name: '404' });
    expect(errorCode).toBeInTheDocument();
  });

  it('should display "Page Not Found" heading', () => {
    renderWithRouter(<NotFound />);

    const heading = screen.getByRole('heading', { name: /page not found/i });
    expect(heading).toBeInTheDocument();
  });

  it('should show descriptive error message', () => {
    renderWithRouter(<NotFound />);

    const message = screen.getByText(
      /the page you are looking for does not exist/i
    );
    expect(message).toBeInTheDocument();
  });

  it('should render link to home page', () => {
    renderWithRouter(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /go back to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should have correct CSS classes applied', () => {
    renderWithRouter(<NotFound />);

    const notFoundPage = screen.getByText('404').closest('.not-found-page');
    expect(notFoundPage).toBeInTheDocument();

    const notFoundContent = screen
      .getByText('Page Not Found')
      .closest('.not-found-content');
    expect(notFoundContent).toBeInTheDocument();
  });

  it('should have home link with correct CSS class', () => {
    renderWithRouter(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /go back to home/i });
    expect(homeLink).toHaveClass('home-link');
  });

  it('should render proper heading hierarchy', () => {
    renderWithRouter(<NotFound />);

    const h1 = screen.getByRole('heading', { level: 1 });
    const h2 = screen.getByRole('heading', { level: 2 });

    expect(h1).toHaveTextContent('404');
    expect(h2).toHaveTextContent('Page Not Found');
  });

  it('should display all required elements in correct structure', () => {
    renderWithRouter(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(
      screen.getByText('The page you are looking for does not exist.')
    ).toBeInTheDocument();
    expect(screen.getByText('Go back to Home')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    const { container } = renderWithRouter(<NotFound />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should have semantic HTML structure', () => {
    renderWithRouter(<NotFound />);

    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(2);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
  });

  it('should have accessible link text', () => {
    renderWithRouter(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /go back to home/i });
    expect(homeLink).toHaveTextContent('Go back to Home');

    expect(homeLink.textContent).not.toBe('Click here');
    expect(homeLink.textContent).not.toBe('Link');
  });

  it('should display error message as paragraph', () => {
    renderWithRouter(<NotFound />);

    const errorMessage = screen.getByText(
      /the page you are looking for does not exist/i
    );
    expect(errorMessage.tagName).toBe('P');
  });

  it('should have Link component from react-router-dom', () => {
    renderWithRouter(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /go back to home/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink).not.toHaveAttribute('target', '_blank');
  });

  it('should contain all text content correctly', () => {
    renderWithRouter(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(
      screen.getByText('The page you are looking for does not exist.')
    ).toBeInTheDocument();
    expect(screen.getByText('Go back to Home')).toBeInTheDocument();
  });

  it('should have proper document structure for screen readers', () => {
    renderWithRouter(<NotFound />);

    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('404');

    const secondaryHeading = screen.getByRole('heading', { level: 2 });
    expect(secondaryHeading).toHaveTextContent('Page Not Found');

    const allHeadings = screen.getAllByRole('heading');
    expect(allHeadings[0]).toHaveTextContent('404');
    expect(allHeadings[1]).toHaveTextContent('Page Not Found');
  });
});
