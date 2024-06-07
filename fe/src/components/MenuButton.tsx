import { useIdStore } from "@/store/useStore";
import { usePathname, useRouter } from "next/navigation";
import { IconType } from "react-icons";

interface Props {
  label: string;
  path: string;
  Icon: IconType;
  isDynamic: number | undefined
}

export default function MenuButton({ label, Icon, path, isDynamic }: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const { setBook, setAnggota, setIsSelectBOOK, setIsSelectANGGOTA, setIsSelectPEMINJAMAN, setPeminjaman, setSelectedAnggota } =
    useIdStore();


  return (
    <button
      onClick={() => {
        setIsSelectANGGOTA(false);
        setIsSelectBOOK(false);
        setIsSelectPEMINJAMAN(false);
        setAnggota(undefined);
        setBook(undefined);
        setPeminjaman(undefined);
        setSelectedAnggota(undefined);
        router.push(path);
      }}
      className={`flex w-full items-center gap-2 ${pathName == path ? "bg-biru1 text-putih1" : "text-biru2"} ${isDynamic == pathName?.split('/').length ? "bg-biru1 text-putih1" : "text-biru2"} p-2 text-left`}
    >
      <Icon />
      {label}
    </button>
  );
}
