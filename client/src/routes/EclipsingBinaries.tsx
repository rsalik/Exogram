import { CheckCircle, Search } from '@mui/icons-material';
import EclipsingBinariesPanel from '../components/EclipsingBinaries/EclipsingBinariesPanel';
import EBLookupPanel from '../components/EclipsingBinaries/EBLookupPanel';
import { useParams } from 'react-router';

export default function EclipsingBinaries() {
  const { ticId } = useParams();

  if (window.location.pathname === '/ebs/verify') {
    return (
      <div className="ebs">
        <EclipsingBinariesPanel />
      </div>
    );
  }

  if (window.location.pathname.includes('/ebs/lookup')) { 
    return <div className="ebs">
      <EBLookupPanel id={ticId} />
    </div>
  }

  return (
    <div className="ebs home">
      <div className="title">Eclipsing Binaries</div>
      <div className="buttons">
        <a className="lbtn verify" href="/ebs/verify">
          <div className="icon">
            <CheckCircle fontSize="inherit" />
          </div>
          <div className="name">Verify</div>
          <div className="desc">Help verify thousands of potential eclipsing binaries. Requires Exogram account.</div>
        </a>
        <a className="lbtn lookup" href="/ebs/lookup">
          <div className="icon">
            <Search fontSize="inherit" />
          </div>
          <div className="name">Lookup</div>
          <div className="desc">Search for a specific target.</div>
        </a>
      </div>
    </div>
  );
}
