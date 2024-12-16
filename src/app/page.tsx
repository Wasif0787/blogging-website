"use client"
import { useRouter } from "next/navigation";
import { usePageTitle } from "./hooks/usePageTitle";

export default function Home() {
  const router = useRouter()
  usePageTitle("Medium: Read and write stores.")
  return (
    <div className="h-screen max-h-screen bg-[#F6F4ED] flex flex-col">
      {/* header */}
      <div className="flex flex-row justify-between items-center p-3 px-3 md:px-20 border-b-2 border-slate-400">
        <h1 className="text-[#242424] text-xl md:text-4xl font-bold">Medium</h1>
        <div className="flex flex-row gap-2 md:gap-4">
          <button onClick={() => router.push("/sign-in")} className="text-black">Sign in</button>
          <button onClick={() => router.push("/sign-up")} className="bg-black text-white rounded-xl p-2 text-sm">Get Started</button>
        </div>
      </div>
      {/* Main */}
      <div className="flex flex-col md:flex-row h-full justify-center items-center border-slate-400 border-b-2">
        <div className="md:pl-20 pl-10 flex flex-col gap-4">
          <h1 className="text-black font-serif text-7xl md:text-9xl">Human <br />
            stories & ideas</h1>
          <p className="text-black">A place to read, write, and deepen your understanding</p>
          <button onClick={() => router.push("/home")} className="bg-[#33AB45] text-white md:bg-black rounded-xl p-2 text-lg w-fit">Start Reading</button>
        </div>
        <div className="pl-10 lg:pl-20 hidden md:block">
          <img className="w-[480px] h-[600px] pt-10" src="https://miro.medium.com/v2/format:webp/4*SdjkdS98aKH76I8eD0_qjw.png" alt="image" />
        </div>
      </div>
    </div>
  );
}
