import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  CreditCard,
  Users,
  Star,
} from "lucide-react";
import { api, endpoints } from "@/lib/apiHandler";
import { pricingService } from "@/services/pricingService";
import { personalTrainingService } from "@/services/personalTrainingService";
import { testimonialService } from "@/services/testimonialService";
import type { PricingPlan } from "@/types/pricing";
import type { PersonalTraining } from "@/types/personalTraining";
import type { Testimonial } from "@/types/testimonial";

type TransactionItem = {
  id: string;
  status: string;
  currency: string;
  amount: number;
  method?: string;
  notes?: { customerName?: string; planName?: string };
  created_at: number;
};

type TransactionResponse = {
  success: boolean;
  data?: { count?: number; items?: TransactionItem[] };
};

type SummaryResponse = {
  success: boolean;
  data?: {
    totalRevenue: number;
    capturedCount: number;
    failedCount: number;
    pendingCount: number;
    totalCount: number;
  };
};

type DashboardData = {
  summary: NonNullable<SummaryResponse["data"]>;
  transactions: TransactionItem[];
  pricingPlans: PricingPlan[];
  trainingServices: PersonalTraining[];
  testimonials: Testimonial[];
};

const formatRupees = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (ts: number) =>
  new Date(ts * 1000).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const mapStatus = (status: string) => {
  const s = status.toLowerCase();
  if (s === "captured") return { label: "Success", variant: "default" as const };
  if (s === "failed") return { label: "Failed", variant: "destructive" as const };
  return { label: "Pending", variant: "secondary" as const };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [summaryRes, txRes, plans, services, testimonials] = await Promise.all([
          api.get<SummaryResponse>(endpoints.admin.razorpay.summary, {
            params: {
              from: Math.floor(new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000),
              to: Math.floor(Date.now() / 1000),
            },
          }),
          api.get<TransactionResponse>(endpoints.admin.razorpay.transactions, {
            params: { count: 10, skip: 0 },
          }),
          pricingService.getAllPlans(),
          personalTrainingService.getAllServices(),
          testimonialService.getAllAdmin(),
        ]);
        setData({
          summary: summaryRes.data ?? { totalRevenue: 0, capturedCount: 0, failedCount: 0, pendingCount: 0, totalCount: 0 },
          transactions: txRes.data?.items ?? [],
          pricingPlans: plans,
          trainingServices: services,
          testimonials,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const stats = useMemo(() => {
    if (!data) return null;
    return {
      totalRevenue: data.summary.totalRevenue,
      totalTransactions: data.summary.totalCount,
      activePlansTotal:
        data.pricingPlans.filter((p) => p.isActive).length +
        data.trainingServices.filter((s) => s.isActive).length,
      activeTestimonials: data.testimonials.filter((t) => t.isActive).length,
      recentTransactions: data.transactions.slice(0, 5),
    };
  }, [data]);

  return (
    <AdminLayout>
      <div className="fixed top-[90px] left-0 right-0 z-20 border-b border-slate-200/5 bg-slate-900/50 px-4 py-4 backdrop-blur md:top-[73px] md:left-64 md:px-6">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="mt-2 text-slate-400">Welcome to your admin dashboard.</p>
      </div>

      <div className="pt-[120px] md:pt-[100px] px-4 pb-8 md:px-6 space-y-6">

        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <Card className="border-slate-200/10 bg-slate-900/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-28 bg-slate-800/60" />
              ) : (
                <p className="text-2xl font-bold text-white">{formatRupees(stats?.totalRevenue ?? 0)}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">This month (captured)</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/10 bg-slate-900/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Transactions</CardTitle>
              <CreditCard className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-16 bg-slate-800/60" />
              ) : (
                <p className="text-2xl font-bold text-white">{stats?.totalTransactions ?? 0}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/10 bg-slate-900/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Plans</CardTitle>
              <Users className="h-5 w-5 text-violet-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-12 bg-slate-800/60" />
              ) : (
                <p className="text-2xl font-bold text-white">{stats?.activePlansTotal ?? 0}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">Pricing + Personal Training</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/10 bg-slate-900/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Testimonials</CardTitle>
              <Star className="h-5 w-5 text-amber-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-12 bg-slate-800/60" />
              ) : (
                <p className="text-2xl font-bold text-white">{stats?.activeTestimonials ?? 0}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">Visible on site</p>
            </CardContent>
          </Card>

        </div>

        {/* Row 2: Recent Transactions */}
        <div className="grid grid-cols-1 gap-6">

          {/* Recent Transactions */}
          <Card className="border-slate-200/10 bg-slate-900/40">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-white">Recent Transactions</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/razorpay")}
                className="text-xs text-slate-300 border-slate-700 hover:bg-slate-800"
              >
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0">

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800">
                      <TableHead className="text-slate-400">Customer</TableHead>
                      <TableHead className="text-slate-400">Plan</TableHead>
                      <TableHead className="text-slate-400">Amount</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Method</TableHead>
                      <TableHead className="text-slate-400">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i} className="border-slate-800">
                            <TableCell><Skeleton className="h-4 w-24 bg-slate-800/60" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20 bg-slate-800/60" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16 bg-slate-800/60" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-14 rounded-full bg-slate-800/60" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-12 bg-slate-800/60" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20 bg-slate-800/60" /></TableCell>
                          </TableRow>
                        ))
                      : stats?.recentTransactions.map((tx) => {
                          const s = mapStatus(tx.status);
                          return (
                            <TableRow key={tx.id} className="border-slate-800">
                              <TableCell className="font-medium text-white">
                                {tx.notes?.customerName?.trim() || "Unknown"}
                              </TableCell>
                              <TableCell className="text-slate-300">
                                {tx.notes?.planName || "N/A"}
                              </TableCell>
                              <TableCell className="text-slate-300">
                                {new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: tx.currency || "INR",
                                  maximumFractionDigits: 0,
                                }).format(tx.amount / 100)}
                              </TableCell>
                              <TableCell>
                                <Badge variant={s.variant}>{s.label}</Badge>
                              </TableCell>
                              <TableCell className="text-slate-300">
                                {tx.method || "N/A"}
                              </TableCell>
                              <TableCell className="text-slate-300">
                                {formatDate(tx.created_at)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile card stack */}
              <div className="md:hidden divide-y divide-slate-800">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-4 space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-5 w-28 bg-slate-800/60" />
                          <Skeleton className="h-5 w-14 rounded-full bg-slate-800/60" />
                        </div>
                        <Skeleton className="h-4 w-20 bg-slate-800/60" />
                        <Skeleton className="h-4 w-16 bg-slate-800/60" />
                      </div>
                    ))
                  : stats?.recentTransactions.map((tx) => {
                      const s = mapStatus(tx.status);
                      return (
                        <div key={tx.id} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-white text-sm">
                              {tx.notes?.customerName?.trim() || "Unknown"}
                            </span>
                            <Badge variant={s.variant} className="text-xs">{s.label}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <span className="text-slate-400">
                              Plan: <span className="text-slate-300">{tx.notes?.planName || "N/A"}</span>
                            </span>
                            <span className="text-slate-400">
                              Method: <span className="text-slate-300">{tx.method || "N/A"}</span>
                            </span>
                            <span className="text-slate-400">
                              Amount:{" "}
                              <span className="text-white font-medium">
                                {new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: tx.currency || "INR",
                                  maximumFractionDigits: 0,
                                }).format(tx.amount / 100)}
                              </span>
                            </span>
                            <span className="text-slate-400">
                              Date: <span className="text-slate-300">{formatDate(tx.created_at)}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
              </div>

              {!loading && (!stats?.recentTransactions || stats.recentTransactions.length === 0) && (
                <div className="py-10 text-center text-slate-400 text-sm">
                  No recent transactions found.
                </div>
              )}

            </CardContent>
          </Card>


        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default Dashboard;
