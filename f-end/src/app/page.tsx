import Image from "next/image";
import { PlayerSummary } from "@/components/PlayerSummary";
import { TeamSummary } from "@/components/TeamSummary";

export default function Home() {
  return (
    <>
      <div>
        <PlayerSummary />
      </div>
      <div>
        <TeamSummary />
      </div>
    </>
  );
}
