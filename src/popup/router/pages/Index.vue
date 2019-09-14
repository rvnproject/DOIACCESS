<template>
  <div>
    <div class="header">
      <div class="title text-uppercase">
        <!-- <img src="../../../assets/images/do_i_access_logo.svg"/> -->
        {{ $browser.i18n.getMessage('appName') }}
      </div>
      <div class="sub-title">by <a target="_blank" rel="noopener noreferrer" href="https://ravenproject.me">Raven Project</a></div>
    </div>

    <div class="user-interaction custom-container">
      <div class="custom-row app-informations">
        <div class="lock">
          <font-awesome-icon v-on:click="switchLockState()" :icon="lockIcon()" size="lg" />
        </div>
        <toggle-button
          :value="currentUrlState()"
          :labels="{ checked: 'ON', unchecked: 'OFF' }"
          :color="{ checked: '#bada55', unchecked: '#ff6961' }"
          :height="30"
          :width="65"
          @change="swicthUrlState($event)"
          :sync="true"
          :disabled="!getLockState()"
        />
        <div class="current-url" v-bind:title="currentUrl">{{ currentUrl }}</div>
      </div>
      <div class="custom-row base-url">

        <!-- switch button DOI / ISBN -->
        <!--<b-form-radio-group
          class="doi-isbn-selector"
          id="btn-radios-1"
          v-model="selected"
          :options="options"
          buttons
          size="sm"
          button-variant="outline-dark"
          name="radio-btn-outline"
        /> -->

        <div v-show="selected == 'doi'" class="custom-row full-width">
          <input @keyup="storeBaseUrl($event, 'doi')" class="doi-input base-url-input" ref="doiBaseUrlInput" size="15" type="text" placeholder="Sci-Hub URL like https://sci-hub.se" />
          <div class="question-mark" v-b-tooltip.hover title="Click here to get the default sci-hub URL from whereisscihub.now.sh">
            <font-awesome-icon :icon="questionMark" size="lg" @click="getBaseUrl('doi')" />
          </div>
        </div>

        <!-- ISBN input field -->
        <!-- <div v-show="selected == 'isbn'" class="custom-row full-width">
          <input @keyup="storeBaseUrl($event, 'isbn')" class="isbn-input base-url-input" ref="isbnBaseUrlInput" size="15" type="text" placeholder="https://libgen.is for example" />
          <div class="question-mark" v-b-tooltip.hover title="Click here to get the default libgen URL from whereislibgen.now.sh">
            <font-awesome-icon :icon="questionMark" size="lg" @click="getBaseUrl('isbn')" />
          </div>
        </div> -->
      </div>
    </div>

    <div class="user-information custom-container">
      <div class="custom-row scanned-doi">
        <b-card class="text-center" v-if="!isBaseUrlValid('doi')">
          <b-card-text>
            {{ $browser.i18n.getMessage('invalidGivenUrl') }}
          </b-card-text>
        </b-card>
        <b-card class="text-center" v-else-if="this.$store.state.error_message">
          <b-card-text>
            {{ $browser.i18n.getMessage('invalidCurrentUrl') }}
          </b-card-text>
        </b-card>
        <b-card class="text-center" v-else-if="currentUrlState()">
          <b-card-text> {{ getCurrentTextDoiCount() }} {{ $browser.i18n.getMessage('doiCountMessage') }} </b-card-text>
        </b-card>
        <b-card class="text-center" v-else>
          <b-card-text>
            {{ $browser.i18n.getMessage('switchButtonCount') }}
          </b-card-text>
        </b-card>
      </div>

      <div class="custom-row report-support">
        <b-button variant="outline-dark" href="https://ravenproject.me/#contact" target="_blank" rel="noopener noreferrer">{{ $browser.i18n.getMessage('bugReport') }}</b-button>
        <b-button variant="outline-dark" href="https://chrome.google.com/webstore/detail/ravendoi/edamfibpjbadepheeohkbnanbbgjnfpl" target="_blank" rel="noopener noreferrer">{{ $browser.i18n.getMessage('rateUs') }}</b-button>
        <b-button variant="outline-dark" href="https://ravenproject.me/#support-us" target="_blank" rel="noopener noreferrer">{{ $browser.i18n.getMessage('supportUs') }}</b-button>
      </div>
    </div>

    <div class="footer">
      <div>
        <a class="twitter-button" href="https://twitter.com/RvnProject" target="_blank" rel="noopener noreferrer">
          <font-awesome-icon :icon="twitterIcon" size="2x"></font-awesome-icon>
        </a>
      </div>
      <div class="scite-section" v-html="$browser.i18n.getMessage('sciteAi')"></div>
      <div>
        <font-awesome-icon @click="openOptions()" class="parameter-button" :icon="parameterIcon" size="2x"> </font-awesome-icon>
      </div>
      <slider-picker v-model="colors" />
    </div>
  </div>
