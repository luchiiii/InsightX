import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLogoutUserMutation } from "../../lib/authApis";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import OverviewPage from "./OverviewPage";
import FormsPage from "./FormsPage";
import ApiSettingsPage from "./ApiSettingsPage";
import SettingsPage from "./SettingsPage";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "overview";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userState);
  const [logoutUser] = useLogoutUserMutation();

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/auth/login");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "forms", label: "Forms", icon: "📝" },
    { id: "api", label: "API Settings", icon: "🔑" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const renderPage = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewPage />;
      case "forms":
        return <FormsPage />;
      case "api":
        return <ApiSettingsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed w-full bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={handleLogoClick}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IX</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  InsightX
                </span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.organizationName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside
          className={`fixed md:relative w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 transition-transform duration-300 z-30 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="p-6 space-y-8">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-purple-50 text-purple-600 border-l-4 border-purple-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-8">{renderPage()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
