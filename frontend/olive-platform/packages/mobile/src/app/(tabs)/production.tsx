import { Screen } from '../../components/Screen';
import { ProductionPage } from '../../features/production/ProductionPage';

export default function ProductionScreen() {
  return <Screen children={<ProductionPage/>} ></Screen>;
}