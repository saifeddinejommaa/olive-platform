import React from 'react';
import styles from '../styles/dashboard.module.css'
import type { Purchase } from '../../domain/dashboard.types';
import Card from '../../../../common/widgets/card/Card';

export interface RecentPurchasesTableProps {
  data: Purchase[];
}

const statusLabel: Record<Purchase['status'], string> = {
  received: 'Réceptionné',
  pending: 'En attente',
  rejected: 'Refusé',
};

const statusClass: Record<Purchase['status'], string> = {
  received: styles.badgeReceived,
  pending: styles.badgePending,
  rejected: styles.badgeRejected,
};

/** Table of the most recent olive purchase lots (from farmers / cooperatives). */
export const RecentPurchasesTable: React.FC<RecentPurchasesTableProps> = ({ data }) => (
  <Card
    headerAction={
      <div className={styles.panelTitleRow}>
        <h3 className={styles.panelTitle}>Achats récents</h3>
        <span className={styles.panelMeta}>{data.length} derniers lots</span>
      </div>
    }
  >
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>Lot</th>
          <th className={styles.th}>Fournisseur</th>
          <th className={styles.th}>Variété</th>
          <th className={styles.th}>Qté</th>
          <th className={styles.th}>Prix/kg</th>
          <th className={styles.th}>Statut</th>
        </tr>
      </thead>
      <tbody>
        {data.map((p) => (
          <tr key={p.id}>
            <td className={styles.td}>{p.id}</td>
            <td className={styles.td}>{p.supplier}<br /><span className={styles.panelMeta}>{p.region}</span></td>
            <td className={styles.td}>{p.varietal}</td>
            <td className={styles.td}>{p.quantityKg.toLocaleString('fr-TN')} kg</td>
            <td className={styles.td}>{p.pricePerKgTnd.toFixed(2)} TND</td>
            <td className={styles.td}>
              <span className={`${styles.badge} ${statusClass[p.status]}`}>{statusLabel[p.status]}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

export default RecentPurchasesTable;
