<template>
  <div>
    <div>
      <div class="header text-uppercase">
        {{ $browser.i18n.getMessage('appName') }}
      </div>
      <div class="container">
        <div class="options">
          <h4>{{ $browser.i18n.getMessage('options') }}</h4>
          <hr/>
          <b-row>
            <b-col>
              <b-form-checkbox id="checkbox-doi-highlight" v-model="highlightStatus" name="checkbox-doi-highlight" plain @input="updateIsHighlighted">
                <div class="checkbox-element">
                  {{ $browser.i18n.getMessage('optionHighlight') }}
                </div>
              </b-form-checkbox>
            </b-col>
            <b-col>
              <b-button :disabled="!highlightStatus" class="color-modal-button" v-b-modal.highlight-color :style="{'background-color': selectedColor}"></b-button>
              <b-modal id="highlight-color" title="Highlight color" ok-only>
                <b-row>
                  <b-col class="color-picker">
                    <chrome-picker class="color-modal" :value="color" @input="updateHighlightColor" />
                  </b-col>
                  <b-col class="font-color-picker">
                    <b-row>
                      <strong>{{ $browser.i18n.getMessage('optionFontColor') }}</strong>
                    </b-row>
                    <b-row>
                      <b-form-group>
                        <b-form-radio v-model="fontColor" value="black">{{ $browser.i18n.getMessage('black') }}</b-form-radio>
                        <b-form-radio v-model="fontColor" value="white">{{ $browser.i18n.getMessage('white') }}</b-form-radio>
                      </b-form-group>
                    </b-row>
                  </b-col>
                  <br/>
                </b-row>
                <b-row>
                  <div class="lorem-ipsum">
                    Lorem ipsum <span class="doi-example" :style="{'color': fontColor, 'background-color': selectedColor}">{{ $browser.i18n.getMessage('doiExample') }}</span> magna aliqua.
                  </div>
                </b-row>
              </b-modal>
            </b-col>
          </b-row>

          <h4>{{ $browser.i18n.getMessage('supportUs') }}</h4>
          <hr/>
          <b-row>
            <b-col>
              <div v-html="$browser.i18n.getMessage('optionContribution')"></div>
              <div v-html="$browser.i18n.getMessage('optionContactUs')"></div>
              <div v-html="$browser.i18n.getMessage('optionDonation')"></div>
            </b-col>
          </b-row>

          <h4>{{ $browser.i18n.getMessage('optionCreditsTitle') }}</h4>
          <hr/>
          <b-row>
            <b-col>
              <div>{{ $browser.i18n.getMessage('optionDesignCredits') }}</div>
              <div>{{ $browser.i18n.getMessage('optionDevelopCredits') }}</div>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chrome } from 'vue-color'

export default {
  name: 'App',
  components: {
    'chrome-picker': Chrome
  },
  data() {
    return {
      color: null,
      fontColor: null,
      highlightStatus: null
    }
  },
  mounted() {
    this.$store.watch(
      (state, getters) => getters.isVuexLoaded,
      () => {
        this.color = { hex: this.$store.getters.highlightColor }
        this.highlightStatus = this.$store.getters.isHighlighted
        this.fontColor = this.$store.getters.fontColor
      }
    );
  },
  computed: {
    selectedColor() {
      return this.color.hex
    }
  },
  methods: {
    updateHighlightColor(value) {
      this.color = value
      this.$store.dispatch('setHighlightColor', { highlight_color: this.color.hex })
    },
    updateIsHighlighted(value) {
      this.$store.dispatch('setIsHighlighted', { is_highlighted: value })
    },
    updateFontColor(value) {
      this.$store.dispatch('setFontColor', { font_color: value })
    },
    getColor() {
      return { hex: this.$store.getters.highlightColor }
    }
  }
};
</script>

<style lang="scss">
@import '~bootstrap/dist/css/bootstrap.css';
@import '~bootstrap-vue/dist/bootstrap-vue.css';

body {
  margin: 0px;
  font-size: 15px;
}

h4 {
  margin-top: 30px;
}

.header {
  font-family: 'Dejavu Sans';
  font-size: 30px;
  font-weight: 140;
  padding: 20px;
  display: flex;
  align-items: center;

  border-bottom: 1px solid lightgrey;
}
.options {
  margin-top: 20px;
}

.color-modal-button {
  height: 100%;
  width: auto;
}

.color-modal {
  width: 100% !important;
}

.color-picker {
  flex-grow: 4 !important;
}

.font-color-picker {
  flex-grow: 1 !important;
}

.lorem-ipsum {
  display: inline;
  margin: 1rem 1rem 0 1rem;
}

.doi-example {
  width: auto;
}

p {
  font-size: 20px;
}
</style>
