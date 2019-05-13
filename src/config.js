export default {
    uyghur: {
        themeBodyFont: "AlpidaUnicodeSystem",
        themeBodySize: 14,
        webFontConfig: {
            custom: {
                families: ["AlpidaUnicodeSystem"],
                urls: ["./assets/fonts/uighur.css"],
                testStrings: {
                    "AlpidaUnicodeSystem": "\u067E"
                }
            }
        }
    },
    english: {
        themeBodyFont: "Indie Flower",
        themeBodySize: 14,
        webFontConfig: {
            custom: {
                families: ["Indie Flower"],
                urls: ["./assets/fonts/english.css"]
            }
        }
    }
};