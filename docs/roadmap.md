PierringShot Electronics™
WhatsCore.AI - Layihə Yol Xəritəsi
Layihə Versiyası: v5.0+ (Davamlı Təkmilləşdirmə)
Bu sənəd PierringShot Electronics™ WhatsCore.AI layihəsinin ümumi konsepsiyasını,
arxitekturasını, indiyə qədər həyata keçirilmiş təkmilləşdirmələri, növbəti inkişaf fazalarını, süni
intellektin davranışının optimallaşdırılmasını, monitorinq və hesabatlılıq mexanizmlərini əhatə
edən geniş və ətraflı bir yol xəritəsidir.

Mündəricat
  1.​ Layihənin Ümumi Konsepsiyası və Arxitekturası
  2.​ İndiki Vəziyyət və Həyata Keçirilmiş Təkmilləşdirmələr
  3.​ Növbəti İnkişaf Fazaları (Yol Xəritəsi)
        ○​ Faza 1: Müraciətin Qəbulu və İlkin Analiz (Lead Management)
        ○​ Faza 2: Məhsul/Xidmət Sorğusu və Qiymət Təklifi
        ○​ Faza 3: Satışın Tamamlanması və Çatdırılma
        ○​ Faza 4: Təmir Prosesinin İdarə Edilməsi
  4.​ Süni İntellekt (AI) Davranışının Optimallaşdırılması
  5.​ Monitorinq, Hesabatlılıq və Davamlı Təkmilləşdirmə

1. Layihənin Ümumi Konsepsiyası və Arxitekturası
WhatsCore.AI - Maverick Edition WhatsApp Business API üzərində qurulmuş, süni intellekt (AI)
dəstəkli bir chatbot layihəsidir. Bu bot müştərilərlə avtomatlaşdırılmış şəkildə ünsiyyət qurmaq,
sorğuları cavablandırmaq, məhsul və xidmətlər haqqında məlumat vermək və sifarişləri idarə
etmək üçün nəzərdə tutulub. Layihə Node.js və whatsapp-web.js kitabxanası əsasında
qurulmuşdur.
Məqsəd: Biznes proseslərini avtomatlaşdırmaq, müştəri xidmətini sürətləndirmək, satışları
artırmaq və insan resurslarına olan ehtiyacı optimallaşdırmaq.
Əsas Modullar:
   ●​ Controllers: Mesaj və API sorğularını idarə edir.
   ●​ Services: AI, media emalı, tarixçə idarəetməsi, məhsul/xidmət və sifariş menecerləri kimi
      əsas iş məntiqini ehtiva edir.
   ●​ Data: Məhsul/xidmət məlumatları və lokal tarixçə faylları.
   ●​ Prompts: AI modelləri üçün təlimatları ehtiva edir.

2. İndiki Vəziyyət və Həyata Keçirilmiş
Təkmilləşdirmələr
Layihənin cari vəziyyəti və indiyə qədər həyata keçirilmiş əsas təkmilləşdirmələr:
  ●​ API Marşrutları Aktivləşdirildi: Express serveri API çağırışlarını qəbul edə bilir.
  ●​ Multimodal Bacarıqlar Təkmilləşdirildi:
        ○​ Video Analizi: Videodan bərabər aralıqlarda 5 kadr çıxarılır və AI tərəfindən vizual
            analiz edilir.
        ○​ Səsli Mesaj Transkripsiyası (PTT daxil olmaqla): Səsli mesajlar mətnə çevrilir və
            AI tərəfindən emal edilir. audition_prompt.md vasitəsilə Whisper modelinə əlavə
            kontekst verilir ki, qeyri-dəqiq transkripsiyaları belə düzgün anlasın.
        ○​ Məhsul Tipli Mesajların Emalı: WhatsApp Business API-dən gələn məhsul
            mesajları düzgün tanınır və AI tərəfindən emal edilir.
        ○​ Video Səs və Görüntünün Birgə Analizi: AI artıq video kadrlarını və səs
            transkripsiyasını birləşdirərək daha dolğun analiz təqdim edə bilir.
  ●​ AI Promptların Optimallaşdırılması: assistant_prompt.js faylındakı sistem promptu
     bütün əvvəlki promptların ən yaxşı cəhətlərini birləşdirərək AI-nin davranışını, ünsiyyət
     tərzini, bilik bazası istifadəsini və sifariş yaratma məntiqini optimallaşdırır. WhatsApp
     formatlama stilləri və emoji istifadəsi dəqiqləşdirilib.
  ●​ Lokal Tarixçə Saxlanması: Mesaj tarixçəsi və mesaj ID-ləri Firebase Firestore əvəzinə,
     lokal fayl sistemində (data/chat_histories/) hər çat üçün ayrı JSON fayllarında saxlanılır.
  ●​ Puppeteer Başlama Probleminin Həlli: whatsappClient.js faylındakı puppeteer.args
     parametrləri genişləndirilərək Linux server mühitində brauzerin başlama problemləri
     aradan qaldırılıb.

