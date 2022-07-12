import dictionaryDefinitions from '../dictionaryDefinitions.json';

export default function Dictionary() {
  return (
    <div className="dictionary">
      <div className="title">Dictionary</div>
      <div className="terms">
        {dictionaryDefinitions.sort((a, b) => a.name.localeCompare(b.name)).map((def) => (
          <div key={def.name} className="term">
            <div className="name">{def.name}</div>
            <div className="def">{def.def}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
