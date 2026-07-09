import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Settings() {
  const [activeTab, setActiveTab] = useState('notifications');

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-100 p-2.5 rounded-xl">
          <SettingsIcon className="w-6 h-6 text-slate-700" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="text-slate-500">Manage your account preferences and application settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-2 lg:col-span-1">
          {tabs.map((tab) => (
            <Button 
              key={tab.id}
              variant="ghost" 
              onClick={() => setActiveTab(tab.id)}
              className={`w-full justify-start text-left ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
            </Button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'notifications' && (
            <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
                <CardDescription>Choose what alerts you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between max-w-md">
                  <div>
                    <p className="font-medium text-slate-800">Email Alerts</p>
                    <p className="text-sm text-slate-500">Receive weekly expense summaries</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                </div>
                <div className="flex items-center justify-between max-w-md pt-4 border-t border-slate-100">
                  <div>
                    <p className="font-medium text-slate-800">Push Notifications</p>
                    <p className="text-sm text-slate-500">Get alerted for large transactions</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
