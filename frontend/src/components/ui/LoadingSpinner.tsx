export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );
}
