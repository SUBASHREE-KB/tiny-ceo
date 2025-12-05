import { Check } from 'lucide-react';
// Card Component for displaying team outputs
function OutputCard({ title, content, icon: Icon, status = 'completed' }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <Icon size={20} className="text-white" />
          </div>
          <h3 className="text-white font-semibold">{title}</h3>
        </div>
        {status === 'completed' && (
          <div className="flex items-center gap-1 text-green-500 text-sm">
            <Check size={16} />
            <span>Done</span>
          </div>
        )}
      </div>
      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
        {typeof content === 'string' ? content :
         typeof content === 'object' && content !== null ?
         JSON.stringify(content, null, 2) :
         String(content)}
      </p>
    </div>
  );
}
export default OutputCard;