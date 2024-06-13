// chat.tsx
"use client";

import useAnggotaModule from "@/app/anggota/lib";
import { useIdStore } from "@/store/useStore";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoArrowBackOutline, IoSend } from "react-icons/io5";
import { useSocket } from "@/components/socketContext"; // Import useSocket

export default function Chat({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const { socket } = useSocket(); // Access the socket from context
  const { selectedAnggota, setSelectedAnggota } = useIdStore();
  const [newMsg, setNewMsg] = useState<string>("");
  const [msg, setMsg] = useState<any[]>([]);
  const router = useRouter();
  const { useGetMsg } = useAnggotaModule();
  const queryClient = useQueryClient();
  const { data, isPending } = useGetMsg(selectedAnggota?.id.toString());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMsg = (e: any) => {
    if (e) e.preventDefault();

    if (socket) {
      socket.emit("msg", {
        penerima: "anggota",
        pengirim: "admin",
        text: newMsg,
        id_anggota: selectedAnggota?.id,
      });
    }

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
    if (!socket) return;

    socket.on("msg", (data: any) => {
      setMsg((prev) => [...prev, { ...data }]);
    });

    return () => {
      socket.off("msg");
    };
  }, [socket]);

  useEffect(() => {
    if (selectedAnggota == undefined) {
      router.push("/admin");
    }
  }, [selectedAnggota, router]);

  useEffect(() => {
    queryClient.invalidateQueries();

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [msg]);

  return (
    <div className="flex h-screen w-full flex-col pl-[210px]">
      <div className="flex py-4 w-full items-center gap-2 bg-biru1 pl-4 ">
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
                "bg-gray-300 text-black": item.pengirim == session?.user.role,
                "bg-biru2 text-white": item.pengirim != session?.user.role,
              })}
            >
              {item.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
