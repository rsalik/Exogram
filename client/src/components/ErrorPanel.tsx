export default function ErrorPanel(props: { title: string | JSX.Element; message?: string | JSX.Element }) {
  return (
    <div className="error-panel">
      <div className="title">{props.title}</div>
      <div className="message">{props.message}</div>
    </div>
  );
}
