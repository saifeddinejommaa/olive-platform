import { Screen } from '../../components/Screen';
import { PlotsPage } from '../../features/plots/PlotsPage';

export default function PlotsScreen() {
  return <Screen children={<PlotsPage/>} />;
}