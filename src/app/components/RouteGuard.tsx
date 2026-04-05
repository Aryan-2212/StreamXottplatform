import { Navigate } from 'react-router';
import { useApp } from '../context';

export function RouteGuard() {
  const { preferences } = useApp();
  
  if (preferences.onboardingCompleted) {
    return <Navigate to="/home" replace />;
  }
  
  return <Navigate to="/onboarding" replace />;
}
