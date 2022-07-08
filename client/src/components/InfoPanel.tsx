export default function InfoPanel(props: { title: string | JSX.Element; message: string | JSX.Element }) {
  return (
    <div className="info-panel">
      <div className="title">{props.title}</div>
      <div className="message">{props.message}</div>
    </div>
  );
}
