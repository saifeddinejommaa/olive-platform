import { HarvestPage } from '../../features/harvest/components/HarvestPage';
import { Screen } from '../../components/Screen';

export default function RecolteScreen() {
  return <Screen children={<HarvestPage/>} ></Screen>;
}