3. Növbəti İnkişaf Fazaları (Yol Xəritəsi)
Bu, layihənin gələcək inkişafı üçün ətraflı yol xəritəsidir.

Faza 1: Müraciətin Qəbulu və İlkin Analiz (Lead Management)
Məqsəd: Yeni müştəri müraciətlərini avtomatik qəbul etmək, ilkin salamlamanı göndərmək və
müştərinin niyyətini təyin etmək.
 ●​ Lead Obyektinin Yaradılması:
        ○​ handleMessage funksiyasında ( controllers/messageController.js ) hər yeni daxil
            olan mesaj üçün unikal lead_id ilə yeni bir "Lead Obyekti" yaradılacaq.
        ○​ Bu obyekt status="yeni" olaraq təyin ediləcək və lokal fayl sistemində (və ya
            gələcəkdə Memento Database-də) saxlanılacaq.
        ○​ Leads Kitabxanası: Məlumat modeli aşağıdakı sahələri ehtiva edəcək: lead_id,
            chatId, customerName, status (yeni, niyyət_təyin_edilir, məhsul_sorğusu,
            təmir_sorğusu, sifariş_yaradılır, tamamlandı, ləğv_edildi), initialMessage,
            timestamp, lastActivity, notes.
 ●​ Avtomatik Xoş Gəldin Mesajı:
        ○​ prompts/leadWelcomePrompt.js faylındakı getLeadWelcomePrompt funksiyasından
            istifadə edərək müştəriyə standart salamlama mesajı göndəriləcək.
        ○​ Bu mesaj müştərinin ilkin niyyətini öyrənməyə yönəldiləcək.
 ●​ Niyyətin Anlaşılması (NLU):
        ○​ AI (services/ai.js) müştərinin ilk mesajını (mətn, şəkil, səsli mesaj, video) analiz
            edərək niyyəti təyin edəcək.
        ○​ Mümkün niyyətlər: "məhsul sorğusu", "təmir sorğusu", "ünvan sorğusu", "ödəniş
            sorğusu", "başqa kömək".
        ○​ Niyyət təyin edildikdən sonra Lead obyektinin status sahəsi yenilənəcək.
 ●​ Media Fayl Tipinin Düzgün Yoxlanılması:
        ○​ mediaProcessor.js faylında media tipinin (məsələn, .jpeg faylının səs kimi emal
           edilməməsi üçün) düzgün yoxlanılması təmin ediləcək.

