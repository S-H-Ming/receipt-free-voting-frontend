"use client"

import React, { useContext, useEffect, useState } from "react"
import { Context } from "@/context"
import Button from "./button"
import { showWallet } from "@/libs/string"

export const WalletConnect = () => {
  const context = useContext(Context)
  const [showDisconnect, setShowDisconnect] = useState(false)
  const address = context.acc?.address
  const label = address ? showWallet(address) : "Connect Wallet"

  const handleSync = async () => {
    if (!context.address) {
      await context.syncTaquito()
    }
  }

  const handleUnsync = async () => {
    await context.disconnect()
    setShowDisconnect(false) // Close the dropdown after disconnecting
  }

  return (
    <div className="relative flex items-center justify-center">
      <Button
        type="primary"
        onClick={() => {
          address ? setShowDisconnect((prev) => !prev) : handleSync()
        }}
      >
        <div>{label}</div>
      </Button>
      
      {/* Disconnect Dropdown */}
      {address && (
          <div className={`absolute top-full mt-1 w-full rounded-md bg-deep-gray-color py-2 text-center z-10 ${showDisconnect ? "" : "hidden"}`}>
            <button
              className={`w-full text-white py-1`}
              onClick={() => {
                handleUnsync()
              }}
            >
              <div>Disconnect</div>
            </button>
          </div>
      )}
    </div>
  )
}

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-main-color px-4 h-[65px]">
      {/* Logo placeholder */}
      <div className="w-12 h-12 bg-gray-400"></div>

      {/* WalletConnect Button */}
      <WalletConnect />
    </header>
  )
}
