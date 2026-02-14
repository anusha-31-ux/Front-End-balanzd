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
import { toast } from "sonner";

type TransactionItem = {
  id: string;
  amount: number;
  currency: string;
  created_at: number;
  status: string;
  email?: string;
  notes?: {
    customerName?: string;
  };
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
};

type TableRowData = {
  id: string;
  userName: string;
  date: string;
  amount: string;
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
          endpoints.adminRazorpay.transactions,
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
              endpoints.adminRazorpay.transactions,
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
        date: formatDate(item.created_at),
        amount: formatAmount(item.amount, item.currency || "INR"),
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

  const loadingRows = Array.from({ length: 10 }, (_, index) => (
    <TableRow key={`loading-${index}`}>
      <TableCell className="w-2/5">
        <Skeleton className="h-4 w-36 bg-slate-800/60" />
      </TableCell>
      <TableCell className="w-1/5">
        <Skeleton className="h-4 w-24 bg-slate-800/60" />
      </TableCell>
      <TableCell className="w-1/5">
        <Skeleton className="h-4 w-28 bg-slate-800/60" />
      </TableCell>
      <TableCell className="w-1/5">
        <Skeleton className="h-6 w-20 rounded-full bg-slate-800/60" />
      </TableCell>
    </TableRow>
  ));

  return (
    <AdminLayout>
      <div className="fixed top-[73px] left-64 right-0 z-20 bg-slate-900/50 px-6 py-4 backdrop-blur border-b border-slate-200/5">
        <h2 className="text-3xl font-bold text-white">Transaction Management</h2>
        <p className="mt-2 text-slate-400">Manage payment settings and transactions.</p>
      </div>

      <div className="pt-[110px] px-6 flex flex-col overflow-hidden" style={{ height: "calc(95vh - 50px)" }}>
        {/* Filters */}
        <div className="mb-6 space-y-4 flex-shrink-0">
          <div className="flex gap-4 items-end flex-wrap">
            {/* Filter Fields Container */}
            <div className="flex gap-4 flex-wrap">
              {/* Status Filter */}
              <div className="space-y-2 w-[280px]">
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
              <div className="space-y-2 w-[280px]">
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
              <div className="space-y-2 w-[280px]">
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
                className="gap-2 flex-shrink-0"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </div>

        <Card className="border-slate-200/10 bg-slate-900/40 rounded-none flex flex-col flex-grow overflow-hidden">
          {/* Fixed Table Header */}
          <div className="border-b border-slate-200/10 flex-shrink-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-400 w-2/5">User Name</TableHead>
                  <TableHead className="text-slate-400 w-1/5">Date</TableHead>
                  <TableHead className="text-slate-400 w-1/5">Transaction Amount</TableHead>
                  <TableHead className="text-slate-400 w-1/5">Status</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* Scrollable Table Body */}
          <div className="overflow-y-auto flex-grow">
            <Table>
              <TableBody>
              {isLoadingMore && allItems.length === 0 ? (
                <>
                  {loadingRows}
                </>
              ) : allItems.length === 0 ? (
                <TableRow>
                  <TableCell className="text-slate-300 text-center" colSpan={4}>
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {rows.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium text-white w-2/5">
                        {transaction.userName}
                      </TableCell>
                      <TableCell className="text-slate-300 w-1/5">{transaction.date}</TableCell>
                      <TableCell className="text-slate-300 w-1/5">{transaction.amount}</TableCell>
                      <TableCell className="w-1/5">
                        <Badge variant={transaction.statusVariant} className="w-20 justify-center">
                          {transaction.statusLabel}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {isLoadingMore &&
                    loadingRows.map((row, idx) => (
                      <TableRow key={`loading-append-${idx}`}>
                        <TableCell className="w-2/5">
                          <Skeleton className="h-4 w-36 bg-slate-800/60" />
                        </TableCell>
                        <TableCell className="w-1/5">
                          <Skeleton className="h-4 w-24 bg-slate-800/60" />
                        </TableCell>
                        <TableCell className="w-1/5">
                          <Skeleton className="h-4 w-28 bg-slate-800/60" />
                        </TableCell>
                        <TableCell className="w-1/5">
                          <Skeleton className="h-6 w-20 rounded-full bg-slate-800/60" />
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              )}
              </TableBody>
            </Table>
            <div ref={sentinelRef} className="h-4 bg-slate-900/40" />
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default TransactionManagement;
