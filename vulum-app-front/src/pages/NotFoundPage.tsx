import { Button } from "../components/ui/button";

const NotFound = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-background">
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        <h2 className="mb-4 text-6xl font-extrabold gradient-text">404</h2>
        <h3 className="mb-2 text-2xl font-bold text-foreground">
          Page not found
        </h3>
        <p className="text-muted-foreground mb-8 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get
          you back on track.
        </p>
        <Button
          asChild
          size="lg"
          className="rounded-xl bg-primaryBlue hover:bg-darkBlue text-white"
        >
          <a href="/">Back to home</a>
        </Button>
      </div>

      {/* Right Section */}
      <div className="relative max-h-screen w-full p-2 max-lg:hidden">
        <div className="h-full w-full rounded-2xl bg-gradient-to-br from-primaryBlue to-indigo-600 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-[12rem] font-extrabold leading-none opacity-20">
                404
              </div>
            </div>
          </div>
          <img
            src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/error/image-1.png"
            alt="404 illustration"
            className="absolute top-1/2 left-1/2 h-[clamp(260px,25vw,406px)] -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
