<template>
  <span>{{ dateString }}</span>
</template>

<script>
import VueI18n from "vue-i18n";
import moment from "moment";

export default {
  props: {
    date: {
      type: String,
      default: function() {
        return new Date().toUTCString();
      }
    },
    ago: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
  },
  data: function() {
    return {
      dateString: "",
      timer: null
    };
  },
  watch: {
    date() {
      this.changed();
    },
    ago() {
      this.changed();
    }
  },
  mounted: function() {
    this.changed();
  },
  methods: {
    changed() {
      if (this.timer != null) {
        let timer = this.timer;
        this.timer = null;
        clearInterval(timer);
      }
      this.updateDateString();
      if (this.ago) {
        const self = this;
        this.timer = setInterval(() => { self.updateDateString() }, 6000);
      }
    },
    updateDateString() {
      var m = moment(this.date);
      if (this.ago) {
        this.dateString = this.getDateString(m.toDate());
      } else {
        this.dateString = m.format("D MMMM YYYY");
      }
    },

    getDateString(date) {
      var ti = Math.abs(new Date().getTime() - date.getTime());
      ti = ti / 1000; // Convert to seconds
      if (ti < 1) {
        return this.$t("time.never");
      } else if (ti < 60) {
        return this.$t("time.recently");
      } else if (ti < 3600 && Math.round(ti / 60) < 60) {
        var diff = Math.round(ti / 60);
        return this.$tc("time.minutes", diff);
      } else if (ti < 86400 && Math.round(ti / 60 / 60) < 24) {
        var diff = Math.round(ti / 60 / 60);
        return this.$tc("time.hours", diff);
      } else {
        var diff = Math.round(ti / 60 / 60 / 24);
        return this.$tc("time.days", diff);
      }
    }
  },
  beforeDestroy() {
    if (this.timer != null) {
      clearInterval(this.timer);
    }
    this.timer = null;
  }
};
</script>
