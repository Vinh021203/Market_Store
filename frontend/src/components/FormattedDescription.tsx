import React from "react";

interface FormattedDescriptionProps {
  text: string;
  className?: string;
}

const FormattedDescription: React.FC<FormattedDescriptionProps> = ({
  text,
  className = "",
}) => {
  const formatText = (text: string) => {
    const lines = text.split("\n");

    return lines.map((line, index) => {
      // Dòng trống
      if (line.trim() === "") {
        return <br key={index} />;
      }

      // Headings với ##
      if (line.match(/^##\s/)) {
        const content = line.replace(/^##\s/, "");
        return (
          <h3
            key={index}
            className="pb-2 mt-6 mb-3 text-xl font-bold border-b text-slate-900 dark:text-slate-100 border-slate-200"
          >
            {formatInlineText(content)}
          </h3>
        );
      }

      // Bullet points với • - *
      if (line.match(/^[•\-\*]\s/)) {
        const content = line.replace(/^[•\-\*]\s/, "");
        return (
          <div key={index} className="flex items-start my-2 space-x-3">
            <span className="mt-1 text-lg font-bold text-blue-600">•</span>
            <span className="flex-1">{formatInlineText(content)}</span>
          </div>
        );
      }

      // Numbered lists với 1. 2. 3.
      if (line.match(/^\d+\.\s/)) {
        const match = line.match(/^(\d+)\.\s(.+)/);
        if (match) {
          const [, number, content] = match;
          return (
            <div key={index} className="flex items-start my-2 space-x-3">
              <span className="text-blue-600 font-bold mt-1 min-w-[2rem] text-lg">
                {number}.
              </span>
              <span className="flex-1">{formatInlineText(content)}</span>
            </div>
          );
        }
      }

      // Paragraphs bình thường
      return (
        <p key={index} className="my-3 leading-relaxed">
          {formatInlineText(line)}
        </p>
      );
    });
  };

  const formatInlineText = (text: string) => {
    // **Bold text**
    let formatted = text.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold text-slate-900 dark:text-slate-100">$1</strong>',
    );

    // *Italic text*
    formatted = formatted.replace(
      /\*(.*?)\*/g,
      '<em class="italic text-slate-700 dark:text-slate-300">$1</em>',
    );

    // `Code`
    formatted = formatted.replace(
      /`(.*?)`/g,
      '<code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm font-mono text-slate-800 dark:text-slate-200">$1</code>',
    );

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <div className={`formatted-description ${className}`}>
      {formatText(text)}
    </div>
  );
};

export default FormattedDescription;
