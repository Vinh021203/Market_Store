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
  Sparkles,
  Zap,
  TrendingUp,
  FolderOpen,
  File,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Download as DownloadType } from "@/types";

// 🎨 COLOR SCHEME - Pastel như My Orders
const colorScheme = {
  primaryGradient: "from-pink-400 via-orange-400 to-yellow-400",
  secondaryGradient: "from-pink-500 via-orange-500 to-yellow-500",
  pageBackground: "from-pink-50 via-blue-50 to-yellow-50",
  sectionBackground: "from-pink-50/80 via-blue-50/60 to-yellow-50/80",
  glassCard: "from-white/95 via-pink-50/60 to-blue-50/40",
};

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

  const getFileConfig = (type: string) => {
    const configs = {
      template: {
        icon: Archive,
        gradient: "from-blue-400 to-cyan-500",
        bgColor: "from-blue-50/90 via-cyan-50/70 to-blue-100/80",
        textColor: "text-blue-600",
        borderColor: "border-blue-200",
        label: "Template",
      },
      ebook: {
        icon: FileText,
        gradient: "from-green-400 to-emerald-500",
        bgColor: "from-green-50/90 via-emerald-50/70 to-green-100/80",
        textColor: "text-green-600",
        borderColor: "border-green-200",
        label: "E-book",
      },
    };
    return configs[type as keyof typeof configs] || configs.template;
  };

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const stats = {
    total: downloads.length,
    templates: downloads.filter((d) => d.type === "template").length,
    ebooks: downloads.filter((d) => d.type === "ebook").length,
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${colorScheme.pageBackground} flex items-center justify-center`}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-pink-500" />
          </motion.div>
          <p
            className={`text-xl font-bold bg-gradient-to-r ${colorScheme.primaryGradient} bg-clip-text text-transparent`}
          >
            Đang tải downloads...
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${colorScheme.pageBackground}`}
      style={{
        backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.04) 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.04) 0%, transparent 50%),
                 radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.03) 0%, transparent 50%)`,
      }}
    >
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[
          {
            emoji: "📥",
            position: "top-20 right-20",
            color: "from-green-100 to-emerald-200",
          },
          {
            emoji: "📦",
            position: "top-40 left-10",
            color: "from-blue-100 to-cyan-200",
          },
          {
            emoji: "📁",
            position: "bottom-20 right-10",
            color: "from-orange-100 to-yellow-200",
          },
          {
            emoji: "✨",
            position: "bottom-40 left-20",
            color: "from-purple-100 to-indigo-200",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className={`absolute ${item.position} text-4xl opacity-20`}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <div
              className={`p-3 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg`}
            >
              {item.emoji}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="container px-4 py-8 mx-auto relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1
                className={`flex items-center gap-3 text-4xl font-bold bg-gradient-to-r ${colorScheme.primaryGradient} bg-clip-text text-transparent`}
              >
                <div
                  className={`p-2 rounded-xl bg-gradient-to-r ${colorScheme.primaryGradient} shadow-lg`}
                >
                  <Download className="w-8 h-8 text-white" />
                </div>
                Downloads của tôi
              </h1>
              <p className="mt-2 text-slate-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Quản lý và tải xuống tất cả các file bạn đã mua
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-pink-200 hover:bg-pink-50 hover:border-pink-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
              <Button
                size="sm"
                asChild
                className={`bg-gradient-to-r ${colorScheme.primaryGradient} hover:${colorScheme.secondaryGradient} text-white shadow-lg`}
              >
                <Link to="/templates">
                  <Download className="w-4 h-4 mr-2" />
                  Mua thêm
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-4 md:grid-cols-3"
          >
            {[
              {
                title: "Tổng files",
                value: stats.total,
                subtitle: "Files sẵn sàng tải",
                icon: Download,
                gradient: colorScheme.primaryGradient,
                bgColor: "from-pink-50/90 via-orange-50/70 to-yellow-100/80",
                trend: "+100%",
              },
              {
                title: "Templates",
                value: stats.templates,
                subtitle: "Website templates",
                icon: Archive,
                gradient: "from-blue-400 to-cyan-500",
                bgColor: "from-blue-50/90 via-cyan-50/70 to-blue-100/80",
                trend: "+20%",
              },
              {
                title: "E-books",
                value: stats.ebooks,
                subtitle: "Digital books",
                icon: FileText,
                gradient: "from-green-400 to-emerald-500",
                bgColor: "from-green-50/90 via-emerald-50/70 to-green-100/80",
                trend: "+15%",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card
                  className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br ${stat.bgColor} backdrop-blur-lg rounded-2xl transition-all duration-300 group`}
                >
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
                  />
                  <CardContent className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                        className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-semibold">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.trend}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">
                        {stat.title}
                      </p>
                      <p
                        className={`text-3xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                      >
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {stat.subtitle}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              className={`border-0 shadow-xl bg-gradient-to-br ${colorScheme.glassCard} backdrop-blur-lg rounded-2xl`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                    <Input
                      placeholder="Tìm kiếm file..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-pink-200 focus:border-pink-300 focus:ring-pink-300"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setViewMode(viewMode === "grid" ? "list" : "grid")
                      }
                      className="border-pink-200 hover:bg-pink-50"
                    >
                      {viewMode === "grid" ? (
                        <List className="w-4 h-4 mr-2" />
                      ) : (
                        <Grid3X3 className="w-4 h-4 mr-2" />
                      )}
                      {viewMode === "grid" ? "Danh sách" : "Lưới"}
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
            transition={{ delay: 0.4 }}
          >
            <Card
              className={`border-0 shadow-xl bg-gradient-to-br ${colorScheme.glassCard} backdrop-blur-lg rounded-2xl`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span
                    className={`bg-gradient-to-r from-pink-600 via-blue-600 to-orange-600 bg-clip-text text-transparent font-bold`}
                  >
                    Danh sách Downloads
                  </span>
                  <Badge className="bg-pink-100 text-pink-700 border-pink-200">
                    {filteredDownloads.length} files
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredDownloads.length === 0 ? (
                  <div className="py-12 text-center">
                    <div
                      className={`inline-flex p-6 rounded-full bg-gradient-to-r ${colorScheme.primaryGradient} opacity-20 mb-4`}
                    >
                      <Download className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-slate-800">
                      {searchTerm
                        ? "Không tìm thấy file"
                        : "Chưa có downloads nào"}
                    </h3>
                    <p className="mb-6 text-slate-600">
                      {searchTerm
                        ? `Không có file nào khớp với "${searchTerm}"`
                        : "Bạn chưa có file nào để tải. Hãy mua sản phẩm để có thể download!"}
                    </p>
                    {!searchTerm && (
                      <Button
                        asChild
                        className={`bg-gradient-to-r ${colorScheme.primaryGradient} hover:${colorScheme.secondaryGradient} text-white shadow-lg`}
                      >
                        <Link to="/templates">
                          <Download className="w-4 h-4 mr-2" />
                          Khám phá sản phẩm
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        : "space-y-4"
                    }
                  >
                    <AnimatePresence>
                      {filteredDownloads.map((download, index) => {
                        const fileConfig = getFileConfig(download.type);
                        return (
                          <motion.div
                            key={download.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={
                              viewMode === "grid"
                                ? `p-6 border-0 rounded-2xl shadow-lg hover:shadow-xl bg-gradient-to-br ${fileConfig.bgColor} backdrop-blur-sm transition-all duration-300 group`
                                : `flex items-center justify-between p-6 border-0 rounded-2xl shadow-lg hover:shadow-xl bg-gradient-to-br ${fileConfig.bgColor} backdrop-blur-sm transition-all duration-300`
                            }
                          >
                            {viewMode === "grid" ? (
                              <>
                                <div className="flex items-start justify-between mb-4">
                                  <motion.div
                                    whileHover={{ rotate: 360, scale: 1.2 }}
                                    transition={{ duration: 0.6 }}
                                    className={`p-3 rounded-xl bg-gradient-to-r ${fileConfig.gradient} shadow-lg`}
                                  >
                                    <fileConfig.icon className="w-6 h-6 text-white" />
                                  </motion.div>
                                  <Badge
                                    className={`${fileConfig.bgColor} ${fileConfig.textColor} ${fileConfig.borderColor} border shadow-sm`}
                                  >
                                    {fileConfig.label}
                                  </Badge>
                                </div>

                                <div className="mb-4">
                                  <h4 className="mb-2 text-lg font-bold text-slate-800 line-clamp-2">
                                    {download.name}
                                  </h4>
                                  <div className="space-y-2 text-sm text-slate-600">
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
                                    className={`flex-1 bg-gradient-to-r ${colorScheme.primaryGradient} hover:${colorScheme.secondaryGradient} text-white shadow-lg`}
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Tải xuống
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-pink-200 hover:bg-pink-50"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center space-x-4">
                                  <motion.div
                                    whileHover={{ rotate: 360, scale: 1.2 }}
                                    transition={{ duration: 0.6 }}
                                    className={`p-3 rounded-xl bg-gradient-to-r ${fileConfig.gradient} shadow-lg`}
                                  >
                                    <fileConfig.icon className="w-6 h-6 text-white" />
                                  </motion.div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                      <h4 className="text-lg font-bold text-slate-800">
                                        {download.name}
                                      </h4>
                                      <Badge
                                        className={`${fileConfig.bgColor} ${fileConfig.textColor} ${fileConfig.borderColor} border shadow-sm text-xs`}
                                      >
                                        {fileConfig.label}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-600">
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
                                    className={`bg-gradient-to-r ${colorScheme.primaryGradient} hover:${colorScheme.secondaryGradient} text-white shadow-lg`}
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Tải xuống
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-pink-200 hover:bg-pink-50"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </div>
                              </>
                            )}
                          </motion.div>
                        );
                      })}
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
