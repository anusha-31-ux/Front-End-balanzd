import { useEffect, useMemo, useState, useRef } from "react";
import AdminLayout from "../AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RotateCcw, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { api, endpoints } from "@/lib/apiHandler";
import axiosClient from "@/services/axiosClient";
import { toast } from "sonner";

type TransactionItem = {
  id: string;
  order_id?: string;
  acquirer_data?: {
    rrn?: string;
    upi_transaction_id?: string;
  };
  bank?: string;
  method?: string;
  description?: string;
  email?: string;
  contact?: string;
  upi?: {
    payer_account_type?: string;
    vpa?: string;
  };
  status: string;
  currency: string;
  amount: number;
  fee?: number;
  tax?: number;
  notes?: {
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    goal?: string;
    health?: string;
    instagramId?: string;
    planName?: string;
  };
  created_at: number;
};

type TransactionResponse = {
  success: boolean;
  message?: string;
  data?: {
    entity?: string;
    count?: number;
    items?: TransactionItem[];
  };
};

type ApiParams = {
  count: number;
  skip: number;
  from?: number;
  to?: number;
  status?: string;
};

type TableRowData = {
  id: string;
  userName: string;
  planName: string;
  date: string;
  amount: string;
  method: string;
  contact: string;
  goals: string;
  health: string;
  instagramId: string;
  statusLabel: string;
  statusVariant: "default" | "secondary" | "destructive" | "outline";
};

const formatAmount = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount / 100);
  } catch (error) {
    console.error("Failed to format amount:", error);
    return `${currency} ${(amount / 100).toFixed(2)}`;
  }
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const mapStatus = (status: string) => {
  const normalized = status.toLowerCase();

  if (normalized === "captured") {
    return { label: "Success", variant: "default" as const };
  }

  if (normalized === "failed") {
    return { label: "Failed", variant: "destructive" as const };
  }

  if (normalized === "created" || normalized === "authorized") {
    return { label: "Pending", variant: "secondary" as const };
  }

  return { label: normalized, variant: "outline" as const };
};

