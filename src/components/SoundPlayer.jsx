import { useSelector, useDispatch } from "react-redux";
import { selectSounds, togglePlay, setVolume } from "../store/soundSlice";
import { useEffect, useRef } from "react";
import Draggable from "react-draggable";

function SoundPlayer() {
  const dispatch = useDispatch();
  const sounds = useSelector(selectSounds);

  const audioRefs = useRef({});

  useEffect(() => {
    sounds.forEach((sound) => {
      if (!audioRefs.current[sound.id]) {
        audioRefs.current[sound.id] = new Audio(sound.src);
      }
      audioRefs.current[sound.id].volume = sound.volume;
    });
  }, [sounds]);

  const handlePlayPause = (id) => {
    const sound = sounds.find((s) => s.id === id);
    const audio = audioRefs.current[id];

    if (sound && audio) {
      if (sound.playing) {
        audio.pause();
      } else {
        audio.play();
      }
      dispatch(togglePlay(id));
    }
  };

  const handleVolumeChange = (id, volume) => {
    const audio = audioRefs.current[id];
    if (audio) {
      audio.volume = volume;
    }
    dispatch(setVolume({ id, volume }));
  };

  return (
    <Draggable>
      <div className="p-4 bg-gray-800 text-white rounded-lg w-72 shadow-lg cursor-move">
        <h3 className="text-lg font-semibold mb-4">🎵 Sound Controls</h3>
        {sounds.map((sound) => (
          <div key={sound.id} className="flex items-center justify-between mb-2">
            <div>
              <button
                onClick={() => handlePlayPause(sound.id)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
              >
                {sound.playing ? "Pause" : "Play"}
              </button>
              <p>{sound.name}</p>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sound.volume}
              onChange={(e) => handleVolumeChange(sound.id, parseFloat(e.target.value))}
              className="ml-4 w-24"
            />
          </div>
        ))}
      </div>
    </Draggable>
  );
}

export default SoundPlayer;
