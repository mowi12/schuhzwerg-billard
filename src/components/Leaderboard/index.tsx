import React from "react";
import { LeaderboardEntry } from "@site/src/types/leaderboard";
import "./style.css";

interface LeaderboardProps {
    data: LeaderboardEntry[];
    minimumParticipationThreshold: number;
}

type Order = "asc" | "desc";

const headers = [
    "Name",
    "Elo",
    "Lowest Elo",
    "Highest Elo",
    "Winrate",
    "Games Played",
    "Wins",
    "Losses",
    "Draws",
    "Win Streak",
    "Longest Win Streak",
];

interface Key {
    name: keyof LeaderboardEntry;
    order: Order;
}

const keys: Key[] = [
    {
        name: "name",
        order: "desc",
    },
    {
        name: "elo",
        order: "desc",
    },
    {
        name: "lowest_elo",
        order: "desc",
    },
    {
        name: "highest_elo",
        order: "desc",
    },
    {
        name: "winrate",
        order: "desc",
    },
    {
        name: "games",
        order: "desc",
    },
    {
        name: "wins",
        order: "desc",
    },
    {
        name: "losses",
        order: "asc",
    },
    {
        name: "draws",
        order: "asc",
    },
    {
        name: "current_win_streak",
        order: "desc",
    },
    {
        name: "longest_win_streak",
        order: "desc",
    },
];

interface SortConfig {
    field: string;
    order: Order;
}

let oldSortConfig: SortConfig = {
    field: headers[1],
    order: keys[1].order,
};

type ValueOf<T> = T[keyof T];

function formatCellContent(content: ValueOf<LeaderboardEntry>) {
    if (typeof content === "number") {
        return content.toLocaleString("de-DE", { maximumFractionDigits: 2 });
    }
    return content;
}

function sortFields(
    a: LeaderboardEntry,
    b: LeaderboardEntry,
    sortConfig: SortConfig
) {
    const { name, order } = keys[headers.indexOf(sortConfig.field)];
    const aAttribute = a[name];
    const bAttribute = b[name];

    if (typeof aAttribute === "string" && typeof bAttribute === "string") {
        return order === "asc"
            ? aAttribute.localeCompare(bAttribute)
            : aAttribute.localeCompare(bAttribute);
    }

    if (typeof aAttribute === "number" && typeof bAttribute === "number") {
        return order === "asc"
            ? aAttribute - bAttribute
            : bAttribute - aAttribute;
    }

    throw new Error("Cannot compare different types!");
}

// https://stackoverflow.com/questions/48846289/why-is-my-react-component-is-rendering-twice
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
let once = false;

function sortLeaderBoard(
    leaderboard: LeaderboardEntry[],
    sortConfig: SortConfig | null
) {
    if (isDev && !once) {
        once = true;
        return;
    }

    if (sortConfig !== null) {
        if (sortConfig.order === "desc") {
            leaderboard.sort((a, b) => sortFields(b, a, sortConfig));
        } else {
            leaderboard.sort((a, b) => sortFields(a, b, sortConfig));
        }
    }
}

function onHeaderClick(
    header: string,
    setSortConfig: (sortConfig: SortConfig) => void
) {
    let newSortConfig: SortConfig;
    if (oldSortConfig.field === header) {
        const newOrder = oldSortConfig.order === "asc" ? "desc" : "asc";
        newSortConfig = { field: header, order: newOrder };
    } else {
        newSortConfig = { field: header, order: "asc" };
    }
    oldSortConfig = newSortConfig;
    setSortConfig(newSortConfig);
}

export default function Leaderboard(props: LeaderboardProps) {
    const { data, minimumParticipationThreshold } = props;
    const [sortConfig, setSortConfig] = React.useState(oldSortConfig);

    React.useMemo(() => {
        sortLeaderBoard(data, sortConfig);
    }, [data, sortConfig]);

    return (
        <div>
            <i>
                Notiz: Spieler mit weniger als
                {` ${minimumParticipationThreshold} `}
                Teilnahmen werden zuletzt gelistet.
            </i>
            <br />
            <br />
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        onHeaderClick(header, setSortConfig)
                                    }
                                    className={
                                        sortConfig.field === header
                                            ? sortConfig.order
                                            : ""
                                    }
                                >
                                    {header}
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry) => (
                        <tr key={entry.name}>
                            {keys.map(({ name }) => (
                                <td key={name}>
                                    {formatCellContent(entry[name])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
