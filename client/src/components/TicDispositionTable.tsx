import { useState, useEffect } from 'react';
import { getDictionary, useUsers } from '../handlers/databaseHandler';
import { generateDefinableTermsFromText } from './DefinableTerm';

export default function TicDispositionTable(props: { data: any }) {
  const users = useUsers();

  const [dictionary, setDictionary] = useState<any[]>([]);

  useEffect(() => {
    getDictionary().then(setDictionary);
  }, []);

  return (
    <div className="tic-disposition-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Disposition</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(props.data)
            .sort((k: any) => {
              if (k === 'paper') {
                return -1;
              }
              return 0;
            })
            .map((k: any) => (
              // This should probably be refactored lol
              <TicDispositionTableRow data={{ ...props.data[k], userId: k }} users={users} key={k} dictionary={dictionary} />
            ))}
        </tbody>
      </table>
    </div>
  );
}

function TicDispositionTableRow(props: { data: any; users: any; dictionary: any[] }) {
  return (
    <tr className={`${props.data.userId === 'paper' ? 'paper' : ''}`}>
      <td>
        {isNaN(props.data.userId)
          ? props.data.userId[0].toUpperCase() + props.data.userId.substring(1) // Crazy, I know lol
          : props.users?.filter((u: any) => u.id === props.data.userId)[0]?.name}
      </td>
      <td>{props.data.disposition}</td>
      <td>{generateDefinableTermsFromText(props.data.comments, props.dictionary)}</td>
    </tr>
  );
}
