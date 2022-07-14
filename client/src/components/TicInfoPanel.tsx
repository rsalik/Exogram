import { useEffect, useState } from 'react';
import { getTicFiles } from '../firebase/functionsHandler';
import { exofopLink, TicBasicProperties } from '../utils';
import InfoPanel from './InfoPanel';
import Link from './Link';
import TicDispositionTable from './TicDispositionTable';

export default function TicInfoPanel(props: { ticData: any }) {
  const [ticFiles, setTicFiles] = useState<any[]>([]);
  const [ticFilesLoading, setTicFilesLoading] = useState(true);

  useEffect(() => {
    getTicFiles(props.ticData.ticId).then((files) => {
      if (Array.isArray(files)) {
        setTicFiles(files);
        setTicFilesLoading(false);
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
                <div className="name">{p.name}</div>
                <div className="value">{p.id === 'sectors' ? props.ticData[p.id].replaceAll(',', ', ') : props.ticData[p.id]}</div>
              </div>
            )
          );
        })}
      </div>

      {ticFilesLoading ? (
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