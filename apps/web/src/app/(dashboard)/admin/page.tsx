'use client';

import { useState } from 'react';
import { Shield, Users, FileText, CheckCircle, XCircle, Trash2, Edit, Activity, BarChart3, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminDashboard, useAdminUsers, useAdminToggleUserStatus, useAdminPendingResources, useAdminUpdateResourceStatus } from '@/hooks/use-admin';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'resources' | 'quizzes'>('overview');
  
  const { data: stats, isLoading: isLoadingStats } = useAdminDashboard();
  const { data: users, isLoading: isLoadingUsers } = useAdminUsers();
  const { data: pendingResources, isLoading: isLoadingResources } = useAdminPendingResources();
  
  const { mutate: toggleStatus } = useAdminToggleUserStatus();
  const { mutate: updateResource } = useAdminUpdateResourceStatus();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display text-[var(--color-text-primary)]">Admin Control Panel</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Platform management, moderation, and analytics.</p>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1 bg-[var(--color-bg-secondary)] rounded-lg w-fit">
        {['overview', 'users', 'resources', 'quizzes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2.5 rounded-md text-sm font-bold capitalize transition-all whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-[var(--color-primary-base)] text-white shadow-md' 
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          {isLoadingStats ? <p>Loading stats...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Students" value={stats?.totalUsers || 0} icon={<Users className="w-5 h-5 text-blue-400" />} trend="Registered" />
              <StatCard title="Active Resources" value={stats?.activeResources || 0} icon={<FileText className="w-5 h-5 text-emerald-400" />} trend={`${stats?.pendingResources || 0} pending review`} />
              <StatCard title="Total Quizzes Taken" value={stats?.totalQuizzes || 0} icon={<CheckCircle className="w-5 h-5 text-purple-400" />} trend="Across all subjects" />
              <StatCard title="Platform Revenue" value={`Rs ${stats?.revenue || 0}`} icon={<Activity className="w-5 h-5 text-orange-400" />} trend="Free tier active" />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[var(--color-primary-light)]" />
                  User Growth Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center border-t border-[var(--color-border-subtle)]/50">
                <p className="text-[var(--color-text-tertiary)]">Chart Placeholder (Recharts)</p>
              </CardContent>
            </Card>

            <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Recent Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ActivityItem action="User Registration" user="Kasun P." time="2 mins ago" />
                <ActivityItem action="Resource Upload" user="Amandi S." time="15 mins ago" />
                <ActivityItem action="Quiz Published" user="Admin" time="1 hour ago" />
                <ActivityItem action="Group Created" user="Nimal J." time="3 hours ago" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50 animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[var(--color-text-tertiary)] uppercase bg-[var(--color-bg-tertiary)] rounded-t-lg">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)]">
                  {isLoadingUsers ? <tr><td colSpan={5} className="p-4 text-center">Loading users...</td></tr> : 
                   users?.map((u: any) => (
                    <UserRow 
                      key={u._id}
                      name={u.name} 
                      email={u.email} 
                      role={u.role} 
                      status={u.isActive ? 'Active' : 'Suspended'} 
                      joined={new Date(u.createdAt).toLocaleDateString()} 
                      onToggle={() => toggleStatus(u._id)}
                    />
                   ))
                  }
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RESOURCES TAB */}
      {activeTab === 'resources' && (
        <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50 animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle>Resource Review Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingResources ? <p>Loading queue...</p> : 
               pendingResources?.length > 0 ? pendingResources.map((r: any) => (
                <ReviewItem 
                  key={r._id}
                  title={r.title} 
                  uploader={r.uploadedBy?.name || 'Unknown'} 
                  type={r.fileType} 
                  onApprove={() => updateResource({ id: r._id, status: 'approved' })}
                  onReject={() => updateResource({ id: r._id, status: 'rejected' })}
                />
               )) : <p className="text-[var(--color-text-tertiary)]">Queue is empty. Great job!</p>
              }
            </div>
          </CardContent>
        </Card>
      )}

      {/* QUIZZES TAB */}
      {activeTab === 'quizzes' && (
        <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50 animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>MCQ Management</CardTitle>
            <Button size="sm" className="shadow-glow-primary">Create New Quiz</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <QuizAdminItem title="Physics Mechanics Base" status="Published" questions={50} />
              <QuizAdminItem title="Chemistry Organic Basics" status="Draft" questions={25} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, trend }: any) {
  return (
    <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">{title}</p>
            <p className="text-2xl font-bold font-display text-[var(--color-text-primary)]">{value}</p>
          </div>
          <div className="p-2 bg-[var(--color-bg-tertiary)] rounded-lg">
            {icon}
          </div>
        </div>
        <div className="mt-4 text-xs font-medium text-[var(--color-text-tertiary)]">
          {trend}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ action, user, time }: any) {
  return (
    <div className="flex justify-between items-center p-3 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[var(--color-primary-base)]"></div>
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{action}</p>
          <p className="text-xs text-[var(--color-text-tertiary)]">by {user}</p>
        </div>
      </div>
      <span className="text-xs text-[var(--color-text-tertiary)]">{time}</span>
    </div>
  );
}

function UserRow({ name, email, role, status, joined, onToggle }: any) {
  return (
    <tr className="hover:bg-[var(--color-bg-tertiary)]/50 transition-colors">
      <td className="px-6 py-4">
        <div className="font-medium text-[var(--color-text-primary)]">{name}</div>
        <div className="text-xs text-[var(--color-text-tertiary)]">{email}</div>
      </td>
      <td className="px-6 py-4">
        <Badge variant={role === 'admin' ? 'default' : 'outline'} className="capitalize">{role}</Badge>
      </td>
      <td className="px-6 py-4">
        <Badge variant={status === 'Active' ? 'success' : 'error'}>{status}</Badge>
      </td>
      <td className="px-6 py-4 text-[var(--color-text-secondary)]">{joined}</td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <Button onClick={onToggle} variant="ghost" size="sm" className={status === 'Active' ? 'text-orange-400' : 'text-emerald-400'}>
            {status === 'Active' ? 'Suspend' : 'Activate'}
          </Button>
        </div>
      </td>
    </tr>
  );
}

function ReviewItem({ title, uploader, type, onApprove, onReject }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]">
      <div>
        <h4 className="font-bold text-[var(--color-text-primary)]">{title}</h4>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">Uploaded by {uploader} • {type}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onApprove} variant="outline" size="sm" className="text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"><CheckCircle className="w-4 h-4 mr-1" /> Approve</Button>
        <Button onClick={onReject} variant="outline" size="sm" className="text-red-500 border-red-500/30 hover:bg-red-500/10"><XCircle className="w-4 h-4 mr-1" /> Reject</Button>
      </div>
    </div>
  );
}

function QuizAdminItem({ title, status, questions }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]">
      <div>
        <h4 className="font-bold text-[var(--color-text-primary)]">{title}</h4>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">{questions} Questions</p>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant={status === 'Published' ? 'success' : 'default'}>{status}</Badge>
        <Button variant="ghost" size="sm"><Edit className="w-4 h-4 mr-2" /> Edit</Button>
      </div>
    </div>
  );
}
