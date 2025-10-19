import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="relative bg-black after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}

          {/* Logo + Desktop Links */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch ">
            <div className="flex shrink-0 items-center">
              <Image src="/logo.png" alt="Easytek" width={120} height={32} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
