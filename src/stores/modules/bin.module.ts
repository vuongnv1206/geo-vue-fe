import { defineStore } from 'pinia'

export const useBinStore = defineStore('bin', {
  state: () => ({
    isBinQuestion: false,
    refresh: false,
  }),
  actions: {
    setBinQuestion(value: boolean) {
      this.isBinQuestion = value
    },
    setRefresh(value: boolean) {
      this.refresh = value
    },
  },
})
