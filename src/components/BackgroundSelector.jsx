import { useDispatch, useSelector } from "react-redux";
import { setBackground, selectCurrentBackground, selectBackgrounds } from "../store/backgroundSlice";

export default function BackgroundSelector() {
  const dispatch = useDispatch();
  const currentBackground = useSelector(selectCurrentBackground);
  const backgrounds = useSelector(selectBackgrounds);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm mt-2">
      <h3 className="text-lg font-semibold mb-4">Background Theme</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {backgrounds.map((bg) => (
          <button
            key={bg.id}
            onClick={() => dispatch(setBackground(bg.id))}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
              currentBackground === bg.id ? "border-blue-500" : "border-transparent"
            } transition`}
          >
            <img src={bg.image} alt={bg.name} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
