import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-dark-950 text-dark-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-3xl -z-10" />

      <div className="text-center space-y-6 max-w-md relative glass-panel p-8 rounded-3xl border border-dark-800 shadow-2xl">
        {/* Brand Icon */}
        <div className="flex justify-center">
          <div className="bg-brand-500/10 p-4 rounded-2xl text-brand-400 border border-brand-500/20">
            <BookOpen className="w-12 h-12 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-8xl font-display font-extrabold text-white tracking-tighter">404</h1>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Requested Resource Not Found</h2>
          <p className="text-sm text-dark-400 max-w-sm mx-auto mt-2">
            The page you are looking for does not exist or has been moved to a different administrative sector.
          </p>
        </div>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-brand-500/25 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Portal Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
