const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="
          loader
          relative
          w-[50px] aspect-square
          rounded-full
          before:content-['']
          before:absolute
          before:top-0
          before:left-1/2
          before:-translate-x-1/2
          before:rounded-full
          before:bg-[#2A85FF]
          after:content-['']
          after:absolute
          after:inset-0
          after:rounded-full
          after:[background:conic-gradient(transparent_30%,#2A85FF)]
          after:[mask:radial-gradient(farthest-side,transparent_calc(100%-8px),#000_0)]
        "
      ></div>
    </div>
  );
};

export default Loading;
