import { useEffect, useState } from "react";
import Groups from "./Groups";
import Connect from "./Connect";
import Audio from "./Audio";
import MakePosts from "./MakePosts";
import { PostingProvider } from "../PostingContext";

function Main() {
  const [isConnected, setConnection] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("http://localhost:3000/connect");
        if (!response.ok) {
          throw new Error("Ошибка соединения с сервером");
        }
        setConnection(true);
      } catch (error) {
        console.error(error);
        setError("Ошибка при подключении к серверу");
      }
    };
    checkConnection();
  }, []);

  if (error) {
    return (
      <div>
        <h2>Ошибка</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!isConnected) {
    return <div className="m-8 font-bold text-4xl">Подключение...</div>;
  }

  return (
    <>
      <PostingProvider>
        <div className="flex flex-row m-8 gap-2 ">
          <h2 className="font-bold text-3xl">SMM</h2>
          <span className="text-green-500 text-2xl">●</span>
          <h2 className="text-2xl">Работаем</h2>
          <MakePosts />
        </div>
        <div className="flex flex-row m-8 justify-around">
          <Connect />
          <Audio />
          <Groups />
        </div>
      </PostingProvider>
    </>
  );
}

export default Main;
