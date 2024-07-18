import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Auth';
import OTP from './OTP';
import Upload from './FileUpload';
import { AuthProvider } from './AuthContext';  
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
    
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/otp" element={<OTP />} />
          <Route path="*" element={<Auth />} />
          <Route path="/upload" element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    
  );
};

export default App;
