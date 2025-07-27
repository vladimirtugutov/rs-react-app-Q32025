import './About.css';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="about-page">
      <nav className="about-nav">
        <Link to="/">← Back to Search</Link>
      </nav>

      <div className="about-content">
        <h1>About This Application</h1>

        <div className="author-info">
          <h2>Author Information</h2>
          <p>
            <strong>Name:</strong> Vladimir Tugutov
          </p>
          <p>
            <strong>GitHub:</strong>{' '}
            <a
              href="https://github.com/vladimirtugutov"
              target="_blank"
              rel="noopener noreferrer"
            >
              [vladimirtugutov]
            </a>
          </p>
          <p>
            <strong>Course:</strong> RS School React Course Q3 2025
          </p>
        </div>

        <div className="course-info">
          <h2>Course Information</h2>
          <p>
            This application was created as part of the RS School React course.
          </p>
          <p>
            <a
              href="https://rs.school/courses/reactjs"
              target="_blank"
              rel="noopener noreferrer"
              className="course-link"
            >
              RS School React Course
            </a>
          </p>
        </div>

        <div className="app-info">
          <h2>Application Features</h2>
          <ul>
            <li>Search books using Open Library API</li>
            <li>Pagination support</li>
            <li>Detailed book view</li>
            <li>URL-based navigation</li>
            <li>React Router integration</li>
            <li>Custom hooks for localStorage</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;
