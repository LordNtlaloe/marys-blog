"use client"

import { getAllUsers } from '@/actions/user.actions';
import { getAllPosts } from '@/actions/posts.actions';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  
  useEffect(() => {
    const fetchData = async () => {
      const [fetchedUsers, fetchedPosts] = await Promise.all([
        getAllUsers(),
        getAllPosts()
      ]);
      setUsers(fetchedUsers);
      setPosts(fetchedPosts);
    };
    fetchData();
  }, []);

  if ('error' in users || 'error' in posts) {
    return <div className="text-red-500">Error fetching data</div>;
  }

  const userCount = users.length;
  const postCount = posts.length;

  const chartData = [
    { name: "Users", count: userCount },
    { name: "Posts", count: postCount },
  ];

  const lineChartData = posts.map((post: any, index: number) => ({
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
