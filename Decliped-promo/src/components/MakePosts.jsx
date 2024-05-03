// внутри MakePosts компонента
import { useState } from "react";
import { usePosting } from "../PostingContext";

function MakePosts() {
  const [resBack, setRes] = useState(false);

  const { isPostingEnabled, disablePosting } = usePosting();

  function handlePosting() {
    disablePosting(); // Отключаем кнопку перед отправкой запроса
    fetch("http://localhost:3000/post")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to post");
        }
        setRes(true);
        return response.json();
      })
      .catch((error) => {
        console.error("Error posting:", error);
      });
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      <button
        className="border p-1 disabled:bg-gray-200 hover:border-gray-700"
        onClick={handlePosting}
        disabled={!isPostingEnabled}
      >
        Выложить Посты
      </button>
      {resBack ? <p className="">Посты выложились</p> : ""}
    </div>
  );
}

export default MakePosts;
