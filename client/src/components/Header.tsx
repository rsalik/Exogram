export default function Header() {
  return (
    <div className="header">
      <div className="title">
        <a href="/">
          Exo<span>gram</span>
        </a>
      </div>
      <div className="links">
        <a href="/table">TIC Table</a>
        <div className="sep">/</div>
        <a href="/dictionary">Dictionary</a>
      </div>
    </div>
  );
}
