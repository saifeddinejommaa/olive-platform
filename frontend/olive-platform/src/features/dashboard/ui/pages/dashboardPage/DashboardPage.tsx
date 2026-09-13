import React from 'react';
import styles from '../../styles/dashboard.module.css'
import { alerts, harvestTrend, kpis, oilAnalyses, pressingBatches, recentPurchases, stockTanks } from '../../../data/mockDashboardData';
import { AlertsFeed, HarvestTrendChart, KpiCard, OilQualityPanel, PressingYieldWidget, RecentPurchasesTable, StockLevelWidget } from '../../widgets';

export const DashboardPage: React.FC = () => {
  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tableau de bord</h1>
          <div className={styles.subtitle}>Campagne 2026/2027 — mise à jour il y a 12 min</div>
        </div>
        <span className={styles.range}>1 sept. – 13 sept. 2026</span>
      </div>

      <div className={styles.kpiRow}>
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className={styles.grid}>
        <div>
          <HarvestTrendChart data={harvestTrend} />
          <RecentPurchasesTable data={recentPurchases} />
        </div>
        <div>
          <PressingYieldWidget data={pressingBatches} />
          <OilQualityPanel data={oilAnalyses} />
          <StockLevelWidget data={stockTanks} />
          <AlertsFeed data={alerts} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
