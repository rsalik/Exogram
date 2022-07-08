export default function TicDisposition(props: { data: any }) {
  return (
    <div className="disposition-wrapper">
      <div className="disposition">
        {props.data.name && <div className="name">{props.data.name}</div>}
        <div className="value">{props.data.disposition}</div>
        {props.data.comments && <div className="comments">{props.data.comments}</div>}
      </div>
    </div>
  );
}
