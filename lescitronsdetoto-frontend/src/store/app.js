// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    debug: false,
    colourPrimary: "yellow-lighten-2",
    colourSecondary: "light-green-lighten-1"
  }),
})
