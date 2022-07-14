import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ErrorPanel from '../components/ErrorPanel';
import InfoPanel from '../components/InfoPanel';
import TicInfoPanel from '../components/TicInfoPanel';
import { useTicData } from '../handlers/databaseHandler';

export function TicPage() {
  const { ticId } = useParams();

  const [ticNotFoundError, setTicNotFoundError] = useState(false);
  const [loadingTicData, setLoadingTicData] = useState(true);

  const ticData = useTicData(ticId || '');

  useEffect(() => {
    if (ticData) {
      setLoadingTicData(false);
      setTicNotFoundError(false);
    }

    if (!ticData) {
      setTicNotFoundError(true);
    }
  }, [ticData]);

  if (loadingTicData) return <InfoPanel title="Loading TIC Data" />;
  if (ticNotFoundError)
    return (
      <ErrorPanel
        title="Error 404"
        message={
          <>
            No data on{' '}
            <span className="mono">
              TIC <strong>{ticId}</strong>
            </span>{' '}
            was found on the server.
          </>
        }
      />
    );

  return (
    <div className="tic-page">
      <TicInfoPanel ticData={ticData} />
    </div>
  );
}
