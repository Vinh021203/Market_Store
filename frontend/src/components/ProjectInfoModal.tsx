import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, GraduationCap, Users, Award, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LS_KEY = "project-info-viewed";

const ProjectInfoModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const hasViewed = localStorage.getItem(LS_KEY);
    if (!hasViewed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(LS_KEY, "true");
    setIsOpen(false);
  };

  const projectInfo = {
    students: [
      {
        name: "Lương Thế Vinh",
        topic:
          "Phát triển hệ thống xử lý và quản trị dữ liệu thông minh cho nền tảng thương mại điện tử quản trị nội dung số",
      },
      {
        name: "Nguyễn Minh Phương",
        topic:
          "Thiết kế và phát triển giao diện người dùng thông minh cho nền tảng thương mại điện tử quản trị nội dung số",
      },
    ],
    advisor: "An Hồng Sơn",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal - COMPACT & SCROLLABLE */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="pointer-events-auto w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <Card className="border-0 shadow-2xl overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-orange-100 to-yellow-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-200/30 via-transparent to-transparent" />

                {/* Decorative elements */}
                <div className="absolute top-3 right-3 w-16 h-16 bg-pink-300/40 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-3 left-3 w-12 h-12 bg-orange-300/40 rounded-full blur-lg animate-pulse" />

                <CardContent className="relative z-10 p-6">
                  {/* Close Button */}
                  <Button
                    onClick={handleClose}
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white border-2 border-pink-200 text-pink-700 z-10"
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  {/* Header - COMPACT */}
                  <div className="text-center mb-5">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-pink-200 to-orange-300 mb-3 shadow-lg border-3 border-white/50"
                    >
                      <GraduationCap
                        className="w-7 h-7 text-pink-700"
                        strokeWidth={2}
                      />
                    </motion.div>

                    <Badge className="mb-2 bg-gradient-to-r from-pink-200 to-orange-200 text-pink-800 border-0 px-3 py-0.5 text-xs font-bold">
                      🎓 Đồ Án Tốt Nghiệp
                    </Badge>

                    <h2 className="text-base font-bold text-transparent bg-gradient-to-r from-pink-700 via-orange-700 to-yellow-700 bg-clip-text leading-tight px-2">
                      Nền tảng Thương mại Điện tử Thông minh
                    </h2>
                  </div>

                  {/* Content - WITH TOPICS */}
                  <div className="space-y-4">
                    {/* Students with Topics */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-gradient-to-br from-blue-200 to-cyan-300 rounded-lg shadow-md">
                          <Users className="w-4 h-4 text-blue-700" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">
                          Sinh viên thực hiện
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {projectInfo.students.map((student, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-3 border-2 border-blue-200 shadow-sm"
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-200 to-cyan-300 flex items-center justify-center font-bold text-blue-700 text-xs border-2 border-white shadow-md flex-shrink-0">
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm text-slate-800">
                                  {student.name}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 pl-1">
                              <BookOpen className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                {student.topic}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Advisor */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-gradient-to-br from-purple-200 to-pink-300 rounded-lg shadow-md">
                          <Award className="w-4 h-4 text-purple-700" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">
                          Giảng viên hướng dẫn
                        </h3>
                      </div>

                      <div className="bg-white rounded-lg p-3 border-2 border-purple-200 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-200 to-pink-300 flex items-center justify-center font-bold text-purple-700 text-sm border-2 border-white shadow-md">
                            {projectInfo.advisor
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-800">
                              {projectInfo.advisor}
                            </div>
                            <div className="text-xs text-slate-600 font-medium">
                              Giảng viên hướng dẫn
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 pt-4 border-t-2 border-pink-200 text-center">
                    <p className="text-xs font-bold text-transparent bg-gradient-to-r from-pink-700 to-orange-700 bg-clip-text">
                      🎓 Đại học Công nghiệp Việt - Hưng
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5 font-medium">
                      Năm học 2024 - 2025
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 flex justify-center">
                    <Button
                      onClick={handleClose}
                      className="px-6 py-2 text-sm rounded-xl bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 hover:from-pink-600 hover:via-orange-600 hover:to-yellow-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                      Khám phá ngay 🚀
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectInfoModal;