</template>

<script>
import { faLock, faLockOpen, faCog, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { parse } from 'tldjs';
import { updateBadge } from '../../../utils/badges';
import { Slider } from 'vue-color';
import axios from 'axios';

global.browser = require('webextension-polyfill');

export default {
  data() {
    return {
      twitterIcon: faTwitter,
      questionMark: faQuestion,
      parameterIcon: faCog,
      isAppUsable: true,
      selected: 'doi',
      options: [
        { text: 'DOI', value: 'doi' },
        { text: 'ISBN', value: 'isbn', disabled: true }
      ]
    };
  },
  components: {
    'slider-picker': Slider
  },
  mounted() {
    this.$refs.doiBaseUrlInput.value = this.$store.getters.baseUrlByIdType['doi'];
    // this.$refs.isbnBaseUrlInput.value = this.$store.getters.baseUrlByIdType['isbn'];
    this.baseUrlColor('doi');
    // this.baseUrlColor('isbn');
    updateBadge();
  },
  methods: {
    getCurrentTextDoiCount() {
      if (this.$store.getters.doiCountByTabId[this.$store.getters.currentTabId] != null) {
        return this.$store.getters.doiCountByTabId[this.$store.getters.currentTabId];
      }
      return 0;
    },
    swicthUrlState(event) {
      this.$store.dispatch('setStateByUrl', { url: this.$store.getters.currentUrl, enable: event.value });
      if (event.value === true) {
        browser.runtime.sendMessage({
          switchState: true,
        });
      }
      updateBadge();
    },
    currentUrlState() {
      if (this.$store.getters.lockedUrlState !== null) {
        return this.$store.getters.lockedUrlState;
      }
      const { currentUrl } = this.$store.getters;
      if (currentUrl in this.$store.getters.stateByUrl) {
        return this.$store.getters.stateByUrl[currentUrl];
      }
      return false;
    },
    getLockState() {
      if (this.$store.getters.lockedUrlState === null) {
        return true;
      }
      return false;
    },
    switchLockState() {
      if (this.$store.getters.lockedUrlState !== null) {
        this.$store.dispatch('setLockedUrlState', { locked_url_state: null });
      } else {
        this.$store.dispatch('setLockedUrlState', { locked_url_state: this.currentUrlState() });
      }
      updateBadge();
    },
    lockIcon() {
      // true == open
      // false == close
      if (this.getLockState() === true) {
        return faLockOpen;
      }
      return faLock;
    },
    baseUrlColor(idType) {
      var baseUrlInput = idType === 'doi' ? this.$refs.doiBaseUrlInput : this.$refs.isbnBaseUrlInput
      if (this.isBaseUrlValid(idType)) {
        baseUrlInput.classList.add('valid');
        baseUrlInput.classList.remove('invalid');
      } else {
        baseUrlInput.classList.add('invalid');
        baseUrlInput.classList.remove('valid');
      }
    },
    storeBaseUrl(event, idType) {
      this.$store.dispatch('setBaseUrlByIdType', { id_type: idType, base_url: event.target.value });
      this.baseUrlColor(idType);
    },
    openOptions() {
      browser.runtime.openOptionsPage();
    },
    isBaseUrlValid(idType) {
      const formattedUrl = new parse(this.$store.getters.baseUrlByIdType[idType]);

      if (formattedUrl.domain || formattedUrl.isIp) {
        return true;
      }
      return false;
    },
    getBaseUrl(idType) {
      if (idType === 'doi') {
        var source = 'scihub'
        var baseUrlInput = this.$refs.doiBaseUrlInput
      } else if (idType === 'isbn') {
        var source = 'libgen'
        var baseUrlInput = this.$refs.isbnBaseUrlInput
      }
      baseUrlInput.disabled = true
      axios.get(`https://whereis${source}.now.sh/api`).then(response => {
        baseUrlInput.value = response.data[0]
        baseUrlInput.disabled = false
        this.storeBaseUrl({target: {value: baseUrlInput.value}}, idType)
      })
    }
  },
  computed: {
    currentUrl() {
      return this.$store.getters.currentUrl;
    },
    baseUrlPopoverConfig() {
      return {
        html: true,
        content: () => {
          return browser.i18n.getMessage('scihubLocation');
        },
      };
    },
  },
};
</script>

<style lang="scss">
.full-width {
  width: 100%;
}

.header {
  font-family: 'Dejavu Sans';
  font-size: 15px;
  font-weight: 140;
  padding: 20px;
  display: flex;
  align-items: center;

  border-bottom: 1px solid lightgrey;

  .title {
    font-size: 30px;
    img {
      width: 200px;
    }
  }
  .sub-title {
    font-size: 13px;
    padding-left: 10px;
    align-self: flex-end;
  }
}

// like container and row from bootstrap but without bootstrap properties
.custom-container {
}

.custom-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-left: 0;
  margin-right: 0;
}

