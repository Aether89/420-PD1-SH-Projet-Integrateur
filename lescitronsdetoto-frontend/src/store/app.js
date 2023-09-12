// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    debug: true,
    colourAccent: "amber-lighten-2",
    colourPrimary: "yellow-lighten-4",
    colourSecondary: "light-green-lighten-1",
    colourTernary: "yellow-lighten-2"
  }),
})
