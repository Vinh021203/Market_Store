// pages/Downloads.tsx
import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  Download,
  FileText,
  Loader2,
  Search,
  Calendar,
  HardDrive,
  ExternalLink,
  Archive,
  RefreshCw,
  Grid3X3,
  List,
  Star,
  Clock,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Download as DownloadType } from "@/types";

const Downloads: React.FC = () => {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState<DownloadType[]>([]);
  const [filteredDownloads, setFilteredDownloads] = useState<DownloadType[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchDownloads = async () => {
      if (!user) return;

      try {
        // Lấy completed orders trước
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("id")
          .eq("user_id", user.id)
          .in("status", ["completed", "processing"]);

        if (ordersError) throw ordersError;

        const completedOrderIds = ordersData?.map((order) => order.id) || [];

        if (completedOrderIds.length > 0) {
          const { data: downloadsData, error: downloadsError } = await supabase
            .from("downloads")
            .select("*")
            .eq("user_id", user.id)
            .in("order_id", completedOrderIds);

          if (downloadsError) throw downloadsError;
          setDownloads(downloadsData || []);
        }
      } catch (error) {
        console.error("Error fetching downloads:", error);
        toast({
          variant: "destructive",
          description: "Không thể tải danh sách downloads",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDownloads();
  }, [user]);

  // Filter downloads based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = downloads.filter((download) =>
        download.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredDownloads(filtered);
    } else {
      setFilteredDownloads(downloads);
    }
  }, [downloads, searchTerm]);

  const handleDownload = async (downloadId: string) => {
    try {
      const { data, error } = await supabase
        .from("downloads")
        .select("download_url")
        .eq("id", downloadId)
        .single();

      if (error || !data?.download_url) throw new Error("Không tìm thấy file");

      const url = data.download_url;
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
      link.download = url.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        description: "Bắt đầu tải file...",
        duration: 3000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Tải file thất bại",
      });
    }
  };

  const getFileIcon = (type: string) => {
    return type === "template" ? (
      <Archive className="w-8 h-8 text-blue-500" />
    ) : (
      <FileText className="w-8 h-8 text-green-500" />
    );
  };

  const getFileTypeColor = (type: string) => {
    return type === "template"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  };

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const stats = {
    total: downloads.length,
    templates: downloads.filter((d) => d.type === "template").length,
    ebooks: downloads.filter((d) => d.type === "ebook").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Download className="w-8 h-8 text-green-500 opacity-20" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
          <Package className="w-6 h-6 text-blue-500 opacity-20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
          <Archive className="text-purple-500 w-7 h-7 opacity-20" />
        </div>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-16 h-16 shadow-lg rounded-2xl bg-gradient-to-r from-green-500 to-blue-600"
              >
                <Download className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text">
              Downloads của tôi ({stats.total})
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Quản lý và tải xuống tất cả các file bạn đã mua. Truy cập mọi lúc,
              mọi nơi.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-6 md:grid-cols-3"
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tổng files
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {stats.total}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
                    <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Templates
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.templates}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
                    <Archive className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      E-books
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {stats.ebooks}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full dark:bg-purple-900">
                    <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm file..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-100 border-0 dark:bg-gray-800"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setViewMode(viewMode === "grid" ? "list" : "grid")
                      }
                      className="bg-gray-100 border-0 dark:bg-gray-800"
                    >
                      {viewMode === "grid" ? (
                        <List className="w-4 h-4 mr-2" />
                      ) : (
                        <Grid3X3 className="w-4 h-4 mr-2" />
                      )}
                      {viewMode === "grid" ? "Danh sách" : "Lưới"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-100 border-0 dark:bg-gray-800"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Làm mới
                    </Button>
                    <Button size="sm" asChild>
                      <Link to="/templates">
                        <Download className="w-4 h-4 mr-2" />
                        Mua thêm
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Downloads List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Danh sách Downloads</span>
                  <Badge
                    variant="secondary"
                    className="text-blue-800 bg-blue-100"
                  >
                    {filteredDownloads.length} files
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <span className="ml-3 text-lg">Đang tải downloads...</span>
                  </div>
                ) : filteredDownloads.length === 0 ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      <Download className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">
                      {searchTerm
                        ? "Không tìm thấy file"
                        : "Chưa có downloads nào"}
                    </h3>
                    <p className="mb-6 text-muted-foreground">
                      {searchTerm
                        ? `Không có file nào khớp với "${searchTerm}"`
                        : "Bạn chưa có file nào để tải. Hãy mua sản phẩm để có thể download!"}
                    </p>
                    {!searchTerm && (
                      <Button
                        asChild
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <Link to="/templates">
                          <Download className="w-4 h-4 mr-2" />
                          Khám phá sản phẩm
                        </Link>
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        : "space-y-4"
                    }
                  >
                    <AnimatePresence>
                      {filteredDownloads.map((download, index) => (
                        <motion.div
                          key={download.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className={
                            viewMode === "grid"
                              ? "p-6 border-0 rounded-xl shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-slate-700 dark:to-slate-800 hover:shadow-xl transition-all duration-300 group"
                              : "flex items-center justify-between p-6 border-0 rounded-xl shadow-lg bg-gradient-to-r from-white to-gray-50 dark:from-slate-700 dark:to-slate-800 hover:shadow-xl transition-all duration-300"
                          }
                        >
                          {viewMode === "grid" ? (
                            // Grid View
                            <>
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-3 transition-transform duration-300 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 group-hover:scale-110">
                                    {getFileIcon(download.type)}
                                  </div>
                                  <div>
                                    <Badge
                                      className={`text-xs ${getFileTypeColor(download.type)}`}
                                    >
                                      {download.type === "template"
                                        ? "Template"
                                        : "E-book"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-4">
                                <h4 className="mb-2 text-lg font-semibold transition-colors line-clamp-2 group-hover:text-blue-600">
                                  {download.name}
                                </h4>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {new Date(
                                        download.download_date,
                                      ).toLocaleDateString("vi-VN")}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <HardDrive className="w-4 h-4" />
                                    <span>
                                      {download.file_size || "Không xác định"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleDownload(download.id)}
                                  disabled={isLoading}
                                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Tải xuống
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-gray-100 border-0 dark:bg-gray-700"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </div>
                            </>
                          ) : (
                            // List View
                            <>
                              <div className="flex items-center space-x-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                                  {getFileIcon(download.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-lg font-semibold">
                                      {download.name}
                                    </h4>
                                    <Badge
                                      className={`text-xs ${getFileTypeColor(download.type)}`}
                                    >
                                      {download.type === "template"
                                        ? "Template"
                                        : "E-book"}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {new Date(
                                        download.download_date,
                                      ).toLocaleDateString("vi-VN")}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <HardDrive className="w-4 h-4" />
                                      {download.file_size || "Không xác định"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleDownload(download.id)}
                                  disabled={isLoading}
                                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Tải xuống
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-gray-100 border-0 dark:bg-gray-700"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Downloads;
