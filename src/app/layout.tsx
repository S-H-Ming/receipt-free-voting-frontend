import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { ContextProvider } from "@/context"
import Head from "next/head"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Blockchain Voter",
  description: ""
}

const montserrat = Montserrat({
  weight: "400",
  subsets: ["latin"]
})

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <Head>
        <title>Voting System</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body className={`${montserrat.className}`}>
        <ContextProvider>
          <Header />
          <main className="relative mb-auto mt-0 flex min-h-full w-full max-w-[1920px] flex-col gap-0 py-0 md:px-16 lg:gap-2 xl:py-2">
            {children}
          </main>
          <Footer />
        </ContextProvider>
      </body>
    </html>
  )
}
