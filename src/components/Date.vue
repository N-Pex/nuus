<template>
  <span>{{ dateString }}</span>
</template>

<script>

import VueI18n from 'vue-i18n';
import moment from 'moment';

export default {
  props: {
    date: {
      type: String,
      default: function() {
        return new Date().toUTCString();
      }
    }
  },
  data: function() {
    return {
      dateString: "",
      timer: null
    };
  },
  created: function() {
    this.updateDateString();
    this.timer = setInterval(this.updateDateString, 6000);
  },
  methods: {
    updateDateString() {
      this.dateString = this.getDateString();
    },

    getDateString() {
      var date = moment(this.date).toDate();
      var ti = Math.abs(new Date().getTime() - date.getTime());
      ti = ti / 1000; // Convert to seconds
  		if (ti < 1)
	  	{
		  	return this.$t("time.never");
		  }
		else if (ti < 60)
		{
			return this.$t("time.recently");
		}
		else if (ti < 3600 && Math.round(ti / 60) < 60)
		{
			var diff = Math.round(ti / 60);
      if (diff == 1) {
        return this.$t("time.minute", { time: diff });
      }
      return this.$t("time.minutes", { time: diff });
		}
		else if (ti < 86400 && Math.round(ti / 60 / 60) < 24)
		{
			var diff = Math.round(ti / 60 / 60);
			if (diff == 1) {
        return this.$t("time.hour", { time: diff });
      }
        return this.$t("time.hours", { time: diff });
		}
		else {
			var diff = Math.round(ti / 60 / 60 / 24);
			if (diff == 1) {
        return this.$t('time.day', { time: diff });
      }
        return this.$t('time.days', { time: diff });
		}
    },
    cancelAutoUpdate: function() {
      clearInterval(this.timer);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>
