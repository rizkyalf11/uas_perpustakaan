"use client";
import LoadingScreen from "@/components/LoadingScreen";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoArrowBackOutline, IoSend } from "react-icons/io5";
import { io } from "socket.io-client";
import useAnggotaModule from "../lib";
import { useQueryClient } from "@tanstack/react-query";

export default function Chat() {
  const { useGetMsg } = useAnggotaModule();
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<any>(null);
  const router = useRouter();
  const [newMsg, setNewMsg] = useState<string>("");
  const [msg, setMsg] = useState<any[]>([]);
  const { data, isPending } = useGetMsg(session?.user.id?.toString());
  const queryClient = useQueryClient();

  const handleSendMsg = (e: any) => {
    if (e) e.preventDefault();

    socket.emit("msg", {
      penerima: "admin",
      pengirim: "anggota",
      text: newMsg,
      id_anggota: session?.user.id,
    });

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
      if (data.id_anggota == session?.user.id) {
        console.log(data);
        console.log(`target ${data.id_anggota}`);
        setMsg((prev) => [...prev, { ...data }]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [session]);

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

  if (status == "loading") {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex h-14 w-full items-center gap-2 bg-biru1 px-2">
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
      <div className="w-full flex-grow pt-2 overflow-y-auto">
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
