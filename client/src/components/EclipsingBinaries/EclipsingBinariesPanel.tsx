import { Check, ChevronRight, KeyboardReturn } from '@mui/icons-material';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { getRandomEB, submitEBResponse } from '../../handlers/functionsHandler';
import { exofopLink, latteLink } from '../../utils';
import ErrorPanel from '../ErrorPanel';
import InfoPanel from '../InfoPanel';

const questions = [
  'Is this an <span>eclipsing binary</span>?',
  'Is the <span>measured period</span> correct?',
  'Any other comments?',
  'Review',
];

const quickAdds = ['CPOC', 'AE', 'LowSNR', 'DLC', 'Fla', 'SSys'];

export default function EclipsingBinariesPanel() {
  const [ebFile, setEBFile] = useState<any>(null);
  const [ebFileFailedLoading, setEBFileFailedLoading] = useState(false);
  const [noFilesLeft, setNoFilesLeft] = useState(false);
  const [step, setStep] = useState(0);

  const [responses, setResponses] = useState({ isEB: false, isPeriodCorrect: false, comments: '' });
  const [comments, setComments] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedTicId, setSubmittedTicId] = useState(0);

  const user = useContext(UserContext);

  const ticId = ebFile?.name.split('.')[0].replace('TIC', '').replace(/^0+/, '');

  function fetchEBFile() {
    getRandomEB().then((file) => {
      if (file) {
        if (file.none) setNoFilesLeft(true);
        else setEBFile(file);
      } else {
        setEBFileFailedLoading(true);
      }
    });
  }

  useEffect(() => {
    if (user) {
      fetchEBFile();
    }
  }, [user]);

  const registerYes = useCallback(() => {
    if (step === 0) setResponses({ ...responses, isEB: true });
    if (step === 1) setResponses({ ...responses, isPeriodCorrect: true });

    if (step === 3) {
      submitEBResponse(ebFile, responses).then((success) => {
        if (success) {
          setResponses({ isEB: false, isPeriodCorrect: false, comments: '' });
          setComments('');
          setStep(0);
          setEBFile(null);
          fetchEBFile();

          setShowSuccess(true);
          setSubmittedTicId(ticId);
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
        } else {
          alert('There was an error submitting your response. Please try again.');
        }
      });

      return;
    }

    setStep(step + 1);
  }, [step, responses, ebFile, ticId]);

  const registerNo = useCallback(() => {
    if (step === 0) setResponses({ ...responses, isEB: false });
    if (step === 1) setResponses({ ...responses, isPeriodCorrect: false });

    if (step === 3) {
      setResponses({ isEB: false, isPeriodCorrect: false, comments: '' });
      setComments('');
      setStep(0);
      return;
    }

    setStep(2);
  }, [step, responses]);

  const registerComments = useCallback(() => {
    setStep(3);
    setResponses({ ...responses, comments: comments });
  }, [responses, comments]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (step < 2 || step === 3) {
        if (e.key === 'q' || e.key === 'Q') {
          registerYes();
          e.preventDefault();
        }

        if (e.key === 'e' || e.key === 'E') {
          registerNo();
          e.preventDefault();
        }
      }

      if (step === 2) {
        if (e.key === 'Enter') {
          registerComments();
          e.preventDefault();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [step, registerYes, registerNo, registerComments]);

  const successEle = (
    <div className={`success ${showSuccess ? 'show' : ''}`}>
      <div className="icon">
        <Check fontSize="large" />
      </div>
      <div className="text">
        Response Submitted for <br/>TIC <strong>{submittedTicId}</strong>
      </div>
    </div>
  );

  if (!user) {
    return <ErrorPanel title="Not Authenticated" message="You must be logged in to view this page." />;
  }

  if (ebFileFailedLoading) {
    return (
      <>
        {successEle}
        <ErrorPanel title="Error Loading File" message="There was an error loading the file. Please try again later." />;
      </>
    );
  }

  if (noFilesLeft) {
    return (
      <>
        {successEle}
        <InfoPanel
          title="No Files Left"
          message="There are no potential eclipsing binaries left for you to vet. Check back later for more!"
        />
      </>
    );
  }

  if (!ebFile) {
    return (
      <>
        {successEle}
        <InfoPanel title={'Loading...'} />;
      </>
    );
  }

  return (
    <>
      {successEle}
      <div className="panel">
        <div className="title" dangerouslySetInnerHTML={{ __html: questions[step] }}></div>
        <div className="info">
          <div className="steps">
            <div className={`step ${step === 0 ? 'active' : step > 0 ? 'done' : ''}`}>1</div>
            <div className={`step ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}>2</div>
            <div className={`step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>3</div>
          </div>
          {step < 3 && (
            <div className="links">
              <a href={exofopLink(ticId)} className="exofop eb-link" target="_blank" rel="noreferrer">
                Exofop
              </a>
              <div className="spacer"></div>
              <a href={latteLink(ticId)} className="latte eb-link" target="_blank" rel="noreferrer">
                LATTE
              </a>
            </div>
          )}
        </div>
        <br />

        <div className={`wrapper ${step === 3 ? 'w-review' : ''}`}>
          <img src={ebFile.webContentLink} alt="Eclipsing Binary" />

          {step === 3 ? (
            <div className="review">
              <div className="review-item">
                <div className="title">Is this an eclipsing binary?</div>
                <div className="response">{responses.isEB ? 'Yes' : 'No'}</div>
              </div>
              <div className="review-item">
                <div className="title">Is the measured period correct?</div>
                <div className="response">{responses.isPeriodCorrect ? 'Yes' : 'No'}</div>
              </div>
              <div className="review-item">
                <div className="title">Any other comments?</div>
                <div className="response">{comments}</div>
              </div>
              <div className="buttons">
                <div className="btn yes" onClick={registerYes}>
                  Submit <div className="key">Q</div>
                </div>
                <div className="spacer"></div>
                <div className="btn no" onClick={registerNo}>
                  Start Over <div className="key">E</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="input">
              {step < 2 ? (
                <>
                  <div className="btn yes" onClick={registerYes}>
                    Yes <div className="key">Q</div>
                  </div>
                  <div className="spacer"></div>
                  <div className="btn no" onClick={registerNo}>
                    No <div className="key">E</div>
                  </div>
                </>
              ) : (
                <div className="input-wrapper">
                  <div className="text-input-wrapper">
                    <input autoFocus type="text" placeholder="Comments" value={comments} onChange={(e) => setComments(e.target.value)} />
                    <div className="key">
                      <KeyboardReturn />
                    </div>
                    <div className="btn go" onClick={registerComments}>
                      <ChevronRight fontSize="large" />
                    </div>
                  </div>
                  <div className="quick-adds">
                    {quickAdds.map((quickAdd) => (
                      <div className="quick-add" onClick={() => setComments(comments + (comments.length > 0 ? ', ' + quickAdd : quickAdd))}>
                        {quickAdd}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
