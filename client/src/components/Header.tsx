export function Header() {
  return (
    <div className="header">
      <HeaderAndFooterContent />
    </div>
  );
}

export function Footer() {
  return (
    <div className="footer">
      <HeaderAndFooterContent />
    </div>
  );
}

function HeaderAndFooterContent() {
  return (
    <>
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
    </>
  );
}
