export const truncateText = (text: string, startCount: number, endCount: number) => {
  if (!text) return "";

  // Agar uzunlik kesishdan kichik bo'lsa, kesmay qaytaramiz
  if (text.length <= startCount + endCount) return text;

  const start = text.slice(0, startCount);
  const end = text.slice(text.length - endCount);

  return `${start}...${end}`;
};
