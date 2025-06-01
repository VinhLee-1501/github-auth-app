import React, { useEffect, useState } from "react";
import { X, Phone, Heart, ExternalLink, Users, GitBranch } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { apiService } from "../services/api";

interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos?: number;
  followers?: number;
}

interface UserProfileModalProps {
  phoneNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  phoneNumber,
  open,
  onOpenChange,
}) => {
  const [likedUsers, setLikedUsers] = useState<GithubUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUserProfile();
    }
  }, [open]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const profile = await apiService.getUserProfile(phoneNumber);
      setLikedUsers(profile.favorite_github_users || []);
    } catch (error) {
      toast.error("An error occurred while loading profile information.");
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Personal information</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Phone number</h3>
            <p className="text-gray-600">{phoneNumber}</p>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-5 w-5 text-red-500" />
              <h3 className="font-medium text-gray-900">
                List of Github users who liked ({likedUsers.length})
              </h3>
            </div>

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(4)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : likedUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>You have not liked any Github user yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {likedUsers.map((user) => (
                  <Card
                    key={user.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={user.avatar_url}
                          alt={user.login}
                          className="w-12 h-12 rounded-full border-2 border-gray-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {user.login}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            ID: {user.id}
                          </Badge>
                        </div>
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      </div>

                      {(user.public_repos !== undefined ||
                        user.followers !== undefined) && (
                        <div className="flex space-x-4 text-sm text-gray-600 mb-3">
                          {user.public_repos !== undefined && (
                            <div className="flex items-center space-x-1">
                              <GitBranch className="h-3 w-3" />
                              <span>{user.public_repos}</span>
                            </div>
                          )}
                          {user.followers !== undefined && (
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{user.followers}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => window.open(user.html_url, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        View on Github
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
