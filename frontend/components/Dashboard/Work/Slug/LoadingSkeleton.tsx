function LoadingSkeleton() {
  return (
    <>
      {" "}
      <div className="bg-white rounded-xl shadow-md p-6 mb-4 animate-pulse">
        {" "}
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>{" "}
        <div className="space-y-4">
          {" "}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        {" "}
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>{" "}
        <div className="h-32 bg-gray-200 rounded"></div>{" "}
      </div>{" "}
    </>
  );
}

export default LoadingSkeleton;