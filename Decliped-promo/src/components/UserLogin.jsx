import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserLogin() {
  const [message, setMessage] = useState("");
  const redirect = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/login");

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        redirect("main");
      } else {
        setMessage("Произошла ошибка при регистрации");
        console.error(data.error);
      }
    } catch (error) {
      setMessage("Произошла ошибка при регистрации");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col  items-center w-56 ml-8  p-8 border border-black rounded-lg">
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        {/*  <div>
          <label>
            Токен Admin:
            <input
              className="border m-1 p-1"
              type="text"
              value={token1}
              onChange={(e) => setToken1(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Токен OK.RU:
            <input
              className="border m-1 p-1"
              type="text"
              value={token2}
              onChange={(e) => setToken2(e.target.value)}
            />
          </label>
        </div> */}
        <button
          className="border p-2 hover:border-gray-800 active:border-gray-950"
          type="submit"
        >
          Войти
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UserLogin;
