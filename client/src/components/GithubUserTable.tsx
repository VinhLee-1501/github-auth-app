
import React from 'react';
import { Heart, ExternalLink, Users, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos?: number;
  followers?: number;
}

interface GithubUserTableProps {
  users: GithubUser[];
  likedUsers: Set<number>;
  onLikeUser: (userId: number) => void;
  loading?: boolean;
}

const GithubUserTable: React.FC<GithubUserTableProps> = ({
  users,
  likedUsers,
  onLikeUser,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No results found</p>
        <p className="text-gray-400 mt-2">Try searching with different keywords</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <Card key={user.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-16 h-16 rounded-full border-2 border-gray-200"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{user.login}</h3>
                  <Badge variant="secondary" className="text-xs">
                    ID: {user.id}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onLikeUser(user.id)}
                className={`rounded-full ${
                  likedUsers.has(user.id) 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart 
                  className={`h-5 w-5 ${likedUsers.has(user.id) ? 'fill-current' : ''}`} 
                />
              </Button>
            </div>

            <div className="space-y-3">
              {(user.public_repos !== undefined || user.followers !== undefined) && (
                <div className="flex space-x-4 text-sm text-gray-600">
                  {user.public_repos !== undefined && (
                    <div className="flex items-center space-x-1">
                      <GitBranch className="h-4 w-4" />
                      <span>{user.public_repos} repos</span>
                    </div>
                  )}
                  {user.followers !== undefined && (
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{user.followers} followers</span>
                    </div>
                  )}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(user.html_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Github
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GithubUserTable;
