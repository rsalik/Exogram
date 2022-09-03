import { Search } from "@mui/icons-material";

export function FloatingSearchBar(props: { value: string; onChange: (v: string) => void }) {
  return (
    <div className={`floating-search${props.value.length === 0 ? ' empty' : ''}`}>
      <div className="label">
        {<Search />} <span>Search</span>
      </div>
      <input type="text" placeholder="1003831, pVshape" value={props.value} onChange={(e) => props.onChange(e.target.value)} />
    </div>
  );
}
