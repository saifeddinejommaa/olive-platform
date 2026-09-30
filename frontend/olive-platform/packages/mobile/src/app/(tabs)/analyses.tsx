import { useState } from 'react';
import { Screen } from '../../components/Screen';
import { SegmentedControl } from '../../components/SegmentedControl';
import { OliveAnalysesPage } from '../../features/oliveAnalyses/OliveAnalysesPage';
import { OilAnalysesPage } from '../../features/oilAnalyses/OilAnalysesPage';

type AnalysisKind = 'olive' | 'oil';

const KIND_OPTIONS: { value: AnalysisKind; label: string }[] = [
  { value: 'olive', label: 'Olive' },
  { value: 'oil', label: 'Huile' },
];

// Analyses d'olive et d'huile, dans le même onglet.
export default function AnalysesScreen() {
  const [kind, setKind] = useState<AnalysisKind>('olive');

  const switcher = (
    <SegmentedControl options={KIND_OPTIONS} value={kind} onChange={setKind} />
  );

  return (
    <Screen>
      {kind === 'olive' ? (
        <OliveAnalysesPage headerContent={switcher} />
      ) : (
        <OilAnalysesPage headerContent={switcher} />
      )}
    </Screen>
  );
}
