function Song({ id, title, artist }) {
  return (
    <li className="border p-4 rounded-lg mb-2" key={id}>
      <h3 className="">{title}</h3>
      <p className="font-thin">{artist}</p>
    </li>
  );
}

export default Song;
