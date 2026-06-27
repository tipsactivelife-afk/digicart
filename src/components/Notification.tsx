import { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../store';

export default function Notification() {
  const { state, dispatch } = useStore();

  useEffect(() => {
    if (state.notification) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.notification, dispatch]);

  if (!state.notification) return null;

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  };

  const Icon = icons[state.notification.type];

  return (
    <div className="fixed top-28 right-4 z-[70] animate-slide-in-right">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-lg ${
          colors[state.notification.type]
        }`}
      >
        <Icon className={`w-5 h-5 ${iconColors[state.notification.type]}`} />
        <span className="text-sm font-medium">{state.notification.message}</span>
        <button
          onClick={() => dispatch({ type: 'CLEAR_NOTIFICATION' })}
          className="p-1 rounded-lg hover:bg-black/5 transition-colors ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
