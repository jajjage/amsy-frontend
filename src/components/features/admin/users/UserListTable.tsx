"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { AdminUser, UserLifecycleSegment } from "@/types/admin/user.types";
import { ChevronLeft, ChevronRight, Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const lifecycleTabs: { id: UserLifecycleSegment | "all"; label: string }[] = [
  { id: "all", label: "All users" },
  { id: "never_activated", label: "Never activated" },
  { id: "active", label: "Active" },
  { id: "at_risk", label: "At risk" },
  { id: "churned", label: "Churned" },
  { id: "dormant", label: "Dormant" },
];

const lifecycleLabels: Record<UserLifecycleSegment, string> = {
  never_activated: "Never activated",
  active: "Active",
  at_risk: "At risk",
  churned: "Churned",
  dormant: "Dormant",
};

function formatActivityDate(
  value: string | null | undefined,
  timeZone: string
) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeZone,
  }).format(date);
}

export function UserListTable() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [lifecycleFilter, setLifecycleFilter] = useState<
    UserLifecycleSegment | "all"
  >("all");
  const isSearchActive = !!debouncedSearch.trim();

  const limit = 25;

  const [prevSearch, setPrevSearch] = useState(debouncedSearch);

  // Reset page when search term changes
  // We use this pattern instead of useEffect to avoid cascading renders
  // See: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (debouncedSearch !== prevSearch) {
    setPrevSearch(debouncedSearch);
    setPage(1);
  }

  const { data, isLoading, isFetching, isError, refetch } = useAdminUsers({
    page,
    limit,
    role: roleFilter === "all" ? undefined : roleFilter,
    search: debouncedSearch,
    lifecycleSegment: lifecycleFilter === "all" ? undefined : lifecycleFilter,
  });

  const pagination = data?.data?.pagination;

  // Server is source of truth for search/filter/pagination.
  const users = data?.data?.users || [];
  const lifecycleCounts = data?.data?.lifecycleCounts;
  const lifecycleTimezone = data?.data?.lifecycleTimezone || "Africa/Lagos";

  const tabs = [
    { id: "all", label: "All Users" },
    { id: "admin", label: "Admins" },
    { id: "staff", label: "Staff" },
    { id: "reseller", label: "Resellers" },
    { id: "user", label: "Users" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users</CardTitle>
        <Button asChild size="sm">
          <Link href="/admin/dashboard/users/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-5 space-y-4">
          <Tabs
            value={lifecycleFilter}
            onValueChange={(value) => {
              setLifecycleFilter(value as UserLifecycleSegment | "all");
              setPage(1);
            }}
          >
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-md bg-transparent p-0 pb-1">
              {lifecycleTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:border-border data-[state=active]:bg-background min-h-9 shrink-0 gap-2 rounded-md border border-transparent px-3 data-[state=active]:shadow-sm"
                >
                  {tab.label}
                  {tab.id !== "all" && (
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {lifecycleCounts?.[tab.id] ?? "—"}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={roleFilter === tab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setRoleFilter(tab.id);
                    setPage(1); // Reset page when role changes
                  }}
                  className="whitespace-nowrap"
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            <div className="relative w-full max-w-xs">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search users..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lifecycle</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!data && isLoading ? (
                // Loading Skeletons for Rows
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-8 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    <p className="text-muted-foreground">
                      Failed to load users
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => refetch()}
                    >
                      Retry
                    </Button>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    {searchInput
                      ? "No matching users found"
                      : "No users found in this category"}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: AdminUser) => (
                  <TableRow key={user.id || user.userId}>
                    <TableCell className="font-medium">
                      {user.fullName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.isSuspended ? (
                        <Badge variant="destructive">Suspended</Badge>
                      ) : (
                        <Badge variant="default">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="min-w-48">
                      {user.lifecycleSegment ? (
                        <div className="space-y-1">
                          <Badge
                            variant={
                              user.lifecycleSegment === "dormant" ||
                              user.lifecycleSegment === "churned"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {lifecycleLabels[user.lifecycleSegment]}
                          </Badge>
                          <p className="text-muted-foreground text-xs">
                            {user.lifecycleSegment === "never_activated"
                              ? "No qualifying activity"
                              : `${user.daysInactive ?? 0} days inactive`}
                          </p>
                          {formatActivityDate(
                            user.lastMeaningfulActivityAt,
                            lifecycleTimezone
                          ) && (
                            <p className="text-muted-foreground text-xs">
                              Last activity:{" "}
                              {formatActivityDate(
                                user.lastMeaningfulActivityAt,
                                lifecycleTimezone
                              )}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/admin/dashboard/users/${user.id || user.userId}`}
                        >
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {isSearchActive && isFetching && (
          <p className="text-muted-foreground mt-3 text-xs">Searching...</p>
        )}

        {/* Pagination */}
        {!!data && !isError && pagination && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Page {pagination.page} of {pagination.totalPages} (
              {pagination.total} users)
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
