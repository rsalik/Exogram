import { Check, Delete } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { deleteDisposition, getDictionary, submitDisposition } from '../handlers/databaseHandler';

export default function CreateDispositionPanel(props: { existingDisposition?: any; ticId: string }) {
  const [disposition, setDisposition] = useState<string>(props.existingDisposition?.disposition || 'PC');
  const [comments, setComments] = useState<string>(props.existingDisposition?.comments || '');

  const [error, setError] = useState<string | undefined>();

  const [dictionary, setDictionary] = useState<any[]>([]);

  useEffect(() => {
    getDictionary().then((d) =>
      setDictionary(
        d
          .map((t) => {
            return { ...t, name: t.name.replaceAll('(p)', '') };
          })
          .sort((a, b) => a.name.localeCompare(b.name))
      )
    );
  }, []);

  function submit() {
    submitDisposition({ disposition, comments }, props.ticId).then((success) => {
      if (success) setComments('');
      else {
        setError('Failed to submit disposition');
        setTimeout(() => setError(undefined), 3000);
      }
    });
  }

  function remove() {
    deleteDisposition(props.ticId).then((success) => {
      if (success) {
        setDisposition('PC');
        setComments('');
      } else {
        setError('Failed to delete disposition');
        setTimeout(() => setError(undefined), 3000);
      }
    });
  }

  return (
    <div className="create-disposition">
      <div className="title">{props.existingDisposition ? 'Update Disposition' : 'Create Disposition'}</div>
      <div className="input-wrapper">
        <select name="disp" value={disposition} onChange={(e) => setDisposition(e.target.value)}>
          <option value="PC">PC</option>
          <option value="pFP">pFP</option>
          <option value="FP">FP</option>
        </select>
        <input
          type="text"
          placeholder="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
        />
        <div className="submit" onClick={submit}>
          <Check fontSize="large" />
        </div>
        {props.existingDisposition && (
          <div className="delete" onClick={remove}>
            <Delete fontSize="large" />
          </div>
        )}
      </div>
      {error && <div className="error">{error}</div>}
      <table className="quick-add">
        <tbody>
          {(() => {
            const rows = [];
            for (let i = 0; i < dictionary.length; i += 5) {
              rows.push(
                <tr key={i}>
                  {dictionary.slice(i, i + 5).map((d: any) => (
                    <React.Fragment key={d.name}>
                      {!!d && (
                        <td key={d.name} onClick={() => setComments(comments.length ? comments + ', ' + d.name : d.name)}>
                          {d.name}
                        </td>
                      )}
                    </React.Fragment>
                  ))}
                </tr>
              );
            }
            return rows;
          })()}
        </tbody>
      </table>
    </div>
  );
}
