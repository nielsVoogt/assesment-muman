import moment from "moment";

export default {
  methods: {
    formatDate(date, format) {
      return moment(date).format(format);
    },
  },
};
