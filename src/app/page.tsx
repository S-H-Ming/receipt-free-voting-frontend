"use client";

import React, { useContext, useEffect, useState } from "react"
import Root from "@/components/root";

const App = () => {

  return (
    <div className="w-full flex flex-col items-center">
      <div className="p-8">
          <p className="text-main font-bold text-lg">Voting Step</p>
          <p className="text-main text-base">1. Connect your wallet.</p>
          <p className="text-main text-base">2. Login your google account.</p>
          <p className="text-main text-base">3. Vote for the candidates you want.</p>
      </div>
      <div className=" w-full text-center">
          <Root />
      </div>
    </div>
  );
};

export default App;