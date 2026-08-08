/**
 * Markdown & Content Utilities for ExplainingDream.com
 * Handles Markdown sanitization, heading extraction, and dynamic reading time calculations.
 */

// Strips Markdown syntax markers for plain text display (e.g., in excerpts, search summaries, meta descriptions)
export function sanitizeMarkdownText(raw: string): string {
  if (!raw) return '';
  return raw
    // Remove headers (###, ##, #)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italics (**text**, *text*, ___text___)
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/_{1,3}([^_]+)_{1,3}/g, '$1')
    // Remove blockquote markers (> )
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules (---, ***)
    .replace(/^[-*_]{3,}$/gm, '')
    // Remove links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove list item bullets (- , * , 1. )
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Replace multiple newlines with single space or break
    .replace(/\n{2,}/g, ' ')
    .trim();
}

// Calculates dynamic reading time in Arabic (~180-200 Arabic words per minute)
export function calculateReadingTime(text: string): string {
  if (!text) return '3 دقائق';
  const cleanText = sanitizeMarkdownText(text);
  const wordCount = cleanText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(2, Math.ceil(wordCount / 180));
  return `${minutes} دقائق`;
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number; // 2 for H2, 3 for H3
}

// Extracts H2 and H3 headings from Markdown content to build dynamic Table of Contents
export function extractHeadings(content: string): HeadingItem[] {
  if (!content) return [];
  const lines = content.split('\n');
  const headings: HeadingItem[] = [];
  let counter = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      const title = sanitizeMarkdownText(trimmed.replace(/^#\s+/, ''));
      if (title) {
        headings.push({
          id: `heading-${counter++}`,
          text: title,
          level: 2,
        });
      }
    } else if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      const title = sanitizeMarkdownText(trimmed.replace(/^##\s+/, ''));
      if (title) {
        headings.push({
          id: `heading-${counter++}`,
          text: title,
          level: 2,
        });
      }
    } else if (trimmed.startsWith('### ')) {
      const title = sanitizeMarkdownText(trimmed.replace(/^###\s+/, ''));
      if (title) {
        headings.push({
          id: `heading-${counter++}`,
          text: title,
          level: 3,
        });
      }
    }
  }

  return headings;
}