const TransactionManagement = () => {
  const [allItems, setAllItems] = useState<TransactionItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());
  const [isFromCalendarOpen, setIsFromCalendarOpen] = useState(false);
  const [isToCalendarOpen, setIsToCalendarOpen] = useState(false);

  // Initial load
  useEffect(() => {
    const loadInitial = async () => {
      try {
        // Clear existing data and reset pagination when filters change
        setAllItems([]);
        setSkip(0);
        setIsLoadingMore(true);
        
        const params: ApiParams = {
          count: pageSize,
          skip: 0,
        };

        // Add date filters if present
        if (dateFrom) {
          params.from = Math.floor(dateFrom.getTime() / 1000);
        }
        if (dateTo) {
          params.to = Math.floor(dateTo.getTime() / 1000);
        }

        const response = await api.get<TransactionResponse>(
          endpoints.admin.razorpay.transactions,
          { params }
        );
        const items = response.data?.items ?? [];
        setAllItems(items);
        setSkip(pageSize);
        setHasMore(items.length >= pageSize);
      } catch (error) {
        console.error("Failed to load transactions:", error);
        toast.error("Failed to load transactions");
        setAllItems([]);
        setHasMore(false);
      } finally {
        setIsLoadingMore(false);
      }
    };

    loadInitial();
  }, [dateFrom, dateTo, statusFilter]);

  // Load more on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoadingMore &&
          hasMore &&
          allItems.length > 0
        ) {
          try {
            setIsLoadingMore(true);
            const params: ApiParams = {
              count: pageSize,
              skip,
            };

            if (dateFrom) {
              params.from = Math.floor(dateFrom.getTime() / 1000);
            }
            if (dateTo) {
              params.to = Math.floor(dateTo.getTime() / 1000);
            }

            const response = await api.get<TransactionResponse>(
              endpoints.admin.razorpay.transactions,
              { params }
            );
            const newItems = response.data?.items ?? [];
            if (newItems.length > 0) {
              setAllItems((prev) => [...prev, ...newItems]);
              setSkip((prev) => prev + pageSize);
              setHasMore(newItems.length >= pageSize);
            } else {
              setHasMore(false);
            }
          } catch (error) {
            console.error("Failed to load more transactions:", error);
            toast.error("Failed to load more transactions");
            setHasMore(false);
          } finally {
            setIsLoadingMore(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [isLoadingMore, hasMore, skip, allItems, dateFrom, dateTo]);

  const rows = useMemo<TableRowData[]>(() => {
    let filtered = allItems.map((item) => {
      const statusInfo = mapStatus(item.status || "unknown");
      return {
        id: item.id,
        userName: item.notes?.customerName?.trim() || item.email || "Unknown",
        planName: item.notes?.planName || item.description || "N/A",
        date: formatDate(item.created_at),
        amount: formatAmount(item.amount, item.currency || "INR"),
        method: item.method || "N/A",
        contact: item.notes?.customerPhone || item.contact || "N/A",
        goals: item.notes?.goal || "N/A",
        health: item.notes?.health || "N/A",
        instagramId: item.notes?.instagramId || "N/A",
        statusLabel: statusInfo.label,
        statusVariant: statusInfo.variant,
      };
    });

    // Client-side filtering
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((row) =>
        row.statusLabel.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return filtered;
  }, [allItems, statusFilter]);

  const handleResetFilters = () => {
    setStatusFilter("all");
    setDateFrom(undefined);
    setDateTo(new Date());
  };

  const handleExport = async () => {
    try {
      const params: ApiParams = {};

      // Add date filters if present
      if (dateFrom) {
        params.from = Math.floor(dateFrom.getTime() / 1000);
      }
      if (dateTo) {
        params.to = Math.floor(dateTo.getTime() / 1000);
      }

      // Add status filter if not all
      if (statusFilter && statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await axiosClient.get(endpoints.admin.razorpay.exportTransactions, {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Transactions exported successfully");
    } catch (error) {
      console.error("Failed to export transactions:", error);
      toast.error("Failed to export transactions");
    }
  };

  const loadingRows = Array.from({ length: 10 }, (_, index) => (
    <TableRow key={`loading-${index}`}>
      <TableCell className="w-1/12">
        <Skeleton className="h-4 w-24 bg-slate-800/60" />
      </TableCell>
      <TableCell className="w-1/12">
        <Skeleton className="h-4 w-20 bg-slate-800/60" />
      </TableCell>
      <TableCell className="w-1/12">
        <Skeleton className="h-4 w-16 bg-slate-800/60" />
      </TableCell>
      <TableCell className="w-1/12">
        <Skeleton className="h-4 w-20 bg-slate-800/60" />
      </TableCell>
      <TableCell className="w-1/12">
        <Skeleton className="h-4 w-16 bg-slate-800/60" />
      </TableCell>
      <TableCell className="w-1/12">
        <Skeleton className="h-4 w-20 bg-slate-800/60" />
      </TableCell>
      <TableCell className="w-1/12">
        <Skeleton className="h-4 w-24 bg-slate-800/60" />
      </TableCell>
      <TableCell className="w-1/12">
        <Skeleton className="h-4 w-20 bg-slate-800/60" />
      </TableCell>
      <TableCell className="w-1/12">
        <Skeleton className="h-4 w-24 bg-slate-800/60" />
      </TableCell>
      <TableCell className="w-1/12">
        <Skeleton className="h-6 w-16 rounded-full bg-slate-800/60" />
      </TableCell>
    </TableRow>
  ));

  return (
    <AdminLayout>
      <div className="fixed top-[73px] left-0 right-0 z-20 border-b border-slate-200/5 bg-slate-900/50 px-4 py-4 backdrop-blur md:left-64 md:px-6">
        <h2 className="text-3xl font-bold text-white">Transaction Management</h2>
        <p className="mt-2 text-slate-400">Manage payment settings and transactions.</p>
      </div>

      <div className="pt-[110px] px-4 flex flex-col md:h-[calc(95vh-50px)] md:px-6 md:overflow-hidden">
        {/* Filters */}
        <div className="mb-6 space-y-4 flex-shrink-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            {/* Filter Fields Container */}
            <div className="flex w-full flex-wrap gap-4">
              {/* Status Filter */}
              <div className="space-y-2 w-full sm:w-[280px]">
                <Label htmlFor="status-filter" className="text-slate-300 text-sm font-medium">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className="space-y-2 w-full sm:w-[280px]">
                <Label className="text-slate-300 text-sm font-medium">From Date</Label>
                <Popover open={isFromCalendarOpen} onOpenChange={setIsFromCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-white normal-case",
                        !dateFrom && "text-slate-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span className="normal-case">{dateFrom ? format(dateFrom, "dd MMM yyyy") : "Select date"}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={(date) => {
                        setDateFrom(date);
                        setIsFromCalendarOpen(false);
                      }}
                      initialFocus
                      className="bg-slate-800 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To */}
              <div className="space-y-2 w-full sm:w-[280px]">
                <Label className="text-slate-300 text-sm font-medium">To Date</Label>
                <Popover open={isToCalendarOpen} onOpenChange={setIsToCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-white normal-case",
                        !dateTo && "text-slate-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span className="normal-case">{dateTo ? format(dateTo, "dd MMM yyyy") : "Select date"}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={(date) => {
                        setDateTo(date);
                        setIsToCalendarOpen(false);
                      }}
                      initialFocus
                      className="bg-slate-800 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Reset Filters Button */}
            {(statusFilter !== "all" || dateFrom) && (
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="w-full gap-2 sm:w-auto"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            )}

            {/* Export Button */}
            <Button
              variant="default"
              onClick={handleExport}
              className="w-full gap-2 sm:w-auto"
            >
              Export to XLSX
            </Button>
          </div>
        </div>

        <Card className="border-slate-200/10 bg-slate-900/40 rounded-none flex flex-col flex-grow overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:flex flex-1 overflow-x-auto">
            <div className="min-w-[1400px] flex h-full flex-col">
              {/* Fixed Table Header */}
              <div className="border-b border-slate-200/10 flex-shrink-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-400 text-left w-1/12">Customer Name</TableHead>
                      <TableHead className="text-slate-400 text-left w-1/12">Plan</TableHead>
                      <TableHead className="text-slate-400 text-left w-1/12">Date</TableHead>
                      <TableHead className="text-slate-400 text-left w-1/12">Amount</TableHead>
                      <TableHead className="text-slate-400 text-left w-1/12">Method</TableHead>
                      <TableHead className="text-slate-400 text-left w-1/12">Contact</TableHead>
                      <TableHead className="text-slate-400 text-left w-1/12">Goals</TableHead>
                      <TableHead className="text-slate-400 text-left w-1/12">Health</TableHead>
                      <TableHead className="text-slate-400 text-left w-1/12">Instagram</TableHead>
                      <TableHead className="text-slate-400 text-left w-1/12">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {/* Scrollable Table Body */}
              <div className="flex-grow overflow-y-auto">
                <Table>
                  <TableBody>
              {isLoadingMore && allItems.length === 0 ? (
                <>
                  {loadingRows}
                </>
              ) : allItems.length === 0 ? (
                <TableRow>
                  <TableCell className="text-slate-300 text-center" colSpan={10}>
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {rows.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium text-white w-1/12">
                        {transaction.userName}
                      </TableCell>
                      <TableCell className="text-slate-300 w-1/12">{transaction.planName}</TableCell>
                      <TableCell className="text-slate-300 w-1/12">{transaction.date}</TableCell>
                      <TableCell className="text-slate-300 w-1/12">{transaction.amount}</TableCell>
                      <TableCell className="text-slate-300 w-1/12">{transaction.method}</TableCell>
                      <TableCell className="text-slate-300 w-1/12">{transaction.contact}</TableCell>
                      <TableCell className="text-slate-300 w-1/12">{transaction.goals}</TableCell>
                      <TableCell className="text-slate-300 w-1/12">{transaction.health}</TableCell>
                      <TableCell className="text-slate-300 w-1/12">{transaction.instagramId}</TableCell>
                      <TableCell className="w-1/12">
                        <Badge variant={transaction.statusVariant} className="w-16 justify-center">
                          {transaction.statusLabel}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {isLoadingMore &&
                    loadingRows.map((row, idx) => (
                      <TableRow key={`loading-append-${idx}`}>
                        <TableCell className="w-1/12">
                          <Skeleton className="h-4 w-24 bg-slate-800/60" />
                        </TableCell>
                        <TableCell className="w-1/12">
                          <Skeleton className="h-4 w-20 bg-slate-800/60" />
                        </TableCell>
                        <TableCell className="w-1/12">
                          <Skeleton className="h-4 w-16 bg-slate-800/60" />
                        </TableCell>
                        <TableCell className="w-1/12">
                          <Skeleton className="h-4 w-20 bg-slate-800/60" />
                        </TableCell>
                        <TableCell className="w-1/12">
                          <Skeleton className="h-4 w-16 bg-slate-800/60" />
                        </TableCell>
                        <TableCell className="w-1/12">
                          <Skeleton className="h-4 w-20 bg-slate-800/60" />
                        </TableCell>
                        <TableCell className="w-1/12">
                          <Skeleton className="h-4 w-24 bg-slate-800/60" />
                        </TableCell>
                        <TableCell className="w-1/12">
                          <Skeleton className="h-4 w-20 bg-slate-800/60" />
                        </TableCell>
                        <TableCell className="w-1/12">
                          <Skeleton className="h-4 w-24 bg-slate-800/60" />
                        </TableCell>
                        <TableCell className="w-1/12">
                          <Skeleton className="h-6 w-16 rounded-full bg-slate-800/60" />
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              )}
                  </TableBody>
                </Table>
                <div ref={sentinelRef} className="h-4 bg-slate-900/40" />
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex-1 overflow-y-auto p-4 space-y-4">
            {isLoadingMore && allItems.length === 0 ? (
              // Mobile loading cards
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="border-slate-200/10 bg-slate-800/40 p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-5 w-32 bg-slate-700/60" />
                      <Skeleton className="h-6 w-16 rounded-full bg-slate-700/60" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-slate-700/60" />
                      <Skeleton className="h-4 w-20 bg-slate-700/60" />
                      <Skeleton className="h-4 w-28 bg-slate-700/60" />
                      <Skeleton className="h-4 w-16 bg-slate-700/60" />
                    </div>
                  </div>
                </Card>
              ))
            ) : allItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400">No transactions found.</p>
              </div>
            ) : (
              <>
                {rows.map((transaction) => (
                  <Card key={transaction.id} className="border-slate-200/10 bg-slate-800/40 p-4">
                    <div className="space-y-3">
                      {/* Header with name and status */}
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-white text-lg">{transaction.userName}</h3>
                        <Badge variant={transaction.statusVariant} className="text-xs">
                          {transaction.statusLabel}
                        </Badge>
                      </div>

                      {/* Transaction details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-slate-400">Plan</p>
                          <p className="text-white">{transaction.planName}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Date</p>
                          <p className="text-white">{transaction.date}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Amount</p>
                          <p className="text-white font-medium">{transaction.amount}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Method</p>
                          <p className="text-white">{transaction.method}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Contact</p>
                          <p className="text-white">{transaction.contact}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Goals</p>
                          <p className="text-white text-xs">{transaction.goals}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Health</p>
                          <p className="text-white text-xs">{transaction.health}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Instagram</p>
                          <p className="text-white text-xs">{transaction.instagramId}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Mobile loading indicator */}
                {isLoadingMore && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <p className="text-slate-400 text-sm mt-2">Loading more...</p>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default TransactionManagement;
