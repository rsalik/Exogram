export default function TicDispositionTable(props: { data: any }) {
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
          {props.data
            .sort((d: any) => {
              if (d.userId === 'user:paper') {
                return -1;
              }
              return 0;
            })
            .map((d: any) => (
              <TicDispositionTableRow data={d} key={d.userId} />
            ))}
        </tbody>
      </table>
    </div>
  );
}

function TicDispositionTableRow(props: { data: any }) {
  return (
    <tr className={`${props.data.userId === 'user:paper' ? 'paper' : ''}`}>
      <td>{props.data.name}</td>
      <td>{props.data.disposition}</td>
      <td>{props.data.comments}</td>
    </tr>
  );
}