Faza 2: Məhsul/Xidmət Sorğusu və Qiymət Təklifi
Məqsəd: Müştərinin məhsul və ya xidmət sorğularını emal etmək, bilik bazasından məlumat
təqdim etmək və qiymət təklif etmək.
  ●​ Məhsul/Xidmət Axtarışı:
         ○​ AI müştərinin sorğusundan (mətn, səs transkripsiyası, şəkil/video analizi nəticəsi)
            məhsulun/xidmətin adını, modelini və ya ID-sini çıxaracaq.
         ○​ productManager.js və serviceManager.js vasitəsilə products.csv və services.csv
            fayllarında (və ya gələcəkdə Memento Database-də) axtarış ediləcək.
         ○​ AI tapılan məlumatları "BİLİK BAZASI NƏTİCƏLƏRİ" olaraq prompta daxil edəcək.
  ●​ Qiymət Hesablanması və Təklif:
         ○​ Tapılan məhsul/xidmət üçün qiymət və stok məlumatı AI tərəfindən formatlanmış
            şəkildə müştəriyə təqdim ediləcək (endirim şablonları daxil olmaqla).
         ○​ Yeni Sahələr: "Yekun Məbləğ", "Tranzaksiya ID" və "Satış Qiyməti" sahələri
            Lead/Order obyektlərinə əlavə ediləcək və bu məlumatlar AI tərəfindən cavabda
            istifadə olunacaq.
         ○​ Alternativ Adlar (Teqlər): Məhsul/xidmət verilənlər bazasına "Alternativ Adlar
            (Teqlər)" sahəsi əlavə ediləcək ki, AI axtarışları daha dəqiq aparsın.
  ●​ Stok Yoxlaması: Məhsulun/xidmətin mövcudluğu haqqında məlumat veriləcək. Əgər
      stokda yoxdursa, alternativlər təklif ediləcək.
  ●​ Status Yenilənməsi: Lead obyekti status="müştəri_cavabı_gözlənilir" olaraq yenilənəcək.

Faza 3: Satışın Tamamlanması və Çatdırılma
Məqsəd: Müştəri təklifi qəbul etdikdə sifarişi tamamlamaq və çatdırılmanı təşkil etmək.
 ●​ Ödəniş Təsdiqi:
      ○​ Müştəri təklifi qəbul etdikdə, AI ödəniş rekvizitlərini (bank kartı nömrələri, M10,
          BirBank) göndərəcək.
      ○​ Müştəridən ödəniş qəbzinin şəklini tələb etmək.
      ○​ Sistem qəbzi analiz edib ödənişi təsdiqləyəcək.
 ●​ Sifarişin Yaradılması:
      ○​ Ödəniş təsdiqləndikdən sonra createOrder funksiyası ( orderManager.js )
          aktivləşəcək.
      ○​ AI təlimatdakı JSON formatında cavab verərək sifarişin Memento Database-də (və
          ya lokal JSON-da) yaradılmasını təmin edəcək.
      ○​ Order obyekti aşağıdakı sahələri ehtiva edəcək: orderId, lead_id, customerInfo,
          items (məhsul/xidmət siyahısı), totalAmount, transactionId, paymentStatus,
          deliveryAddress, deliveryStatus.
 ●​ Kuryer Sifarişi (Simulyasiya):
      ○​ Müştəridən çatdırılma ünvanı alınacaq.
      ○​ Uber API ilə inteqrasiya simulyasiya ediləcək (gələcəkdə real inteqrasiya).
      ○​ Kuryer təyin olunacaq və müştəriyə kuryer məlumatları (adı, nömrəsi, avtomobil,
          izləmə linki) göndəriləcək.
      ○​ Çatdırılma ödənişi məsafəyə və tıxaca görə hesablanacaq.
 ●​ Depo İdarəetməsi:
        ○​ Sistem müxtəlif depoların (Həsən Əliyev 96, Süleyman Rüstəm 15d, Rəşid
           Behbudov 134, Azadlıq prospekti 61) stok mövcudluğunu nəzərə alaraq məhsulun
           ən uyğun depodan götürülməsini təmin edəcək.
        ○​ Kuryerə məhsulu götürmək üçün dəqiq təlimatlar veriləcək.

