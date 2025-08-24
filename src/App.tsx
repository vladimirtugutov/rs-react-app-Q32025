import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainRoute from './pages/MainRoute';
import UncontrolledForm from './pages/UncontrolledForm';
import ControlledForm from './pages/ControlledForm';

export default function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Main</Link>
          </li>
          <li>
            <Link to="/uncontrolled-form">Uncontrolled Form</Link>
          </li>
          <li>
            <Link to="/controlled-form">Controlled Form</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<MainRoute />} />
        <Route path="/uncontrolled-form" element={<UncontrolledForm />} />
        <Route path="/controlled-form" element={<ControlledForm />} />
      </Routes>
    </Router>
  );
}
