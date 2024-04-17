// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import Highlight from "../components/Highlight";
import SingleLeaderboard from "@site/src/components/SingleLeaderboard";

export default {
    // Re-use the default mapping
    ...MDXComponents,
    Highlight,
    SingleLeaderboard,
};
