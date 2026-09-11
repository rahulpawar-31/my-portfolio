export default function Loading() {
  return (
    <main className="min-h-screen bg-white dark:bg-black py-16 px-6">
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="h-4 w-32 rounded bg-zinc-100 dark:bg-zinc-900 mb-10" />
        <div className="h-1.5 w-20 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-8" />
        <div className="h-9 w-2/3 rounded bg-zinc-100 dark:bg-zinc-900 mb-4" />
        <div className="flex flex-wrap gap-2 mb-8">
          <div className="h-6 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-6 w-20 rounded-full bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-6 w-14 rounded-full bg-zinc-100 dark:bg-zinc-900" />
        </div>
        <div className="flex gap-3 mb-10">
          <div className="h-9 w-24 rounded-lg bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-9 w-28 rounded-lg bg-zinc-100 dark:bg-zinc-900" />
        </div>
        <hr className="border-zinc-200 dark:border-zinc-800 mb-10" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-4 w-5/6 rounded bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-4 w-3/4 rounded bg-zinc-100 dark:bg-zinc-900" />
        </div>
      </div>
    </main>
  );
}
