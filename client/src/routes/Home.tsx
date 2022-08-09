import TableImage from '../imgs/table.png';
import DispositionImage from '../imgs/dispositions.png';
import ChartsImage from '../imgs/charts.png';

export default function Home() {
  return (
    <div className="home">
      <div className="title">Welcome to Exogram!</div>
      <div className="section">
        <img src={TableImage} alt="TIC Table" />
        <div className="text">
          <div className="title">TIC Table</div>
          <div className="description">View, sort, and search through Planet Patrol's vast catalog of TESS targets.</div>
        </div>
      </div>
      <div className="section">
        <div className="text">
          <div className="title">View and Create Dispositions</div>
          <div className="description">
            Compare others' dispositions, and write your own. Use prewritten comments to ensure your dispositions are machine readable.
          </div>
        </div>
        <img src={DispositionImage} alt="View and Create Dispositions" />
      </div>
      <div className="section">
        <img src={ChartsImage} alt="Light Curves" />
        <div className="text">
          <div className="title">View Light Curves</div>
          <div className="description">Automatically generate interactive light curves that can feature multiple targets at once. These charts can be easily zoomed, panned, and (soon) shared!</div>
        </div>
      </div>
    </div>
  );
}
