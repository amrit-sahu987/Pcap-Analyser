"use client";

import React, { createContext, useContext, useState } from "react";

const PacketContext = createContext<any>(null);

export const usePacketData = () => useContext(PacketContext);

export const PacketProvider = ({ children }) => {
  const [packets, setPackets] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [filename, setFilename] = useState<string>("");

  return (
    <PacketContext.Provider value={{ packets, setPackets, message, setMessage, filename, setFilename }}>
      {children}
    </PacketContext.Provider>
  );
};
