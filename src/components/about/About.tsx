import './About.css';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const About = () => {
  const t = useTranslations('About');

  return (
    <div className="about-page">
      <nav className="about-nav">
        <Link href="/">{t('backToSearch')}</Link>
      </nav>

      <div className="about-content">
        <h1>{t('title')}</h1>

        <div className="author-info">
          <h2>{t('authorInfo')}</h2>
          <p>
            <strong>{t('name')}:</strong> Vladimir Tugutov
          </p>
          <p>
            <strong>{t('github')}:</strong>{' '}
            <a
              href="https://github.com/vladimirtugutov"
              target="_blank"
              rel="noopener noreferrer"
            >
              [vladimirtugutov]
            </a>
          </p>
          <p>
            <strong>{t('course')}:</strong> RS School React Course Q3 2025
          </p>
        </div>

        <div className="course-info">
          <h2>{t('courseInfo')}</h2>
          <p>{t('courseDescription')}</p>
          <p>
            <a
              href="https://rs.school/courses/reactjs"
              target="_blank"
              rel="noopener noreferrer"
              className="course-link"
            >
              {t('courseLink')}
            </a>
          </p>
        </div>

        <div className="app-info">
          <h2>{t('appFeatures')}</h2>
          <ul>
            <li>{t('feature1')}</li>
            <li>{t('feature2')}</li>
            <li>{t('feature3')}</li>
            <li>{t('feature4')}</li>
            <li>{t('feature5')}</li>
            <li>{t('feature6')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
