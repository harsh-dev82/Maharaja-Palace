import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
  }

  return isAuthenticated;
};
