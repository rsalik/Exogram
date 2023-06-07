import { ChevronRight, KeyboardReturn } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getEB } from '../../handlers/functionsHandler';

export default function EBLookupPanel(props: { id?: string }) {
  const [id, setId] = useState(props.id || '');
  const [input, setInput] = useState('');
  const [file, setFile] = useState<any>(null);
  const [noFileFound, setNoFileFound] = useState(false);
  const [internalError, setInternalError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNoFileFound(false);
    setInternalError(false);
    setFile(null);
    setInput('');

    if (id) {
      setLoading(true);

      getEB(id).then((res) => {
        setLoading(false);

        if (res) {
          if (res.none) {
            setNoFileFound(true);
            return;
          }

          console.log(res);
          setFile(res);
        } else {
          setInternalError(true);
        }
      });
    }
  }, [id]);

  function search() {
    window.history.pushState({}, '', `/ebs/lookup/${input}`);
    setId(input);
  }

  return (
    <div className="lookup panel">
      <div className="title">EB Candidate Lookup</div>
      <div className="wrapper">
        {/* yikes */}
        {noFileFound ? (
          <div className="error placeholder">
            No file found for&nbsp;<strong>TIC {id}</strong>
          </div>
        ) : internalError ? (
          <div className="error placeholder">An internal error occurred</div>
        ) : loading ? (
          <div className="loading placeholder">Loading...</div>
        ) : file?.webContentLink ? (
          <img src={file.webContentLink} alt="" />
        ) : (
          <div className="placeholder"></div>
        )}

        <div className="answer-panel">
          {file?.webContentLink && (
            <div className="eb-info">
              <div className="title">File Info</div>
              <div className="questions">
                <div className="item">
                  <div className="question">TIC ID</div>
                  <div className="answer">{file.name.split('.')[0].replace('TIC', '').replace(/^0+/, '')}</div>
                </div>
                <div className="horiz"></div>
                <div className="item">
                  <div className="question">File name</div>
                  <div className="answer">{file.name}</div>
                </div>
              </div>
            </div>
          )}

          <div className="new">
            <div className="title">Lookup New TIC</div>
            <div className="input-wrapper">
              <div className="text-input-wrapper">
                <input
                  autoFocus
                  type="text"
                  placeholder="TIC ID"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') search();
                  }}
                />
                <div className="key">
                  <KeyboardReturn fontSize="inherit" />
                </div>
                <div className="btn go" onClick={search}>
                  <ChevronRight fontSize="inherit" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
