export default function AuthLoading() {
  return (
    <div className="container flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="h-8 w-48 mx-auto bg-muted animate-pulse rounded-md" />
        <div className="space-y-4">
          <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  );
}
