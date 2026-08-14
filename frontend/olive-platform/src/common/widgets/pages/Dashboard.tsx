import Sidebar from "../layout/Sidebar";
import { kpis } from "../../data/kpis";
import KPICard from "../kpi/KPICard";
import DonutChart from "../charts/DonutChart";
import { donutData } from "../../data/donut";
export default function Dashboard() {

  return (
    <div className="shell">
      <Sidebar  />

      <main className="main">
        <div className="content">
          <div className="kpi-grid">
            {kpis.map((k, i) => (
              <KPICard key={i} {...k} />
            ))}
          </div>

          <DonutChart data={donutData} />
        </div>
      </main>
    </div>
  );
}