import React from "react";

export const AdminSidebar = ({ activeAdminTab, setActiveAdminTab }) => {
  const adminNavItems = [
    { id: "admin-dashboard", label: "Overview & Health", icon: "📊" },
    { id: "admin-tournaments", label: "Tournament Creator", icon: "🏆" },
    { id: "admin-disputes", label: "Dispute Hub Queue", icon: "⚖️" },
    { id: "admin-users", label: "Sanctions & Roster RBAC", icon: "🛡️" },
    { id: "admin-broadcast", label: "Caster & Broadcast Desk", icon: "🎙️" }
  ];

  return (
    <aside className="w-64 bg-[#141A24] border-r border-[#232D3F] p-4 flex flex-col justify-between shrink-0">
      <div>
        <div className="px-3 py-2 text-xs font-bold text-[#FFD100] tracking-widest uppercase mb-4 border-b border-[#232D3F] pb-2">
          Admin Back Office
        </div>
        <nav className="flex flex-col gap-1">
          {adminNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveAdminTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeAdminTab === item.id
                  ? "bg-[#00F0FF]/10 text-[#00F0FF] border-l-4 border-[#00F0FF]"
                  : "text-[#8A99AD] hover:bg-[#0B0E14] hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-3 bg-[#0B0E14] rounded-md border border-[#232D3F] text-xs text-[#8A99AD]">
        <div className="font-semibold text-white">Logged in as Admin</div>
        <div>Overwatch 2 Season Engine</div>
      </div>
    </aside>
  );
};