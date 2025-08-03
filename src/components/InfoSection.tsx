import { InfoSectionProps } from '../types/components';

export const InfoSection = ({ title, children }: InfoSectionProps) => (
  <div className="info-section">
    <h4>{title}</h4>
    {children}
  </div>
);
