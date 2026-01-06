import InfoCard from "@/components/InfoCard";
import { Construction } from "lucide-react";

const featureReady = false;

export default function Dashboard() {



  if (!featureReady) { // FIXME: full screen issue
    return ( 
      <div className=" flex-1 flex items-center justify-center h-full w-full bg-slate-50/30">
        <div className="flex flex-col items-center justify-center p-8 w-full text-center text-slate-500">
          <Construction className="w-16 h-16 mb-4 text-slate-300" />
          <h2 className="text-lg font-medium text-slate-900 mb-2">Feature Under Construction</h2>
          <p className="max-w-md mx-auto">We are currently working on this feature. Please check back later for updates.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 font-normal text-sm">Summary of your content performance today.</p>
      </div>

      <div className="flex flex-wrap items-center justify-evenly  gap-5 p-8 pt-2">
        <InfoCard
          title="Total Article"
          value="1,234"
          statisticValue="+12 hari ini"
          icon={<i className="fa-solid fa-newspaper text-2xl text-slate-400"></i>}
        />
        <InfoCard
          title="View Hari Ini"
          value="850"
          statisticValue="5.2% dari kemarin"
          icon={<i className="fa-solid fa-eye text-2xl text-blue-400"></i>}
        />
        <InfoCard
          title="Total View"
          value="45.2K"
          statisticValue="+1.2K bulan ini"
          icon={<i className="fa-solid fa-chart-line text-2xl text-emerald-400"></i>}
        />
        <InfoCard
          title="Menunggu Review"
          value="5"
          statisticValue="Perlu segera diperiksa"
          icon={<i className="fa-solid fa-clock-rotate-left text-2xl text-amber-400"></i>}
        />
      </div>

      <div className="flex flex-col p-8 py-3 h-full overflow-auto">
        <h2 className="font-semibold text-lg text-slate-700">Statistic Terbaru</h2>
        <div className="mt-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm min-h-[200px] flex items-center justify-center text-slate-400 italic">
          Statistic {/* TODO: bagian statistic, tambahkan sesi statistic di sini
            1. view 7 hari terakhri
            2. article category (banyak article per category)
            3. article Terpopuler (top 5 article)
            4. Article terbaru (top 5 article terbaru)
          
          */}
        </div>
      </div>
    </div>
  );
}   