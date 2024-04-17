interface HighlightProps {
    children: React.ReactNode;
}

export default function Highlight(props: HighlightProps) {
    const { children } = props;
    return <span style={{ color: "rgb(253, 119, 119)" }}>{children}</span>;
}
