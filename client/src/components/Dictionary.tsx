import { useEffect, useState } from 'react';
import { getDictionary } from '../firebase/databaseHandler';

export default function Dictionary() {
  const [dictionary, setDictionary] = useState<any[]>([]);

  useEffect(() => {
    getDictionary().then(setDictionary);
  }, []);

  return (
    <div className="dictionary">
      <div className="title">Dictionary</div>
      <div className="terms">
        {dictionary
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((def) => (
            <div key={def.name} className="term">
              <div className="name">{def.name}</div>
              <div className="def">{def.def}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
