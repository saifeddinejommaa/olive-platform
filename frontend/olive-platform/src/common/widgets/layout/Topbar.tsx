import { usePageTitleStore } from "../../stores/usePageTittleStore";

export default function Topbar() {
  const dynamicTitle = usePageTitleStore((state) => state.title);
  const dynamicSubTitle = usePageTitleStore((state) => state.subTitle);
  const title = dynamicTitle ?? "Olive Platform";
  const subTitle = dynamicSubTitle ?? "Olive Platform";
  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>

        <div className="topbar-breadcrumb">{subTitle}</div>
      </div>

      <div className="topbar-actions">
        <button type="button" className="topbar-button" title="Notifications">
          🔔
        </button>

        <div className="user-profile">
          <div className="user-avatar">SJ</div>

          <div className="user-info">
            <strong>Administrateur</strong>
            <span>Gestionnaire</span>
          </div>
        </div>
      </div>
    </header>
  );
}