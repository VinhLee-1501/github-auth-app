
const API_BASE_URL = 'http://localhost:8000/api'; // Điều chỉnh URL backend của bạn

interface CreateAccessCodeResponse {
  accessCode: string;
}

interface ValidateAccessCodeResponse {
  success: boolean;
}

interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos?: number;
  followers?: number;
}

interface SearchGithubUsersResponse {
  items: GithubUser[];
  total_count: number;
}

interface UserProfile {
  favorite_github_users: GithubUser[];
}

export const apiService = {
  // Tạo mã xác thực mới
  async createNewAccessCode(phoneNumber: string): Promise<CreateAccessCodeResponse> {
    const response = await fetch(`${API_BASE_URL}/createNewAccessCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create access code');
    }
    
    return response.json();
  },

  // Xác thực mã truy cập
  async validateAccessCode(accessCode: string, phoneNumber: string): Promise<ValidateAccessCodeResponse> {
    const response = await fetch(`${API_BASE_URL}/validateAccessCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessCode, phoneNumber }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to validate access code');
    }
    
    return response.json();
  },

  // Tìm kiếm Github users
  async searchGithubUsers(q: string, page: number = 1, per_page: number = 10): Promise<SearchGithubUsersResponse> {
    const response = await fetch(`${API_BASE_URL}/searchGithubUsers?q=${encodeURIComponent(q)}&page=${page}&per_page=${per_page}`);
    
    if (!response.ok) {
      throw new Error('Failed to search Github users');
    }
    
    return response.json();
  },

  // Tìm thông tin chi tiết Github user
  async findGithubUserProfile(github_user_id: number): Promise<GithubUser> {
    const response = await fetch(`${API_BASE_URL}/findGithubUserProfile?github_user_id=${github_user_id}`);
    
    if (!response.ok) {
      throw new Error('Failed to find Github user profile');
    }
    
    return response.json();
  },

  // Like Github user
  async likeGithubUser(phoneNumber: string, github_user_id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/likeGithubUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, github_user_id }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to like Github user');
    }
  },

  // Lấy thông tin profile người dùng
  async getUserProfile(phoneNumber: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/getUserProfile?phoneNumber=${encodeURIComponent(phoneNumber)}`);
    
    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }
    
    return response.json();
  },
};
