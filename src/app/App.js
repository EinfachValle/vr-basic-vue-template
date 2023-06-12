import {ref} from 'vue';

import Page404 from '../views/pages/Page404/page404.vue';

import Home from '../views/pages/Home/home.vue';

export default {
  name: 'app',
  components: {
    Page404,
    Home,
  },
  data() {
    return {
      currentTheme: ref(true),
    }
  },
  async mounted() {
    this.loadTheme();
  },
  methods: {
    toggleTheme() {
      this.currentTheme = ref(!this.currentTheme);
      localStorage.setItem('theme', this.currentTheme);
    },
    loadTheme() {
      if (localStorage.getItem('theme') === 'true') {
        this.currentTheme = ref(true)
      } else {
        this.currentTheme = ref(false)
      }
    }
  }
}
