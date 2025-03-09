import './telegram-web-app.js'
import {createApp} from 'vue'
import './css/app.scss'
import App from './App.vue'


const app = createApp(App)
app.mount('#app')


// Проверяем поддержку Service Worker API
if ('serviceWorker' in navigator) {
    (async () => {
        try {
            // Получаем все активные регистрации
            const registrations = await navigator.serviceWorker.getRegistrations();

            // Удаляем каждую регистрацию
            for (const registration of registrations) {
                await registration.unregister();
                console.log('Service Worker отключен:', registration.scope);
            }

            // Блокируем будущие регистрации (опционально)
            navigator.serviceWorker.register = async () => {
                // throw new Error('Регистрация Service Worker заблокирована');
            };

            // Принудительная перезагрузка страницы (опционально)
            if (registrations.length) {
                window.location.reload(true)
            }
        } catch (error) {
            console.error('Ошибка при отключении Service Worker:', error);
        }
    })();
} else {
    console.log('Service Workers не поддерживаются в этом браузере');
}