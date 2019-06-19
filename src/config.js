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
            {title: "Main service", url: "https://www.rfa.org/uyghur/RSS"},
            {title: "Main service (cached)", url: "./assets/uyghur.xml"}
        ],
        isRTL: true
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