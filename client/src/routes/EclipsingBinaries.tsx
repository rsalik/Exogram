import { Bookmark, Check, CheckCircle, Search } from '@mui/icons-material';
import EclipsingBinariesPanel from '../components/EclipsingBinaries/EclipsingBinariesPanel';
import EBLookupPanel from '../components/EclipsingBinaries/EBLookupPanel';
import { useParams } from 'react-router';
import { useState } from 'react';
import SavedEBs from '../components/EclipsingBinaries/SavedEBs';
import EBLeaderboard from '../components/EclipsingBinaries/EBLeaderboard';

export default function EclipsingBinaries() {
  const { ticId } = useParams();

  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedTicId, setSubmittedTICId] = useState('');

  const successEle = (
    <div className={`success ${showSuccess ? 'show' : ''}`}>
      <div className="icon">
        <Check fontSize="large" />
      </div>
      <div className="text">
        Response Submitted for <br />
        TIC <strong>{submittedTicId}</strong>
      </div>
    </div>
  );

  function submitSuccess(id: string) {
    setShowSuccess(true);
    setSubmittedTICId(id);

    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  }

  if (window.location.pathname.includes('/ebs/verify')) {
    return (
      <div className="ebs">
        {successEle}
        <EclipsingBinariesPanel submitSuccess={submitSuccess} id={ticId} />
      </div>
    );
  }

  if (window.location.pathname.includes('/ebs/lookup')) {
    return (
      <div className="ebs">
        {successEle}
        <EBLookupPanel id={ticId} />
      </div>
    );
  }

  if (window.location.pathname.includes('/ebs/saved')) {
    return (
      <div className="ebs">
        {successEle}
        <SavedEBs />
      </div>
    );
  }

  return (
    <div className="ebs home">
      {successEle}
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
      <a className="saved" href="/ebs/saved">
        <Bookmark font-size="inherit" />
        &nbsp;<span>View Saved Targets</span>
      </a>
      <EBLeaderboard />
    </div>
  );
}
