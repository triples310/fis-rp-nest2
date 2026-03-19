"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserCog, Shield } from "lucide-react";
import { AccountList } from "@/modules/system/components/account/account-list";
import { RoleList } from "@/modules/system/components/account/role-list";

export default function AccountPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">帳號設定</h1>
        <p className="text-xs text-muted-foreground mt-1">管理系統帳號與角色權限</p>
      </div>
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="accounts" className="gap-1.5 data-[state=active]:shadow-sm">
            <UserCog className="h-3.5 w-3.5" />
            帳號管理
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-1.5 data-[state=active]:shadow-sm">
            <Shield className="h-3.5 w-3.5" />
            角色設定
          </TabsTrigger>
        </TabsList>
        <TabsContent value="accounts">
          <AccountList />
        </TabsContent>
        <TabsContent value="roles">
          <RoleList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
