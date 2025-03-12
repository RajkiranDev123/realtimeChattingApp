import moment from "moment"

 export const formatTime = (timestamp) => {
    const now = moment()
    const diff = now.diff(moment(timestamp), "days")
    if (diff < 1) {
      return `Today ${moment(timestamp).format("hh:mm A")}`
    } else if (diff === 1) {
      return `Yesterday ${moment(timestamp).format("hh:mm A")}`

    } else {
      return moment(timestamp).format("MMM D, hh:mm A")

    }
  }