import Image from "next/image";
import { PlayerSummary } from "@/components/PlayerSummary";
import { TeamSummary } from "@/components/TeamSummary";

export default function Home() {
  return (
    <div className="border border-slate-900 bg-slate-900">
      <div>
        <PlayerSummary />
      </div>
      <div>
        <TeamSummary />
      </div>
    </div>
  );
}
