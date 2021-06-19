import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment/moment'
import router from '@router'
import store from '@state/store'
import Buefy from 'buefy'
import AutocompleteVue from 'autocomplete-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
// internal icons
import {
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faArchive,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faBars,
  faBoxOpen,
  faCalendarPlus,
  faCalendarTimes,
  faCaretDown,
  faCaretUp,
  faChartBar,
  faCheck,
  faCheckCircle,
  faClipboardList,
  faEllipsisV,
  faExclamationCircle,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faFan,
  faFile,
  faFrown,
  faHandsHelping,
  faHourglassHalf,
  faInfoCircle,
  faMinus,
  faPencilAlt,
  faPaperclip,
  faPlus,
  faReceipt,
  faSearch,
  faTicketAlt,
  faTimes,
  faTrashAlt,
  faUpload,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './app.vue'
// Globally register all `_base`-prefixed components
import '@components/_globals'

moment.locale('fr', {
  months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split(
    '_'
  ),
  monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split(
    '_'
  ),
  monthsParseExact: true,
  weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
  weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm',
  },
  calendar: {
    sameDay: '[Aujourd’hui à] LT',
    nextDay: '[Demain à] LT',
    nextWeek: 'dddd [à] LT',
    lastDay: '[Hier à] LT',
    lastWeek: 'dddd [dernier à] LT',
    sameElse: 'L',
  },
  relativeTime: {
    future: 'dans %s',
    past: 'il y a %s',
    s: 'quelques secondes',
    m: 'une minute',
    mm: '%d minutes',
    h: 'une heure',
    hh: '%d heures',
    d: 'un jour',
    dd: '%d jours',
    M: 'un mois',
    MM: '%d mois',
    y: 'un an',
    yy: '%d ans',
  },
  dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
  ordinal: function(number) {
    return number + (number === 1 ? 'er' : '')
  },
  meridiemParse: /PD|MD/,
  isPM: function(input) {
    return input.charAt(0) === 'M'
  },
  // In case the meridiem units are not separated around 12, then implement
  // this function (look at locale/id.js for an example).
  // meridiemHour : function (hour, meridiem) {
  //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
  // },
  meridiem: function(hours, minutes, isLower) {
    return hours < 12 ? 'PD' : 'MD'
  },
  week: {
    dow: 1, // Monday is the first day of the week.
  },
})

Vue.use(VueMoment, { moment })

library.add(
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faArchive,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faBars,
  faBoxOpen,
  faCalendarPlus,
  faCalendarTimes,
  faCaretDown,
  faCaretUp,
  faChartBar,
  faCheck,
  faCheckCircle,
  faClipboardList,
  faEllipsisV,
  faExclamationCircle,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faFan,
  faFile,
  faFrown,
  faHandsHelping,
  faHourglassHalf,
  faInfoCircle,
  faMinus,
  faPaperclip,
  faPencilAlt,
  faPlus,
  faReceipt,
  faSearch,
  faTicketAlt,
  faTimes,
  faTrashAlt,
  faUpload
)
Vue.component('vue-fontawesome', FontAwesomeIcon)

Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
})

Vue.component('autocomplete-vue', AutocompleteVue)

// Don't warn about using the dev version of Vue in development.
Vue.config.productionTip = process.env.NODE_ENV === 'production'

// If running inside Cypress...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Ensure tests fail when Vue emits an error.
  Vue.config.errorHandler = window.Cypress.cy.onUncaughtException
}

const app = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

// If running e2e tests...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Attach the app to the window, which can be useful
  // for manually setting state in Cypress commands
  // such as `cy.logIn()`.
  window.__app__ = app
}
