import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
    title: "Schuhzwerg Billard",
    tagline: "",
    favicon: "img/favicon.ico",

    // Set the production url of your site here
    url: "https://schuhzwerg.com",
    baseUrl: "",

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "de",
        locales: ["de"],
    },

    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarPath: "./sidebars.ts",
                },
                blog: false,
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        colorMode: {
            defaultMode: "dark",
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },
        navbar: {
            title: "Schuhzwerg Billard",
            logo: {
                alt: "Schuhzwerg Logo",
                src: "img/navbar_logo.png",
            },
            hideOnScroll: true,
            items: [
                {
                    to: "docs/results/",
                    label: "Ergebnisse",
                    position: "left",
                },
                {
                    href: "https://github.com/mowi12/schuhzwerg-billard",
                    label: "GitHub",
                    position: "right",
                },
            ],
        },
        footer: {
            style: "dark",
            copyright: `Copyright © ${new Date().getFullYear()} Moritz Wieland. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
        tableOfContents: {
            minHeadingLevel: 2,
            maxHeadingLevel: 3,
        },
    } satisfies Preset.ThemeConfig,
    plugins: ["./src/plugins/leaderboard-plugin/index.ts"],
};

export default config;
