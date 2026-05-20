import { type ReactNode } from "react";
import { useLayoutStore } from "../stores/layoutStore";

type AppLayoutProps = {
  titlebar: ReactNode;
  sidebar: ReactNode;
  preview: ReactNode;
  workspace: ReactNode;
  children: ReactNode;
};

export function AppLayout({ titlebar, sidebar, preview, workspace, children }: AppLayoutProps) {
  const sidebarOpen = useLayoutStore((state) => state.sidebarOpen);
  const previewOpen = useLayoutStore((state) => state.previewOpen);
  const workspaceOpen = useLayoutStore((state) => state.workspaceOpen);

  return (
    <>
      {titlebar}
      <div className="app">
        <aside className={`sidebar${sidebarOpen ? "" : " collapsed"}`}>
          <div className="sidebar-inner">{sidebar}</div>
        </aside>

        <main className="main-content">{children}</main>

        <aside className={`preview-panel${previewOpen ? "" : " collapsed"}`}>
          <div className="preview-panel-inner">{preview}</div>
        </aside>

        <aside className={`jian-sidebar${workspaceOpen ? "" : " collapsed"}`}>
          <div className="jian-sidebar-inner">{workspace}</div>
        </aside>
      </div>
    </>
  );
}
