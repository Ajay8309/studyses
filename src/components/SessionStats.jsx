import { formatDistanceToNow } from "date-fns";

export default function SessionStats({ sessions }) {
  console.log("Rendering sessions:", sessions); // Debugging

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-64 mt-2">
      <h3 className="text-lg font-semibold mb-2">Session History</h3>
      {sessions.length === 0 ? (
        <p className="text-gray-500">No sessions completed yet</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {sessions.map((session, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded shadow">
              <p className="text-sm">
                {Math.floor(session.duration / 60)} min session completed{" "}
                {session.completedAt ? formatDistanceToNow(new Date(session.completedAt)) : "unknown time"} ago
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
