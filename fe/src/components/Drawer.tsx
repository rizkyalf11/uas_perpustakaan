import React, { ReactNode } from "react";
import { IoClose } from "react-icons/io5";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  onSubmit: () => void;
  onClear: () => void;
}

export default function Drawer({
  children,
  isOpen,
  onClose,
  onSubmit,
  onClear,
}: DrawerProps) {
  return (
    <div className={`fixed inset-0 z-50 flex ${isOpen ? "block" : "hidden"}`}>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Drawer Content */}
      <div className="fixed right-0 z-50 flex h-screen w-80 max-w-full flex-col bg-putih2 shadow-lg">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Filter</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex-grow p-4">{children}</div>

        <div className="flex gap-2 p-4">
          <button
            onClick={() => {
              onSubmit();
              onClose();
            }}
            className="rounded-md bg-biru1 px-3 py-1 text-putih1 hover:bg-biru2"
          >
            Terapkan
          </button>
          <button
            onClick={() => {
              onClear();
              onClose();
            }}
            className="rounded-md bg-red-500 px-3 py-1 text-putih1 hover:bg-red-600"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
