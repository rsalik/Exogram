import { useEffect, useState } from 'react';

export function generateDefinableTermsFromText(text: string, dictionary: any[]) {
  return (
    <>
      {text
        .replaceAll(/,(?=[^\s])/g, ', ') // Add spaces to commas w/o spaces so that terms are seperated
        .split(' ')
        .map<React.ReactNode>((t, i) => {
          let tr = t.trim().replaceAll(',', '');

          if (tr.length === 0) {
            return null;
          }

          let dictTerm = dictionary.find(
            (d) => d.name === tr || d.name.replaceAll('(p)', 'p') === tr || d.name.replaceAll('(p)', '') === tr
          );

          if (dictTerm) {
            return <DefinableTerm text={t} key={t} term={dictTerm.name} definition={dictTerm.def || ''} />;
          }

          return t;
        })
        .reduce((p, c) => [p, ' ', c])}
    </>
  );
}

export default function DefinableTerm(props: { text: string; term: string; definition: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!hovering) setShowTooltip(false);
  }, [hovering, showTooltip]);

  return (
    <div className="definable">
      <div
        className="text"
        onMouseEnter={() => {
          setHovering(true);
          setTimeout(() => { 
            setShowTooltip(true);
          }, 200);
        }}
        onMouseLeave={() => setHovering(false)}
      >
        {props.text}
      </div>
      {showTooltip && (
        <div className="tooltip">
          <div className="term">{props.term}</div>
          <div className="definition">{props.definition}</div>
        </div>
      )}
    </div>
  );
}
