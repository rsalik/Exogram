import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { getDictionary, useUsernames } from '../handlers/databaseHandler';
import { generateDefinableTermsFromText } from './DefinableTerm';

export default function TicDispositionTable(props: { data: any; paperDisposition?: any }) {
  const users = useUsernames(props.data.map((d: any) => d.userId));

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
          {props.paperDisposition && <TicDispositionTableRow paper users={users} dictionary={dictionary} data={props.paperDisposition} />}
          {Object.keys(props.data)
            .sort()
            .map((k: any) => (
              <TicDispositionTableRow data={props.data[k]} users={users} key={k} dictionary={dictionary} />
            ))}
        </tbody>
      </table>
    </div>
  );
}

function TicDispositionTableRow(props: { data: any; users: any; dictionary: any[]; paper?: boolean }) {
  const user = useContext(UserContext);

  return (
    <tr className={`${props.paper ? 'paper' : ''} ${user?.uid === props.data.userId ? 'self' : ''}`}>
      <td>{props.paper ? 'Paper' : props.data.userId === 'group' ? 'Group' : props.users[props.data.userId] || ''}</td>
      <td>{generateDefinableTermsFromText(props.data.disposition, props.dictionary)}</td>
      <td>{generateDefinableTermsFromText(props.data.comments, props.dictionary)}</td>
    </tr>
  );
}
