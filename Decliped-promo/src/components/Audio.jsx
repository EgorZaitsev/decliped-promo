import { usePosting } from "../PostingContext";
import React, { useState } from "react";
import Song from "./Song";

function Audio() {
  const { enablePosting, disablePosting } = usePosting();
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const getAudio = async () => {
    disablePosting(); // Отключаем кнопку при начале запроса
    try {
      const response = await fetch(
        `http://localhost:3000/audio?count=${count}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch audio");
      }
      const audioArray = await response.json();
      setAudios(audioArray.items);
      setLoading(false);
      enablePosting(); // Включаем кнопку после успешного запроса
    } catch (error) {
      console.error("Error fetching audio:", error);
      setLoading(false);
    }
  };

  const handleCountChange = (event) => {
    setCount(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getAudio();
    // Вы можете добавить дополнительную логику здесь, если это необходимо
  };

  return (
    <div>
      <h2 className="font-bold">Аудио</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Количество аудио:
          <input
            min={1}
            className="m-2 border"
            type="number"
            value={count}
            onChange={handleCountChange}
          />
        </label>
        <button
          className="border p-2 hover:border-gray-800 active:border-gray-950"
          type="submit"
        >
          Загрузить
        </button>
      </form>
      {loading ? ( // Если loading true, показываем индикатор загрузки
        <p className="mt-2">Ждём музло...</p>
      ) : (
        <ul className="h-[550px] overflow-auto">
          {audios.map((audio) => (
            <Song key={audio.id} title={audio.title} artist={audio.artist} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Audio;
