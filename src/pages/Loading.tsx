function Loading() {
  return (
    <main className="h-screen flex items-center justify-center bg-sky-600 text-white">
      <div className="flex items-center flex-col gap-2">
        <span className="h-[40px] w-[40px] border-4 rounded-full border-dotted animate-spin border-white"></span>
        <h1>Loading...</h1>
      </div>
    </main>
  );
}

export default Loading;
