export default function FeedItem({ item, onSave }) {
    const handleSave = () => {
      onSave(item);
    };
  
    const handleShare = () => {
      navigator.clipboard.writeText(item.url);
      alert('Link copied to clipboard!');
    };
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            item.type === 'twitter' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
          }`}>
            {item.type}
          </span>
        </div>
        <h3 className="text-lg font-medium mb-2">{item.title || item.text.substring(0, 100)}</h3>
        {item.text && item.text.length > 100 && (
          <p className="text-gray-600 mb-4">{item.text.substring(0, 200)}...</p>
        )}
        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            Save
          </button>
          <button
            onClick={handleShare}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Share
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            View Original
          </a>
        </div>
      </div>
    );
  }