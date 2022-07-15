import TableImage from '../imgs/table.png';
import DispositionImage from '../imgs/dispositions.png';

export default function Home() {
  return (
    <div className="home">
      <div className="title">Welcome to Exogram!</div>
      <div className="section">
        <img src={TableImage} alt="TIC Table" />
        <div className="text">
          <div className="title">TIC Table</div>
          <div className="description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi pariatur eum odit vel ducimus laboriosam, fugiat rem blanditiis
            quisquam inventore quia dolorem fugit, minima maxime! Illo unde aliquam alias suscipit!
          </div>
        </div>
      </div>
      <div className="section">
        <div className="text">
          <div className="title">View and Create Dispositions</div>
          <div className="description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi pariatur eum odit vel ducimus laboriosam, fugiat rem blanditiis
            quisquam inventore quia dolorem fugit, minima maxime! Illo unde aliquam alias suscipit!
          </div>
        </div>
        <img src={DispositionImage} alt="TIC Table" />
      </div>
    </div>
  );
}
