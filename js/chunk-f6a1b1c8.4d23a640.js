(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f6a1b1c8"],{"4d79":function(t,e,s){"use strict";var a=s("80da"),n=s.n(a);n.a},"5dde":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"mainRoot"},[s("v-app-bar",{staticClass:"header",attrs:{flat:""}},[s("v-app-bar-nav-icon",[s("v-icon",{attrs:{color:"accent"}},[t._v("$vuetify.icons.logoInverted")])],1),s("v-spacer"),s("v-toolbar-title",{staticClass:"white--text feedTitle text-uppercase"},[t._v(t._s(t.$t("more")))])],1),s("v-container",{staticClass:"content",attrs:{fluid:"","pa-5":""}},[s("v-row",[s("v-col",[s("div",{staticClass:"black--text settingsCategory"},[t._v(t._s(t.$t("service")))])])],1),s("v-row",{staticClass:"pa-2"},[s("v-col",[s("v-radio-group",{model:{value:t.service,callback:function(e){t.service=e},expression:"service"}},t._l(t.services,(function(t){return s("v-radio",{key:t.value,attrs:{label:t.name,value:t.value}})})),1)],1)],1),s("v-row",[s("v-col",[s("div",{staticClass:"black--text settingsCategory"},[t._v(t._s(t.$t("font_size")))])])],1),s("v-row",{staticClass:"pa-2"},[s("v-col",[s("v-slider",{attrs:{min:"-100",max:"100",step:"25",ticks:"always","tick-size":"5"},scopedSlots:t._u([{key:"prepend",fn:function(){return[s("span",{staticClass:"settingsSmallFontA"},[t._v("A")])]},proxy:!0},{key:"append",fn:function(){return[s("span",{staticClass:"settingsLargeFontA"},[t._v("A")])]},proxy:!0}]),model:{value:t.textSizeAdjustment,callback:function(e){t.textSizeAdjustment=e},expression:"textSizeAdjustment"}})],1)],1),s("v-row",[s("v-col",[s("div",{staticClass:"appVersionText"},[t._v(t._s(t.$root.appVersionString))])])],1)],1)],1)},n=[],i=s("db49"),o={name:"More",computed:{services:function(){return Object.keys(i["a"]).map((function(t){return{name:i["a"][t].displayName,value:t}}))},service:{get:function(){return this.$store.state.flavor},set:function(t){this.$store.commit("setFlavor",t)}},textSizeAdjustment:{get:function(){return this.$store.state.textSizeAdjustment},set:function(t){this.$store.commit("setTextSizeAdjustment",t)}}},watch:{$route:function(t,e){this.thisRouteName==t.name&&console.log("More Shown")}}},r=o,c=(s("4d79"),s("2877")),l=Object(c["a"])(r,a,n,!1,null,"38d30208",null);e["default"]=l.exports},"80da":function(t,e,s){}}]);
//# sourceMappingURL=chunk-f6a1b1c8.4d23a640.js.map