import { useState } from 'react';
import ErrorPanel from '../components/ErrorPanel';
import Link from '../components/Link';
import TicTable from '../components/TicTable';

export default function TicTablePage() {
  const [error, setError] = useState(false);

  return (
    <>
      {error ? (
        <ErrorPanel
          title="An Error Occurred"
          message={<>Unable to fetch TIC Data. Try again in a few minutes or contact the <Link href="mailto:rssalik14@gmail.com" borderless>developers</Link> if the problem persists.</>}
        />
      ) : (
        <TicTable onError={() => setError(true)} />
      )}
    </>
  );
}
