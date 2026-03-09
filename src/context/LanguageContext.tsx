import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'hy' | 'en' | 'es' | 'ru';

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

const translations: Translations = {
  // Navbar
  'nav.logo': { hy: 'ԱվտոԱկադեմիա', en: 'AutoAcademy', es: 'AutoAcademy', ru: 'АвтоАкадемия' },
  'nav.home': { hy: 'Գլխավոր', en: 'Home', es: 'Inicio', ru: 'Главная' },
  'nav.search': { hy: 'Որոնում', en: 'Search', es: 'Búsqueda', ru: 'Поиск' },
  'nav.vin': { hy: 'VIN Ստուգում', en: 'VIN Lookup', es: 'Buscar VIN', ru: 'Проверка VIN' },
  'nav.maintenance': { hy: 'Սպասարկում', en: 'Maintenance', es: 'Mantenimiento', ru: 'Обслуживание' },
  'nav.map': { hy: 'Քարտեզ', en: 'Map', es: 'Mapa', ru: 'Карта' },
  'nav.appraiser': { hy: 'Գնահատում', en: 'Appraiser', es: 'Tasador', ru: 'Оценка' },
  'nav.history': { hy: 'Պատմություն', en: 'History', es: 'Historial', ru: 'История' },
  'nav.howToUse': { hy: 'Ինչպես օգտվել', en: 'How to Use', es: 'Cómo usar', ru: 'Как пользоваться' },
  'nav.about': { hy: 'Մեր մասին', en: 'About Us', es: 'Sobre nosotros', ru: 'О нас' },
  'nav.contact': { hy: 'Կապ', en: 'Contact', es: 'Contacto', ru: 'Контакт' },
  'nav.login': { hy: 'Մուտք', en: 'Login', es: 'Iniciar sesión', ru: 'Вход' },
  'nav.signup': { hy: 'Գրանցվել', en: 'Sign Up', es: 'Registrarse', ru: 'Регистрация' },
  'nav.logout': { hy: 'Դուրս գալ', en: 'Logout', es: 'Cerrar sesión', ru: 'Выход' },
  'nav.profile': { hy: 'Իմ Էջը', en: 'My Profile', es: 'Mi Perfil', ru: 'Мой профиль' },
  'nav.adminLogin': { hy: 'Ադմին Մուտք', en: 'Admin Login', es: 'Inicio Admin', ru: 'Вход Админа' },
  'nav.language': { hy: 'Լեզու', en: 'Language', es: 'Idioma', ru: 'Язык' },

  // Search Section
  'search.aiPowered': { hy: 'ԱԲ-ով աշխատող օգնական', en: 'AI Powered Assistant', es: 'Asistente impulsado por IA', ru: 'Помощник на базе ИИ' },
  'search.analysisTitle': { hy: 'Վերլուծություն և Լուծումներ', en: 'Analysis & Solutions', es: 'Análisis y soluciones', ru: 'Анализ и решения' },
  'search.usefulLinks': { hy: 'Օգտակար հղումներ', en: 'Useful Links', es: 'Enlaces útiles', ru: 'Полезные ссылки' },
  'search.title': { hy: 'Ձեր մեքենայի խելացի օգնականը', en: 'Your Smart Car Assistant', es: 'Tu asistente inteligente para el coche', ru: 'Ваш умный автопомощник' },
  'search.subtitle': { hy: 'Նկարագրեք խնդիրը, և մեր ԱԲ օգնականը կգտնի լավագույն լուծումները ձեզ համար՝ հիմնվելով հազարավոր տեխնիկական տվյալների վրա:', en: 'Describe the problem, and our AI assistant will find the best solutions for you based on thousands of technical data points.', es: 'Describe el problema y nuestro asistente de IA encontrará las mejores soluciones para ti basándose en miles de datos técnicos.', ru: 'Опишите проблему, и наш ИИ-помощник найдет для вас лучшие решения на основе тысяч технических данных.' },
  'search.placeholder': { hy: 'Օրինակ՝ Մեքենան դժվարությամբ է միանում առավոտյան...', en: 'Example: The car has trouble starting in the morning...', es: 'Ejemplo: El coche tiene problemas para arrancar por la mañana...', ru: 'Например: Машина плохо заводится по утрам...' },
  'search.button': { hy: 'Գտնել լուծումը', en: 'Find Solution', es: 'Encontrar solución', ru: 'Найти решение' },

  // VIN Lookup
  'vin.title': { hy: 'VIN Կոդի Ստուգում', en: 'VIN Code Lookup', es: 'Búsqueda de código VIN', ru: 'Проверка VIN-кода' },
  'vin.subtitle': { hy: 'Մուտքագրեք մեքենայի VIN կոդը՝ պատմությունը, տեխնիկական տվյալները և հետկանչերը ստուգելու համար:', en: 'Enter the car\'s VIN code to check history, technical specs, and recalls.', es: 'Introduce el código VIN del coche para consultar el historial, las especificaciones técnicas y las retiradas del mercado.', ru: 'Введите VIN-код автомобиля, чтобы проверить историю, технические характеристики и отзывы.' },
  'vin.placeholder': { hy: 'Մուտքագրեք 17-նիշանոց VIN կոդը', en: 'Enter 17-digit VIN code', es: 'Introduce el código VIN de 17 dígitos', ru: 'Введите 17-значный VIN-код' },
  'vin.button': { hy: 'Ստուգել', en: 'Check', es: 'Comprobar', ru: 'Проверить' },

  // Maintenance
  'maint.title': { hy: 'Սպասարկման Օրացույց', en: 'Maintenance Schedule', es: 'Calendario de mantenimiento', ru: 'График обслуживания' },
  'maint.subtitle': { hy: 'Իմացեք, թե երբ է անհրաժեշտ կատարել ձեր մեքենայի հերթական սպասարկումը:', en: 'Find out when your car needs its next scheduled maintenance.', es: 'Averigua cuándo necesita tu coche su próximo mantenimiento programado.', ru: 'Узнайте, когда вашему автомобилю потребуется следующее плановое обслуживание.' },
  'maint.make': { hy: 'Մակնիշ', en: 'Make', es: 'Marca', ru: 'Марка' },
  'maint.model': { hy: 'Մոդել', en: 'Model', es: 'Modelo', ru: 'Модель' },
  'maint.year': { hy: 'Տարեթիվ', en: 'Year', es: 'Año', ru: 'Год' },
  'maint.mileage': { hy: 'Վազք (կմ)', en: 'Mileage (km)', es: 'Kilometraje (km)', ru: 'Пробег (км)' },
  'maint.button': { hy: 'Հաշվարկել', en: 'Calculate', es: 'Calcular', ru: 'Рассчитать' },

  // Map
  'map.title': { hy: 'Մոտակա Սպասարկման Կենտրոններ', en: 'Nearby Service Centers', es: 'Centros de servicio cercanos', ru: 'Ближайшие сервисные центры' },
  'map.subtitle': { hy: 'Գտեք լավագույն ավտոսպասարկման կենտրոնները ձեր տարածքում:', en: 'Find the best car service centers in your area.', es: 'Encuentra los mejores centros de servicio de coches en tu zona.', ru: 'Найдите лучшие автосервисы в вашем районе.' },
  'map.locate': { hy: 'Որոշել իմ դիրքը', en: 'Locate Me', es: 'Ubicarme', ru: 'Определить мое местоположение' },
  'map.searching': { hy: 'Որոնվում են մոտակա սերվիսները...', en: 'Searching for nearby services...', es: 'Buscando servicios cercanos...', ru: 'Поиск ближайших сервисов...' },
  'map.info': { hy: 'Տեղեկատվություն', en: 'Information', es: 'Información', ru: 'Информация' },
  'map.places': { hy: 'Գտնված վայրերը', en: 'Found Locations', es: 'Lugares encontrados', ru: 'Найденные места' },
  'map.openMap': { hy: 'Բացել Քարտեզում', en: 'Open in Maps', es: 'Abrir en Mapas', ru: 'Открыть в Картах' },
  'map.refresh': { hy: 'Թարմացնել դիրքը', en: 'Refresh Position', es: 'Actualizar posición', ru: 'Обновить местоположение' },
  'map.noPlaces': { hy: 'Հստակ վայրեր չգտնվեցին:', en: 'No specific locations found.', es: 'No se han encontrado lugares específicos.', ru: 'Конкретных мест не найдено.' },
  'map.error.locate': { hy: 'Չհաջողվեց որոշել ձեր դիրքը: Խնդրում ենք թույլատրել մուտքը դեպի տեղադրություն:', en: 'Failed to determine your position. Please allow access to location.', es: 'No se ha podido determinar tu posición. Por favor, permite el acceso a la ubicación.', ru: 'Не удалось определить ваше местоположение. Пожалуйста, разрешите доступ к местоположению.' },
  'map.error.browser': { hy: 'Ձեր բրաուզերը չի աջակցում աշխարհագրական դիրքի որոշումը:', en: 'Your browser does not support geolocation.', es: 'Tu navegador no soporta la geolocalización.', ru: 'Ваш браузер не поддерживает геолокацию.' },
  'map.error.generic': { hy: 'Չհաջողվեց գտնել մոտակա սերվիսները: Խնդրում ենք փորձել փոքր-ինչ ուշ:', en: 'Failed to find nearby services. Please try again later.', es: 'No se han podido encontrar servicios cercanos. Por favor, inténtalo de nuevo más tarde.', ru: 'Не удалось найти ближайшие сервисы. Пожалуйста, попробуйте позже.' },
  'map.locatePrompt': { hy: 'Որոնել մոտակա սերվիսները', en: 'Search nearby services', es: 'Buscar servicios cercanos', ru: 'Поиск ближайших сервисов' },
  'map.locateDesc': { hy: 'Սեղմեք ստորև նշված կոճակը, որպեսզի մենք կարողանանք գտնել ձեր դիրքը և ցույց տալ մոտակա սերվիսները:', en: 'Click the button below so we can find your location and show nearby services.', es: 'Haz clic en el botón de abajo para que podamos encontrar tu ubicación y mostrarte los servicios cercanos.', ru: 'Нажмите на кнопку ниже, чтобы мы могли найти ваше местоположение и показать ближайшие сервисы.' },

  // How to Use
  'how.title': { hy: 'Ինչպես օգտվել', en: 'How to Use', es: 'Cómo usar', ru: 'Как пользоваться' },
  'how.subtitle': { hy: 'Հետևեք այս պարզ քայլերին ձեր խնդրի լուծումը գտնելու համար', en: 'Follow these simple steps to find the solution to your problem', es: 'Sigue estos sencillos pasos para encontrar la solución a tu problema', ru: 'Следуйте этим простым шагам, чтобы найти решение вашей проблемы' },
  'how.step1.title': { hy: 'Նկարագրեք խնդիրը', en: 'Describe the problem', es: 'Describe el problema', ru: 'Опишите проблему' },
  'how.step1.desc': { hy: 'Մուտքագրեք ձեր մեքենայի անսարքության նկարագրությունը մեր որոնման դաշտում:', en: 'Enter a description of your car\'s malfunction in our search field.', es: 'Introduce una descripción de la avería de tu coche en nuestro campo de búsqueda.', ru: 'Введите описание неисправности вашего автомобиля в поле поиска.' },
  'how.step2.title': { hy: 'Ստացեք վերլուծություն', en: 'Get analysis', es: 'Obtén el análisis', ru: 'Получите анализ' },
  'how.step2.desc': { hy: 'Մեր ԱԲ-ն կվերլուծի տվյալները և կառաջարկի հնարավոր լուծումներ:', en: 'Our AI will analyze the data and suggest possible solutions.', es: 'Nuestra IA analizará los datos y sugerirá posibles soluciones.', ru: 'Наш ИИ проанализирует данные и предложит возможные решения.' },
  'how.step3.title': { hy: 'Գտեք մասնագետ', en: 'Find a specialist', es: 'Encuentra un especialista', ru: 'Найдите специалиста' },
  'how.step3.desc': { hy: 'Օգտվեք մեր քարտեզից՝ մոտակա լավագույն մասնագետին գտնելու համար:', en: 'Use our map to find the best specialist nearby.', es: 'Utiliza nuestro mapa para encontrar al mejor especialista cercano.', ru: 'Воспользуйтесь нашей картой, чтобы найти лучшего специалиста поблизости.' },

  // About Us
  'about.title': { hy: 'Մեր Մասին', en: 'About Us', es: 'Sobre nosotros', ru: 'О нас' },
  'about.teamTitle': { hy: 'Մեր թիմը', en: 'Our Team', es: 'Nuestro equipo', ru: 'Наша команда' },
  'about.teamDesc': { hy: 'Մենք ավտոսիրահարների և ծրագրավորողների թիմ ենք, ովքեր հավատում են, որ տեխնոլոգիաները կարող են հեշտացնել մեքենայի սպասարկումը:', en: 'We are a team of car enthusiasts and developers who believe that technology can simplify car maintenance.', es: 'Somos un equipo de entusiastas de los coches y desarrolladores que creen que la tecnología puede simplificar el mantenimiento del coche.', ru: 'Мы — команда автолюбителей и разработчиков, которые верят, что технологии могут упростить обслуживание автомобиля.' },
  'about.reliabilityTitle': { hy: 'Վստահելիություն', en: 'Reliability', es: 'Fiabilidad', ru: 'Надежность' },
  'about.reliabilityDesc': { hy: 'Մեր տրամադրած տեղեկատվությունը հիմնված է հազարավոր տեխնիկական աղբյուրների և արհեստական բանականության վերլուծության վրա:', en: 'The information we provide is based on thousands of technical sources and AI analysis.', es: 'La información que proporcionamos se basa en miles de fuentes técnicas y análisis de IA.', ru: 'Предоставляемая нами информация основана на тысячах технических источников и анализе ИИ.' },
  'about.p1': { hy: 'ԱվտոԱկադեմիան ստեղծվել է վարորդների կյանքը հեշտացնելու նպատակով:', en: 'AutoAcademy was created to make drivers\' lives easier.', es: 'AutoAcademy se creó para facilitar la vida de los conductores.', ru: 'AutoAcademy была создана, чтобы облегчить жизнь водителям.' },
  'about.p2': { hy: 'Մենք օգտագործում ենք արհեստական բանականության վերջին տեխնոլոգիաները՝ ավտոմեքենաների ախտորոշումը և սպասարկումը ավելի մատչելի և հասկանալի դարձնելու համար:', en: 'We use the latest AI technologies to make car diagnostics and maintenance more accessible and understandable.', es: 'Utilizamos las últimas tecnologías de IA para que el diagnóstico y el mantenimiento de los coches sean más accesibles y comprensibles.', ru: 'Мы используем новейшие технологии ИИ, чтобы сделать диагностику и обслуживание автомобилей более доступными и понятными.' },

  // Contact Us
  'contact.title': { hy: 'Կապ Մեզ Հետ', en: 'Contact Us', es: 'Contáctanos', ru: 'Свяжитесь с нами' },
  'contact.subtitle': { hy: 'Մենք միշտ պատրաստ ենք օգնել ձեզ ձեր հարցերում', en: 'We are always ready to help you with your questions', es: 'Siempre estamos listos para ayudarte con tus preguntas', ru: 'Мы всегда готовы помочь вам с вашими вопросами' },
  'contact.phone': { hy: 'Հեռախոս', en: 'Phone', es: 'Teléfono', ru: 'Телефон' },
  'contact.address': { hy: 'Հասցե', en: 'Address', es: 'Dirección', ru: 'Адрес' },
  'contact.location': { hy: 'Քանաքեռ-Զեյթուն', en: 'Kanaker-Zeytun', es: 'Kanaker-Zeytun', ru: 'Канакер-Зейтун' },
  'contact.name': { hy: 'Անուն', en: 'Name', es: 'Nombre', ru: 'Имя' },
  'contact.email': { hy: 'Էլ. փոստ', en: 'Email', es: 'Correo electrónico', ru: 'Эл. почта' },
  'contact.message': { hy: 'Հաղորդագրություն', en: 'Message', es: 'Mensaje', ru: 'Сообщение' },
  'contact.send': { hy: 'Ուղարկել', en: 'Send', es: 'Enviar', ru: 'Отправить' },

  // Auth
  'auth.login': { hy: 'Մուտք', en: 'Login', es: 'Iniciar sesión', ru: 'Вход' },
  'auth.signup': { hy: 'Գրանցում', en: 'Sign Up', es: 'Registro', ru: 'Регистрация' },
  'auth.name': { hy: 'Անուն', en: 'Name', es: 'Nombre', ru: 'Имя' },
  'auth.namePlaceholder': { hy: 'Ձեր անունը', en: 'Your name', es: 'Tu nombre', ru: 'Ваше имя' },
  'auth.email': { hy: 'Էլ. փոստ', en: 'Email', es: 'Correo electrónico', ru: 'Эл. почта' },
  'auth.password': { hy: 'Գաղտնաբառ', en: 'Password', es: 'Contraseña', ru: 'Пароль' },
  'auth.noAccount': { hy: 'Չունե՞ք հաշիվ:', en: 'Don\'t have an account?', es: '¿No tienes una cuenta?', ru: 'Нет аккаунта?' },
  'auth.hasAccount': { hy: 'Արդեն ունե՞ք հաշիվ:', en: 'Already have an account?', es: '¿Ya tienes una cuenta?', ru: 'Уже есть аккаунт?' },
  'auth.submitLogin': { hy: 'Մուտք գործել', en: 'Sign In', es: 'Entrar', ru: 'Войти' },
  'auth.submitSignup': { hy: 'Գրանցվել', en: 'Register', es: 'Registrarse', ru: 'Зарегистрироваться' },

  // History
  'history.title': { hy: 'Որոնումների պատմություն', en: 'Search History', es: 'Historial de búsqueda', ru: 'История поиска' },
  'history.subtitle': { hy: 'Ձեր վերջին գործողությունները ԱվտոԱկադեմիայում', en: 'Your recent activities at AutoAcademy', es: 'Tus actividades recientes en AutoAcademy', ru: 'Ваши последние действия в AutoAcademy' },
  'history.empty': { hy: 'Պատմությունը դատարկ է', en: 'History is empty', es: 'El historial está vacío', ru: 'История пуста' },
  'history.notAvailable': { hy: 'Պատմությունը հասանելի չէ', en: 'History not available', es: 'Historial no disponible', ru: 'История недоступна' },
  'history.loginRequired': { hy: 'Խնդրում ենք մուտք գործել՝ ձեր որոնումների պատմությունը տեսնելու համար:', en: 'Please login to see your search history.', es: 'Por favor, inicia sesión para ver tu historial de búsqueda.', ru: 'Пожалуйста, войдите, чтобы увидеть историю поиска.' },
  'history.clear': { hy: 'Մաքրել', en: 'Clear', es: 'Limpiar', ru: 'Очистить' },
  'history.type.search': { hy: 'Որոնում', en: 'Search', es: 'Búsqueda', ru: 'Поиск' },
  'history.type.vin': { hy: 'VIN Ստուգում', en: 'VIN Check', es: 'Comprobación de VIN', ru: 'Проверка VIN' },
  'history.type.maintenance': { hy: 'Սպասարկում', en: 'Maintenance', es: 'Mantenimiento', ru: 'Обслуживание' },
  'history.type.other': { hy: 'Այլ', en: 'Other', es: 'Otro', ru: 'Другое' },

  // Errors & Misc
  'error.generic': { hy: 'Տեղի է ունեցել սխալ: Փորձեք կրկին:', en: 'An error occurred. Please try again.', es: 'Se ha producido un error. Por favor, inténtalo de nuevo.', ru: 'Произошла ошибка. Пожалуйста, попробуйте еще раз.' },
  'error.fillAll': { hy: 'Խնդրում ենք լրացնել բոլոր դաշտերը:', en: 'Please fill in all fields.', es: 'Por favor, rellena todos los campos.', ru: 'Пожалуйста, заполните все поля.' },
  'error.vinInvalid': { hy: 'Խնդրում ենք մուտքագրել վավեր VIN կոդ:', en: 'Please enter a valid VIN code.', es: 'Por favor, introduce un código VIN válido.', ru: 'Пожалуйста, введите действительный VIN-код.' },
  'error.vinGeneric': { hy: 'Սխալ VIN ստուգման ժամանակ:', en: 'Error during VIN check.', es: 'Error durante la comprobación del VIN.', ru: 'Ошибка при проверке VIN.' },
  'error.maintGeneric': { hy: 'Սխալ հաշվարկի ժամանակ:', en: 'Error during calculation.', es: 'Error durante el cálculo.', ru: 'Ошибка при расчете.' },

  // Footer
  'footer.rights': { hy: 'Բոլոր իրավունքները պաշտպանված են:', en: 'All rights reserved.', es: 'Todos los derechos reservados.', ru: 'Все права защищены.' },

  // Appraiser
  'appraiser.title': { hy: 'Գնի Գնահատում', en: 'Price Appraiser', es: 'Tasador de Precios', ru: 'Оценка цены' },
  'appraiser.subtitle': { hy: 'Իմացեք՝ արդյոք մեքենայի գինը համապատասխանում է շուկային', en: 'Find out if the car price matches the market', es: 'Averigua si el precio del coche coincide con el mercado', ru: 'Узнайте, соответствует ли цена автомобиля рыночной' },
  'appraiser.form.make': { hy: 'Մակնիշ', en: 'Make', es: 'Marca', ru: 'Марка' },
  'appraiser.form.model': { hy: 'Մոդել', en: 'Model', es: 'Modelo', ru: 'Модель' },
  'appraiser.form.year': { hy: 'Տարեթիվ', en: 'Year', es: 'Año', ru: 'Год' },
  'appraiser.form.mileage': { hy: 'Վազք (կմ)', en: 'Mileage (km)', es: 'Kilometraje (km)', ru: 'Пробег (км)' },
  'appraiser.form.condition': { hy: 'Վիճակ', en: 'Condition', es: 'Estado', ru: 'Состояние' },
  'appraiser.form.price': { hy: 'Առաջարկվող գին ($)', en: 'Offered Price ($)', es: 'Precio ofrecido ($)', ru: 'Предложенная цена ($)' },
  'appraiser.condition.excellent': { hy: 'Գերազանց', en: 'Excellent', es: 'Excelente', ru: 'Отличное' },
  'appraiser.condition.good': { hy: 'Լավ', en: 'Good', es: 'Bueno', ru: 'Хорошее' },
  'appraiser.condition.fair': { hy: 'Միջին', en: 'Fair', es: 'Regular', ru: 'Среднее' },
  'appraiser.condition.poor': { hy: 'Վատ', en: 'Poor', es: 'Malo', ru: 'Плохое' },
  'appraiser.submit': { hy: 'Գնահատել', en: 'Appraise', es: 'Tasar', ru: 'Оценить' },
  'appraiser.result.fair': { hy: 'Արդար գին', en: 'Fair Price', es: 'Precio justo', ru: 'Справедливая цена' },
  'appraiser.result.overpriced': { hy: 'Թանկացված', en: 'Overpriced', es: 'Sobrevalorado', ru: 'Завышенная цена' },
  'appraiser.result.deal': { hy: 'Լավ առաջարկ', en: 'Great Deal', es: 'Gran oferta', ru: 'Отличное предложение' },

  // Profile
  'profile.title': { hy: 'Իմ Էջը', en: 'My Profile', es: 'Mi Perfil', ru: 'Мой профиль' },
  'profile.name': { hy: 'Անուն', en: 'Name', es: 'Nombre', ru: 'Имя' },
  'profile.username': { hy: 'Օգտանուն', en: 'Username', es: 'Nombre de usuario', ru: 'Имя пользователя' },
  'profile.email': { hy: 'Էլ. հասցե', en: 'Email', es: 'Correo electrónico', ru: 'Эл. почта' },
  'profile.save': { hy: 'Պահպանել', en: 'Save Changes', es: 'Guardar cambios', ru: 'Сохранить изменения' },
  'profile.cancel': { hy: 'Չեղարկել', en: 'Cancel', es: 'Cancelar', ru: 'Отмена' },
  'profile.success': { hy: 'Պրոֆիլը թարմացվեց', en: 'Profile updated successfully', es: 'Perfil actualizado con éxito', ru: 'Профиль успешно обновлен' },

  // Admin
  'admin.dashboard': { hy: 'Կառավարման վահանակ', en: 'Dashboard', es: 'Panel de control', ru: 'Панель управления' },
  'admin.revenue': { hy: 'Եկամուտ', en: 'Revenue', es: 'Ingresos', ru: 'Доход' },
  'admin.sales': { hy: 'Վաճառք', en: 'Sales', es: 'Ventas', ru: 'Продажи' },
  'admin.customers': { hy: 'Հաճախորդներ', en: 'Customers', es: 'Clientes', ru: 'Клиенты' },
  'admin.bounceRate': { hy: 'Մերժման գործակից', en: 'Bounce Rate', es: 'Tasa de rebote', ru: 'Показатель отказов' },
  'admin.salesOverview': { hy: 'Վաճառքի ակնարկ', en: 'Sales Overview', es: 'Resumen de ventas', ru: 'Обзор продаж' },
  'admin.trafficSources': { hy: 'Տրաֆիկի աղբյուրներ', en: 'Traffic Sources', es: 'Fuentes de tráfico', ru: 'Источники трафика' },
  'admin.recentActivity': { hy: 'Վերջին գործողություններ', en: 'Recent Activity', es: 'Actividad reciente', ru: 'Actividad reciente' },
  'admin.topProducts': { hy: 'Լավագույն ապրանքներ', en: 'Top Products', es: 'Productos top', ru: 'Лучшие товары' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved as Language) || 'hy';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
