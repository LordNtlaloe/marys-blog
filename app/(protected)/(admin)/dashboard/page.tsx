"use client"
import { getAllUsers } from '@/actions/user.actions';
import { getAllPosts } from '@/actions/posts.actions';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';

// Define proper interfaces
interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
}

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  status: 'published' | 'draft' | 'archived';
  readTime: number;
  views: number;
  likes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt?: string;
  author_name: string;
  category_name: string;
  slug: string;
  tags?: string[];
  featuredImageUrl?: string;
}

interface ErrorResponse {
  error: string;
}

interface ChartData {
  name: string;
  count: number;
}

interface LineChartData {
  name: string;
  views: number;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[] | ErrorResponse>([]);
  const [posts, setPosts] = useState<Post[] | ErrorResponse>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedUsers, fetchedPosts] = await Promise.all([
          getAllUsers(),
          getAllPosts()
        ]);

        setUsers(fetchedUsers);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setUsers({ error: 'Failed to fetch users' });
        setPosts({ error: 'Failed to fetch posts' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-600 dark:text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  // Type guards to check for errors
  const hasUserError = users && typeof users === 'object' && 'error' in users;
  const hasPostError = posts && typeof posts === 'object' && 'error' in posts;

  if (hasUserError || hasPostError) {
    return (
      <div className="p-6">
        <div className="text-red-500">
          Error fetching data:
          {hasUserError && <div>Users: {(users as ErrorResponse).error}</div>}
          {hasPostError && <div>Posts: {(posts as ErrorResponse).error}</div>}
        </div>
      </div>
    );
  }

  // Type assertions after error checking
  const userArray = users as User[];
  const postArray = posts as Post[];

  const userCount = userArray.length;
  const postCount = postArray.length;

  const chartData: ChartData[] = [
    { name: "Users", count: userCount },
    { name: "Posts", count: postCount },
  ];

  const lineChartData: LineChartData[] = postArray.map((post: Post, index: number) => ({
    name: `Post ${index + 1}`,
    views: post.views || Math.floor(Math.random() * 100),
  }));

  return (
    <div className="p-6 space-y-8 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-xl">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl">{userCount}</p>
        </div>
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-xl">
          <h2 className="text-xl font-semibold">Total Posts</h2>
          <p className="text-2xl">{postCount}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <h2 className="text-xl mb-4 font-semibold">Content Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "#fff", borderRadius: 8 }} />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <h2 className="text-xl mb-4 font-semibold">Post Views (Sample)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "#fff", borderRadius: 8 }} />
            <Line type="monotone" dataKey="views" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}