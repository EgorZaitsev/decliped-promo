import React, { useState, useEffect } from "react";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await fetch("http://localhost:3000/groups");
        if (!response.ok) {
          throw new Error("Ошибка получения данных о группах");
        }
        const data = await response.json();
        setGroups(data);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при получении данных о группах:", error.message);
        setError("Ошибка при получении данных о группах");
        setLoading(false);
      }
    }

    fetchGroups();
  }, []);

  if (loading) {
    return <div className="m-8">Загрузка...</div>;
  }

  if (error) {
    return <div className="m-8">Ошибка: {error}</div>;
  }

  return (
    <div>
      <h2 className="font-bold mb-2">Список групп</h2>
      <ul className="grid grid-cols-2 w-[500px] justify-items-center h-[590px] overflow-auto flex-col gap-1">
        {groups.map((group) => (
          <li className="border p-2 w-56 " key={group.id}>
            <img className="w-12 rounded-3xl" src={group.pic} alt="grouppic" />
            <p>{group.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Groups;

// function Groups() {
//   const [groups, setGroups] = useState([]);
//   useEffect(() => {
//     setGroups(getGroups());
//   }, []);
//   return (
//     <>
//       <h1>Группы для рассылки</h1>
//       <ul>{}</ul>
//     </>
//   );
// }
