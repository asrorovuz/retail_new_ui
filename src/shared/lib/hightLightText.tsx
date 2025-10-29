export const highlightText = (text: string, search: string) => {
  if (!search) return text;

  const regex = new RegExp(`(${search})`, "gi");

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: text.replace(
          regex,
          `<span style="color:#555; font-weight:600;">$1</span>`
        ),
      }}
    />
  );
};
