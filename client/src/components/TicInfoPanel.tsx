import { useEffect, useState } from 'react';
import { getTicFiles } from '../handlers/functionsHandler';
import { exofopLink, TicBasicProperties } from '../utils';
import ErrorPanel from './ErrorPanel';
import InfoPanel from './InfoPanel';
import Link from './Link';
import TicDispositionTable from './TicDispositionTable';

export default function TicInfoPanel(props: { ticData: any }) {
  const [ticFiles, setTicFiles] = useState<any[]>([]);
  const [ticFilesLoading, setTicFilesLoading] = useState(true);
  const [ticFilesFailedLoading, setTicFilesFailedLoading] = useState(false);

  useEffect(() => {
    getTicFiles(props.ticData.ticId).then((files) => {
      if (files) {
        setTicFiles(files);
        setTicFilesLoading(false);
      } else {
        setTicFilesFailedLoading(true);
      }
    });
  }, [props.ticData]);

  return (
    <div className="tic-info">
      <div className="title-sec-wrapper">
        <div className="title-sec">
          <div className="title">
            TIC <span>{props.ticData.ticId}</span>
          </div>
          <a href={exofopLink(props.ticData.ticId)} className="exofop-link" target="_blank" rel="noreferrer">
            Exofop Link
          </a>
          {!!props.ticData.dispositions['paper'] && <div className="published-badge">This TIC was published in a Planet Patrol Paper</div>}
        </div>
      </div>

      <div className="data-wrapper">
        {TicBasicProperties.filter((t) => t.id !== 'ticId').map((p) => {
          return (
            !!props.ticData[p.id] && (
              <div className={`data`} key={p.id}>
                <div className="name" dangerouslySetInnerHTML={{ __html: p.name }}></div>
                <div className="value">{p.id === 'sectors' ? props.ticData[p.id].replaceAll(',', ', ') : props.ticData[p.id]}</div>
              </div>
            )
          );
        })}
      </div>

      {ticFilesFailedLoading ? (
        <ErrorPanel title="Failed to load TIC files" message="Refresh the page to try again." />
      ) : ticFilesLoading ? (
        <InfoPanel title="Loading TIC Files" />
      ) : ticFiles.length ? (
        <div className="files">
          <div className="title">Files</div>
          <table>
            <tbody>
              {ticFiles.map((f: any) => (
                <tr>
                  <td>
                    <Link href={f.webContentLink} newTab>
                      {f.name}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <InfoPanel title="No Files" />
      )}

      <div className="dispositions">
        <div className="title">Dispositions</div>
        <TicDispositionTable data={props.ticData.dispositions} />
      </div>
    </div>
  );
}
