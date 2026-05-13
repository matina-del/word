Component({
  properties: {
    word: { type: String, value: '' },
    phonetic: { type: String, value: '' },
    meaning: { type: String, value: '' },
    example: { type: String, value: '' },
    isFavorite: { type: Boolean, value: false }
  },
  methods: {
    onFavorite() {
      this.triggerEvent('favorite');
    },
    onVoice() {
      this.triggerEvent('voice', { word: this.data.word });
    }
  }
});





