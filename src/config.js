export default {
    uyghur: {
        webFontName: "'AlpidaUnicodeSystem', 'Roboto', sans-serif",
        webFontSize: "15pt",
        webFontCssFile: "./assets/fonts/uyghur.css",
        webFontConfig: {
            custom: {
                families: ["AlpidaUnicodeSystem"],
                testStrings: {
                    "AlpidaUnicodeSystem": "\u067E"
                }
            }
        },
        services: [
            {title: "Main service", url: "https://www.rfa.org/uyghur/RSS"},
            {title: "Main service (cached)", url: "./assets/uyghur.xml"}
        ],
        isRTL: true
    },
    mandarin: {
        webFontName: "'Microsoft YaHei', 'Roboto', sans-serif",
        webFontSize: "15pt",
        webFontCssFile: "./assets/fonts/mandarin.css",
        webFontConfig: {
            custom: {
                families: ["AlpidaUnicodeSystem"],
                testStrings: {
                    "AlpidaUnicodeSystem": "\u067E"
                }
            }
        },
        services: [
            {title: "Main service", url: "https://www.rfa.org/mandarin/RSS"},
            {title: "Main service (cached)", url: "./assets/mandarin.xml"}
        ],
        isRTL: false
    },
    cantonese: {
        webFontName: "'Microsoft YaHei', 'Roboto', sans-serif",
        webFontSize: "15pt",
        webFontCssFile: "./assets/fonts/cantonese.css",
        webFontConfig: {
            custom: {
                families: ["AlpidaUnicodeSystem"],
                testStrings: {
                    "AlpidaUnicodeSystem": "\u067E"
                }
            }
        },
        services: [
            {title: "Main service", url: "https://www.rfa.org/cantonese/RSS"}
        ],
        isRTL: false
    },
    burmese: {
        webFontName: "'Zawgyi-One', 'Roboto', sans-serif",
        webFontSize: "15pt",
        webFontCssFile: "./assets/fonts/burmese.css",
        webFontConfig: {
            custom: {
                families: ["Zawgyi-One"],
                testStrings: {
                    "Zawgyi-One": "\u1000"
                }
            }
        },
        services: [
            {title: "Main service", url: "https://www.rfa.org/burmese/RSS"}
        ],
        isRTL: false
    },
    english: {
        webFontName: "'Roboto', sans-serif",
        webFontSize: "15pt",
        webFontCssFile: "./assets/fonts/english.css",
        webFontConfig: {
            google: {
                families: ['Roboto']
            }
        },
        services: [
            {title: "Main service", url: "https://www.rfa.org/english/RSS", categories: [
                {url: "./assets/english_cat1.xml"},
                {url: "./assets/english_cat2.xml"}
            ]},
            {title: "Main service (cached)", url: "./assets/english.xml", categories: [
                {url: "./assets/english_cat1.xml"},
                {url: "./assets/english_cat2.xml"}
            ]}
        ],
        isRTL: false
    }
};