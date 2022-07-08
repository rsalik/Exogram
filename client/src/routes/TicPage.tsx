import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getTic } from '../apiHandler';
import ErrorPanel from '../components/ErrorPanel';
import InfoPanel from '../components/InfoPanel';
import TicInfoPanel from '../components/TicInfoPanel';

export function TicPage() {
  const { ticId } = useParams();
  const [ticData, setTicData] = useState<any>({} as any);

  const [ticNotFoundError, setTicNotFoundError] = useState(false);
  const [loadingTicData, setLoadingTicData] = useState(true);

  useEffect(() => {
    if (ticId) {
      getTic(ticId).then((data) => {
        if (data) setTicData(data);
        else setTicNotFoundError(true);

        setLoadingTicData(false);
      });
    }
  }, [ticId]);

  if (loadingTicData) return <InfoPanel title="Loading TIC Data" message="" />;
  if (ticNotFoundError) return <ErrorPanel title="Error 404" message={<>No data on <span className="mono">TIC <strong>{ticId}</strong></span> was found on the server.</>} />;

  return (
    <div className="tic-page">
      <TicInfoPanel ticData={ticData} />
    </div>
  );
}
