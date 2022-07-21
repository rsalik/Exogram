import ErrorPanel from '../components/ErrorPanel';
import Link from '../components/Link';

export default function PageNotFound() {
  return (
    <ErrorPanel
      title="Error 404"
      message={
        <>
          The page at <strong>{new URL(window.location.href).pathname}</strong> was not found on the server.&nbsp;
          <Link href="/">Return Home</Link>
        </>
      }
    />
  );
}
