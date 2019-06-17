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
            "https://www.rfa.org/uyghur/RSS"
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
            "https://www.rfa.org/english/RSS"
        ],
        isRTL: false
    }
};