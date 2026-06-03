import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { About } from './About';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('About', () => {
  it('should render main heading correctly', () => {
    renderWithRouter(<About />);

    expect(
      screen.getByRole('heading', { name: /about this application/i })
    ).toBeInTheDocument();
  });

  it('should render navigation link to home page', () => {
    renderWithRouter(<About />);

    const backLink = screen.getByRole('link', { name: /← back to search/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('should display author information section with correct details', () => {
    renderWithRouter(<About />);

    expect(
      screen.getByRole('heading', { name: /author information/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/name:/i)).toBeInTheDocument();
    expect(screen.getByText('Vladimir Tugutov')).toBeInTheDocument();
    expect(screen.getByText(/github:/i)).toBeInTheDocument();
    expect(screen.getByText(/course:/i)).toBeInTheDocument();
    expect(
      screen.getByText(/rs school react course q3 2025/i)
    ).toBeInTheDocument();
  });

  it('should display course information section', () => {
    renderWithRouter(<About />);

    expect(
      screen.getByRole('heading', { name: /course information/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /this application was created as part of the rs school react course/i
      )
    ).toBeInTheDocument();
  });

  it('should render RS School course link with correct attributes', () => {
    renderWithRouter(<About />);

    const courseLink = screen.getByRole('link', {
      name: /rs school react course/i,
    });
    expect(courseLink).toBeInTheDocument();
    expect(courseLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    expect(courseLink).toHaveAttribute('target', '_blank');
    expect(courseLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(courseLink).toHaveClass('course-link');
  });

  it('should display GitHub link with correct attributes', () => {
    renderWithRouter(<About />);

    const githubLink = screen.getByRole('link', {
      name: /\[vladimirtugutov\]/i,
    });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/vladimirtugutov'
    );
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should display application features section', () => {
    renderWithRouter(<About />);

    expect(
      screen.getByRole('heading', { name: /application features/i })
    ).toBeInTheDocument();

    const featuresList = screen.getByRole('list');
    expect(featuresList).toBeInTheDocument();
  });

  it('should display all application features correctly', () => {
    renderWithRouter(<About />);

    const expectedFeatures = [
      'Search books using Open Library API',
      'Pagination support',
      'Detailed book view',
      'URL-based navigation',
      'React Router integration',
      'Custom hooks for localStorage',
    ];

    expectedFeatures.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  it('should have correct CSS classes applied', () => {
    renderWithRouter(<About />);

    const aboutPage = screen
      .getByText(/about this application/i)
      .closest('.about-page');
    expect(aboutPage).toBeInTheDocument();

    const aboutNav = screen.getByText(/back to search/i).closest('.about-nav');
    expect(aboutNav).toBeInTheDocument();

    const aboutContent = screen
      .getByText(/author information/i)
      .closest('.about-content');
    expect(aboutContent).toBeInTheDocument();
  });

  it('should render all sections in correct order', () => {
    renderWithRouter(<About />);

    const headings = screen.getAllByRole('heading');
    const headingTexts = headings.map((heading) => heading.textContent);

    expect(headingTexts).toEqual([
      'About This Application',
      'Author Information',
      'Course Information',
      'Application Features',
    ]);
  });

  it('should render exactly 6 list items in features section', () => {
    renderWithRouter(<About />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(6);
  });

  it('should contain appropriate semantic HTML structure', () => {
    renderWithRouter(<About />);

    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();

    expect(screen.getByText(/author information/i).closest('div')).toHaveClass(
      'author-info'
    );
    expect(screen.getByText(/course information/i).closest('div')).toHaveClass(
      'course-info'
    );
    expect(
      screen.getByText(/application features/i).closest('div')
    ).toHaveClass('app-info');
  });

  it('should have accessible external links', () => {
    renderWithRouter(<About />);

    const externalLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('target') === '_blank');

    expect(externalLinks).toHaveLength(2);

    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('should display author name as Vladimir Tugutov', () => {
    renderWithRouter(<About />);

    expect(screen.getByText('Vladimir Tugutov')).toBeInTheDocument();
  });

  it('should display correct course year Q3 2025', () => {
    renderWithRouter(<About />);

    expect(
      screen.getByText(/rs school react course q3 2025/i)
    ).toBeInTheDocument();
  });

  it('should have GitHub username vladimirtugutov in link text', () => {
    renderWithRouter(<About />);

    const githubLink = screen.getByText('[vladimirtugutov]');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink.closest('a')).toHaveAttribute(
      'href',
      'https://github.com/vladimirtugutov'
    );
  });
});
