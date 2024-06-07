"use client";
import LoadingScreen from "@/components/LoadingScreen";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { IoChatbubbleEllipsesOutline, IoExitOutline } from "react-icons/io5";

interface Props {
  children: ReactNode;
}

export default function AnggotaTemplate({ children }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathName = usePathname();

  if (status == "loading") {
    return <LoadingScreen />;
  }

  return (
    <div className="m-auto min-h-screen max-w-md bg-putih1 px-4">
      {pathName != "/anggota/chat" && (
        <>
          <div className="mb-5 flex w-full items-center justify-between my-10">
            <div className="flex items-start gap-1">
              <p className="text-2xl font-semibold">
                HAI, {session?.user.nama}!
              </p>
              <button onClick={() => signOut()}>
                <IoExitOutline size={20} />
              </button>
            </div>

            <button onClick={() => router.push("/anggota/chat")}>
              <IoChatbubbleEllipsesOutline size={25} />
            </button>
          </div>

          <div className="grid h-10 grid-cols-3">
            <button
              onClick={() => router.push("/anggota")}
              className={`border ${pathName == "/anggota" && "bg-biru1 text-putih1"} rounded-l-md border-black/50 transition-all duration-200 hover:border-none hover:bg-biru1 hover:text-putih1`}
            >
              Buku
            </button>
            <button
              onClick={() => router.push("/anggota/pinjaman")}
              className={`border ${pathName == "/anggota/pinjaman" && "bg-biru1 text-putih1"} border-black/50 transition-all duration-200 hover:border-none hover:bg-biru1 hover:text-putih1`}
            >
              Pinjaman
            </button>
            <button
              onClick={() => router.push("/anggota/pengembalian")}
              className={`border ${pathName == "/anggota/pengembalian" && "bg-biru1 text-putih1"} rounded-r-md border-black/50 transition-all duration-200 hover:border-none hover:bg-biru1 hover:text-putih1`}
            >
              Pengembalian
            </button>
          </div>
        </>
      )}
      {children}
    </div>
  );
}
