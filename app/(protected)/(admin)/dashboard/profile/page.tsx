"use client"

import React, { useState } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { updateUser } from "@/actions/user.actions"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function Profile() {
  const { user, loading, error } = useCurrentUser()
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    image: user?.image || "",
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const res = await updateUser(user.id, form)
      if ("error" in res) {
        toast.error(res.error)
      } else {
        toast.success("Profile updated")
        setIsEditing(false)
      }
    }// FIXED - avoids lint error
    catch (err) {
      console.error("Failed to update profile:", err)
      toast.error("Failed to update profile");
    }
    finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-gray-600 dark:text-gray-300">Loading user data...</p>
  if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>
  if (!user) return <p className="text-gray-500 dark:text-gray-300">No user found.</p>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#2C2C2C] dark:bg-[#2C2C2C] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Profile Overview
          </h3>
          <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={saving}>
            {isEditing ? (saving ? "Saving..." : "Save") : "Edit"}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Meta Info */}
          <div className="rounded-lg bg-gray-50 dark:bg-neutral-800 p-4">
            <h4 className="font-semibold text-gray-700 dark:text-white mb-2">Meta</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>ID:</strong> {user.id}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Role:</strong> {user.role}
            </p>
          </div>

          {/* Basic Info */}
          <div className="rounded-lg bg-gray-50 dark:bg-neutral-800 p-4 space-y-3">
            <h4 className="font-semibold text-gray-700 dark:text-white mb-2">Personal Info</h4>

            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-xs text-gray-500 mb-1">First Name</label>
                {isEditing ? (
                  <Input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-sm text-gray-800 dark:text-white">
                    {user.first_name}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                {isEditing ? (
                  <Input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-sm text-gray-800 dark:text-white">
                    {user.last_name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              {isEditing ? (
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-sm text-gray-800 dark:text-white">{user.email}</p>
              )}
            </div>
          </div>

          {/* Profile Image */}
          <div className="rounded-lg bg-gray-50 dark:bg-neutral-800 p-4">
            <h4 className="font-semibold text-gray-700 dark:text-white mb-2">Profile Picture</h4>
            {isEditing ? (
              <Input
                name="image"
                placeholder="Profile image URL"
                value={form.image}
                onChange={handleChange}
              />
            ) : user.image ? (
              <Image
                src={user.image}
                alt="Profile"
                className="h-24 w-24 rounded-full border object-cover"
              />
            ) : (
              <p className="text-sm text-gray-500">No image set.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
