import { BackspaceOutlined, Bookmark, BookmarkBorderOutlined, Check, ChevronRight, KeyboardReturn } from '@mui/icons-material';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { getEB, getRandomEB, submitEBResponse } from '../../handlers/functionsHandler';
import { exofopLink, latteLink } from '../../utils';
import ErrorPanel from '../ErrorPanel';
import InfoPanel from '../InfoPanel';
import { setIsEBSaved, getIsEBSaved } from '../../handlers/databaseHandler';
import { useNavigate } from 'react-router';

const quickAdds = [
  'CPOC',
  'Additional Eclipses',
  'Low SNR',
  'High SNR',
  'Period Off by Integer',
  'Difficult Lightcurve',
  'Scndry Phase Wrong',
  'Strong Systemics',
  'Needs More Eyes',
];

export default function EclipsingBinariesPanel(props: { submitSuccess: Function; id?: string }) {
  const [ebFile, setEBFile] = useState<any>(null);
  const [ebFileFailedLoading, setEBFileFailedLoading] = useState(false);
  const [noFilesLeft, setNoFilesLeft] = useState(false);
  const [step, setStep] = useState(0);

  const [saved, setSaved] = useState(false);

  const [responses, setResponses] = useState({ isEB: false, isPeriodCorrect: false, comments: '' });
  const [comments, setComments] = useState('');

  const user = useContext(UserContext);

  const ticId = props.id || ebFile?.name.split('.')[0].replace('TIC', '').replace(/^0+/, '');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchIsEBSaved() {
      if (ticId) {
        setSaved((await getIsEBSaved(ticId)) || false);
      }
    }

    fetchIsEBSaved();
  }, [ticId, user]);

  const fetchEBFile = useCallback(() => {
    const callback = (file: any) => {
      if (file) {
        if (file.none) setNoFilesLeft(true);
        else setEBFile(file);
      } else {
        setEBFileFailedLoading(true);
      }
    };

    if (props.id) {
      getEB(props.id).then(callback);
    } else {
      getRandomEB().then((file: any) => {
        if (file) {
          if (file.none) setNoFilesLeft(true);
          else setEBFile(file);
        } else {
          setEBFileFailedLoading(true);
        }
      });
    }
  }, [props.id]);

  useEffect(() => {
    if (user) {
      fetchEBFile();
    }
  }, [user, fetchEBFile]);

  const registerYes = useCallback(() => {
    if (step === 0) setResponses({ ...responses, isEB: true });
    if (step === 1) setResponses({ ...responses, isPeriodCorrect: true });

    if (step === 3) {
      submitEBResponse(ticId, responses).then((success) => {
        if (success) {
          props.submitSuccess(ticId);

          if (props.id) {
            navigate(`/ebs`);
            return;
          }

          setResponses({ isEB: false, isPeriodCorrect: false, comments: '' });
          setComments('');
          setStep(0);
          setEBFile(null);
          fetchEBFile();
        } else {
          alert('There was an error submitting your response. Please try again.');
        }
      });

      return;
    }

    setStep(step + 1);
  }, [step, responses, ticId, fetchEBFile, props]);

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
        if (e.key === 'Enter') {
          registerYes();
          e.preventDefault();
        }

        if (e.key === 'Backspace' || e.key === 'Delete') {
          registerNo();
          e.preventDefault();
        }
      }

      if (step === 2) {
        if (e.key === 'Enter') {
          registerComments();
          e.preventDefault();
        }

        try {
          if (e.ctrlKey && quickAdds[parseInt(e.key) - 1]) {
            setComments(comments + (comments.length > 0 ? ', ' + quickAdds[parseInt(e.key) - 1] : quickAdds[parseInt(e.key) - 1]));
            e.preventDefault();
          }
        } catch {}
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [step, comments, registerYes, registerNo, registerComments]);

  if (!user) {
    return <ErrorPanel title="Not Authenticated" message="You must be logged in to view this page." />;
  }

  if (ebFileFailedLoading) {
    return <ErrorPanel title="Error Loading File" message="There was an error loading the file. Please try again later." />;
  }

  if (noFilesLeft) {
    if (props.id) {
      return <ErrorPanel title="Invalid TIC ID" message={`No file for TIC ${props.id} was found.`} />;
    }

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
    <div className="panel">
      <div className="title">
        <div className="name">
          TIC {ticId}
          <div
            className={`save ${saved ? 'active' : ''}`}
            onClick={async () => {
              if (await setIsEBSaved(ticId, !saved)) {
                setSaved(!saved);
              }
            }}
          >
            {saved ? <Bookmark fontSize="inherit" /> : <BookmarkBorderOutlined fontSize="inherit" />}
          </div>
        </div>

        <div className="links">
          <a href={exofopLink(ticId)} className="exofop eb-link" target="_blank" rel="noreferrer">
            Exofop
          </a>
          <div className="spacer"></div>
          <a href={latteLink(ticId)} className="latte eb-link" target="_blank" rel="noreferrer">
            LATTE
          </a>
        </div>
      </div>

      <div className="info">
        <div className="steps">
          <div className={`step ${step === 0 ? 'active' : step > 0 ? 'done' : ''}`}>1</div>
          <div className={`step ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}>2</div>
          <div className={`step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>3</div>
        </div>
      </div>
      <br />

      <div className={`wrapper`}>
        <img src={ebFile.webContentLink} alt="Eclipsing Binary" />

        <div className="answer-panel">
          <div className="main">
            <div className="title">Responses</div>
            <div className="questions">
              <div className={`item ${step === 0 ? 'active' : step > 0 ? 'done' : 'hidden'}`}>
                <div className="question">
                  Is this an <span>eclipsing binary</span>?
                </div>
                {step > 0 && <div className="answer">{responses.isEB ? 'Yes' : 'No'}</div>}
              </div>
              {step > 0 && <div className="horiz"></div>}
              <div className={`item ${step === 1 ? 'active' : step > 1 ? 'done' : 'hidden'}`}>
                <div className="question">
                  Is the <span>measured period</span> correct?
                </div>
                {step > 1 && <div className="answer">{responses.isPeriodCorrect ? 'Yes' : 'No'}</div>}
              </div>
              {step > 1 && <div className="horiz"></div>}
              <div className={`item ${step === 2 ? 'active' : step > 2 ? 'done' : 'hidden'}`}>
                <div className="question">Additional Comments?</div>
                {step > 2 && <div className="answer">{responses.comments}</div>}
              </div>
            </div>
          </div>

          <div className="input">
            {step < 2 ? (
              <>
                <div className="btn yes" onClick={registerYes}>
                  Yes
                  <div className="keys">
                    <div className="key">
                      <KeyboardReturn />
                    </div>
                  </div>
                </div>
                <div className="spacer"></div>
                <div className="btn no" onClick={registerNo}>
                  No
                  <div className="keys">
                    <div className="key">
                      <BackspaceOutlined />
                    </div>
                  </div>
                </div>
              </>
            ) : step === 2 ? (
              <div className="input-wrapper">
                <div className="text-input-wrapper">
                  <input autoFocus type="text" placeholder="Comments" value={comments} onChange={(e) => setComments(e.target.value)} />
                  <div className="key">
                    <KeyboardReturn fontSize="inherit" />
                  </div>
                  <div className="btn go" onClick={registerComments}>
                    <ChevronRight fontSize="inherit" />
                  </div>
                </div>
                <div className="quick-adds">
                  {quickAdds.map((quickAdd, i) => (
                    <div
                      className="quick-add"
                      key={i}
                      onClick={() => setComments(comments + (comments.length > 0 ? ', ' + quickAdd : quickAdd))}
                    >
                      {quickAdd} <div className="key l">CTRL</div>
                      <div className="key">{i + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="btn submit" onClick={registerYes}>
                  Submit
                  <div className="keys">
                    <div className="key">
                      <KeyboardReturn />
                    </div>
                  </div>
                </div>
                <div className="spacer"></div>
                <div className="btn reset" onClick={registerNo}>
                  Reset
                  <div className="keys">
                    <div className="key">
                      <BackspaceOutlined />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
