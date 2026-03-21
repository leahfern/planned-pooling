const React = require('react');

const mockNavigate = jest.fn();

// Shared location so MemoryRouter can set it and useLocation can read it
let currentLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default',
};

exports.useNavigate = () => mockNavigate;
exports.useLocation = () => currentLocation;

function MemoryRouter({ children, initialEntries = ['/'], initialIndex = 0 }) {
  const entry = initialEntries[initialIndex];
  if (entry && typeof entry === 'string') {
    const [pathname, search = ''] = entry.split('?');
    currentLocation = { ...currentLocation, pathname: pathname || '/', search: search ? '?' + search : '' };
  }
  return React.createElement(React.Fragment, null, children);
}

exports.MemoryRouter = MemoryRouter;
exports.BrowserRouter = MemoryRouter;
exports.Router = MemoryRouter;
exports.Routes = ({ children }) => children;
exports.Route = ({ element }) => element;
