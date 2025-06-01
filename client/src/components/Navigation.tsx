import React from "react";
import { Search, User, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  onProfileClick,
  onLogout,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Github Search</h1>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm Github users..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onProfileClick}
              className="rounded-full"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Đăng xuất"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
