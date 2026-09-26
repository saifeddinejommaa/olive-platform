import { Screen } from '../../components/Screen';
import { OliveAnalysesPage } from '../../features/oliveAnalyses/OliveAnalysesPage';

export default function AnalysesScreen() {
  return <Screen children={<OliveAnalysesPage/>}/>;
}