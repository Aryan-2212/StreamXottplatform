import { RouterProvider } from 'react-router';
import { AppProvider } from './context';
import { WatchlistProvider } from './watchlistContext';
import { router } from './routes';

export default function App() {
  return (
    <AppProvider>
      <WatchlistProvider>
        <RouterProvider router={router} />
      </WatchlistProvider>
    </AppProvider>
  );
}