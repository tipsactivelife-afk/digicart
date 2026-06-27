import { X, Tag, Sparkles } from 'lucide-react';
import { useStore } from '../store';

export default function ExitPopup() {
  const { state, dispatch } = useStore();

  if (!state.showExitPopup) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => dispatch({ type: 'HIDE_EXIT_POPUP' })}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-bounce-in">
        {/* Close */}
        <button
          onClick={() => dispatch({ type: 'HIDE_EXIT_POPUP' })}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top accent */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-400 h-2" />

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-primary-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wait! Don't leave yet 👋</h2>
          <p className="text-gray-600 mb-6">
            Get <span className="font-bold text-primary-700 text-lg">10% off</span> your first
            purchase with this exclusive code:
          </p>

          {/* Code */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-5 mb-6 border-2 border-dashed border-primary-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">
                Your Exclusive Code
              </span>
              <Sparkles className="w-4 h-4 text-primary-500" />
            </div>
            <p className="text-3xl font-black text-primary-700 tracking-widest">WELCOME10</p>
          </div>

          <button
            onClick={() => {
              dispatch({ type: 'HIDE_EXIT_POPUP' });
              dispatch({ type: 'NAVIGATE', page: 'products' });
            }}
            className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-200 mb-3"
          >
            Claim My 10% Off
          </button>

          <button
            onClick={() => dispatch({ type: 'HIDE_EXIT_POPUP' })}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            No thanks, I'll pay full price
          </button>
        </div>
      </div>
    </div>
  );
}
