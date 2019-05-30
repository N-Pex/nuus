export default {
    uyghur: {
        themeBodyFont: "AlpidaUnicodeSystem",
        themeBodySize: 14,
        webFontCssFile: "./assets/fonts/uyghur.css",
        webFontConfig: {
            custom: {
                families: ["AlpidaUnicodeSystem"],
                testStrings: {
                    "AlpidaUnicodeSystem": "\u067E"
                }
            }/*,
            loading: function() {
                console.log("Loading font");
            },
            active: function() {
                console.log("Loading font done");
            },
            inactive: function() {
                console.log("Font invalid");
            }*/
        },
        feeds: [
            "./assets/uyghur.xml",
            "./assets/english.xml",
            "https://www.rfa.org/uyghur/RSS"
        ],
        isRTL: true
    },
    english: {
        themeBodyFont: "Indie Flower",
        themeBodySize: 14,
        webFontCssFile: "./assets/fonts/english.css",
        webFontConfig: {
            custom: {
                families: ["Indie Flower"]
            }
        },
        feeds: [
            "https://www.nasa.gov/rss/dyn/mission_pages/kepler/news/kepler-newsandfeatures-RSS.rss",
            "https://www.rfa.org/english/RSS"
        ],
        isRTL: false
    }
};