import { useCallback, useContext, useEffect, useState } from 'react';
import { getRandomEB, submitEBResponse } from '../../handlers/functionsHandler';
import ErrorPanel from '../ErrorPanel';
import InfoPanel from '../InfoPanel';
import { UserContext } from '../../App';
import { Check, ChevronRight, KeyboardReturn } from '@mui/icons-material';

const questions = ['Is this an eclipsing binary?', 'Is the measured period correct?', 'Any other comments?', 'Review'];

export default function EclipsingBinariesPanel() {
  const [ebFile, setEBFile] = useState<any>(null);
  const [ebFileFailedLoading, setEBFileFailedLoading] = useState(false);
  const [noFilesLeft, setNoFilesLeft] = useState(false);
  const [step, setStep] = useState(0);

  const [responses, setResponses] = useState({ isEB: false, isPeriodCorrect: false, comments: '' });
  const [comments, setComments] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);

  const user = useContext(UserContext);

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
  }, [step, responses, ebFile]);

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

  if (!user) {
    return <ErrorPanel title="Not Authenticated" message="You must be logged in to view this page." />;
  }

  if (ebFileFailedLoading) {
    return <ErrorPanel title="Error Loading File" message="There was an error loading the file. Please try again later." />;
  }

  if (noFilesLeft) {
    return (
      <InfoPanel
        title="No Files Left"
        message="There are no potential eclipsing binaries left for you to vet. Check back later for more!"
      />
    );
  }

  if (!ebFile) {
    return <InfoPanel title={'Loading...'} />;
  }

  return (
    <>
      <div className="panel">
        <div className="title">{questions[step]}</div>
        <div className="steps">
          <div className={`step ${step === 0 ? 'active' : step > 0 ? 'done' : ''}`}>1</div>
          <div className={`step ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}>2</div>
          <div className={`step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>3</div>
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
                <div className="response">{responses.isEB ? 'Yes' : 'No'}</div>
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
                <div className="text-input-wrapper">
                  <input autoFocus type="text" placeholder="Comments" value={comments} onChange={(e) => setComments(e.target.value)} />
                  <div className="key">
                    <KeyboardReturn />
                  </div>
                  <div className="btn go" onClick={registerComments}>
                    <ChevronRight fontSize="large" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {
        <div className={`success ${showSuccess ? 'show' : ''}`}>
          <div className="icon">
            <Check fontSize="large" />
          </div>
          <div className="text">
            Response Submitted for <strong>{ebFile.name.split('.')[0]}</strong>
          </div>
        </div>
      }
    </>
  );
}
