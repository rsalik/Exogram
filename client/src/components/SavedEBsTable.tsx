import { useEffect, useState } from 'react';
import { getMyEBResponse } from '../handlers/databaseHandler';

export default function SavedEBsTable(props: { ticIds: string[] }) {
  const [ebs, setEbs] = useState<any[]>([]);

  useEffect(() => {
    function getEBs() {
      let arr = [] as any[];
      let promises = [];

      for (let ticId of props.ticIds) {
        promises.push(
          (async () => {
            return { ...(await getMyEBResponse(ticId)), ticId };
          })()
        );
      }

      Promise.all(promises).then((res) => {
        res.forEach((r) => {
          arr.push(r);
        });
        console.log(arr);
        setEbs(arr);
      });
    }

    getEBs();
  }, [props.ticIds]);

  return (
    <div className="tic-table">
      <div className="title">Saved EBs</div>

      <table className="table-compact">
        <thead>
          <tr>
            <th>TIC ID</th>
            <th>Your Response to "Is Eclipsing Binary"</th>
            <th>Your Response to "Is Measured Period Correct"</th>
            <th>Your Comments</th>
          </tr>
        </thead>
        <tbody>
          {ebs.map((eb) => (
            <tr onClick={() => window.open('/ebs/lookup/' + eb.ticId)} className="tic" key={eb.ticId}>
              <td className="mono">{eb.ticId}</td>
              <td>{eb.isEB !== undefined ? (eb.isEB ? 'Yes' : 'No') : ''}</td>
              <td>{eb.isPeriodCorrect !== undefined ? (eb.isPeriodCorrect ? 'Yes' : 'No') : ''}</td>
              <td>{eb.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
