import { usePluginData } from "@docusaurus/useGlobalData";
import Leaderboard from "../Leaderboard";
import { LeadboardData } from "@site/src/types/leaderboard";

export default function SingleLeaderboard() {
    const { singleLeaderboard } = usePluginData(
        "leaderboard-plugin"
    ) as LeadboardData;
    return <Leaderboard data={singleLeaderboard} />;
}
