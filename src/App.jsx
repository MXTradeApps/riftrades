import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { EntitlementProvider } from './contexts/EntitlementContext.jsx';

function App() {
    return (
        <AuthProvider>
            <EntitlementProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                </Routes>
            </EntitlementProvider>
        </AuthProvider>
    );
}

export default App;
