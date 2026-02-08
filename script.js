// 1. Инициализация Telegram WebApp
let tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

// 2. ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ СТРАНИЦ (Bottom Nav)
function showPage(pageId, navElement) {
    // Скрываем все страницы
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Показываем выбранную страницу
    document.getElementById(pageId).classList.add('active');

    // Сбрасываем стили навигации
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active-nav'));
    // Подсвечиваем активную кнопку
    if (navElement) {
        navElement.classList.add('active-nav');
    }

    // Вибрация (тактильный отклик)
    tg.HapticFeedback.impactOccurred('light');
}

// 3. ФУНКЦИЯ КОДИРОВАНИЯ В HEX (с поддержкой русского языка)
function toHex(str) {
    try {
        // Кодируем строку в UTF-8, чтобы русские буквы не превратились в кашу
        var s = unescape(encodeURIComponent(str));
        var res = '';
        for (var i = 0; i < s.length; i++) {
            // Превращаем каждый символ в 16-ричный код
            res += s.charCodeAt(i).toString(16).padStart(2, '0');
        }
        return res;
    } catch (e) {
        console.error("Ошибка кодирования:", e);
        return "";
    }
}

// 4. ФУНКЦИЯ ОТПРАВКИ ЗАЯВКИ
function sendOrder() {
    // Получаем данные из полей ввода
    let name = document.getElementById('name').value.trim();
    let phone = document.getElementById('phone').value.trim();
    let comment = document.getElementById('task').value.trim();

    // Проверка на пустые поля
    if (!name || !phone) {
        tg.showAlert('⚠️ Пожалуйста, введите имя и номер телефона');
        return;
    }

    // ОГРАНИЧЕНИЕ: Параметр start в Telegram не может быть длиннее 64 символов.
    // В HEX одна русская буква занимает 4 символа, цифра - 2 символа.
    // Поэтому обрезаем лишнее, чтобы ссылка не сломалась.
    let shortName = name.substring(0, 10);
    let shortComment = comment.substring(0, 5);

    // Собираем строку через разделитель |
    let dataString = shortName + '|' + phone + '|' + shortComment;

    // Переводим в HEX
    let hexData = toHex(dataString);

    // Финальная проверка длины (лимит Telegram = 64 знака для параметра start)
    if (hexData.length > 64) {
        tg.showAlert('❌ Слишком много данных! Сократите имя или комментарий.');
        return;
    }

    // Ссылка на бота (ЗАМЕНИ ТЕКСТ НИЖЕ)
    let botUsername = 'SecretesGoodsBot';
    let url = 'https://t.me/' + botUsername + '?start=' + hexData;

    // Отправляем пользователя в бота
    tg.openTelegramLink(url);
}

// При запуске можно сразу подсветить первую вкладку
document.addEventListener('DOMContentLoaded', () => {
    console.log("Mini App Ready");
});