Faza 4: Təmir Prosesinin İdarə Edilməsi
Məqsəd: Təmir müraciətlərini effektiv şəkildə idarə etmək və müştəriləri prosesin hər mərhələsi
barədə məlumatlandırmaq.
  ●​ Təmir İş Axını: Təmir müraciətləri üçün faza-mərhələ iş axını implementasiya ediləcək:
        1.​ Qəbul: İlkin diaqnostika üçün cihazın qəbulu.
        2.​ Diaqnostika və Təsdiq: Pulsuz diaqnostika aparılır, problem müəyyən edilir, təmir
            xərcləri və müddəti müştəriyə bildirilir. Müştəri təsdiqlədikdə (və ya depozit
            ödədikdə).
        3.​ Təmir: Təmir işləri aparılır.
        4.​ Təhvil: Təmir tamamlandıqdan sonra cihaz müştəriyə təhvil verilir.
  ●​ Diaqnostika Ödənişi Məntiqi: Diaqnostika ödənişsizdir, lakin təmir baş tutduqda bu
     məntiq təsdiqlənir.
  ●​ Zəmanət İdarəetməsi: Məhsul və xidmətlər üçün zəmanət şərtləri AI tərəfindən izah
     ediləcək və idarə olunacaq.

4. Süni İntellekt (AI) Davranışının Optimallaşdırılması
AI-nin daha "ağıllı" və "proaktiv" olması üçün davamlı təkmilləşdirmələr:
  ●​ Prompt Təkmilləşdirmələri və Dilin İncəlikləri:
         ○​ Adaptiv Ton: AI müştərinin danışıq tərzinə uyğunlaşacaq. Səmimi müştərilər üçün
            "brat", "can" kimi sözləri yerində istifadə edə biləcək, rəsmi müştərilər üçün isə
            peşəkar tonu qoruyacaq.
         ○​ Qeyri-dəqiq İfadələrin Anlaşılması: "Amciqfason transkripsiyalar" və ya digər
            qeyri-standart ifadələr olsa belə, AI kontekstə əsaslanaraq müştərinin əsl niyyətini
            və sualını düzgün şərh etməyi öyrənəcək.
         ○​ Proaktiv Təkliflər: AI sadəcə suala cavab verməyəcək, həm də müştərinin
            problemini həll etmək üçün proaktiv şəkildə xidmətlər və məhsullar təklif edəcək
            (məsələn, "noutbuk qızır" üçün təmizlik xidməti).
  ●​ Söhbət Tarixçəsinin İdarə Edilməsi və Token Optimallaşdırılması:
         ○​ MAX_HISTORY_MESSAGES dəyişəni dinamik olaraq idarə ediləcək.
         ○​ AI modelinə göndərilən söhbət tarixçəsi optimallaşdırılacaq (ən köhnə və ya ən az
            əhəmiyyətli mesajların silinməsi).
         ○​ Bilik Bazasının nəticələri də qısa və məqsədəuyğun şəkildə təqdim ediləcək ki,
            ümumi token sayı aşılmasın.
  ●​ Məlumat Olmadıqda Cavab: AI bilik bazasında məlumat tapmazsa, məlumat
      uydurmayacaq. Bunun əvəzinə, müştəriyə bunu səmimi şəkildə bildirəcək və "menecerlə
      əlaqə" yazmağı təklif edəcək.

5. Monitorinq, Hesabatlılıq və Davamlı Təkmilləşdirmə
Sistemin arxa planda necə işlədiyini və nə qədər effektiv olduğunu izləmək üçün:
   ●​ Hər Addımın Loqlanması: Hər bir müraciət, atılan hər addım, göndərilən hər mesaj və
      sistem qərarı unikal lead_id ilə loqlanacaq (logs/whatscore.log). Bu, gələcəkdə hesabatlar
      çıxarmaq və sistemin effektivliyini ölçmək üçün vacibdir.
   ●​ Performans Metrikaları: AI cavab vaxtı, mesaj emalı müddəti, API istifadəsi kimi
      metrikalar izləniləcək.
   ●​ Müştəri Məmnuniyyəti Sorğusu: Təmir prosesi bitdikdən sonra müştəri məmnuniyyəti
      sorğusu keçirilə bilər.
   ●​ İterativ Təkmilləşdirmə: Bu sistem heç vaxt "bitmiş" olmayacaq. O, daim öyrənən və
      təkmilləşən bir canlı orqanizm kimi olacaq. Hər testdən, hər müştəri rəyindən sonra AI-nin
      davranışını və Bilik Bazasını yeniləyəcəyik.
