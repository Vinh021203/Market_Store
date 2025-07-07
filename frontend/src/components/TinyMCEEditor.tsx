import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  theme?: "light" | "dark";
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  placeholder = "Viết nội dung bài viết...",
  height = 500,
  theme = "light",
}) => {
  const editorRef = useRef<any>(null);
  const [wordCount, setWordCount] = useState(0);

  const handleEditorChange = (content: string) => {
    onChange(content);
    const text = content.replace(/<[^>]*>/g, "").trim();
    const words = text ? text.split(/\s+/).length : 0;
    setWordCount(words);
  };

  // Template tự tạo
  const insertTemplate = (templateType: string) => {
    const templates = {
      blog: "<h1>Tiêu đề bài viết</h1><p><strong>Tóm tắt:</strong> Mô tả ngắn...</p><h2>Nội dung chính</h2><p>Chi tiết...</p>",
      news: "<h2>Tiêu đề tin tức</h2><p><em>Ngày: [Date]</em></p><p>Nội dung tin tức...</p>",
      quote: "<blockquote><p>Trích dẫn quan trọng...</p></blockquote>",
    };

    if (editorRef.current) {
      editorRef.current.insertContent(templates[templateType] || "");
    }
  };

  return (
    <div className="w-full mb-4">
      {/* Quick templates */}
      <div className="flex items-center mb-3 space-x-2">
        <span className="text-sm text-gray-600">Mẫu nhanh:</span>
        <button
          type="button"
          onClick={() => insertTemplate("blog")}
          className="px-3 py-1 text-xs text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
        >
          Blog
        </button>
        <button
          type="button"
          onClick={() => insertTemplate("news")}
          className="px-3 py-1 text-xs text-green-700 bg-green-100 rounded hover:bg-green-200"
        >
          Tin tức
        </button>
        <button
          type="button"
          onClick={() => insertTemplate("quote")}
          className="px-3 py-1 text-xs text-purple-700 bg-purple-100 rounded hover:bg-purple-200"
        >
          Trích dẫn
        </button>
      </div>

      <div className="overflow-hidden border shadow-lg rounded-xl">
        <Editor
          apiKey="6wob4h7r1ddb19nbipsoixqg1gjwxjflxntssu6w9ti385p4"
          onInit={(evt, editor) => (editorRef.current = editor)}
          value={value}
          onEditorChange={handleEditorChange}
          init={{
            height: height,
            menubar: false,
            skin: theme === "dark" ? "oxide-dark" : "oxide",
            content_css: theme === "dark" ? "dark" : "default",

            // ✅ Plugins tương thích TinyMCE 7.0
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
            ],

            // ✅ Toolbar với typography đầy đủ
            toolbar: [
              "undo redo | formatselect fontselect fontsizeselect | bold italic underline strikethrough",
              "forecolor backcolor | alignleft aligncenter alignright alignjustify",
              "bullist numlist outdent indent | blockquote | link image media table",
              "codesample emoticons | removeformat | fullscreen preview help",
            ].join(" | "),

            toolbar_mode: "sliding",

            // ✅ Cấu hình typography chi tiết
            block_formats:
              "Đoạn văn=p;" +
              "Tiêu đề 1=h1;" +
              "Tiêu đề 2=h2;" +
              "Tiêu đề 3=h3;" +
              "Tiêu đề 4=h4;" +
              "Tiêu đề 5=h5;" +
              "Tiêu đề 6=h6;" +
              "Preformatted=pre;" +
              "Blockquote=blockquote;" +
              "Div=div",

            // ✅ Font options
            font_family_formats:
              "Arial=arial,helvetica,sans-serif;" +
              "Times New Roman=times new roman,times,serif;" +
              "Courier New=courier new,courier,monospace;" +
              "Helvetica=helvetica,arial,sans-serif;" +
              "Georgia=georgia,serif;" +
              "Verdana=verdana,sans-serif;" +
              "Inter=inter,sans-serif;" +
              "Roboto=roboto,sans-serif;" +
              "Open Sans=open sans,sans-serif;" +
              "Lato=lato,sans-serif;" +
              "Montserrat=montserrat,sans-serif;" +
              "Poppins=poppins,sans-serif",

            // ✅ Font size options
            font_size_formats:
              "8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 28pt 32pt 36pt 48pt 60pt 72pt",

            // ✅ Style formats cho typography nâng cao
            style_formats: [
              {
                title: "Typography",
                items: [
                  { title: "Tiêu đề chính", block: "h1" },
                  { title: "Tiêu đề phụ", block: "h2" },
                  { title: "Tiêu đề mục", block: "h3" },
                  { title: "Tiêu đề nhỏ", block: "h4" },
                  { title: "Đoạn văn", block: "p" },
                  { title: "Trích dẫn", block: "blockquote" },
                  { title: "Code block", block: "pre" },
                ],
              },
              {
                title: "Text Styles",
                items: [
                  { title: "Chữ đậm", inline: "strong" },
                  { title: "Chữ nghiêng", inline: "em" },
                  { title: "Gạch chân", inline: "u" },
                  { title: "Gạch ngang", inline: "s" },
                  { title: "Code inline", inline: "code" },
                  { title: "Highlight", inline: "mark" },
                  { title: "Chữ nhỏ", inline: "small" },
                ],
              },
              {
                title: "Special Formats",
                items: [
                  { title: "Lead paragraph", block: "p", classes: "lead" },
                  {
                    title: "Muted text",
                    inline: "span",
                    classes: "text-muted",
                  },
                  {
                    title: "Success text",
                    inline: "span",
                    classes: "text-success",
                  },
                  {
                    title: "Warning text",
                    inline: "span",
                    classes: "text-warning",
                  },
                  {
                    title: "Error text",
                    inline: "span",
                    classes: "text-danger",
                  },
                ],
              },
            ],

            // ✅ Sử dụng browser spellcheck thay vì plugin spellchecker
            browser_spellcheck: true,

            // ✅ Paste options tương thích
            paste_as_text: false,
            paste_webkit_styles: "color font-size font-family",

            // ✅ Content styling với typography đẹp
            content_style: `
              body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                font-size: 16px; 
                line-height: 1.6;
                color: ${theme === "dark" ? "#e5e7eb" : "#374151"};
                background-color: ${theme === "dark" ? "#1f2937" : "#ffffff"};
                padding: 2rem;
                max-width: none;
              }
              
              /* Typography Hierarchy */
              h1, h2, h3, h4, h5, h6 { 
                font-weight: 700; 
                margin-top: 2rem; 
                margin-bottom: 1rem; 
                color: ${theme === "dark" ? "#f9fafb" : "#111827"};
                line-height: 1.3;
              }
              
              h1 { 
                font-size: 2.5rem; 
                border-bottom: 3px solid #3b82f6; 
                padding-bottom: 0.5rem;
                margin-bottom: 1.5rem;
              }
              
              h2 { 
                font-size: 2rem; 
                border-bottom: 2px solid #6b7280; 
                padding-bottom: 0.3rem;
                color: #1f2937;
              }
              
              h3 { 
                font-size: 1.75rem; 
                color: #3b82f6;
                margin-top: 1.5rem;
              }
              
              h4 { 
                font-size: 1.5rem;
                color: #4b5563;
              }
              
              h5 { 
                font-size: 1.25rem;
                color: #6b7280;
              }
              
              h6 { 
                font-size: 1.125rem;
                color: #9ca3af;
                text-transform: uppercase;
                letter-spacing: 0.05em;
              }
              
              /* Paragraph styles */
              p { 
                margin-bottom: 1.5rem; 
                text-align: justify;
                hyphens: auto;
              }
              
              p.lead {
                font-size: 1.25rem;
                font-weight: 300;
                color: #6b7280;
                margin-bottom: 2rem;
              }
              
              /* Text utilities */
              .text-muted { color: #6b7280; }
              .text-success { color: #059669; }
              .text-warning { color: #d97706; }
              .text-danger { color: #dc2626; }
              
              /* Emphasis */
              strong, b { font-weight: 700; color: ${theme === "dark" ? "#f3f4f6" : "#111827"}; }
              em, i { font-style: italic; }
              u { text-decoration: underline; text-decoration-color: #3b82f6; }
              s { text-decoration: line-through; }
              mark { background-color: #fef08a; padding: 0.125rem 0.25rem; border-radius: 0.25rem; }
              small { font-size: 0.875rem; color: #6b7280; }
              
              /* Code */
              code {
                background: linear-gradient(135deg, ${theme === "dark" ? "#374151" : "#f1f5f9"} 0%, ${theme === "dark" ? "#4b5563" : "#e2e8f0"} 100%);
                padding: 0.25rem 0.5rem;
                border-radius: 0.375rem;
                font-family: 'Fira Code', ui-monospace, monospace;
                font-size: 0.9em;
                border: 1px solid ${theme === "dark" ? "#6b7280" : "#cbd5e1"};
                color: #dc2626;
              }
              
              pre {
                background: linear-gradient(135deg, ${theme === "dark" ? "#374151" : "#f8fafc"} 0%, ${theme === "dark" ? "#4b5563" : "#f1f5f9"} 100%);
                padding: 1.5rem;
                border-radius: 0.75rem;
                overflow-x: auto;
                border: 1px solid ${theme === "dark" ? "#6b7280" : "#e5e7eb"};
                box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
                font-family: 'Fira Code', ui-monospace, monospace;
                font-size: 0.875rem;
                line-height: 1.7;
              }
              
              /* Blockquotes */
              blockquote {
                border-left: 5px solid #3b82f6;
                margin: 2rem 0;
                padding: 1.5rem;
                font-style: italic;
                background: linear-gradient(135deg, ${theme === "dark" ? "#374151" : "#f8fafc"} 0%, ${theme === "dark" ? "#4b5563" : "#e2e8f0"} 100%);
                border-radius: 0 1rem 1rem 0;
                position: relative;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                font-size: 1.125rem;
              }
              
              blockquote::before {
                content: '"';
                font-size: 4rem;
                color: #3b82f6;
                position: absolute;
                top: -0.5rem;
                left: 1rem;
                line-height: 1;
                font-family: serif;
              }
              
              /* Lists */
              ul, ol {
                padding-left: 2rem;
                margin-bottom: 1.5rem;
              }
              
              li {
                margin-bottom: 0.5rem;
                line-height: 1.6;
              }
              
              ul li::marker {
                color: #3b82f6;
              }
              
              ol li::marker {
                color: #3b82f6;
                font-weight: bold;
              }
              
              /* Links */
              a { 
                color: #3b82f6; 
                text-decoration: none; 
                border-bottom: 1px solid transparent;
                transition: all 0.2s ease;
              }
              
              a:hover { 
                color: #1d4ed8; 
                border-bottom-color: #1d4ed8;
              }
              
              /* Tables */
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 2rem 0;
                border-radius: 0.75rem;
                overflow: hidden;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
              }
              
              table td, table th {
                border: 1px solid ${theme === "dark" ? "#4b5563" : "#e5e7eb"};
                padding: 1rem;
                text-align: left;
              }
              
              table th {
                background: linear-gradient(135deg, ${theme === "dark" ? "#374151" : "#f9fafb"} 0%, ${theme === "dark" ? "#4b5563" : "#f3f4f6"} 100%);
                font-weight: 700;
                color: ${theme === "dark" ? "#f3f4f6" : "#374151"};
                text-transform: uppercase;
                font-size: 0.875rem;
                letter-spacing: 0.05em;
              }
              
              /* Images */
              img {
                max-width: 100%;
                height: auto;
                border-radius: 0.75rem;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                transition: transform 0.2s ease;
              }
              
              img:hover {
                transform: scale(1.02);
              }
              
              /* HR */
              hr {
                border: none;
                height: 2px;
                background: linear-gradient(to right, transparent, #3b82f6, transparent);
                margin: 3rem 0;
                border-radius: 1px;
              }
              
              /* Selection */
              ::selection {
                background-color: #3b82f6;
                color: white;
              }
            `,

            placeholder: placeholder,
            branding: false,
            resize: false,
            statusbar: false,

            // ✅ Custom setup cho template functionality
            setup: (editor) => {
              // Custom template button
              editor.ui.registry.addMenuButton("customTemplate", {
                text: "Template",
                fetch: (callback) => {
                  const items = [
                    {
                      type: "menuitem",
                      text: "Blog Post",
                      onAction: () => insertTemplate("blog"),
                    },
                    {
                      type: "menuitem",
                      text: "Tin tức",
                      onAction: () => insertTemplate("news"),
                    },
                    {
                      type: "menuitem",
                      text: "Trích dẫn",
                      onAction: () => insertTemplate("quote"),
                    },
                  ];
                  callback(items);
                },
              });

              // Custom typography shortcuts
              editor.ui.registry.addButton("heading1", {
                text: "H1",
                onAction: () => editor.execCommand("FormatBlock", false, "h1"),
              });

              editor.ui.registry.addButton("heading2", {
                text: "H2",
                onAction: () => editor.execCommand("FormatBlock", false, "h2"),
              });

              editor.ui.registry.addButton("heading3", {
                text: "H3",
                onAction: () => editor.execCommand("FormatBlock", false, "h3"),
              });
            },
          }}
        />

        {/* Enhanced Status bar */}
        <div className="flex justify-between px-4 py-2 text-sm text-gray-600 border-t bg-gray-50">
          <div className="flex items-center space-x-4">
            <span>📝 {wordCount} từ</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs">Typography: H1-H6, P, Blockquote</span>
          </div>
          <span className="text-xs">TinyMCE 7.0 Compatible</span>
        </div>
      </div>
    </div>
  );
};

export default TinyMCEEditor;
