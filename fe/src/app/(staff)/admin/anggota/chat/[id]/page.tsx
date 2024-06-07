"use client";

import useAnggotaModule from "@/app/anggota/lib";
import { useIdStore } from "@/store/useStore";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoArrowBackOutline, IoSend } from "react-icons/io5";
import { io } from "socket.io-client";

export default function Chat({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<any>(null);
  const { selectedAnggota, setSelectedAnggota } = useIdStore();
  const [newMsg, setNewMsg] = useState<string>("");
  const [msg, setMsg] = useState<any[]>([]);
  const router = useRouter();
  const { useGetMsg } = useAnggotaModule();
  const queryClient = useQueryClient();
  const { data, isPending } = useGetMsg(selectedAnggota?.id.toString());


  const handleSendMsg = (e: any) => {
    if (e) e.preventDefault();

    socket.emit("msg", {
      penerima: "anggota",
      pengirim: "admin",
      text: newMsg,
      id_anggota: selectedAnggota?.id,
    });

    setNewMsg("");
    setMsg((prev) => [
      ...prev,
      {
        text: newMsg,
        pengirim: "admin",
        penerima: "anggota",
        id_anggota: selectedAnggota?.id,
        id: Date.now(),
      },
    ]);
  };

  useEffect(() => {
    const socket = io("http://localhost:5105", {
      withCredentials: true,
      query: {
        username: session?.user.nama,
        id: session?.user.id,
        role: session?.user.role,
      },
    });

    socket.on("connect", () => {
      setSocket(socket);
    });

    socket.on("msg", (data) => {
      console.log(data);
      setMsg((prev) => [...prev, { ...data }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [session, selectedAnggota]);

  useEffect(() => {
    if (selectedAnggota == undefined) {
      router.push("/admin");
    }
    console.log(selectedAnggota);
  }, [selectedAnggota, router]);

  useEffect(() => {
    queryClient.invalidateQueries();
    console.log(data);

    const manipulatedData = data?.message.map((item: any) => {
      return {
        ...item,
        pengirim: item.pengirim,
        penerima: item.penerima,
        text: item.pesan,
        id_anggota: item.id_anggota.id,
      };
    });

    setMsg(manipulatedData || []);
  }, [queryClient, data]);

  return (
    <div className="flex h-screen w-full flex-col pl-[210px]">
      <div className="flex h-16 w-full items-center gap-2 bg-biru1 pl-4 ">
        <button
          onClick={() => {
            router.push("/admin/anggota");
            setSelectedAnggota(undefined);
          }}
          className="text-putih1"
        >
          <IoArrowBackOutline size={25} />
        </button>
        <p className="text-lg text-putih1">{selectedAnggota?.nama}</p>
      </div>

      <div className="w-full flex-grow px-10 pt-2 overflow-y-auto">
        {msg.map((item, i) => (
          <div
            key={i}
            className={clsx("chat", {
              "chat-end": item.pengirim == session?.user.role,
              "chat-start": item.pengirim != session?.user.role,
            })}
          >
            <div
              className={clsx("chat-bubble", {
                "bg-biru1 text-putih1": item.pengirim == session?.user.role,
                "bg-biru2 text-white": item.pengirim != session?.user.role,
              })}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full px-2 pt-2">
        <form className="mb-2 flex gap-2" onSubmit={handleSendMsg}>
          <input
            type="text"
            placeholder="hai!"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="border-hitam text-hitam input input-bordered w-full"
          />
          <button type="submit">
            <IoSend className="size-8" />
          </button>
        </form>
      </div>
    </div>
  );
}
