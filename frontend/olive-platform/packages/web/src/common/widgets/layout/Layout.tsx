import { Outlet } from "react-router-dom";
import { useSeasonStore } from "../../../stores/SeasonStore";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  // Changer de campagne remonte la page : ses données sont rechargées.
  const selectedSeasonId = useSeasonStore((state) => state.selectedSeasonId);

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-layout">
        <Topbar />

        <main className="page-content">
          <Outlet key={selectedSeasonId ?? "none"} />
        </main>
      </div>
    </div>
  );
}
