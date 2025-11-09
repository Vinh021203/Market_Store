import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Image,
  Code,
  Quote,
  List,
  Hash,
  Bold,
  Italic,
  Link,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  Settings,
  Palette,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
  Download,
  Upload,
  Zap,
  Sparkles,
  Coffee,
  Heart,
  Star,
  Target,
  TrendingUp,
  BarChart3,
  Users,
  Globe,
  Calendar,
  Clock,
  Tag,
  Layers,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  theme?: "light" | "dark";
  showPreview?: boolean;
  showWordCount?: boolean;
  showTemplates?: boolean;
  mode?: "blog" | "product" | "full";
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  placeholder = "Bắt đầu viết nội dung tuyệt vời...",
  height = 500,
  theme = "light",
  showPreview = true,
  showWordCount = true,
  showTemplates = true,
  mode = "full",
}) => {
  const editorRef = useRef<any>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);

  // Tính toán thống kê content
  useEffect(() => {
    const text = value.replace(/<[^>]*>/g, "").trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;
    const avgReadingSpeed = 200; // words per minute
    const estimatedReadingTime = Math.ceil(words / avgReadingSpeed);

    setWordCount(words);
    setCharCount(chars);
    setReadingTime(estimatedReadingTime);
  }, [value]);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  // Template library nâng cao
  const templates = {
    // Blog Templates
    blog_intro: {
      name: "Blog Intro",
      icon: "📝",
      category: "Blog",
      content: `
        <h1>🚀 Tiêu đề bài viết hấp dẫn</h1>
        <p class="lead"><strong>Tóm tắt:</strong> Mô tả ngắn gọn về nội dung chính của bài viết, giúp người đọc hiểu được giá trị mà họ sẽ nhận được.</p>
        
        <blockquote>
          <p>💡 <em>Trích dẫn hoặc insight quan trọng để thu hút người đọc</em></p>
        </blockquote>
        
        <h2>📋 Nội dung chính</h2>
        <p>Bắt đầu phát triển ý tưởng chính của bài viết tại đây...</p>
        
        <h3>🎯 Điểm nổi bật</h3>
        <ul>
          <li>✅ Lợi ích thứ nhất</li>
          <li>✅ Lợi ích thứ hai</li>
          <li>✅ Lợi ích thứ ba</li>
        </ul>
      `,
    },

    blog_tutorial: {
      name: "Tutorial Guide",
      icon: "🎓",
      category: "Blog",
      content: `
        <h1>📚 Hướng dẫn: [Tên Tutorial]</h1>
        <p class="lead">Hướng dẫn từng bước chi tiết để hoàn thành [mục tiêu cụ thể].</p>
        
        <h2>🎯 Mục tiêu</h2>
        <p>Sau khi hoàn thành hướng dẫn này, bạn sẽ có thể:</p>
        <ul>
          <li>Kỹ năng 1</li>
          <li>Kỹ năng 2</li>
          <li>Kỹ năng 3</li>
        </ul>
        
        <h2>🛠️ Công cụ cần thiết</h2>
        <ul>
          <li>Công cụ 1</li>
          <li>Công cụ 2</li>
          <li>Công cụ 3</li>
        </ul>
        
        <h2>📖 Bước 1: Chuẩn bị</h2>
        <p>Mô tả chi tiết bước đầu tiên...</p>
        
        <h2>📖 Bước 2: Thực hiện</h2>
        <p>Hướng dẫn thực hiện...</p>
        
        <h2>✅ Kết luận</h2>
        <p>Tóm tắt những gì đã học được...</p>
      `,
    },

    // Product Templates
    product_description: {
      name: "Product Description",
      icon: "📦",
      category: "Product",
      content: `
        <h2>🌟 Giới thiệu sản phẩm</h2>
        <p class="lead">Mô tả ngắn gọn về sản phẩm và giá trị cốt lõi mà nó mang lại.</p>
        
        <h3>✨ Tính năng nổi bật</h3>
        <ul>
          <li>🚀 <strong>Tính năng 1:</strong> Mô tả chi tiết</li>
          <li>💎 <strong>Tính năng 2:</strong> Mô tả chi tiết</li>
          <li>⚡ <strong>Tính năng 3:</strong> Mô tả chi tiết</li>
          <li>🎯 <strong>Tính năng 4:</strong> Mô tả chi tiết</li>
        </ul>
        
        <h3>📊 Thông số kỹ thuật</h3>
        <table>
          <tr><th>Thông số</th><th>Giá trị</th></tr>
          <tr><td>Kích thước</td><td>Nhập thông số</td></tr>
          <tr><td>Định dạng</td><td>Nhập định dạng</td></tr>
          <tr><td>Tương thích</td><td>Nhập tương thích</td></tr>
        </table>
        
        <h3>🎯 Phù hợp với ai?</h3>
        <ul>
          <li>👨‍💻 Nhóm đối tượng 1</li>
          <li>🎨 Nhóm đối tượng 2</li>
          <li>📱 Nhóm đối tượng 3</li>
        </ul>
        
        <blockquote>
          <p>💡 <strong>Lưu ý:</strong> Thông tin quan trọng mà khách hàng cần biết trước khi mua.</p>
        </blockquote>
      `,
    },

    product_features: {
      name: "Features List",
      icon: "⚡",
      category: "Product",
      content: `
        <h2>🚀 Tính năng vượt trội</h2>
        
        <h3>🎨 Thiết kế & Giao diện</h3>
        <ul>
          <li>✅ Responsive design - Tương thích mọi thiết bị</li>
          <li>✅ Modern UI/UX - Giao diện hiện đại, thân thiện</li>
          <li>✅ Customizable - Dễ dàng tùy chỉnh theo nhu cầu</li>
          <li>✅ Cross-browser - Hoạt động trên mọi trình duyệt</li>
        </ul>
        
        <h3>⚡ Hiệu suất & Tối ưu</h3>
        <ul>
          <li>🚀 Fast loading - Tải trang nhanh chóng</li>
          <li>🚀 SEO optimized - Tối ưu cho công cụ tìm kiếm</li>
          <li>🚀 Lightweight code - Code gọn nhẹ, hiệu quả</li>
          <li>🚀 Performance focused - Tập trung vào hiệu suất</li>
        </ul>
        
        <h3>🛠️ Kỹ thuật & Công nghệ</h3>
        <ul>
          <li>💻 Latest technology stack</li>
          <li>💻 Clean, documented code</li>
          <li>💻 Regular updates & support</li>
          <li>💻 Best practices implementation</li>
        </ul>
      `,
    },

    // Content Templates
    news_article: {
      name: "News Article",
      icon: "📰",
      category: "News",
      content: `
        <h1>📰 [Tiêu đề tin tức]</h1>
        <p><em>📅 Ngày: ${new Date().toLocaleDateString("vi-VN")} | ⏰ ${new Date().toLocaleTimeString("vi-VN")}</em></p>
        
        <p class="lead"><strong>Tóm tắt:</strong> Tóm tắt ngắn gọn về sự kiện/tin tức quan trọng.</p>
        
        <h2>📋 Chi tiết sự kiện</h2>
        <p>Mô tả chi tiết về sự kiện, bao gồm:</p>
        <ul>
          <li>🕐 Thời gian diễn ra</li>
          <li>📍 Địa điểm</li>
          <li>👥 Nhân vật liên quan</li>
          <li>💡 Ý nghĩa và tác động</li>
        </ul>
        
        <blockquote>
          <p>"Trích dẫn quan trọng từ nguồn tin đáng tin cậy"</p>
        </blockquote>
        
        <h2>📊 Phân tích & Đánh giá</h2>
        <p>Phân tích sâu về tác động và ý nghĩa của sự kiện...</p>
        
        <h2>🔮 Triển vọng</h2>
        <p>Dự báo về những diễn biến tiếp theo...</p>
      `,
    },

    faq_section: {
      name: "FAQ Section",
      icon: "❓",
      category: "Support",
      content: `
        <h2>❓ Câu hỏi thường gặp (FAQ)</h2>
        
        <h3>🔍 Câu hỏi 1: [Câu hỏi phổ biến nhất]</h3>
        <p><strong>Trả lời:</strong> Câu trả lời chi tiết và dễ hiểu...</p>
        
        <h3>🔍 Câu hỏi 2: [Câu hỏi về tính năng]</h3>
        <p><strong>Trả lời:</strong> Giải thích cụ thể về tính năng...</p>
        
        <h3>🔍 Câu hỏi 3: [Câu hỏi về giá cả]</h3>
        <p><strong>Trả lời:</strong> Thông tin về giá cả và ưu đãi...</p>
        
        <h3>🔍 Câu hỏi 4: [Câu hỏi về hỗ trợ]</h3>
        <p><strong>Trả lời:</strong> Thông tin về dịch vụ hỗ trợ...</p>
        
        <blockquote>
          <p>💬 <strong>Vẫn có thắc mắc?</strong> Liên hệ với chúng tôi qua [thông tin liên hệ] để được hỗ trợ trực tiếp.</p>
        </blockquote>
      `,
    },

    comparison_table: {
      name: "Comparison Table",
      icon: "📊",
      category: "Analysis",
      content: `
        <h2>📊 Bảng so sánh</h2>
        <p>So sánh chi tiết giữa các phiên bản/sản phẩm:</p>
        
        <table>
          <thead>
            <tr>
              <th>Tính năng</th>
              <th>⚡ Basic</th>
              <th>🚀 Pro</th>
              <th>💎 Premium</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Tính năng 1</strong></td>
              <td>✅ Có</td>
              <td>✅ Có</td>
              <td>✅ Có</td>
            </tr>
            <tr>
              <td><strong>Tính năng 2</strong></td>
              <td>❌ Không</td>
              <td>✅ Có</td>
              <td>✅ Có</td>
            </tr>
            <tr>
              <td><strong>Tính năng 3</strong></td>
              <td>❌ Không</td>
              <td>❌ Không</td>
              <td>✅ Có</td>
            </tr>
            <tr>
              <td><strong>Hỗ trợ</strong></td>
              <td>📧 Email</td>
              <td>📧📞 Email + Phone</td>
              <td>📧📞💬 24/7 Support</td>
            </tr>
            <tr>
              <td><strong>Giá</strong></td>
              <td>$29</td>
              <td>$79</td>
              <td>$149</td>
            </tr>
          </tbody>
        </table>
        
        <h3>🎯 Khuyến nghị</h3>
        <ul>
          <li>💼 <strong>Basic:</strong> Phù hợp cho người mới bắt đầu</li>
          <li>🚀 <strong>Pro:</strong> Lý tưởng cho doanh nghiệp nhỏ</li>
          <li>💎 <strong>Premium:</strong> Tốt nhất cho doanh nghiệp lớn</li>
        </ul>
      `,
    },
  };

  // Insert template
  const insertTemplate = (templateKey: string) => {
    const template = templates[templateKey];
    if (template && editorRef.current) {
      editorRef.current.setContent(template.content);
      setSelectedTemplate("");
    }
  };

  // Filter templates by mode
  const getFilteredTemplates = () => {
    switch (mode) {
      case "blog":
        return Object.entries(templates).filter(
          ([_, template]) =>
            template.category === "Blog" || template.category === "News",
        );
      case "product":
        return Object.entries(templates).filter(
          ([_, template]) =>
            template.category === "Product" || template.category === "Analysis",
        );
      default:
        return Object.entries(templates);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (editorRef.current) {
      editorRef.current.execCommand("mceFullScreen");
    }
  };

  return (
    <TooltipProvider>
      <div
        className={`w-full transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-50 bg-white" : ""}`}
      >
        {/* Enhanced Header Controls */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 border bg-gradient-to-r from-orange-50 via-amber-50 to-pink-50 border-orange-200/50 rounded-t-2xl"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center w-10 h-10 shadow-md rounded-xl bg-gradient-to-r from-orange-500 to-amber-500"
              >
                <FileText className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-orange-800">
                  Content Editor
                </h3>
                <p className="text-xs text-orange-600/70">
                  Professional Writing Tool
                </p>
              </div>
            </div>

            {/* Template Selector */}
            {showTemplates && (
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium text-orange-700">
                  Templates:
                </Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                >
                  <SelectTrigger className="w-48 h-8 text-xs border-orange-200 bg-white/80">
                    <SelectValue placeholder="Chọn template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getFilteredTemplates().map(([key, template]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center space-x-2">
                          <span>{template.icon}</span>
                          <span>{template.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <Button
                    size="sm"
                    onClick={() => insertTemplate(selectedTemplate)}
                    className="h-8 px-3 text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Insert
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            {showPreview && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="h-8 px-3 border-orange-200 bg-white/80"
                  >
                    {isPreviewMode ? (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Editor
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle between Editor and Preview mode</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Fullscreen Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="h-8 px-3 border-orange-200 bg-white/80"
                >
                  {isFullscreen ? (
                    <Minimize className="w-3 h-3" />
                  ) : (
                    <Maximize className="w-3 h-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle fullscreen mode</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.div>

        {/* Quick Template Buttons */}
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 p-3 bg-gradient-to-r from-white/90 to-orange-50/90 border-x border-orange-200/50"
          >
            <span className="flex items-center mr-2 text-xs font-medium text-orange-700">
              <Sparkles className="w-3 h-3 mr-1" />
              Quick Templates:
            </span>
            {getFilteredTemplates()
              .slice(0, 6)
              .map(([key, template]) => (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => insertTemplate(key)}
                      className="px-2 text-xs h-7 border-orange-200/50 hover:bg-orange-100 hover:border-orange-300"
                    >
                      <span className="mr-1">{template.icon}</span>
                      {template.name}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {template.category} - {template.name}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
          </motion.div>
        )}

        {/* Editor Content */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {isPreviewMode ? (
              // Preview Mode
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="min-h-[400px] p-8 bg-white border-x border-orange-200/50 prose prose-orange max-w-none"
                style={{ height: height }}
              >
                <div
                  className="content-preview"
                  dangerouslySetInnerHTML={{
                    __html:
                      value ||
                      '<p class="text-gray-400 italic">Không có nội dung để xem trước...</p>',
                  }}
                />
              </motion.div>
            ) : (
              // Editor Mode
              <motion.div
                key="editor"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="border-x border-orange-200/50"
              >
                <Editor
                  apiKey="o3xpjcpccpwxuf67dwel0pj9fs9oue0a9dnkaegc35gqcg52"
                  onInit={(evt, editor) => {
                    editorRef.current = editor;
                    setIsLoading(false);
                  }}
                  value={value}
                  onEditorChange={handleEditorChange}
                  init={{
                    height: height,
                    menubar: true,
                    skin: theme === "dark" ? "oxide-dark" : "oxide",
                    content_css: theme === "dark" ? "dark" : "default",

                    // Enhanced Plugins
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "help",
                      "wordcount",
                      "emoticons",
                      "codesample",
                      "pagebreak",
                      "nonbreaking",
                      "template",
                      "directionality",
                      "visualchars",
                      "quickbars",
                      "importcss",
                    ],

                    // Enhanced Toolbar
                    toolbar: [
                      "undo redo | formatselect styleselect fontselect fontsizeselect",
                      "bold italic underline strikethrough | forecolor backcolor | align lineheight",
                      "bullist numlist outdent indent | blockquote codesample | link image media table",
                      "insertdatetime emoticons charmap pagebreak | removeformat | fullscreen code help",
                    ].join(" | "),

                    toolbar_mode: "sliding",
                    toolbar_sticky: true,

                    // Enhanced Menu
                    menu: {
                      file: {
                        title: "File",
                        items:
                          "newdocument restoredraft | preview | export print | deleteallconversations",
                      },
                      edit: {
                        title: "Edit",
                        items:
                          "undo redo | cut copy paste | selectall | searchreplace",
                      },
                      view: {
                        title: "View",
                        items:
                          "code | visualaid visualchars visualblocks | spellchecker | preview fullscreen",
                      },
                      insert: {
                        title: "Insert",
                        items:
                          "image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor | insertdatetime",
                      },
                      format: {
                        title: "Format",
                        items:
                          "bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | removeformat",
                      },
                      tools: {
                        title: "Tools",
                        items:
                          "spellchecker spellcheckerlanguage | code wordcount",
                      },
                      table: {
                        title: "Table",
                        items:
                          "inserttable | cell row column | tableprops deletetable",
                      },
                      help: { title: "Help", items: "help" },
                    },

                    // Style Formats
                    style_formats: [
                      {
                        title: "Headings",
                        items: [
                          {
                            title: "Hero Title",
                            block: "h1",
                            classes: "hero-title",
                          },
                          {
                            title: "Section Title",
                            block: "h2",
                            classes: "section-title",
                          },
                          {
                            title: "Subsection",
                            block: "h3",
                            classes: "subsection",
                          },
                          {
                            title: "Minor Heading",
                            block: "h4",
                            classes: "minor-heading",
                          },
                        ],
                      },
                      {
                        title: "Text Styles",
                        items: [
                          {
                            title: "Lead Paragraph",
                            block: "p",
                            classes: "lead",
                          },
                          { title: "Small Text", inline: "small" },
                          {
                            title: "Highlight",
                            inline: "mark",
                            classes: "highlight",
                          },
                          { title: "Code", inline: "code" },
                          {
                            title: "Success Text",
                            inline: "span",
                            classes: "text-success",
                          },
                          {
                            title: "Warning Text",
                            inline: "span",
                            classes: "text-warning",
                          },
                          {
                            title: "Error Text",
                            inline: "span",
                            classes: "text-danger",
                          },
                        ],
                      },
                      {
                        title: "Containers",
                        items: [
                          {
                            title: "Call-to-Action Box",
                            block: "div",
                            classes: "cta-box",
                            wrapper: true,
                          },
                          {
                            title: "Info Box",
                            block: "div",
                            classes: "info-box",
                            wrapper: true,
                          },
                          {
                            title: "Warning Box",
                            block: "div",
                            classes: "warning-box",
                            wrapper: true,
                          },
                          {
                            title: "Feature Box",
                            block: "div",
                            classes: "feature-box",
                            wrapper: true,
                          },
                        ],
                      },
                    ],

                    // Block Formats
                    block_formats:
                      "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre; Blockquote=blockquote; Div=div",

                    // Font Options
                    font_family_formats: [
                      "Inter=inter,sans-serif",
                      "Roboto=roboto,sans-serif",
                      "Open Sans=open sans,sans-serif",
                      "Lato=lato,sans-serif",
                      "Montserrat=montserrat,sans-serif",
                      "Poppins=poppins,sans-serif",
                      "Arial=arial,helvetica,sans-serif",
                      "Times New Roman=times new roman,times,serif",
                      "Courier New=courier new,courier,monospace",
                      "Georgia=georgia,serif",
                    ].join(";"),

                    font_size_formats:
                      "8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 28pt 32pt 36pt 48pt 60pt 72pt 96pt",

                    // Advanced Options
                    browser_spellcheck: true,
                    paste_as_text: false,
                    paste_webkit_styles: "color font-size font-family",
                    paste_retain_style_properties:
                      "color font-size font-family",

                    // Image Options
                    image_advtab: true,
                    image_caption: true,
                    image_list: [
                      {
                        title: "Sample Image 1",
                        value: "https://via.placeholder.com/600x400",
                      },
                      {
                        title: "Sample Image 2",
                        value: "https://via.placeholder.com/800x600",
                      },
                    ],

                    // Table Options
                    table_default_attributes: {
                      border: "1",
                      cellpadding: "10",
                      cellspacing: "0",
                    },
                    table_default_styles: {
                      width: "100%",
                      "border-collapse": "collapse",
                    },

                    // Content Style - Enhanced
                    content_style: `
                      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                      
                      body { 
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                        font-size: 16px; 
                        line-height: 1.7;
                        color: ${theme === "dark" ? "#e5e7eb" : "#374151"};
                        background-color: ${theme === "dark" ? "#1f2937" : "#ffffff"};
                        padding: 3rem;
                        max-width: none;
                        margin: 0;
                      }
                      
                      /* Typography Hierarchy */
                      h1, h2, h3, h4, h5, h6 { 
                        font-weight: 700; 
                        margin-top: 2.5rem; 
                        margin-bottom: 1.25rem; 
                        color: ${theme === "dark" ? "#f9fafb" : "#111827"};
                        line-height: 1.25;
                      }
                      
                      h1.hero-title { 
                        font-size: 3rem; 
                        background: linear-gradient(135deg, #f59e0b, #f97316, #ec4899);
                        background-clip: text;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 2rem;
                        text-align: center;
                      }
                      
                      h2.section-title { 
                        font-size: 2.25rem; 
                        border-bottom: 3px solid #f59e0b; 
                        padding-bottom: 0.75rem;
                        margin-bottom: 2rem;
                        position: relative;
                      }
                      
                      h2.section-title::before {
                        content: '';
                        position: absolute;
                        bottom: -3px;
                        left: 0;
                        width: 60px;
                        height: 3px;
                        background: linear-gradient(90deg, #f59e0b, #ec4899);
                        border-radius: 2px;
                      }
                      
                      h3.subsection { 
                        font-size: 1.875rem; 
                        color: #f59e0b;
                        margin-top: 2rem;
                        position: relative;
                        padding-left: 1rem;
                      }
                      
                      h3.subsection::before {
                        content: '▶';
                        position: absolute;
                        left: 0;
                        color: #ec4899;
                      }
                      
                      h1 { font-size: 2.5rem; }
                      h2 { font-size: 2rem; }
                      h3 { font-size: 1.75rem; }
                      h4 { font-size: 1.5rem; }
                      h5 { font-size: 1.25rem; }
                      h6 { font-size: 1.125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
                      
                      /* Paragraph Styles */
                      p { 
                        margin-bottom: 1.5rem; 
                        text-align: justify;
                        hyphens: auto;
                      }
                      
                      p.lead {
                        font-size: 1.375rem;
                        font-weight: 300;
                        color: #6b7280;
                        margin-bottom: 2.5rem;
                        line-height: 1.6;
                        font-style: italic;
                        text-align: center;
                        padding: 1.5rem;
                        background: linear-gradient(135deg, #fef3c7, #fed7aa);
                        border-radius: 1rem;
                        border: 1px solid #f59e0b;
                      }
                      
                      /* Text Utilities */
                      .text-success { color: #059669; font-weight: 600; }
                      .text-warning { color: #d97706; font-weight: 600; }
                      .text-danger { color: #dc2626; font-weight: 600; }
                      .highlight { background: linear-gradient(135deg, #fef08a, #fcd34d); padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-weight: 500; }
                      
                      /* Special Containers */
                      .cta-box {
                        background: linear-gradient(135deg, #f59e0b, #ec4899);
                        color: white;
                        padding: 2rem;
                        border-radius: 1rem;
                        text-align: center;
                        margin: 2rem 0;
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                      }
                      
                      .info-box {
                        background: linear-gradient(135deg, #dbeafe, #bfdbfe);
                        border-left: 5px solid #3b82f6;
                        padding: 1.5rem;
                        border-radius: 0.5rem;
                        margin: 1.5rem 0;
                      }
                      
                      .warning-box {
                        background: linear-gradient(135deg, #fef3c7, #fde68a);
                        border-left: 5px solid #f59e0b;
                        padding: 1.5rem;
                        border-radius: 0.5rem;
                        margin: 1.5rem 0;
                      }
                      
                      .feature-box {
                        background: linear-gradient(135deg, #d1fae5, #a7f3d0);
                        border: 2px solid #10b981;
                        padding: 1.5rem;
                        border-radius: 1rem;
                        margin: 1.5rem 0;
                        position: relative;
                      }
                      
                      .feature-box::before {
                        content: '✨';
                        position: absolute;
                        top: -10px;
                        right: 20px;
                        background: white;
                        padding: 5px 10px;
                        border-radius: 20px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                      }
                      
                      /* Lists */
                      ul, ol {
                        padding-left: 2rem;
                        margin-bottom: 1.5rem;
                      }
                      
                      li {
                        margin-bottom: 0.75rem;
                        line-height: 1.6;
                        position: relative;
                      }
                      
                      ul li::marker {
                        content: '✅ ';
                      }
                      
                      ol li {
                        counter-increment: step-counter;
                      }
                      
                      ol li::marker {
                        content: counter(step-counter) '. ';
                        color: #f59e0b;
                        font-weight: bold;
                      }
                      
                      /* Enhanced Blockquotes */
                      blockquote {
                        border-left: 5px solid #f59e0b;
                        margin: 2.5rem 0;
                        padding: 2rem;
                        font-style: italic;
                        background: linear-gradient(135deg, #fef3c7, #fed7aa);
                        border-radius: 0 1rem 1rem 0;
                        position: relative;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                        font-size: 1.125rem;
                      }
                      
                      blockquote::before {
                        content: '"';
                        font-size: 4rem;
                        color: #f59e0b;
                        position: absolute;
                        top: -0.5rem;
                        left: 1.5rem;
                        line-height: 1;
                        font-family: serif;
                      }
                      
                      blockquote p {
                        margin-bottom: 0;
                        position: relative;
                        z-index: 1;
                      }
                      
                      /* Code Styling */
                      code {
                        background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
                        padding: 0.375rem 0.75rem;
                        border-radius: 0.5rem;
                        font-family: 'JetBrains Mono', 'Fira Code', monospace;
                        font-size: 0.875em;
                        border: 1px solid #cbd5e1;
                        color: #dc2626;
                        font-weight: 500;
                      }
                      
                      pre {
                        background: linear-gradient(135deg, #1e293b, #334155);
                        padding: 2rem;
                        border-radius: 1rem;
                        overflow-x: auto;
                        border: 1px solid #475569;
                        box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.3);
                        font-family: 'JetBrains Mono', 'Fira Code', monospace;
                        color: #e2e8f0;
                        font-size: 0.875rem;
                        line-height: 1.7;
                        margin: 2rem 0;
                      }
                      
                      pre code {
                        background: none;
                        border: none;
                        padding: 0;
                        color: inherit;
                      }
                      
                      /* Tables */
                      table {
                        border-collapse: collapse;
                        width: 100%;
                        margin: 2rem 0;
                        border-radius: 1rem;
                        overflow: hidden;
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                      }
                      
                      table td, table th {
                        border: 1px solid #e5e7eb;
                        padding: 1.25rem;
                        text-align: left;
                      }
                      
                      table th {
                        background: linear-gradient(135deg, #f59e0b, #ec4899);
                        color: white;
                        font-weight: 700;
                        text-transform: uppercase;
                        font-size: 0.875rem;
                        letter-spacing: 0.05em;
                      }
                      
                      table tbody tr:nth-child(even) {
                        background: linear-gradient(135deg, #fef3c7, #fed7aa);
                      }
                      
                      table tbody tr:hover {
                        background: linear-gradient(135deg, #fde68a, #fcd34d);
                        transform: scale(1.01);
                        transition: all 0.2s ease;
                      }
                      
                      /* Images */
                      img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 1rem;
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                        transition: transform 0.3s ease;
                        margin: 2rem 0;
                      }
                      
                      img:hover {
                        transform: scale(1.02);
                      }
                      
                      /* Links */
                      a { 
                        color: #f59e0b; 
                        text-decoration: none; 
                        border-bottom: 2px solid transparent;
                        transition: all 0.2s ease;
                        font-weight: 500;
                      }
                      
                      a:hover { 
                        color: #d97706; 
                        border-bottom-color: #d97706;
                        background: linear-gradient(135deg, #fef3c7, transparent);
                        padding: 0 0.25rem;
                        border-radius: 0.25rem;
                      }
                      
                      /* HR */
                      hr {
                        border: none;
                        height: 3px;
                        background: linear-gradient(to right, transparent, #f59e0b, #ec4899, transparent);
                        margin: 3rem 0;
                        border-radius: 2px;
                      }
                      
                      /* Selection */
                      ::selection {
                        background: linear-gradient(135deg, #f59e0b, #ec4899);
                        color: white;
                      }
                      
                      /* Responsive Design */
                      @media (max-width: 768px) {
                        body { padding: 1.5rem; }
                        h1.hero-title { font-size: 2rem; }
                        h2.section-title { font-size: 1.75rem; }
                        p.lead { font-size: 1.125rem; padding: 1rem; }
                        table { font-size: 0.875rem; }
                        table td, table th { padding: 0.75rem; }
                      }
                    `,

                    placeholder: placeholder,
                    branding: false,
                    resize: true,
                    statusbar: false,
                    elementpath: false,

                    // Quick Bars
                    quickbars_selection_toolbar:
                      "bold italic | quicklink h2 h3 blockquote",
                    quickbars_insert_toolbar: "quickimage quicktable",

                    // Auto-save
                    autosave_ask_before_unload: true,
                    autosave_interval: "30s",
                    autosave_prefix: "{path}{query}-{id}-",
                    autosave_restore_when_empty: false,
                    autosave_retention: "2m",

                    setup: (editor) => {
                      // Custom buttons
                      editor.ui.registry.addButton("customSave", {
                        text: "Save",
                        onAction: () => {
                          // Handle save logic
                          console.log("Content saved:", editor.getContent());
                        },
                      });

                      // Loading state
                      editor.on("init", () => {
                        setIsLoading(false);
                      });
                    },
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-6 py-3 border border-t-0 bg-gradient-to-r from-orange-50 via-amber-50 to-pink-50 border-orange-200/50 rounded-b-2xl"
        >
          <div className="flex items-center space-x-6">
            {showWordCount && (
              <>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    {wordCount} từ
                  </span>
                </div>
                <div className="w-px h-4 bg-orange-300" />
                <div className="flex items-center space-x-2">
                  <Type className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-700">
                    {charCount.toLocaleString()} ký tự
                  </span>
                </div>
                <div className="w-px h-4 bg-orange-300" />
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-700">
                    ~{readingTime} phút đọc
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className="text-xs text-orange-700 border-orange-300"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Professional Editor
              </Badge>
              <Badge
                variant="outline"
                className="text-xs border-emerald-300 text-emerald-700"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Templates Ready
              </Badge>
            </div>
            <span className="text-xs text-orange-600/70">
              TinyMCE v7.0 • Enhanced WordPress-style
            </span>
          </div>
        </motion.div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-orange-600 rounded-full border-t-transparent"
                />
                <span className="font-medium text-orange-700">
                  Đang tải editor...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};

export default TinyMCEEditor;
