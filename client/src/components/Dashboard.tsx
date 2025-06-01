import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Navigation from "./Navigation";
import GithubUserTable from "./GithubUserTable";
import Pagination from "./Pagination";
import UserProfileModal from "./UserProfileModal";
import { apiService } from "../services/api";

interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos?: number;
  followers?: number;
}

interface DashboardProps {
  phoneNumber: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ phoneNumber, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [likedUsers, setLikedUsers] = useState<Set<number>>(new Set());
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadLikedUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("phoneNumber");
    toast.success("Logout successfully");
    onLogout();
  };

  const loadLikedUsers = async () => {
    try {
      const profile = await apiService.getUserProfile(phoneNumber);
      const likedIds = new Set(
        profile.favorite_github_users.map((user) => user.id)
      );
      setLikedUsers(likedIds);
    } catch (error) {
      console.error("Error loading liked users:", error);
    }
  };

  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter search keyword");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await apiService.searchGithubUsers(
        searchTerm,
        currentPage,
        resultsPerPage
      );

      // Lấy thông tin chi tiết cho từng user
      const usersWithDetails = await Promise.all(
        response.items.map(async (user) => {
          try {
            const details = await apiService.findGithubUserProfile(user.id);
            return {
              ...user,
              public_repos: details.public_repos,
              followers: details.followers,
            };
          } catch (error) {
            console.error(`Error fetching details for user ${user.id}:`, error);
            return user;
          }
        })
      );

      setUsers(usersWithDetails);
      setTotalResults(response.total_count);
    } catch (error) {
      toast.error("An error occurred while searching.");
      console.error("Error searching users:", error);
      setUsers([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeUser = async (userId: number) => {
    try {
      await apiService.likeGithubUser(phoneNumber, userId);

      // Toggle liked status
      const newLikedUsers = new Set(likedUsers);
      if (newLikedUsers.has(userId)) {
        newLikedUsers.delete(userId);
        toast.success("Unliked user");
      } else {
        newLikedUsers.add(userId);
        toast.success("Liked the user");
      }
      setLikedUsers(newLikedUsers);
    } catch (error) {
      toast.error("An error occurred while liking the user.");
      console.error("Error liking user:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Tự động tìm kiếm lại khi chuyển trang
    setTimeout(() => {
      if (searchTerm.trim()) {
        searchUsers();
      }
    }, 100);
  };

  const handleResultsPerPageChange = (newResultsPerPage: number) => {
    setResultsPerPage(newResultsPerPage);
    setCurrentPage(1);
    // Tự động tìm kiếm lại khi thay đổi số kết quả per page
    setTimeout(() => {
      if (searchTerm.trim()) {
        searchUsers();
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={searchUsers}
        onProfileClick={() => setShowProfileModal(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasSearched ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Search Github Users
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Enter your Github username to start searching
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Search results for "{searchTerm}"
              </h2>
              {!loading && (
                <p className="text-gray-600">
                  Find {Math.min(totalResults, 1000)} results
                  {totalResults > 1000 &&
                    " (hiển thị tối đa 1000 kết quả đầu tiên)"}
                </p>
              )}
            </div>

            <GithubUserTable
              users={users}
              likedUsers={likedUsers}
              onLikeUser={handleLikeUser}
              loading={loading}
            />

            {!loading && users.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onPageChange={handlePageChange}
                onResultsPerPageChange={handleResultsPerPageChange}
              />
            )}
          </>
        )}
      </main>

      <UserProfileModal
        phoneNumber={phoneNumber}
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />
    </div>
  );
};

export default Dashboard;
