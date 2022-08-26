import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

const Markdown: React.FC<{ src: string; className?: string }> = ({
  src,
  className = "",
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      className={`space-y-2 ${className}`}
      components={{
        a: ({ node, ...props }) => (
          <a
            target="_blank"
            className="underline decoration-secondary decoration-2 hover:bg-secondary-light"
            {...props}
          />
        ),
        img: ({ node, ...props }) => (
          <div className="w-full flex flex-col items-center">
            <img
              {...props}
              className="max-w-md border-1 border-stone-200 dark:border-800 rounded"
            />
            <h6>{props.alt}</h6>
          </div>
        ),
        table: ({ node, ...props }) => <table {...props} className="table" />,
      }}
    >
      {src}
    </ReactMarkdown>
  );
};

export default Markdown;
