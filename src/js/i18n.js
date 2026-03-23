import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const savedLanguage = localStorage.getItem('language') || 'ua';

const resources = {
  en: {
    translation: {
       phoneBooking: "Book by phone",
        bookNow: "Book Now",
        choose: "Choose",
        readMore: "Read more",
        restorationShort: "Restoreation",
                  readMore1: "Learn More",
           readMore2: "More Details",
      home: "Home",
      services: "Services",
      haircut: "Haircut",
      coloring: "Coloring",
      restoration: "Care and Restoration",
      shop: "Shop",
      about: "About us",
      courses: "Courses",
      cosmetics: "Cosmetics",
      masters: "Masters",
      portfolio: "Our Portfolio",
      contacts: "Contacts",
      schedule: "Working Hours",
      scheduleTime: "Mon-Sat 09:00 - 21:00",
      address: "Address",
      addressText: "Kyiv, Dniprovska Naberezhna, 18А.",
      phone: "Phone",
      phoneNumber: "+380 96 174 43 78",
      ownerText: "Site Owner: BOVÉ | Design: Tetiana Chopovdia. All rights reserved.",

      // Additional homepage content
      aboutUsTitle: "BOVÉ – a personalized space for beauty.",
      aboutUsText: "A premium conceptual space where aesthetics meets comfort and beauty meets individuality. Each client is a unique story, inspiration, image.",
      
      coursesTitle: "Learning at BOVÉ opens the door to the world of beauty, where profession becomes art.",
      coursesSummary: "We offer a proprietary program created by a practicing master, combining fundamental knowledge with modern trends.",
      courseBeginner: "Colorist course for beginners.",
      courseBeginnerSummary: "Suitable for newcomers. Theory + practice on models. Certificate upon completion.",
      courseAdvanced: "Advanced skill improvement course.",
      courseAdvancedSummary: "For practicing masters. One day — maximum benefit. Certificate upon completion.",

      cosmeticsTitle: "We use only high-quality professional products.",
      cosmeticsSummary: "Our technologies provide deep nourishment, protection, and restoration. Shine, elasticity, volume — result of a systematic and conscious approach.",

      mastersTitle: "Master and certified specialist, art director Valentina Bodnaruk.",
      mastersTextHome: "I specialize in creating stylish, individual haircuts and coloring of any complexity, taking into account natural features and client wishes. I also provide professional hair restoration and scalp treatment services.",

      portfolioTitle: "Each coloring is an individual project.",
      portfolioText: "A complex coloring technique ensuring a smooth transition from roots to tips.",
       aboutUsTitle: "BOVÉ – a personalized space for beauty.",
    aboutUsFullText: `We have created a premium conceptual space where aesthetics meet comfort and beauty meets individuality. Each client is a unique story, an inspiration, an image. We believe that style does not start with trends, but with you. That is why our approach to each person is subtle and thoughtfully detailed.
Each haircut is an extension of character.
Each coloring is a form of self-expression.
Each procedure is a ritual that begins with care.
We don’t just change appearances — we help people see themselves in a new light. With confidence.
In harmony. In their own beauty — without exaggeration.`,
// COURSES PAGE (FULL)
coursesPageMainTitle:
  "Learning at BOVÉ opens the door to the world of beauty, where profession becomes art.",

coursesPageIntro:
  "We offer a proprietary program created by a practicing master that combines fundamental knowledge with modern trends. Each course is a blend of deep theory, live practice, and individual guidance. You won’t just learn how to color hair — you’ll learn to see it, work with it delicately and confidently.",

  coursesLearnTitle: "What you’ll learn:",
coursesColoringTitle: "Hair Coloring",
coursesColoringList: [
  "• Basics of color science: color types, pigment, neutralization",
  "• Modern techniques: Airtouch, balayage, shatush, blond melting",
  "• Color correction, toning, complex transitions",
  "• How to choose a color according to facial features and client style"
],

coursesCareTitle: "Care and Restoration",
coursesCareList: [
  "• Diagnosis of hair and scalp condition",
  "• Creation of individual care programs",
  "• Professional protocols: peelings, treatment masks",
  "• Working with premium brands and application techniques"
],

coursesAudienceTitle: "Who this course is for:",
coursesAudienceList: [
  "• Beginners who want to enter the profession",
  "• Masters who want to update their skills",
  "• Anyone who wants to work in the premium beauty industry"
],

coursesResultTitle: "After the course you will receive:",
coursesResultList: [
  "• Certificate of completion",
  "• Portfolio of completed works",
  "• Practical skills ready for work",
  "• Opportunity for internship or employment at BOVÉ"
],
cosmeticsTitle: "We use only high-quality professional products.",

cosmeticsText: [
  "Our products provide deep nourishment, protection, and restoration. Shine, elasticity, and volume are the result of a systematic and conscious approach.",
  "Braé is a Brazilian haircare brand specializing in hair restoration. It uses natural ingredients and innovative technologies, offering a wide range of care and styling products.",
  "Dr. Sorbie is a premium professional trichological brand that combines amino acids, gentle care, and natural extracts without SLS, parabens, or mineral oils. Focused on scalp health and cellular-level hair restoration, it is widely used in premium beauty salons."
],
mastersTitle: "Master and certified hair & scalp care specialist",

mastersText: [
  "I specialize in creating stylish, individual haircuts and coloring of any complexity, taking into account natural features and client wishes. I also provide professional hair restoration and scalp treatment services.",
  "My goal is not just to change appearance, but to help the client see themselves in a new light, preserving naturalness and comfort. I work with different hair types and always select solutions that harmoniously combine technique, aesthetics, and real needs.",
  "I have been working in this field for over 10 years, and during this time I have learned that true mastery is continuous development.",
  "I regularly attend advanced courses, masterclasses from leading specialists, and constantly update my knowledge on the latest hair and scalp care technologies.",
  "In my work, I use only premium professional products — effective, safe, and tested.",
  "I always carefully study the composition of each product before recommending it to a client: not only the effect but also the quality and long-term impact on hair and scalp health matter. This allows me to create individualized solutions that combine aesthetics, comfort, and care.",
  "Each procedure reflects mindfulness and professional responsibility. Every haircut or coloring is about trust, which I value the most."
],
haircutsTitle: "Haircuts",

haircutsList: [
  "Women's Haircut",
  "Bangs Trim",
  "Blow-dry / Styling",
  "Men's Haircut",
  "Beard Grooming",
  "Children's Haircut",
  "Online consultation via photo"
],

bookNow: "Book Now",

haircutsFootnote: [
  "*Home service doubles the price.",
  "*International service available upon request."
],

haircutsSubtitle: "Your haircut — an extension of your character.",

haircutsDescription: [
  "We offer a personalized approach and attention to detail. The stylist combines timeless techniques with modern trends, creating a look that is unique.",
  [
    "The service includes:",
    "• Shampoo and conditioner treatment;",
    "• Haircut of any complexity;",
    "• Styling with thermal protection;"
  ],
  "We use only professional tools and premium products."
],

haircutsContact: "*For details on service duration and price, please contact us by phone.",
// ua

// en
coloringTitle: "Coloring",
coloringServices: [
  "Consultation",
  "Root coloring",
  "Single-tone coloring",
  "Toning",
  "Contouring",
  ["Total blond (lightening roots \n1.5 cm + toning)"],
  "Primary blond",
  "Partial complex coloring",
  "Advanced coloring techniques",
  "Transition from black hair",
  "Online consultation via photo"
],
coloringFootnotes: [
  "*Home service doubles the price.",
  "*International service available upon request."
],
coloringSubtitle: "Color is a form of self-expression.",
coloringDescription: "We know how to reveal the best in your hair, whether you want a bold new shade, a delicate balayage, or refreshing coloring to cover grey hair. Our professional approach guarantees bright and long-lasting results. Relaxed studio atmosphere and personalized approach make every visit enjoyable. In addition, the stylist uses only high-quality products that nourish your hair and keep it healthy and cared for.",
coloringContact: "*For details on service duration and price, please contact us by phone.",
restorationTitle: "Care and Restoration",
restorationServices: [
  "Peeling",
  "Additional peeling service",
  "Hair reconstruction",
  "Online consultation via photo"
],
restorationFootnotes: [
  "*Home service doubles the price.",
  "*International service available upon request."
],
restorationSubtitle: "True beauty begins with care.",
restorationDescription: "Our procedures focus not only on the visual effect but also on deep hair and scalp restoration. The stylist creates individual treatment plans: deep nourishment, reconstruction, thermal protection, restoring shine and elasticity. \nHair tells a lot: about fatigue, habits, seasonal life, and even mood. We help it sound better.",
restorationContact: "*For details on service duration and price, please contact us by phone.",
  brandsTitle: "Brands",
      getPrice: "Get Price",
      brandsFootnote: "*For details about ordering and pricing, please contact us by phone.",
      allProducts: "All Products",
      shopModalTitle: "Order Information",
      courseSignUp: "Enroll now",
      hitSalesTitle: "Hit Sales",
      priceTitle: "Сontract price",
      catalogTitle: "Product catalog"

    }
  },
  ua: {
    translation: {
       phoneBooking: "Запис за телефоном",
         bookNow: "Записатись",
         choose: "Обрати",
         readMore: "Читати більше",
          readMore1: "Дізнатися більше",
           readMore2: "Детальніше",
           restorationShort: "Відновлення",
      home: "Головна",
      services: "Послуги",
      haircut: "Стрижка",
      coloring: "Фарбування",
      restoration: "Догляд та відновлення",
      shop: "Магазин",
      about: "Про нас",
      courses: "Курси",
      cosmetics: "Косметика",
      masters: "Майстри",
      portfolio: "Наші роботи",
      contacts: "Контакти",
      schedule: "Графік роботи",
      scheduleTime: "Пн-сб 09:00 - 21:00",
      address: "Адреса",
      addressText: "Київ, Дніпровська набережна, 18А.",
      phone: "Телефон",
      phoneNumber: "+380 96 174 43 78",
      ownerText: "Власник сайту: BOVÉ | Дизайн: Tetiana Chopovdia. Всі права захищені.",

      // Additional homepage content
      aboutUsTitle: "BOVÉ–індивідуальний простір для краси.",
      aboutUsText: "Концептуальний простір преміум-класу, де естетика поєднується з комфортом, а краса з індивідуальністю. Тут кожен клієнт — це окрема історія, натхнення, образ.",
      
      coursesTitle: "Навчання у BOVÉ–це вхід у світ краси, де професія стає мистецтвом.",
      coursesSummary: "Ми пропонуємо авторську програму, створену практикуючим майстром, що поєднує фундаментальні знання з сучасними трендами.",
      courseBeginner: "Курс колористики для початківців.",
      courseBeginnerSummary: "Підходить для новачків. \nТеорія + практика на моделях. \nСертифікат після завершення.",
      courseAdvanced: "Курс підвищення кваліфікації.",
      courseAdvancedSummary: "Для практикуючих майстрів. \nОдин день — максимум користі. \nСертифікат про проходження.",

      cosmeticsTitle: "Ми використовуємо лише якісні професійні засоби.",
      cosmeticsSummary: "Наші технології забезпечують глибоке живлення, захист і відновлення. Блиск, еластичність, об’єм — результат системного та свідомого підходу.",

      mastersTitle: "Майстер та сертифікований фахівець, арт-директор Валентина Боднарук.",
      mastersTextHome: "Я спеціалізуюсь на створенні стильних, індивідуальних стрижок та фарбування волосся будь-якої складності, враховуючи природні особливості та бажання кожного клієнта. Також надаю професійні послуги з відновлення волосся, та лікування шкіри голови.",

      portfolioTitle: "Кожне фарбування – індивідуальний проєкт.",
      portfolioText: "Складна техніка фарбування, яка забезпечує плавний перехід від коріння до кінчиків волосся.",
          aboutUsTitle: "BOVÉ–індивідуальний простір для краси.",
    aboutUsFullText: `Ми створили концептуальний простір преміум-класу, де
     естетика поєднується з комфортом, а краса з
                індивідуальністю. Тут кожен клієнт — це окрема історія,
                 натхнення, образ. Ми віримо, що стиль починається не з 
                 трендів, а з тебе. Саме тому підхід до кожного — тонкий і 
                 продуманий до деталей.
                 Кожна стрижка — як продовження характеру.
                 Кожне фарбування — як форма самовираження.
                 Кожна процедура — як раса, що починається з турботи. 
                 Ми не просто змінюємо зовнішність — ми допомагаємо людині побачити себе в новому світлі. У впевненості.
                У гармонії. У власній красі — без перебільшень.`,
                // COURSES PAGE (FULL)
coursesPageMainTitle:
  "Навчання у BOVÉ — це вхід у світ краси, де професія перетворюється на мистецтво.",

coursesPageIntro:
  "Ми пропонуємо авторську програму, створену \nпрактикуючим майстром, що поєднує фундаментальні знання \nз сучасними трендами. \nКожен курс — це поєднання глибокої теорії, живої практики \nта індивідуального супроводу. Ти не просто навчишся \nфарбувати — ти навчишся бачити волосся, працювати з ним \nделікатно та впевнено.",

  coursesLearnTitle: "Чого ти навчишся:",
coursesColoringTitle: "Фарбування волосся",
coursesColoringList: [
  "• Основи колористики: кольоротипи, пігмент, нейтралізація",
  "• Сучасні техніки: Airtouch, балаяж, шатуш, блонд-плавлення",
  "• Корекція кольору, тонування, складні переходи",
  "• Підбір кольору під риси обличчя та стиль клієнта"
],

coursesCareTitle: "Догляд та відновлення",
coursesCareList: [
  "• Діагностика стану волосся та шкіри голови",
  "• Складання індивідуальних програм догляду",
  "• Професійні протоколи: пілінги, лікувальні маски",
  "• Робота з брендами преміум-класу та технікою нанесення"
],

coursesAudienceTitle: "Для кого цей курс:",
coursesAudienceList: [
  "• Початківців, які хочуть увійти в професію",
  "• Майстрів, які прагнуть оновити навички",
  "• Всіх, хто хоче працювати в преміум-сфері краси"
],

coursesResultTitle: "Після курсу ти отримаєш:",
coursesResultList: [
  "• Сертифікат про проходження навчання",
  "• Портфоліо готових робіт",
  "• Практичні навички, готові до роботи",
  "• Можливість стажування або роботи в BOVÉ"
],
cosmeticsTitle: "Ми використовуємо лише якісні професійні засоби.",

cosmeticsText: [
  "Наші засоби забезпечують глибоке живлення, захист і відновлення. Блиск, еластичність та об’єм — результат системного та свідомого підходу.",
  "Продукти Braé — бразильський бренд косметики для волосся, що спеціалізується на відновленні. Використовує натуральні інгредієнти та інноваційні технології. Асортимент включає засоби для догляду та стайлінгу.",
  "Dr. Sorbie — професійний преміальний трихологічний бренд, що поєднує амінокислоти, делікатний догляд та натуральні екстракти без SLS, парабенів і мінеральних олій. Бренд зосереджений на здоров’ї шкіри голови та відновленні волосся на клітинному рівні і активно використовується в салонах преміум-класу."
],
mastersTitle: "Майстер та сертифікований фахівець з догляду за волоссям і шкірою голови",

mastersText: [
  "Я спеціалізуюсь на створенні стильних, індивідуальних стрижок та фарбування волосся будь-якої складності, враховуючи природні особливості та бажання кожного клієнта. Також надаю професійні послуги з відновлення волосся та лікування шкіри голови.",
  "Моя мета — не просто змінити зовнішність, а допомогти клієнту побачити себе в новому світлі, зберігаючи природність і комфорт. Я працюю з різними типами волосся та завжди підбираю рішення, що гармонійно поєднують техніку, естетику й реальні потреби.",
  "У цій сфері я понад 10 років, і за цей час переконалась: справжня майстерність — це постійний розвиток.",
  "Я регулярно проходжу курси підвищення кваліфікації, відвідую майстер-класи провідних фахівців і постійно оновлюю знання щодо новітніх технологій у догляді за волоссям та шкірою голови.",
  "У своїй роботі я використовую виключно професійні засоби преміум-класу — ефективні, безпечні, перевірені.",
  "Я завжди прискіпливо вивчаю склад кожного продукту, перш ніж рекомендувати його клієнту: важлива не лише дія, а й якість, вплив на здоров’я волосся і шкіри голови у довгостроковій перспективі. Це дозволяє мені працювати не за шаблоном, а створювати індивідуальні рішення, які поєднують естетику, комфорт і турботу.",
  "Кожна процедура — про свідомість і професійну відповідальність. Кожна стрижка чи фарбування — про довіру, яку я ціную найбільше."
],
haircutsTitle: "Cтрижка",

haircutsList: [
  "Жіноча стрижка",
  "Стрижка чубчика",
  "Укладка на браш",
  "Чоловіча стрижка",
  "Оформлення бороди",
  "Дитяча стрижка",
  "Онлайн консультація за фото"
],

bookNow: "Записатись",

haircutsFootnote: [
  "*Послуга з виїздом додому x2 до ціни.",
  "*Послуга з виїздом за кордон за домовленістю."
],

haircutsSubtitle: "Твоя стрижка–як продовження характеру.",

haircutsDescription: [
  "Ми пропонуємо індивідуальний підхід та увагу до деталей. Майстер поєднує позачасові техніки із сучасними тенденціями, створюючи образ, який є унікальним.",
  [
    "В послугу входить:",
    "• Миття волосся шампунем та нанесення кондиціонера;",
    "• Стрижка будь-якої складності;",
    "• Укладка поформі з використанням термозахисту;"
  ],
  "Працюємо тільки з професійними інструментами та преміальними продуктами."
],

haircutsContact: "*Деталі щодо тривалості процедури та ціни ви можете уточнити за телефоном.",


coloringTitle: "Фарбування",
coloringServices: [
  "Консультація",
  "Фарбування коренів",
  "Однотонне фарбування",
  "Тонування",
  "Контуринг",
  ["Total blond (висвітлення кореня \n1.5 см + тонування)"],
  "Первинний блонд",
  "Складне фарбування частково",
  "Складні техніки фарбування",
  "Вихід з чорного кольору",
  "Онлайн консультація за фото"
],
coloringFootnotes: [
  "*Послуга з виїздом додому x2 до ціни.",
  "*Послуга з виїздом за кордон за домовленістю."
],
coloringSubtitle: "Колір–це форма самовираження.",
coloringDescription: "Ми знаємо, як розкрити найкраще у вашому волоссі, незалежно від того, чи бажаєте ви сміливий новий відтінок, ніжний балаяж чи освіжаюче фарбування, щоб приховати сивину. Професійний підхід гарантує яскраві та довготривалі результати. Розслаблена атмосфера студії та індивідуальний підхід роблять кожен візит приємним досвідом. Крім того, майстер використовує лише високоякісні продукти, які живлять ваше волосся, зберігаючи його здоровим та доглянутим.",
coloringContact: "*Деталі щодо тривалості процедури та ціни ви можете уточнити за телефоном.",
restorationTitle: "Догляд та відновлення",
restorationServices: [
  "Пілінг",
  "Пілінг додаткова послуга",
  "Реконструкція волосся",
  "Онлайн консультація за фото"
],
restorationFootnotes: [
  "*Послуга з виїздом додому x2 до ціни.",
  "*Послуга з виїздом за кордон за домовленістю."
],
restorationSubtitle: "Справжня краса починається з турботи.",
restorationDescription: "Наші процедури спрямовані не лише на зовнішній ефект, а й на глибоке оздоровлення волосся та шкіри голови. Майстер створює індивідуальні схеми процедур: глибоке живлення, реконструкція, термозахист, відновлення блиску та еластичності. \nВолосся багато розповідає: про втому, звички, сезон життя, і навіть настрій. А ми допомагаємо йому звучати краще.",
restorationContact: "*Деталі щодо тривалості процедури та ціни ви можете уточнити за телефоном.",
 brandsTitle: "Бренди",
      getPrice: "Дізнатись ціну",
      brandsFootnote: "*Деталі щодо замовлення та ціни ви можете дізнатися за телефоном.",
      allProducts: "Всі продукти",
      shopModalTitle: "Інформація щодо замовлення",
      courseSignUp: "Записатись на курс",
      hitSalesTitle: "Хіт Продажу",
      priceTitle: "Ціна договірна",
      catalogTitle: "Каталог товарів"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'ua',
    interpolation: { escapeValue: false }
  });

export default i18n;
