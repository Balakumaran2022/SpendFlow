import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-black text-slate-200">404</h1>
      <h2 className="text-3xl font-bold text-slate-900 mt-4">Page not found</h2>
      <p className="text-slate-500 mt-2 max-w-md">Sorry, we couldn't find the page you're looking for. It might have been removed or renamed.</p>
      <Link 
        to="/" 
        className="mt-8 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
