"use client";

import React, { createContext, useContext, useState } from "react";

const PacketContext = createContext<any>(null);

export const usePacketData = () => useContext(PacketContext);

export const PacketProvider = ({ children }) => {
  const [packets, setPackets] = useState<any[]>([]);

  return (
    <PacketContext.Provider value={{ packets, setPackets }}>
      {children}
    </PacketContext.Provider>
  );
};
