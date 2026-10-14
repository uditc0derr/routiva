import { Navigate, Route, Routes } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext.jsx';
import Landing from './pages/Landing.jsx';
import Doc from './pages/Doc.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <SearchProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/:slug" element={<Doc />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SearchProvider>
  );
}