.user-interaction {
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid lightgrey;
  .app-informations {
    justify-content: flex-start;
    vertical-align: middle;
    align-items: center;
    margin-bottom: 20px;
    label {
      margin-bottom: 0;
    }
    .lock {
      // Disallow the text selection
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
      svg {
        cursor: pointer;
      }
      .fa-lock-open {
        // color transition
        -webkit-transition: color 0.2s ease-in;
        -moz-transition: color 0.2s ease-in;
        -o-transition: color 0.2s ease-in;
        transition: color 0.2s ease-in;
        color: lightgrey;
        margin-right: 15px;
      }
      .fa-lock {
        // color transition
        -webkit-transition: color 0.2s ease-in;
        -moz-transition: color 0.2s ease-in;
        -o-transition: color 0.2s ease-in;
        transition: color 0.2s ease-in;
        color: black;
        margin-right: 20px;
      }
    }
    .current-url {
      font-size: 13px;
      margin-left: 20px;
      overflow: hidden;
      white-space: nowrap;
      width: 190px;
      text-overflow: ellipsis;
    }
  }
  .doi-isbn-selector {
    label {
      cursor: pointer;
      font-size: 0.75rem !important;
      box-shadow: none !important;
      &:focus {
        box-shadow: none !important;
      }
    }
  }
  .question-mark {
    padding-top: 3px;
    cursor: pointer;
    // Disallow the text selection
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */  
  }
  .base-url {
    font-size: 14px;
    justify-content: flex-start;
    vertical-align: middle;
    align-items: center;
    input {
      font-size: 0.75rem;
      padding: 1px 3px 1px 3px;
    }
    button {
      font-size: 0.75rem;
      padding: 2px 7px;
      // Bootstrap unset css
      box-shadow: initial;
    }
    .valid {
      border: 2px solid #bada55;
      box-shadow: 0 0 2px #bada55;
    }
    .invalid {
      border: 2px solid #ff6961;
      box-shadow: 0 0 2px #ff6961;
    }
  }
  .base-url-input {
    height: 28px;
    width: 100%;
    margin-right: 10px;
  }
}

.user-information {
  padding: 20px;
  border-bottom: 1px solid lightgrey;
  .scanned-doi {
    .card-body {
      text-align: left;
      padding: 10px 15px;
    }
    .card {
      box-shadow: 0 8px 6px -6px lightgrey;
      width: 100%;
      max-width: 100%;
    }
  }
  .report-support {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    margin-top: auto;
    .btn {
      width: 100px;
      font-size: 13px;
    }
    a {
      padding: 0.5rem 0.375rem;
    }
  }
}

.footer {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  .twitter-button {
    cursor: pointer;
    color: black;
    transition: all 0.2s;
    &:hover {
      color: #38a1f3;
    }
  }
  .parameter-button {
    cursor: pointer;
    color: black;
    transition: all 2s;
    &:hover {
      transform: rotate(360deg);
    }
  }
  .scite-section {
    padding: 3px;
  }
}
</style>
