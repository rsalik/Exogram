import { ChevronRight } from '@mui/icons-material';
import InfoPanel from '../InfoPanel';

export default function Instructions(props: { setShowInstructions: (show: boolean) => void }) {
  return (
    <div className="instructions">
      <InfoPanel
        title={'Eclipsing Binaries - Instructions'}
        message={
          <>
            <div className="step">
              <div className="step-marker">1</div>
            </div>
            <div className="btn" onClick={props.setShowInstructions.bind(null, false)}>
              Go <ChevronRight fontSize="large" />
            </div>
          </>
        }
      />
    </div>
  );
}
