export default {
    uyghur: {
        themeCSSVariables: require("!css-loader!@/assets/css/uyghur.css").toString(),
        webFontCssFile: "./assets/fonts/uyghur.css",
        webFontConfig: {
            custom: {
                families: ["AlpidaUnicodeSystem"],
                testStrings: {
                    "AlpidaUnicodeSystem": "\u067E"
                }
            }
        },
        feeds: [
            {title: "Main service", url: "https://www.rfa.org/uyghur/RSS"},
            {title: "Main service (cached)", url: "./assets/uyghur.xml"}
        ],
        isRTL: true
    },
    mandarin: {
        themeCSSVariables: require("!css-loader!@/assets/css/mandarin.css").toString(),
        webFontCssFile: "./assets/fonts/mandarin.css",
        webFontConfig: {
            custom: {
                families: ["AlpidaUnicodeSystem"],
                testStrings: {
                    "AlpidaUnicodeSystem": "\u067E"
                }
            }
        },
        feeds: [
            {title: "Main service", url: "https://www.rfa.org/mandarin/RSS"},
            {title: "Main service (cached)", url: "./assets/mandarin.xml"}
        ],
        isRTL: false
    },
    cantonese: {
        themeCSSVariables: require("!css-loader!@/assets/css/cantonese.css").toString(),
        webFontCssFile: "./assets/fonts/cantonese.css",
        webFontConfig: {
            custom: {
                families: ["AlpidaUnicodeSystem"],
                testStrings: {
                    "AlpidaUnicodeSystem": "\u067E"
                }
            }
        },
        feeds: [
            {title: "Main service", url: "https://www.rfa.org/cantonese/RSS"}
        ],
        isRTL: false
    },
    burmese: {
        themeCSSVariables: require("!css-loader!@/assets/css/burmese.css").toString(),
        webFontCssFile: "./assets/fonts/burmese.css",
        webFontConfig: {
            custom: {
                families: ["Zawgyi-One"],
                testStrings: {
                    "Zawgyi-One": "\u1000"
                }
            }
        },
        feeds: [
            {title: "Main service", url: "https://www.rfa.org/burmese/RSS"}
        ],
        isRTL: false
    },
    english: {
        themeCSSVariables: require("!css-loader!@/assets/css/english.css").toString(),
        webFontCssFile: "./assets/fonts/english.css",
        webFontConfig: {
            google: {
                families: ['Roboto']
            }
        },
        feeds: [
            {title: "Main service", url: "https://www.rfa.org/english/RSS"},
            {title: "Main service (cached)", url: "./assets/english.xml"}
        ],
        isRTL: false
    }
};