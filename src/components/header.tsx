"use client"

import { Context } from "@/context"
import Image from "next/image"
import React, { useContext, useEffect, useState } from "react"
import Button from "./button"
// import Logo from "@/../public/images/logo.png"
import Hamburger from "@/../public/images/hamburger.png"
import UseWindowWidth, { isMobile } from "./resize"
import { usePathname } from "next/navigation"
import { showWallet } from "@/libs/string"
import { ADMIN_WALLET } from "@/constants"

export const WalletConnect = ({
  isMobile,
  isAdmin,
  currRoute
}: {
  isMobile: boolean
  isAdmin: boolean
  currRoute: string
}) => {
  const context = useContext(Context)

  const handleSync = async () => {
    if (context.address === undefined) {
      await context.syncTaquito()
    }
  }

  useEffect(() => {
    context.setAccount()
  }, [context])

  const handleUnsync = async () => {
    await context.disconnect()
  }

  // const handleSyncUnsync = async () => {
  //   if (context.address === undefined) {
  //     await context.syncTaquito()
  //   } else {
  //     await context.disconnect()
  //   }
  // }
  const address = context.acc?.address
  let label = address ? showWallet(address) : "Connect Wallet"

  const [showDisconnect, setShowDisconnect] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="flex gap-4">
      <div
        className="relative flex items-center justify-center"
        onMouseEnter={() => setShowDisconnect(true)}
        onMouseLeave={() => setShowDisconnect(false)}
      >
        <Button type="primary" onClick={handleSync}>
          <div>{label}</div>
        </Button>
        {address && (
          <div
            className={`absolute bottom-1 left-0 right-0 translate-y-full rounded-b-md bg-[#d3d3d3] py-4 text-center ${showDisconnect ? "" : "hidden"}`}
          >
            <button
              className=""
              onClick={() => {
                handleUnsync()
                setShowDisconnect(false)
              }}
            >
              <div>Disconnect</div>
            </button>
          </div>
        )}
      </div>
      {/* HAMBURGER */}
      {isMobile && address && (
        <button
          onClick={() => {
            setShowMenu(!showMenu)
          }}
        >
          <Image src={Hamburger} alt="" width={28} height={24} />
        </button>
      )}
      {/* MOBILE MENU */}
      {showMenu && (
        <div className="fixed bottom-0 left-0 right-0 top-0 bg-main-color">
          <div className="h-full w-full bg-white opacity-100"></div>
          <button
            className="absolute right-6 top-6 text-2xl font-bold"
            onClick={() => {
              setShowMenu(false)
            }}
          >
            x
          </button>
          <div className="absolute left-1/2 top-24 flex -translate-x-1/2 flex-col gap-8 text-center">
            {isAdmin && (
              <React.Fragment>
                <a href="/dashboard" className={`${currRoute === "dashboard" && "border-b"}`}>
                  Dashboard
                </a>
                <a href="/create" className={`${currRoute === "create" && "border-b"}`}>
                  Create Gacha
                </a>
              </React.Fragment>
            )}
            <button
              className="rounded-2xl bg-gray px-8 py-4 text-white"
              onClick={() => {
                handleUnsync()
                setShowMenu(false)
              }}
            >
              <div>Disconnect</div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Header({}) {
  const context = useContext(Context)
  const windowWidth = UseWindowWidth()
  const isAdmin = context.acc?.address ? ADMIN_WALLET.includes(context.acc?.address) : false
  const pathname = usePathname()
  let currRoute = pathname.split("/")[1]

  return (
    <header className="sticky left-0 right-0 top-0 z-50 mt-0 flex h-[60px] w-full items-center justify-between bg-main-color px-4">
      {/* <a href="/">
        <Image src={Logo} alt="icon" width={140} />
      </a> */}
      <div className="flex items-center gap-8 text-white">
        {!isMobile(windowWidth) && isAdmin && (
          <React.Fragment>
            <a href="/dashboard" className={`${currRoute === "dashboard" && "border-b"}`}>
              Dashboard
            </a>
            <a href="/create" className={`${currRoute === "create" && "border-b"}`}>
              Create Gacha
            </a>
          </React.Fragment>
        )}
        <WalletConnect isMobile={isMobile(windowWidth)} isAdmin={isAdmin} currRoute={currRoute} />
      </div>
    </header>
  )
}
