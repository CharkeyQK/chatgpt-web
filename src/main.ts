import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'
import Keycloak from 'keycloak-js'


async function bootstrap() {
  const app = createApp(App)
  setupAssets()

  setupScrollbarStyle()

  setupStore(app)

  setupI18n(app)

  await setupRouter(app)

  app.mount('#app')
}



let initOptions = {
  url: 'https://sso.dstp.com.cn/', realm: 'devops', clientId: 'chatgpt', onLoad: 'login-required'
}

let keycloak = new Keycloak(initOptions);

keycloak.init({ onLoad: 'login-required' }).then((auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    console.log("bootstrap")
    bootstrap()
    setTimeout(() => {
      window.location.href = window.location.origin + '/#/';
    }, 1000)

  }

  //Token Refresh
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        console.log("refreshed")
      } else {
        console.log("refreshed else")
      }
    }).catch(() => {
      console.log("refreshed exception catch")
    });
  }, 6000)

}).catch(() => {
  console.log("keycloak.init exception catch")
});