import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';


const pages = import.meta.glob('./components/pages/*.tsx', { eager: true });


function getRouteFromPath(path: string) {
  const match = path.match(/\.\/components\/pages\/(.*)\.tsx$/);
  if (!match) return null;
  let route = match[1]
    .replace(/\\/g, '/')
    .replace(/index$/i, '')
    .replace(/([A-Z])/g, '-$1')
    .replace(/-/g, '')
    .toLowerCase();
  if (!route.startsWith('/')) route = '/' + route;
  return route;
}


const routes = Object.entries(pages)
  .map(([path, mod]: any) => {
    const route = getRouteFromPath(path);
    if (!route || !mod.default) return null;
    return { path: route, Component: mod.default };
  })
  .filter((r): r is { path: string; Component: any } => r !== null);


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
