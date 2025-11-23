const Summary = ({ summary, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
      {summary.map((item, index) => (
        <div
          key={index}
          onClick={() => onSelect(item)}
          className={`${item.bg} ${item.iconColor} rounded-xl p-5 flex items-center gap-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20`}
        >
          <div className="p-3 bg-white/40 rounded-lg backdrop-blur-sm">
            {item.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-secondary">{item.title}</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {item.value.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Summary;