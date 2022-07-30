import { useContext, useEffect, useState } from 'react';
import { getTicFiles } from '../handlers/functionsHandler';
import { exofopLink, TicBasicProperties } from '../utils';
import ErrorPanel from './ErrorPanel';
import InfoPanel from './InfoPanel';
import Link from './Link';
import TicDispositionTable from './TicDispositionTable';
import { TicChartsPanel } from './TicChartsPanel';
import { useTicDispositions, useTicGroups } from '../handlers/databaseHandler';
import { UserContext } from '../App';
import CreateDispositionPanel from './CreateDispositionPanel';

export default function TicInfoPanel(props: { ticData: any }) {
  const [ticFiles, setTicFiles] = useState<any[]>([]);
  const [ticFilesLoading, setTicFilesLoading] = useState(true);
  const [ticFilesFailedLoading, setTicFilesFailedLoading] = useState(false);

  const [showCharts, setShowCharts] = useState(false);

  const ticGroups = useTicGroups();
  const dispositions = useTicDispositions(props.ticData.ticId);

  const user = useContext(UserContext);

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

  // No Tic Data, or the TIC ID is the only value in TIC data
  if (!props.ticData || Object.keys(props.ticData).length === 1)
    return (
      <ErrorPanel
        title="Invalid TIC ID"
        message={
          <>
            No data for <strong>TIC {props.ticData.ticId}</strong> was found on the server.&nbsp;
            <Link href="/table">Return to the TIC Table</Link>
          </>
        }
      />
    );

  return (
    <div className="tic-info">
      <div className="title-sec-wrapper">
        <div className="title-sec">
          <div className="title">
            TIC&nbsp;<span>{props.ticData.ticId}</span>
            {!!ticGroups && !!ticGroups.length && (
              <div className="group">{ticGroups.filter((g) => parseInt(g.id) === props.ticData.group)[0]?.name}</div>
            )}
          </div>
          <a href={exofopLink(props.ticData.ticId)} className="exofop-link" target="_blank" rel="noreferrer">
            Exofop Link
          </a>
          {!!props.ticData.paperDisposition && <div className="published-badge">This TIC was published in a Planet Patrol Paper</div>}
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

      {dispositions?.error && (
        <ErrorPanel
          title="Access Denied"
          message={`${user ? 'You do not have permission to view these dispositions.' : 'Try logging in to view these dispositions.'}`}
        />
      )}

      {dispositions && !dispositions.error && (
        <div className="dispositions">
          <div className="title">Dispositions</div>
          <TicDispositionTable data={dispositions} paperDisposition={props.ticData.paperDisposition} />
          {user &&
            (!!ticGroups && ticGroups.filter((g) => parseInt(g.id) === props.ticData.group)[0]?.write ? (
              <CreateDispositionPanel
                ticId={props.ticData.ticId}
                existingDisposition={dispositions.filter((d: any) => d.userId === user.uid)[0]}
              />
            ) : (
              <div className="no-disps">This TIC is no longer accepting new dispositions.</div>
            ))}
        </div>
      )}

      {showCharts ? (
        <TicChartsPanel tics={[props.ticData.ticId]} />
      ) : (
        <div className="show-charts-panel" onClick={() => setShowCharts(true)}>
          <div className="title">Click to Show Charts</div>
          <div className="message">Targets with many sectors of data may cause performance issues.</div>
        </div>
      )}
    </div>
  );
}
