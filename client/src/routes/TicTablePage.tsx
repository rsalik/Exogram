import TicTable from '../components/TicTable';
import { useTicList } from '../handlers/databaseHandler';

export default function TicTablePage() {
  const ticList = useTicList();

  return <TicTable ticList={ticList} />;
}
