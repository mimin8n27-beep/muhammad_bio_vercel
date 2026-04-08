import type { ReactNode } from "react";

interface SafeRichTextProps {
  text: string;
  className?: string;
}

type Block =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

const inlineParts = (text: string, keyPrefix: string): ReactNode[] => {
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const content = token.slice(token.startsWith("**") ? 2 : 1, token.endsWith("**") ? -2 : -1);
    parts.push(
      token.startsWith("**") ? (
        <strong key={`${keyPrefix}-strong-${index}`}>{content}</strong>
      ) : (
        <em key={`${keyPrefix}-em-${index}`}>{content}</em>
      ),
    );

    lastIndex = regex.lastIndex;
    index += 1;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

const parseMarkdown = (rawText: string): Block[] => {
  const lines = rawText.replace(/\r/g, "").split("\n");
  const blocks: Block[] = [];
  let paragraphBuffer: string[] = [];
  let listItems: string[] = [];
  let orderedList = false;

  const flushParagraph = () => {
    const text = paragraphBuffer.join(" ").trim();
    if (text) {
      blocks.push({ type: "paragraph", text });
    }
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (listItems.length) {
      blocks.push({ type: "list", ordered: orderedList, items: [...listItems] });
    }
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed === "---") {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "heading",
        level: headingMatch[1].length as 1 | 2 | 3,
        text: headingMatch[2].trim(),
      });
      continue;
    }

    const unorderedMatch = trimmed.match(/^-\s+(.+)$/);
    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (unorderedMatch || orderedMatch) {
      flushParagraph();
      const nextOrdered = Boolean(orderedMatch);
      if (listItems.length && orderedList !== nextOrdered) {
        flushList();
      }
      orderedList = nextOrdered;
      listItems.push((unorderedMatch?.[1] || orderedMatch?.[1] || "").trim());
      continue;
    }

    flushList();
    paragraphBuffer.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
};

export function stripMarkdown(text: string) {
  return text
    .replace(/^#{1,3}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^-\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\n+/g, " ")
    .trim();
}

export function SafeRichText({ text, className }: SafeRichTextProps) {
  const blocks = parseMarkdown(text);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = block.level === 1 ? "h3" : block.level === 2 ? "h4" : "h5";
          return (
            <Tag key={`heading-${index}`} className="safe-rich-heading">
              {inlineParts(block.text, `heading-${index}`)}
            </Tag>
          );
        }

        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag
              key={`list-${index}`}
              className={block.ordered ? "safe-rich-list safe-rich-list-ordered" : "safe-rich-list"}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`item-${itemIndex}`}>{inlineParts(item, `item-${index}-${itemIndex}`)}</li>
              ))}
            </ListTag>
          );
        }

        return (
          <p key={`paragraph-${index}`} className="safe-rich-paragraph">
            {inlineParts(block.text, `paragraph-${index}`)}
          </p>
        );
      })}
    </div>
  );
}
