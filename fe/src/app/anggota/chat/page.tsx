"use client";
import LoadingScreen from "@/components/LoadingScreen";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IoArrowBackOutline, IoSend } from "react-icons/io5";
import useAnggotaModule from "../lib";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/socketContext";

export default function Chat() {
  const { useGetMsg } = useAnggotaModule();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [newMsg, setNewMsg] = useState<string>("");
  const [msg, setMsg] = useState<any[]>([]);
  const { data, isPending } = useGetMsg(session?.user.id?.toString());
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { socket } = useSocket(); // Access the socket from context

  const handleSendMsg = (e: any) => {
    if (e) e.preventDefault();

    if (socket) {
      console.log("ada");
      socket.emit("msg", {
        penerima: "admin",
        pengirim: "anggota",
        text: newMsg,
        id_anggota: session?.user.id,
      });
    } else {
      console.log('gada');
    }

    setNewMsg("");
    setMsg((prev) => [
      ...prev,
      {
        text: newMsg,
        pengirim: "anggota",
        penerima: "admin",
        id_anggota: session?.user.id,
        id: Date.now(),
      },
    ]);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("msg", (data: any) => {
      if (data.id_anggota == session?.user.id) {
        setMsg((prev) => [...prev, { ...data }]);
      }
    });

    return () => {
      socket?.off("msg");
    };
  }, [session, socket]);

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
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [msg]);

  if (status == "loading") {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex w-full items-center gap-2 bg-biru1 px-2 py-3">
        <button
          onClick={() => {
            router.push("/anggota");
          }}
          className="text-putih1"
        >
          <IoArrowBackOutline size={25} />
        </button>
        <p className="text-lg text-putih1">Admin</p>
      </div>
      <div className="w-full flex-grow overflow-y-auto pt-2">
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
