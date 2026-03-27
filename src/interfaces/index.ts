export interface IUser {
  id: string;
  email: string;
  name: string;
  password: string;
  profile_pic?: string;
  created_at: Date;
  updated_at?: Date;
}

export interface IBlog {
  id: string;
  created_at: string;
  is_active: boolean;

  title: string;
  description: string;
  image?: string;
  category: string;
  content: string;
  author_id: string;
  likes_count: number;
  comments_count: number;

  author?: IUser;
}

export interface ILike {
  id: string;
  blog_id: string;
  user_id: string;
  created_at: string;

  user?: IUser;
}

export interface INotification {
  id: string;
  user_id: string;
  blog_id: string;
  type: string;
  content: string;
  is_read: boolean;
  created_at: string;

  user?: IUser;
}
