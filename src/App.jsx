import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import BinderCollection from './pages/BinderCollection.jsx';
import SharedBinder from './pages/SharedBinder.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { EntitlementProvider } from './contexts/EntitlementContext.jsx';

function App() {
    return (
        <AuthProvider>
            <EntitlementProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/binder" element={<BinderCollection isWanted={false} />} />
                    <Route path="/wants" element={<BinderCollection isWanted={true} />} />
                    <Route path="/b/:token" element={<SharedBinder />} />
                </Routes>
            </EntitlementProvider>
        </AuthProvider>
    );
}

export default App;
