import { useState } from 'react';
import dictionaryDefinitions from '../dictionaryDefinitions.json';

export function generateDefinableTermsFromText(text: string) {
  return (
    <>
      {text
        .replaceAll(/,(?=[^\s])/g, ', ') // Add spaces to commas w/o spaces so that terms are seperated
        .split(' ')
        .map<React.ReactNode>((t) => {
          let tr = t.trim().replaceAll(',', '');

          if (tr.length === 0) {
            return <></>;
          }

          let dictTerm = dictionaryDefinitions.find((d) => d.name === tr || d.name.replaceAll('(p)', 'p') === tr || d.name.replaceAll('(p)', '') === tr);

          if (dictTerm) {
            return <DefinableTerm text={t} term={dictTerm.name} definition={dictTerm.def} />;
          }

          return <>{t}</>;
        })
        .reduce((p, c) => [p, ' ', c])}
    </>
  );
}

export default function DefinableTerm(props: { text: string; term: string; definition: string }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="definable">
      <div className="text" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
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
