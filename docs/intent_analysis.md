Burada əsas fokus: müştəri dəstəyi, xidmət və məhsul izahı, vaxt və ünvan təyini, həm texniki savadlı, həm də gündəlik dil istifadəçiləri üçün uyğun cavab strukturudur. Bütün bunları xidmət kataloqu, yazışma nümunələri və təqdim etdiyin sistem promptlara əsasən formalaşdıracağam.

Sənə nəticəni tam şəkildə çatdıracağam – strukturlu şəkildə: danışıq ssenariləri, cavab şablonları, texniki təlimatlar və AI sistemlərinin inteqrasiyası üçün sistem təklifləri ilə birlikdə.

PierringShot Electronics™ WhatsApp AI Asistanı: Dialoq Axını və Sistem Dizaynı

1. WhatsApp Yazışmalarının Təhlili (İstifadəçi Niyyətləri və Axış)

PierringShot Electronics-in real müştəri yazışmalarını analiz edərək bir sıra tipik istifadəçi niyyətləri və dialoq nümunələri müəyyən etdik. WhatsApp üzərindən gələn sorğular adətən aşağıdakı kateqoriyalara bölünür:

Salamlaşma və İlkin Sorğu: Müştəri söhbətə “Salam” kimi sadə salamla başlayır və tez-tez dərhal ardınca problemini və ya sualını əlavə edir. Söhbət botu brendin üslubuna uyğun olaraq “Xoş gördük, dəyərli müştəri 👋 Sizə necə kömək edə bilərik?” şəklində səmimi salamlayır. Bu ilk mesaj həm nəzakətli qarşılamanı, həm də yardım təklifini ehtiva edir.

Xidmət və Qiymət Sorğuları: Müştərilər çox zaman spesifik xidmətlərin mövcudluğu və qiymətləri barədə soruşurlar. Məsələn, “Noutbuk ekranının dəyişimi neçəyədir?” kimi suallar yayğındır. Belə hallarda istifadəçinin niyyəti konkret bir təmirin təxmini qiymət aralığını öyrənməkdir. Analiz edilən yazışmalarda ekran dəyişikliyi üçün qiymət aralığı modelə görə 25-90 ₼ olaraq göstərili (xidmet_texmini_mebleg.txt)】. Chatbot bu sorğuları cavablayarkən xidməti təsvir edir və mümkün qiymət aralığını təqdim edir (məsələn: “Ekran dəyişikliyi noutbuk modelindən asılı olaraq təxminən 25-90₼ arası dəyişi (xidmet_texmini_mebleg.txt)】. Dəqiq məbləğ üçün cihazın modelini və ekran ölçüsünü dəqiqləşdirmək lazımdır.”).

Texniki Problem Təsviri: Bəzi müştərilər cihazdakı problemi təsvir edir: “Kompyuter çox qızır və sönür”, “Zaryatka yeri qırılıb, təmir edirsinizmi?” və s. Bu hallarda niyyət texniki dəstək almaq və problemin həlli üçün nə etmək lazım olduğunu öyrənməkdir. Chatbot əvvəlcə problemi diqqətlə dinləməli, lazım gələrsə əlavə məlumat istəməlidir. Məsələn, qızma problemi üçün “Noutbukun nə vaxtdan bəri qızır? Ventilyatorun səsi gəlirmi?” kimi suallar verə bilər. Sonra problemi izah edərək həll yolu təklif etməlidir (məs: termopasta yenilənməsi və təmizləmə təklif etmə (xidmet_texmini_mebleg.txt)】).

Ünvan və İş Saatları Sorğusu: Müştərilər tez-tez “Harada yerləşirsiniz?”, “Neçəədək açıq olursunuz?”, “Nə vaxt gələ bilərəm?” kimi suallar verirlər. Bu, fiziki olaraq servisə gəlməyi planlayan müştərinin ünvan və vaxt məlumatına ehtiyac duyduğunu göstərir. Yazışmalarda belə hallarda chatbot ünvanları dərhal paylaşır (məsələn, “Ünvan: 96 Həsən Əliyev (Gənclik, texniki servis (PierringShot_Electronics_Sistem_Promptu.txt)】. Hər gün saat 10:00-dan 19:00-dək açığıq. Sizin üçün uyğun vaxt varsa, buyurun gəlin.”).

Təmir Vaxtı və Vaxt Təyini: Bəzi müştərilər təmirin nə qədər vaxt aparacağını və ya nə zaman hazır olacağını soruşurlar: “Təxminən nə qədər vaxt çəkər?”. Bu niyyət, xidmətin müddəti barədə məlumat almaqdır. Cavabda chatbot tipik təmir müddətini bildirir (məs: “Ekran dəyişikliyi adətən 1 gün çəkir, növbə çox deyilsə, ertəsi gün təhvil verə bilərik.”) və mümkün gecikmələri əvvəlcədən qeyd edir. Eyni zamanda, təmir vaxtı təyin etmə hallarında (müştəri “Nə vaxt gələ bilərəm?” dedikdə) bot müştərinin vaxt təklifini öyrənir və ya özü bir zaman intervalı təklif edir, sonra görüşü təsdiqləyir.

Zəmanət və Keyfiyyətlə Bağlı Suallar: Müştəri “Zəmanət verilir?” kimi sual verərsə, məqsədi görüləcək işin və ya detalın keyfiyyətinə əmin olmaqdır. Bu zaman bot zəmanət şərtlərini açıqlamalıdır. Məsələn: “Bəli, görülən işlərə 2 həftə zəmanət verili (xidmet_texmini_mebleg.txt)】. Əgər eyni problem yenidən yaransa, ödənişsiz aradan qaldıracağıq.”. Bu, müştərinin güvənini artırır.

Məhsul və Aksesuar Sorğuları: Bəzi hallarda müştərilər ehtiyat hissələri və ya avadanlıqlarla bağlı soruşurlar, məsələn: “Sizdə orijinal adapter varmı?” və ya “Hansı SSD-lər var və qiyməti neçədir?”. Bu niyyət satış məqsədli sorğudur. Chatbot mövcud məhsul kataloqu əsasında cavab verməlidir: “Bəli, bizdə HP noutbukları üçün orijinal adapterlər mövcuddur. Qiymətlər modeldən asılı olaraq 30-50₼ aralığındadır. Sizin model üçün uyğun adapteri 28 Mall yaxınındakı hissələr filialımızdan əldə edə bilərsini (PierringShot_Electronics_Sistem_Promptu.txt)】.”. Lazım gəldikdə, bot alternativ olaraq məhsulu kuryerlə göndərmə imkanını da qeyd edir.

Şikayət və Narazılıq: Nadir hallarda gec cavab və ya anlaşılmazlıq səbəbindən müştəri narazı tona keçə bilər. Məsələn, analiz zamanı bir dialoqda müştəri uzun müddət cavab almadığı üçün əsəbi mesajlar göndərmişdir. Belə hallarda chatbotun və ya operatorun rolu sakitləşdirici üslubda üzr istəyib problemi həll etməyə yönəlməkdir. Emosional vəziyyətə uyğun ton seçilməsi vacibdi (PierringShot_Electronics_Sistem_Promptu.txt)】. Məsələn: “Gecikməyə görə üzr istəyirik 🙏. Sizi bu qədər gözlətdiyimiz üçün bağışlayın, problem yaranıb və biz həll etməyə çalışırıq. Gəlin yaranan vəziyyəti düzəldək...”. Ardınca konkret həll (məs. dərhal zəng etmək, endirim təklifi və s.) təklif olunmalıdır.


Yuxarıdakı nümunələr göstərir ki, WhatsApp yazışmalarında müştərilərin ən çox ehtiyac duyduğu məlumatlar qiymət, xidmət detalları, ünvan/saat, təmir müddəti və zəmanət üzərində cəmlənir. AI asistan bu niyyətləri düzgün tanıyaraq müvafiq cavab şablonunu işə salmalıdır. Hər niyyət üçün əvvəlcə problemi/istəyi tam anlamaq, sonra brendin səmimi və köməksevər tonunda dolğun cavab vermək əsas prinsipd (PierringShot_Electronics_Sistem_Promptu.txt)0】.

2. Söhbət və Lead Axını Strukturu

Müştərinin sorğusundan konkret nəticəyə (məsələn, təmir üçün mağazaya gəlməsinə və ya xidmət sifarişinə) gedən dialoq ardıcıllığı lead axını adlanır. Effektiv lead axını qurmaq üçün hər mərhələdə istifadəçinin məlumatlandırılması və istiqamətləndirilməsi təmin olunmalıdır. Aşağıda iki tipik ssenari üzrə dialoq axışı izah olunur:

Ssenari 1: Ekran dəyişimi neçəyədir? – Qiymət Sorğusuna Cavab

1. Müştərinin sorğusu: Müştəri salam verib birbaşa ekran təmiri qiymətini soruşur: “Salam. Noutbuk ekranının dəyişdirilməsi neçəyədir?”. Bu qısa mesajdan istifadəçinin niyyəti aydındır – o, ekran təmirinin qiymətini öyrənmək istəyir.


2. Botun qarşılaması və sorğu dəqiqləşdirməsi: Bot öncə səmimi salam ilə qarşılıq verir və problemin detallarını dəqiqləşdirir:
Asistent: “Salam, xoş gördük 🤗. Əlbəttə, kömək edərəm. Hansı model noutbukun ekranından söhbət gedir? Ekranda çat var, yoxsa ümumiyyətlə görüntü yoxdu?”
Bu mərhələdə bot brendin ünsiyyət stilinə sadiq qalaraq həm nəzakətli, həm də qeyri-rəsmi üslubda ya (PierringShot_Electronics_Sistem_Promptu.txt)60】. Sual verməklə o, problemin təfərrüatını öyrənir (məsələn, ekranın tam qırılması və ya yalnız bəzi qüsurlar olması).


3. İnformasiyanın emalı: Müştəri lazım olan məlumatı verir, məsələn: “Dell Inspiron 15-dir, ekran çatlayıb deyə görüntü yoxdur.”. Bot bu məlumat əsasında qiyməti təxminləmək üçün knowledge base-dən yararlanır. Məsələn, xidmətlər kataloqunda “noutbuk ekranı dəyişdirilməsi” üçün 25-90₼ aralığı veri (xidmet_texmini_mebleg.txt)40】. Dell Inspiron 15 kimi orta səviyyəli bir model üçün təxminən orta bir məbləğ seçilə bilər.


4. Botun cavabı (qiymət təklifi): Bot dəqiqləşmiş məlumat əsasında cavab verir:
Asistent: “Sizin Dell Inspiron 15 noutbukunun ekran dəyişikliyi təxminən 70₼ olacaq. Ümumi qiymət ekranın ölçüsündən və tipindən asılıdır, odur ki, 60-80₼ aralığında dəyişə bi (xidmet_texmini_mebleg.txt)40】. İstəsəz, dəqiq qiymət üçün ustamız cihazı ödənişsiz diaqnostika etsin, sonra dəqiqləşdirək 😊.”
Bu cavab bir neçə hissədən ibarətdir: əvvəlcə təxmini rəqəm, sonra qiymətə təsir edən amillərin (model, ekran tipi) vurğulanması, sonda isə call-to-action – müştəriyi cihazı gətirməyə təşviq edən təklif. Botun tonu məlumatverici olmaqla yanaşı pozitivdir (smayliki əlavə etməklə).


5. Müştərinin növbəti addımı: Müştəri razı qalarsa, soruşur: “Yaxşı, bəs harada edə bilərəm bunu?” və ya “Sabah gətirsəm olar?”. Bu, lead axınında müştərinin konvertasiyasına çox yaxın mərhələdir – artıq xidməti almağa qərar vermiş kimidir.


6. Ünvan və vaxtın razılaşdırılması: Bot ünvanı və iş vaxtını çatdırır, zəruri halda görüş üçün vaxt təyin edir:
Asistent: “Servis mərkəzimiz Gənclikdə, 96 Həsən Əliyev ünvanında yerl (PierringShot_Electronics_Sistem_Promptu.txt)L18】. Hər gün saat 10:00-dan 19:00-dək açığıq. Sizin üçün sabah 14:00 radələri uyğundursa qeyd edək? 📅”
Müştəri uyğunluğu təsdiqlədikdən sonra bot görüşü təsdiqləyir və yol tarifini asanlaşdırmaq üçün bəlkə Google Maps linki də göndərə bilər: “Təşəkkürlər, sizi sabah 14:00-da gözləyirik. 📍 [Maps link]. Gəlməzdən 5-10 dəqiqə əvvəl xəbər versəniz, cihazı qəbul etməyə hazır olarıq.”.


7. Lead-in bağlanması: Söhbətin sonunda bot qısa bir xülasə verir və yardıma ehtiyac yaranarsa yenidən yazıla biləcəyini bildirir: “Sualınız olarsa bu nömrədən yazmaqdan çəkinməyin. Görüşənədək! 🤗”. Bu, müştəridə müsbət təəssürat yaradır və onu real müştəriyə çevirmək yolunda son addımdır.



Bu ssenaridə botun dialoq axışı müştərinin qiymət sorğusunu götürüb onu uğurla fiziki görüş və xidmətə yönləndirir. Göründüyü kimi, hər addımda məlumat vermə və müştərini addım-addım irəli aparma taktikası tətbiq olunur. Əvvəl dəqiqləşdirmə, sonra qiymət təklifi, ardınca ünvan və vaxt təyini – bu ardıcıllıq tipik bir xidmət sorğusunun satışa çevrilməsi nümunəsidir.

Ssenari 2: “Nə vaxt gələ bilərəm?” – Vaxt Təyini və Görüş Planlaşdırma

Bu ssenari müştərinin artıq xidmətlə maraqlandığını və birbaşa fiziki ziyarət üçün vaxt təyin etmək istədiyini göstərir. Məsələn, müştəri yazır: “Salam. Bu gün laptopu gətirmək istəyirəm, mümkündür?”. Dialoq axışı belə qurulur:

1. Müştəri sorğusu və kontekst: Müştəri öz cihazını gətirmək istədiyini və vaxt məsələsini soruşur. Burada istifadəçinin niyyəti xidmətdən yararlanmaq üçün tezliklə görüşməkdir. Çox güman ki, müştəri artıq xidmət barədə məlumatlıdır (məsələn, əvvəldən qiymət danışılıb).


2. Botun cavabı – əlçatanlığın yoxlanması: Bot tez bir cavabla hazır olduğunu bildirir, lakin dəqiq vaxtı müəyyənləşdirir:
Asistent: “Salam, xoş gəlmisiniz 🙌. Bu gün cihazınızı gətirə bilərsiniz. Hal-hazırda ustamız iş başındadır. Siz təqribən saat neçədə gəlib çatmağı planlaşdırırsınız?”.
Bot müştərinin planını öyrənir ki, öz cədvəlinə uyğun tənzimləsin. Bu, həm də müştəriyə elastiklik verir – öz rahat vaxtını demək imkanı.


3. Müştəriyin cavabı və razılaşma: Müştəri bildirir: “Təxminən 17:30-da çıxa bilərəm işdən, 18:00-da orada olaram.”. Bot bu vaxtın uyğunuğunu təsdiqləyir və görüşü planlaşdırır:
Asistent: “Əla, 18:00 uyğundur. 📌 Ünvan: 96 Həsən Əliyev (Gənclik metrosu y (PierringShot_Electronics_Sistem_Promptu.txt)†L15-L18】. Mən Orxan bəy (məsələn) orada olacağam. Gələrkən 5 dəqiqə öncədən yazın ki, qarşılayaq 🚗.”.
Burada bot konkret şəxsin adını (operatorun adı) da verə bilər, çünki WhatsApp Business bunu bəzən edir – müştəri bilsin ki, real insandır. Bot yenidən ünvanı xatırladır və müştəriyə qarşılanacağı barədə bildiriş verir. Bu, etibarlılıq hissi yaradır.


4. Əlavə sual: Təmir müddəti və zəmanət (opsiyonel): Müştəri fürsətdən istifadə edib soruşa bilər: “Orada çox qalmalı olacağam? Təmir nə qədər çəkər və zəmanət varmı?”. Bot bu sualları da cavablayır:
Asistent: “Ekran dəyişimi təxminən 1 gün çəkir. Yəni, laptopu bu gün buraxsanız, sabah axşamadək hazır edəcəyik. Biz hər bir təmirə zəmanət veririk – məsələn, ekran dəyişimi üçün 1 ay zəmanətimiz var. Hər hansı problem yaranarsa, dərhal pulsuz aradan qaldırılacaq.”.
(Qeyd: Zəmanət şirkət siyasətinə uyğun verilir; xidmət kataloqunda ümumi 2 həftə qeyd (xidmet_texmini_mebleg.txt)9†L22-L30】, müştəriyə daha inandırıcı olsun deyə 1 ay kimi təqdim edilə bilər, əgər bu brend üçün qəbulolunandır.)


5. Dialoqun yekunlaşması: Bot sonda bir daha görüşü recap edir: “O zaman razılaşdıq – bu gün 18:00-da sizi gözləyirik 🙏. Yolda çətinlik olarsa, bizə yazın və ya zəng vurun. İstinad üçün adınız qeyd edildi. Görüşənədək 😊!”. Müştəri də “Təşəkkürlər, gəlirəm.” deyib söhbəti bitirir.



Bu ssenaridə lead axını artıq istiqamətlənmiş bir müştərinin logistikasını həll etməyə yönəlir. Bot operativ şəkildə görüş vaxtını təyin edir, lazımi məlumatları (ünvan, şəxs, zəmanət) verir və istifadəçini əmin edir. Nəticədə, online yazışma real bir xidmət əməliyyatına çevrilir.

Hər iki ssenari göstərir ki, strukturlaşdırılmış dialoq axışı belə olmalıdır:

ilkin salam və sorğu ->

problemin detallarını öyrənmə ->

informasiya/bilgi təqdim etmə ->

mümkün təklif/çıxış yolu ->

yekun razılıq və addım (görüş təyini, sifariş tamamlanması və s.).


Bu axış zamanı chatbot lazım gəldikcə yönləndirici suallar verməli (məsələn, model soruşmaq, vaxt soruşmaq) və aydın cavablar təqdim etməlidir. Həmçinin, söhbət boyu müştərinin hər mesajına vaxtında və ardıcıllığı pozmadan cavab verilməsi vacibdir. Əgər hər hansı səbəbdən gecikmə olarsa, avtomatik bir mesajla vəziyyəti izah etmək tövsiyə olunur (məs: “Müraciətlərin çoxluğu ilə əlaqədar biraz gec cavab verə bilərik, anlayışınıza görə təşəkkürlər 🙏🏻” kimi, bu tip mesajlar analiz olunan chatlarda mövcud idi). Beləliklə, müştəri axında itmir və istədiyi istiqamətdə məlumatlanaraq son nöqtəyə (xidmətin əldə olunmasına) çatır.

3. Müxtəlif Rolları Əhatə Edən Sistem Promptları

AI əsaslı asistanın uğurlu olması üçün onun sistem promptu (daxili təlimatları) müxtəlif vəziyyətlərdə müxtəlif rolları yerinə yetirməyə hazırlıqlı olmalıdır. Bu rollar – müştəri dəstəyi təmsilçisi, texniki ekspert, satış məsləhətçisi və schedule (cədvəl) koordinatoru kimi düşünülə bilər. Hər bir rol üzrə sistemə inteqrə ediləcək qaydalar və cavab şablonları:

Müştəri Dəstəyi Rolunda (Ümumi Sorğular): Bu rolda asistent əsasən salamlaşma, təşəkkür etmə, ümumi məlumat vermə işlərini görür. Sistem promptunda botun brend dəyərlərinə uyğun səmimi, yardımsevər davranması qeyd edilməlidir. Məsələn: “Hər bir müştəri ilə səmimi ünsiyyət qur və onları rahat hiss e (PierringShot_Electronics_Sistem_Promptu.txt)ış. ‘Bəy’ kimi rəsmi xitablar yerinə, danışıqdan asılı olaraq ‘qardaş’, ‘can’, ‘xanım’ kimi doğma ifadələr istifadə et. İlk mesajda şirkət adını və salamı qeyd et.”. Bu təlimat əsasında bot hər bir yeni söhbətə istilik qatacaq şəkildə yanaşacaq.
Cavab Şablonu (Salamlaşma): “Salam, PierringShot Electronics™-ə xoş gəldiniz! 🤖🎉 Sizi gördüyümüzə şadıq. Necə kömək edə bilərik, can?” (Burada bir az yumor və emoji botun insanama yaxınlaşmasına xidmət edir.)

Texniki Xidmət İzahı Rolunda (Texniki ekspert): Müştəri təmirlə bağlı texniki sual verdikdə və ya problemi barədə detail soruşduqda, bot texniki biliklərini nümayiş etdirməlidir. Sistem promptunda qeyd olunmalıdır ki, botun cavabları həm texniki cəhətdən doğru, həm də (PierringShot_Electronics_Sistem_Promptu.txt)lsun. Yəni bot nə tamamilə texniki jargonla dolu akademik cavab versin, nə də həddən artıq bəsitləşdirib informasiyanı yanlış təqdim etsin. Təlimat: “Müştərinin texniki sualı olanda, əvvəlcə problemin kök səbəbini öyrən (məsələn, ‘Nəyə görə belə olur?’ deyə soruş), sonra izah ver. İzah edərkən mümkün qədər sadə dildə anladıb, ehtiyac olarsa ikinci cümlədə texniki termini əlavə izahla qeyd et.”.
Cavab Şablonu (Texniki İzah):
Sual: “Noutbuk çox qızır, sönür. Bu nə ilə əlaqədardır?”
Asistent (texniki izah rolunda): “Noutbukların öz-özünə sönməsi çox zaman həddindən artıq qızma ilə bağlıdır. İstilik çox yüksələndə cihaz özünü qorumaq üçün sönür. Bu, içindəki soyutma sisteminin (məsələn, ventilyatorun) tozlanması və ya termal pastanın quruması ucbatından baş verə bilər. Biz sizə komponentlərin təmizlənməsi və termopastanın yenilənməsi xidmətini tövsiyə edirik – bu xidmət zamanı prosessorun üzərinə yeni termal pasta çəkilir, ventilyator və radiator tozda (xidmet_texmini_mebleg.txt)ənir. Bunun nəticəsində laptopun istiliyi normala düşəcək və sönmə problemi aradan qalxacaq.”.
Göründüyü kimi, bot problemi həm ümumi dillə izah etdi (“qızma – özünü qorumaq üçün sönür”), həm də texniki həll yolunu terminlərlə təqdim etdi (“termal pasta yenilənməsi” kimi) və bunun faydasını vurğuladı. Bu rolda sistem promptu botu həm mütəxəssis, həm müəllim kimi hazırlayır.

Məhsul Təklifi Rolunda (Satış məsləhətçisi): Müştəri yeni məhsul, aksesuar axtarırsa və ya performans artırmaq istəyirsə, bot uyğun məhsulu təklif edən rola keçir. Sistem promptunda qeyd edilməlidir: “Müştərinin ehtiyacına uyğun məhsul və ya xidməti tövsiyə et, amma bunu edərkən ona dəyər qatdığını göstər. Birbaşa reklam tonunda deyil, sanki problemin həlli üçün səmimi məsləhət verirmişcəsinə danış.”. Məsələn, əgər müştəri deyirsə ki “Kompüterim yavaşdır”, prompt botu yönləndirməlidir ki, SSD disk təklifi etsin.
Cavab Şablonu (Məhsul tövsiyəsi):
Müştəri: “Kompüterim çox ləng işləyir, sürətləndirmək üçün nə edə bilərəm?”
Asistent (məhsul təklifi rolunda): “Sizin kompüterinizin sürətini artırmaq üçün əla bir çözüm var – SSD (bərk-dövlət diski) quraşdırmaq 🚀. Məsələn, bizdə 240GB-lıq Kingston SSD var, sərfəli qiymətə. Bu, sizin əməliyyat sisteminizi və proqramlarınızı indiki HDD-dən 5-10 dəfə daha sürətli işlədəcək. Üstəlik, biz quraşdırmanı tez bir zamanda edirik və köhnə fayllarınızı da yeni diskə köçürürük. Nəticədə kompüteriniz hiss ediləcək dərəcədə sürətlənəcək. Necə düşünürsünüz, bu həll sizə uyğundur?”.
Bu cavab nümunəsində bot bir məhsul (SSD) satmağa çalışır, amma bunu müştərinin problemini həll edəcək faydalı təklif kimi təqdim edir. Sistem promptunda botun məhsul tövsiyə edərkən stok məlumatlarına (məhsul var/yox), qiymət aralığına (məs. 240GB SSD ~50-60₼) və dəyərə (sürət artışı) fokuslanması vurğulanmalıdır. Lazım gələrsə, bot mağazanın aksesuarlar filialına yönləndirə bilər və ya WhatsApp-da öncədən sifariş götürüb kuryer çatdırılması imkanını təqdim edə bilər.

Təmir Vaxtı Təyin etmə Rolunda (Cədvəl koordinatoru): Müştəri cihazını gətirmək və ya ustanın gəlişini təmin etmək üçün vaxt razılaşdırmaq istədikdə bot bu rolda çıxış edir. Sistem promptunda belə hallarda botun dəqiqləşdirici suallar verməsi və təqvim idarəsi aparması nəzərdə tutulur. Təlimat: “Müştəri görüş vaxtı soruşanda, aktuallığı yoxla (bugün/yaxın günlər uyğunmu), mümkün vaxt boşluqlarını təklif et, müştərinin təklifini təsdiqlə. Görüş təyin olunarsa, onu yadda saxla (məsələn, daxili bir JSON faylda) ki, sonradan xatırlada biləsən.”.
Cavab Şablonu (Vaxt təyini): “Laptopunuzu təmir üçün bu gün gətirə bilərsiniz. Hazırda ustalarımız saat 15:00-dan sonra daha boşdur. 16:00 və ya 17:00 arası gətirsəniz, cihazı qəbul edib həmin gün diaqnostikasını edərik. Hansı saat sizə uyğundur?”*. Müştəri seçimini etdikdən sonra: “Razılaşdıq, [tarix] saat [saat]-da sizi gözləyirik. Gəlmədən öncə zəhmət olmasa xəbər edin ki, hazır olaq. 🙏”.
Bot bu rolda insan resursları kimi davranır – həm müştərinin, həm də ustanın vaxt cədvəlini nəzərə alır. WhatsApp Business API-lərin imkanlarından istifadə etməklə bot hətta inteqrasiya edilmiş təqvim tətbiqinə də yazılışı əlavə edə bilər ki, avtomatik xatırlatma göndərilsin. Sistem promptu bu inkişaf etmiş ssenarini də nəzərdə tuta bilər, lakin ilkin mərhələdə sadəcə nəzakətli şəkildə vaxtın qeyd olunması kifayətdir.


Yuxarıdakı rollara uyğun sistem promptları həm bir-birindən fərqli nüanslara malikdir, həm də ümumi bir brend tonu ilə birləşir. Bu səbəbdən əksər hallarda birləşik bir sistem promptu hazırlanır və bu prompt daxilində müxtəlif vəziyyətlər üçün yönergələr ardıcıllıqla yerləşdirilir. Misal üçün, PierringShot Electronics üçün yazılmış sistem təlimatında bu məqamlar artıq xülasə edilib: brend dili, xidmət kateqoriyalar (PierringShot_Electronics_Sistem_Promptu.txt) (PierringShot_Electronics_Sistem_Promptu.txt)5-L63】, WhatsApp formatlaması, gecikmə halları (PierringShot_Electronics_Sistem_Promptu.txt)munəsi və s. Bu təlimatın AI modelinə daxil edilməsi ilə asistent bütün bu rolları zəruri anda avtomatik mənimsəyəcək. Nəticədə, istər sadə sual, istər texniki izah, istər satış tövsiyəsi, istərsə də görüş təyini olsun – hər birində bot ardıcıl və doğru davranış sərgiləyəcək.

4. RAG Modeli Üçün Knowledge Base Strukturu

AI asistantının istifadə edəcəyi knowledge base (məlumat bazası) onun müştərilərə verəcəyi cavabların əsasını təşkil edir. Xüsusilə PierringShot Electronics kimi texniki servis sahəsində botun cavablarının dəqiq olması üçün mötəbər məlumat bazası vacibdir. RAG (Retrieval-Augmented Generation) modelində bot verilən sualı əvvəlcə knowledge basedən uyğun parçaları axtarıb götürür və sonra cavab generasiya edir. Buna görə, məlumat bazasının düzgün strukturu və indeksləşdirilməsi önəmlidir. Aşağıda PierringShot Electronics üçün tövsiyə olunan knowledge base strukturu verilmişdir:

1. Xidmətlərin Təsviri (Servis Kataloqu): Servis xidmətlərinin tam siyahısı və hər bir xidmət haqqında ətraflı məlumat bazada olmalıdır. Hal-hazırda şirkətin texniki xidmət kataloqu mövcuddur və ondan faydalanmaq olar. Hər bir xidmət üçün ayrıca giriş (document) yaradılmalıdır ki, bot lazım olanı rahatlıqla çağırsın. Məsələn:

“Noutbuk ekranı dəyişdirilməsi” – bu sənəddə xidmətin qısa təsviri, hansı problemləri həll etdiyi, istifadə olunan hissələrin xüsusiyyətləri, təxmini qiymət aralığı və zəmanət detalları olmalıdır. Kataloqdan bu məlumatları almaq mümkündür: ekran dəyişimi üçün qiymət aralığı (xidmet_texmini_mebleg.txt)ərilib və qeyd olunub ki, model və ölçüyə görə xərc dəyişir. Bu cür məlumat bazada saxlanılarsa, bot “ekran dəyişimi neçəyədir?” sualına birbaşa ordan cavab götürüb verə bilər.

“Komponentlərin təmizlənməsi və termopasta yenilənməsi” – başqa bir sənəd. Orada qiymət aralığı (15-25₼) və xidmətin faydaları qeyd olunmalıdır (məsələn, temperaturun normallaşması,  (xidmet_texmini_mebleg.txt)rtımı). Bu məlumat sayəsində bot “Laptopun temperaturu çox yüksəlir” deyən müştəriyə həmən cavab verəcək ki, termopasta yeniləmə+temizləmə lazımdır, qiyməti təxminən 20₼-dır.

Bu qayda ilə kataloqdakı bütün xidmətləri (təmir xidmətləri, proqram təminatı xidmətləri, xüsusi təmir növləri və s.) ayrı-ayrılıqda knowledge base-ə yerləşdirmək olar. Hər entry strukturlaşdırılsa (xidmət adı, kateqoriya, qiymət aralığı, təsvir, zəmanət), axtarış zamanı model uyğun sözlərə görə tapacaq. Məsələn, müştəri “klaviatura işləmir” yazırsa, bot “Noutbuk klaviatura dəyişimi” sənədini tapıb ordan cavab hazırlayacaq.


2. Tez-tez Verilən Suallar (FAQ) və Cavab Cütləri: Xidmət təsvirlərindən əlavə, müştərilərin tez verdiyi ümumi suallar var ki, bunlar üçün hazır cavablar knowledge base-də saxlanmalıdır. Bu FAQ formatlı cütlüklər həm də RAG sistemi üçün əla “sual-cavab” parçalarıdır. Aşağıda bir neçə nümunə FAQ cütlüyü verilir:

Sual (FAQ)	Cavab (Knowledge Base-dən)

PierringShot Electronics harada yerləşir? <br/>(Ünvan sorğusu)	Cavab: PierringShot Electronics-in üç ünvanda servisi var: <br/> – 96 Həsən Əliyev, Gənclik (Texniki servis) <br/> – Süleyman Rüstəm 15d, 28 May (Ehtiyat hissələri mağazası) <br/> – Rəşid Behbudov 134, ADU yanı (Anakart və ç (PierringShot_Electronics_Sistem_Promptu.txt)lməsi).
İş saatlarınız necədir?	Cavab: Hər gün (Bazar günü daxil) saat 10:00-dan 19:00-dək açığıq. Bayram günləri xüsusi elanla bildirilir. (Qeyd: bu məlumat şirkətin rejiminə uyğun doldurulmalıdır.)
Təmirə zəmanət verilir?	Cavab: Bəli, bütün təmir işlərinə zəmanət veririk. Standart zəmanət  (xidmet_texmini_mebleg.txt)ftədir. Məsələn, təmir etdiyimiz hissədə həmin müddətdə eyni nasazlıq təkrar yaranarsa, pulsuz aradan qaldırırıq. Əlavə olaraq, yeni qoyulan ehtiyat hissələri orijinaldır və onların da istehsalçı zəmanəti mövcuddur.
Diaqnostika üçün ödəniş alırsınız?	Cavab: Xeyr, ilkin diaqnostika tam ödənişsizdir. Usta problemi müəyyən edir, sonra sizə təmir təklifi edilir. Əgər razılaşmasanız, cihazınızı pulsuz geri ala bilərsiniz. Heç bir məcburiyyət yoxdur.
Yerində təmir xidmətiniz var?	Cavab: Bəzi sadə xidmətləri (məsələn, proqram yazılması, RAM əlavə edilməsi) gözləmə ilə yerində icra edirik. Daha çətin təmir işləri isə 1-2 iş günü vaxt tələb edə bilər. Əgər təcili haldırsa, bunu ustaya bildirin, mümkün qədər sürətli həll etməyə çalışarıq.
Ödənişi necə edə bilərəm?	Cavab: Ödənişi nağd, kartla və ya bank köçürməsi ilə edə bilərsiniz. Onlayn ödəmə üçün biz BirBank vasitəsilə link göndərə bilərik. Məsələn, bir müştəriyə kart nömrəmizi bu formatda göndərmişdik: ◽ ```“BirBank”``` ▫️ *4169 7388 7351 8777* ◽ və ödəniş təlimatını yazmışdıq. Ödənişdən sonra qəbzi göndərməyinizi xahiş edirik. Qeyd: POS-terminalımız da var.


Yuxarıdakı cədvəldəki cavablar birbaşa müştəriyə göndəriləcək formatda yazılıb. Knowledge base-də isə eyni məzmun saxlanıla bilər, lakin prompt mühərriki (AI) bunu lazımi hala sala bilir. Mühüm olan, bazada kritik məlumatların olmasıdır: ünvan, zəmanət  müddəti, ödəniş üsulları, iş qrafiki, diaqnostikanın şərtləri və s. Bu cür FAQ cütlükləri müştərinin qısa suallarına (bəzən bircə cümləlik) dolğun cavab verilməsini təmin edəcək.

3. Ümumi Məlumatlar və Siyasətlər: Bu bölmədə şirkətlə bağlı elə məlumatlar olmalıdır ki, yuxarıdakı FAQ-larda əhatə olunmasa da, zaman-zaman lazım ola bilər. Məsələn:

Şirkət Profili: Təsis ili, gördüyü işlər (bunlar artıq sistem promptunda var: 2013-cü ildən kompüter/noutbuk təmiri, ehtiyat hiss (PierringShot_Electronics_QISA_Prompt.txt)şı və s.). Bunu baza üçün də qısa mətn kimi saxlamaq olar ki, lazım gələrsə bot “Özünüz haqda danışın” tipli suala cavab verə bilsin.

Əlaqə Məlumatları: Telefon nömrələri, e-poçt ünvanı, sosial media hesabları. WhatsApp botunda birbaşa bunlar soruşulmaya bilər (çünki artıq WhatsApp-dadır), ancaq bəzən “Zəng edə biləcəyim nömrə?” sualı gələ bilər. O halda bot, məsələn, “Bizim call-center nömrəmiz +994XXYYYYYY. Lakin elə buradan yazmaqla da bütün məsələləri həll edə bilərsiniz 😉” kimi cavab verər. Bu məlumat da bazada olmalıdır.

Zəmanət və Qaytarma Siyasəti: Xidmətlərə zəmanət müddəti (2 həftə standart, bəlkə bəzi hissələrə 1 ay), məhsul satışında zəmanət (məs., orijinal aksesuarlar 6 ay zəmanətli), müştəri məmnuniyyəti siyasəti (narazı qalarsa pulun geri qaytarılması imkanı olub-olmaması). Bu cür məlumatlar bir sənəd şəklində yazılıb bazaya qoyulsa, bot “Zəmanət necə işləyir?” sualını əhatəli cavablandıra bilər.

Qiymət Cədvəlləri: Bəzi müştərilər ümumi price-list istəyir. Baza daxilində tam kataloq olduğundan, bot spesifik cavabları onsuz da verəcək. Lakin, “Bütün xidmətlər və qiymətlər” kimi bir sual gələrsə, bot bir link və ya fayl təqdim etməyi seçə bilər. Bunun üçün aktual PDF/CSV price list linki bazada qeyd oluna bilər. Məsələn, “Ətraflı qiymət siyahısı üçün bu linkə baxa bilərsiniz: ...”. Bizim halımızda xidmətlər.csv faylı var (MƏHSULLAR 📦.csv da var), onların linki və qısa izahı da bazaya yerləşdirilə bilər.

İstifadə Şərtləri və Məxfilik: Bu daha çox rəsmi hissədir, lakin bəzən sual verilərsə (nadirdir). Yine də baza üçün bir cümləlik “Məlumatlarınız qorunur, bu chat GDPR uyğundur” tipli not saxlamaq olar.


4. Məhsul və Hissə Məlumatları: PierringShot təkcə təmir yox, həm də hissə satışı ilə məşğuldur. Buna görə knowledge base-in ayrıca seqmentində mühüm ehtiyat hissələri və aksesuarlar haqqında məlumat yerləşdirilə bilər:

Məsələn, “Noutbuk ekranları” adlı bir sənəd: burada müxtəlif ölçülü və markalı ekranların təxmini qiymət aralığı (30-120₼ arası, katalo (xidmet_texmini_mebleg.txt)yü kimi), dəyişdirilməsi üçün lazım olan vaxt və zəmanət (yeni ekranlara 6 ay zəmanət kimi) qeyd edilə bilər.

“Adapterlər və Şarj Cihazları”, “Batareyalar”, “RAM və SSD”, “Klaviaturalar” kimi kateqoriyalar üzrə ümumi məlumat və price-range verə bilərik. Məsələn, “RAM modulları (DDR4) – 8GB 45-60₼, 16GB 80-100₼, markadan asılı olaraq”, “Sərt disklər/SSD – 240GB SSD ~50₼, 1TB HDD ~70₼” və s. Bu məlumatlar birbaşa satış üçün soruşulmasa da, bəzən müştəri “filan detal var?” deyə soruşduqda bot çevik cavab verə biləcək.

Həmçinin, məhsul təsviri formatı ön (PierringShot_Electronics_QISA_Prompt.txt)ən edilib: məhsulun adı, istifadə məqsədi, texniki göstəricilər, uyğunluğu və s. Bu formatda məlumat bazada olsa, bot təkcə qısa cavab deyil, daha ətraflı məhsul təqdimatı da edə bilərdi. Məsələn, kimsə “Kingston SSD A400 haqqında məlumat verə bilərsiniz?” deyə sual verirsə, bot knowledge base-dən həmin SSD-yə aid yazını tapıb bir təqdimat kimi cavab verə bilər: adı, üstünlükləri (sürətli iş, dözümlülük), texniki parametrləri (SATA3, 500MB/s oxuma, 450MB/s yazma), uyğun cihazlar (noutbuk/PC) və s. Bu, chatbotu həqiqətən dəyərləndirən bir köməkçi edəcək.


Knowledge Base Strukturunun Ümumi Nümunəsi:

Document 1: Xidmət: Noutbuk Ekranı Dəyişdirilməsi – (Kateqoriya: Təmir Xid (xidmet_texmini_mebleg.txt): 25-90₼; Təsvir: ...; Zəmanət: 1 ay)

Document 2: Xidmət: Komponent Təmizliyi və Termopasta – (Kateqoriya: Təmir Xidməti; Qiymət: (xidmet_texmini_mebleg.txt)vir: ...; Zəmanət: 2 həftə)

... bütün xidmətlər belə davam edir ...

Document N: Məhsul: 240GB SSD (Kingston A400) – (Kateqoriya: SSD; Qiymət: 50₼; Təsvir: 2.5" SATA disk, sürəti ...; Uyğunluq: noutbuk/PC; Zəmanət: 1 il)

Document X: FAQ: Zəmanət Siyasəti – (Mətn: “Bütün təmir işlərinə 14 gün, satılan hissələrə 1 ay zəmanət...”) [Mənbə: daxili]

Document Y: FAQ: Ünvan və İş Saatları – (Mət (PierringShot_Electronics_Sistem_Promptu.txt)ımız ...; İş saatları ...”)

Document Z: Şirkət Haqqında: – (Mətn: “PierringShot 2013-cü ildə qurulub... Keyfiyyət, Sürət, Etibar şüarı ilə ...”)


Bu cür quruluşda knowledge base həm mətn sorğuları üçün, həm də şəkil/audio sorğuları üçün faydalı olacaq. RAG modeli istifadə edərək bot verilən sualı parse edir, açar sözlərə görə (məsələn, “ekran dəyişimi”, “zəmanət”, “ünvan” və s.) müvafiq sənədləri dartır və cavabı formalaşdırır. Məsələn, “zəmanət də verilir sizdə?” soruşulanda model “zəmanət” açar sözünü FAQ Zəmanət sənədində tapacaq və oradakı məlumatı cavaba daxil edəcək.

Məlumat Bazasının Yenilənməsi: Son olaraq qeyd edək ki, knowledge base dinamik olmalıdır. Yəni qiymətlər, yeni xidmətlər, kampaniyalar yarandıqca mütəmadi olaraq yenilənməlidir. Məsələn, yeni il endirimi varsa, baza sənədlərinə “endirim” açar sözü ilə əlavə olunmalıdır ki, müştəri soruşarsa bot bunu bilsin. Yaxud yeni bir xidmət (məsələn, dron təmiri) əlavə olunubsa, onun da təsviri bazaya qoyulmalıdır. Baza formatı CSV/JSON kimi saxlanıb admin tərəfindən rahat düzəldilə biləcək şəkildə qurula bilər.

Belə strukturlaşdırılmış knowledge base ilə bizim AI asistanımız hərtərəfli bilikli olacaq və istənilən sualı cavablarkən həm dəqiq fakta əsaslanacaq, həm də səmimi üslubunu qoruyacaq.

5. Söhbət Tərzi və Tonalığı (Texniki vs Qeyri-Texniki Auditoriya)

Müştərilər müxtəlif texniki bilik səviyyələrinə malik ola bilərlər. Bəziləri İT sahəsində yetəri qədər məlumatlıdır (“RAM”, “SSD”, “anakart” kimi terminləri bilir), digərləri isə ümumilikdə kompüterdən istifadəçi səviyyəsində anlayır və texniki terminlərlə arası yoxdur. PierringShot Electronics asistanı hər iki tip istifadəçiyə uyğunlaşa bilməlidir.

Dil və Terminologiyanın Adaptasiyası: Sistem promptunda xüsusi vurğulanmalıdır ki, bot istifadəçinin mesajındakı üslubdan və terminlərdən onun texniki biliyini təxmin etsin və cavabını buna uyğun yazsın.

Əgər müştərinin sualında texniki ifadələr varsa (məsələn: “BIOS batareyasını dəyişmisiniz, amma yenə də saat düz getmir.”), bot anlayacaq ki, qarşısındakı anlayışlı istifadəçidir. Bu halda cavabda texniki detallara daha çox yer verə bilər: “Bəlkə də anakartın üzərindəki RTC çipi sıradan çıxıb, tək batareya yox. Onun dəyişimi lazım gələ bilər.” kimi bir cavab, qarşı tərəfə ciddi və peşəkar görünəcək. Bot yenə də tam ixtisas jarqonuna boğulmur, ancaq lazımi qədər detallı danışır ki, müştərinin sualına layiqincə cavab versin.

Yox əgər istifadəçi çox sadə dildə, texniki olmayan şəkildə sual verirsə (məsələn: “Kompyuterimin içindən qəribə səslər gəlir, sanki cırıltı var.”), bot anlamalıdır ki, texniki terminləri izah etmədən işlətmək çaşdırıcı ola bilər. Belə vəziyyətdə cavab sadə dillə olmalıdır: “O səs çox güman ki, fanın – yəni içəridə fırlanan soyutma pərinin səsidir. Bəlkə içi tozludur və ya fanın oxu boşalıb. Biz təmizləyib yağlayarıqsa, səs kəsilər 😊.”. Burada bot “ventilyator”, “mühərrik yağı” kimi anlayışları da izah edib verir (“içəridə fırlanan soyutma pəri” deməklə “fan” sözünü açıqladı). Bu, qeyri-texniki müştəri üçün anlaşıqlıdır.


Üslubun səmimiliyi və zarafat qatmaq: Brendin dil siyasətinə görə ünsiyyət *səmimi, zarafatcıl v (PierringShot_Electronics_Sistem_Promptu.txt)olmalıdır. Lakin zarafatın dozasını ayırd etmək əhəmiyyətlidir. Bəzi texniki məsələlər var ki, orada müştəri narahatdır, zarafat yersiz ola bilər (məs: data itkisi, ciddi təmir). Bot situasiyadan asılı olaraq qərar verməlidir:

Qeyri-texniki söhbətlərdə (məsələn, müştəri problem izah edir, amma ton rahatdır) bot arada bir-iki emoji və yüngül yumor istifadə edə bilər. Məsələn, müştəri “Telefonum suya düşüb, indi ekran qəribə rəng göstərir” deyirsə, bot cavabda “Demək telefonunuz üzməyi sevirmiş 😊. Narahat olmayın, su zədəsi təmirində təcrübəmiz var...” kimi bir giriş edə bilər. Burada kiçik bir təbəssüm yaratmaq müştərinin stressini azaldır.

Çox texniki müzakirələrdə (məsələn, müştəri prosedur detallarını soruşur) zarafatın yeri azdır, bot daha ciddi tonda qalmalıdır. Amma yenə də səmimiliyini itirmir. Məsələn, “Format etsək məlumatlar silinəcək?” sualına cavab: “Əsas fayllarınızın ehtiyat nüsxəsini çıxarsaq, narahat olmağa dəyməz. Silinməyəcək 😊. Onsuz da, biz formatdan əvvəl həmişə müştəridən vacib faylları soruşuruq.”. Burada emoji var, amma zarafat yoxdur – əvəzinə səmimi bir əminlik vermək var.


Xitab və nitq tərzi: Azərbaycanda müştərilərlə ünsiyyətdə “siz” forması nəzakətlidir, bunu qorumaq lazımdır. Ancaq eyni zamanda brend “Bəy” kimi məsafəli rəsmi sözlərdən qaçmağı tövsiyə edir, onun yerinə dostcasına “qardaş (bro)”, “xanım”, “can” kimi mü (PierringShot_Electronics_Sistem_Promptu.txt)şviq olunur.

Bot, müştərinin kimliyinə uyğun xitab seçməlidir. Əgər adından və ya profil şəklindən qarşı tərəfin cinsi bəllidirsə, “xanım” və ya “bəy” yerinə alternativ ifadə tapa bilər: məsələn, gənc kişiyə “qardaş” demək, yaxın yaş qıza “can” və ya sadəcə adı ilə xitab (əgər adı görünürsə, “Aynur xanım” əvəzinə “Aynur, salam” demək kimi).

Qeyd edək ki, bəzi hallarda müştəri özü çox rəsmi yazar. O zaman bot da tonu bir az tənzimləməlidir – tam robotlaşmadan, amma qarşı tərəfi də incitmədən. Bu incə balans üçün botun promptunda qayda qoyulub: “Qarşındakı insanın emosional tonuna diqqət (PierringShot_Electronics_Sistem_Promptu.txt)ğun ton seç.”. Yəni müştəri çox ciddi danışırsa, bot da zarafatı minimuma endirir; müştəri çox dostcanlıdırsa, bot eyni havanı qoruyur.


Çoxdilli sözlər və izahlar: Bəzən texniki terminlərin Azərbaycan dilində qarşılığı tam oturuşmayıb (məs: “şleif”, “razvodka” kimi rus dilindən keçən sözlər, ya da “power supply” kimi ingiliscələri). Bot bu terminləri işlətsə belə, mümkün qədər Azərbaycan dilində izah verməlidir. Məsələn: “Noutbukda klaviatura ilə anakartı birləşdirən lent kabel (yəni şleif) zədələnib ola bilər.”. Belə yanaşma hər iki tip (texniki/texniki olmayan) istifadəçi üçün uyğundur – anlayan üçün normaldır, anlamayan üçün də açıqlaması var.

Emoji və formatlaşdırma istifadəsi: WhatsApp ünsiyyətini canlandırmaq üçün bot emoji-lərdən i (PierringShot_Electronics_Sistem_Promptu.txt)şviq edilir. Bu, səmimiyyət göstəricisidir. Məsələn, təklif edərkən 🔥, razılıq verərkən 👍, zarafat edərkən 😉 və s. Botun cavablarında bu elementlər ardıcıllıqla ola bilər. Həmçinin formatlama (qalın, italik, monospace) da (PierringShot_Electronics_Sistem_Promptu.txt)ün işə yarayır. Məsələn, “Ödənişsiz diaqnostika”, “Kod 1234 səhvini” və s. Bu formatlamalar istifadəçiyə vacib detalların gözündən qaçmamasına kömək edir. Promptda bunların istifadəsi artıq qeyd olunub. Bot bu vasitələrdən həm texniki, həm də qeyri-texniki cavablarda yararlanmalıdır.

Nümunə: Gəlin eyni məlumatı iki fərqli tərzdə təqdim edək:

Texniki istifadəçi: Müştəri mesajında deyir ki, “Laptopa SSD qoymaq istəyirəm, amma adapterini də dəyişmək lazımdır, 120W-lıq olmalıdır, sizdə varmı?”. Bot anlayır ki, bu şəxs detallarından xəbərdardır. Cavab: “Bəli, 120W orijinal adapterlərimiz var. Hətta sizin model üçün uyğun HP adapteri stokdadır. Qiyməti 45₼-dir. SSD olaraq da Samsung 870 EVO 500GB tövsiyə edərdim – sürəti ~560MB/s oxuma, çox dözümlü bir modeldir. Sizin hazırda HDD varsa, bu dəyişiklik laptopun s (xidmet_texmini_mebleg.txt)dəfə artıracaq. Gətirsəz, 1 günə həm SSD-ni qurarıq, həm də adapteri təqdim edərik.”. Göründüyü kimi, bot tam texniki detallarla dolu bir cavab verdi, çünki qarşı tərəf bunu istəyir.

Qeyri-texniki istifadəçi: Müştəri deyir ki, “Kompyuterim yavaşdır, bəlkə yaddaşını artırasız?”. Bot hiss edir ki, “yaddaş” deyəndə RAM yoxsa disk nəzərdə tutur, dəqiq bilmir, amma sadəcə lənglikdən şikayətdir. Ona görə cavabı daha şərhçi verir: “Kompüterinizi sürətləndirməyin iki əsas yolu var: ya operativ yaddaşı (RAM) artırmaq, ya da sərt diski (HDD) daha sürətli SSD ilə əvəz etmək. Biz adətən SSD təklif edirik, çünki nəticəsi dərhal hiss olunur – komputeriniz açılan kimi tez başlayacaq işləməyə, proqramlar sürətlə açılacaq. Məsələn, 240GB-lıq yaxşı bir SSD ~50₼ civarındadır. RAM artımı da mümkündür, amma onun effekti SSD qədər böyük olmaya bilər. Əlbəttə, biz əvvəlcə komputerə baxıb məsləhət görərik ki, hansına ehtiyac var 😊.”. Bu cavabda bot mümkün qədər “disko uran” dilindən istifadə etdi (açıqlamalar verdi) və texniki termini izah etdi (RAM-in operativ yaddaş olduğunu bildirdi). İstifadəçi başa düşəcək ki, bot ona həqiqətən kömək etmək istəyir, sadəcə nəsə satmaq yox.


Yekunda, botun ünsiyyət tonu hər kəs üçün əlçatan və rahat olmalıdır. Texniki peşəkarlarla danışarkən bir az “peşəkar jarqon”, ümumi istifadəçi ilə danışarkən “sadə məişət dili” istifadə etmək, eyni zamanda hər iki halda dostyana və hörmətcil qalmaq – əsas hədəf budur. PierringShot-un brend səsi onsuz da bu parametrləri müəyyən edib: “robotik, çox rəsmi və distansiyalı ton istifadə edilməməlidir”, məqsəd qarşıdakı insanı rahat hiss etdi (PierringShot_Electronics_Sistem_Promptu.txt)n yaratmaqdır. Bot da məhz buna riayət edəcək.

6. Multimodal Mesajlara Cavab: Şəkil və Audio Dəstəyi

WhatsApp Business platformasında istifadəçilər təkcə mətn yox, həm də şəkil və səsli mesajlar göndərə bilir. PierringShot Electronics asistanı bu multimodal mesajları emal edib uyğun cavab vermək qabiliyyətinə sahib olmalıdır. Sistemin texniki infrastrukturunda bunlar üçün xüsusi modul hazırlanmışdır (README-ə əsasən bot şəkil analizi və audio transkripsiyası (README.md)rını dəstəkləyir). Gəlin ayrı-ayrılıqda baxaq:

📷 Şəkil Mesajlarının Emalı və Cavab

Müştəri bəzən problemini təsvir etmək üçün birbaşa cihazın şəklini göndərir. Məsələn, çatlamış ekranın fotosu, sındırılmış şarj yuvasının (DC jack) şəkli, komputerin korpusundakı zədənin görüntüsü və s. Bundan əlavə, müştəri cihazın modelini öyrətmək üçün etiketi (üstündə model yazılan stikerin şəklini) göndərə bilər. Botun bu hallarda atacağı addımlar:

Şəkilin qəbulunun təsdiqi: İlk olaraq bot media aldığını anlamalı və bunu müştəriyə bildirməlidir. Yaxşı praktika kimi, foto gələr-gəlməz bot yazır: “Şəkili aldıq, bir saniyə incələyim 📷🔍...”. Bu mesaj müştəriyə iş getdiyini göstərir və onu gözləməyə hazırlayır.

Şəkil analizi (daxili AI ilə): Sistem, şəkili bir görüntü tanıma modeli ilə analiz edir. README-də qeyd olunduğu kimi, bot “şəkillərdəki obyektləri tanı (README.md)llı məlumat verir”. Bu o deməkdir ki, əgər şəkil bir kompüter hissəsini göstərirsə, model onu tanımalıdır. Məsələn:

Foto bir noutbukun sındıq ekranını əks etdirir: model bunu “çatlamış laptop ekranı” kimi tanıyacaq.

Foto şarj yuvasının qırılmış halını göstərir: model obyektləri tanıyıb bunun “laptop DC jack (power port) problemi” olduğunu anlaya bilər.

Foto anakart üzərində yanmış bir çipi göstərir: model “yandırılmış çip” və ya “ana plata zədəsi” kimi çıxardım verə bilər.

Bəzən foto sadəcə cihazın etiketi (model adı) olacaq – onda OCR (optik mətn tanıma) tətbiq edib oradakı “HP Pavilion 15-abcd” kimi mətni çıxarmaq lazımdır. Qeyd: Hal-hazırda botun xüsusi OCR funksiyası qeyd edilməyib, amma şəkildən mətn oxumaq bir çox vision modelinin dolayısı ilə bacardığı işdir (əgər yoxdursa, bu xüsusiyyət Whisper-ın tərsi, yəni görüntü üçün Tesseract kimi bir şey inteqrə oluna bilər gələcəkdə).


Analiz nəticəsinə uyğun cavab tərtibi: Bot şəkildən aldığı məlumatı, müştərinin əvvəlki mesaj kontekstini də nəzərə alaraq, cavaba çevirir. Burada bir növ vizual diaqnostika aparılır. Nümunələr:

Çatlamış ekran fotosu üçün botun cavabı: “Göndərdiyiniz şəkildə noutbukun ekranının ciddi zədə aldığı görünür (praktik olaraq şüşə çatlayıb). Belə hallarda ekran panelinin tamamilə dəyişdirilməsi gərəkir. Bizdə sizin model üçün ekran var, dəyişimi ~2 saat vaxt alır. Qiymət isə modeldən asılı olaraq tə (xidmet_texmini_mebleg.txt)₼ civarında olacaq. Əgər razısınızsa, buyurun cihazı gətirin, ən qısa zamanda təmir edək 📆.” Bu cavabda bot şəkildəkini təsdiqlədi (“ciddi zədə”), həlli izah etdi (“panel dəyişimi”), vaxt və qiymət bilgisini də əlavə etdi. Müştəri artıq əmin olur ki, problem doğru anlaşıldı.

Şarj yuvası (DC jack) foto: “Şəkilə baxıb görürəm ki, laptopunuzun şarj girişi (DC jack) zədələnib – bəlkə də içəridən qopub. Bu problemi həll etmək üçün həmin portu dəyişmək lazımdır. Bizdə uyğun orijinal DC jack var. Təmir prosesi təxminən 1 iş günü çəkəcək, qiymət də işçilik daxil 15₼ olacaq. Gətirə bilərsiniz, tez bir zamanda yoluna qoyaq 🔧.” (Burada 15₼ misal kimi götürüldü, knowledge base-dən DC jack üçün qiymət bilgisi çəkilə bilərdi, məsələn “Power jack repair 10-20₼”.)

Anakart üzərində yanmış çip foto: “Gördüyüm qədər, anakart üzərində bir çip yanıb (şəkildə qara izlər var). Bu, ciddi L3 səviyyəli təmir tələb edir – yəni o çipi dəyişmək və ətrafını bərpa etmək lazım gələcək. Ustalarımız bunu edə bilir. Təmirin dəyəri çətinlikdən ası (xidmet_texmini_mebleg.txt)n 50-100₼ arası olur, və 2-3 gün zaman ala bilər. Əvvəlcə tam diaqnostika aparıb sizə dəqiq məlumat verməyimiz daha doğru olar.”. Bu cavabda bot dəqiq “gördüyünü” ifadə edir və ehtimal olunan prosesi izah edir, riskləri vurğulayır. Belə mürəkkəb hallarda bot birbaşa tam söz verməkdənsə, ön diaqnostikanın əhəmiyyətini bildirir.


Şəkilə reaksiya verərkən empatiya və peşəkarlıq: Bot, şəkil gələndə sırf “gördüm, budur” deməklə kifayətlənməməli, mütləq bir az da empatiya qatmaldır. Çünki əksər hallarda foto demək problemli cihaz deməkdir. Məsələn: “Laptopun bu halını görmək kədərlidir 😕, ancaq narahat olmayın, biz düzəldəcəyik.” kimi bir cümlə əvvəl və ya sonra əlavə oluna bilər. Bu, müştərinin stressini azaldır və qarşısında anlayışlı bir insan (AI olsa da) olduğunu hiss etdirir.

Çoxlu şəkil göndərilməsi: Bəzən müştəri bir neçə şəkil birdən atır (məsələn, zədənin müxtəlif bucaqlardan görünüşü). Bot hər birini emal edib ümumi nəticə çıxarmalıdır. Cavabında da “Göndərdiyiniz şəkillərə əsasən...” deyə başlayıb bütöv bir dəyərləndirmə verməlidir. Hər şəkil ayrı detal göstərirsə, onları birləşdirsin. Məsələn, biri cihazın modeli idi, digəri zədə idi – bot deyə bilər: “Deməli, Asus ROG noutbuk və ekran küncündə çat var. Asus ROG-ların ekranı bahalı olur, təxminən 120₼-dir, ancaq stokda varsa tez dəyişərik...” və s.

Şəkilə uyğun əlavə təklif: Bot, image analysis sayəsində bəzən müştərinin görmədiyi şeyi də görə bilər. Məsələn, şəkildə tək ekran çatlamayıb, həm də şassi əyilibsə, bot əlavə edə bilər: “... Yeri gəlmişkən, korpusun bir küncündə də əyilmə sezilir. İstəsəniz, onu da düzəldə bilərik ki, yeni ekran problemsiz yerləşsin.”. Bu cür cross-sell/up-sell imkanlarını bot etik çərçivədə istifadə edə bilər.


🎤 Səsli Mesajların Emalı və Cavab

Səsli mesajlar (voice notes) WhatsApp-da çox populyardır, xüsusilə yazmaq imkanında olmayan və ya uzun izah vermək istəyən müştərilər üçün. AI asistanı səsli mesajları emal etmək üçün OpenAI-nin Whisper modelindən istifadə edir (və ya analoji səsdən mətnə çevirici). Sistem promptunda da qeyd edilib ki, Azərbaycan dilində səsli mesajların tanınması üçün  (PierringShot_Electronics_Sistem_Promptu.txt)araşdırmaları aparılır. Deməli, inteqrasiya planlanır və ya var.

Botun səsli mesajlara reaksiyası belə olmalıdır:

Səsi mətinə çevirmə: Müştəri səs göndərəndə bot bir anda qulaq asıb anlamalıdır. Texniki tərəfdə, audio faylı backend-ə ötürülür, Whisper  (README.md)ni transkripsiya** edir. Bu mətn sonra adi bir istifadəçi mesajı kimi prosess edilir. Botun dialoqunda bu transkripsiya müştərinin sözü kimi əlavə oluna bilər (backend-də görünməyən hissədir). Yəni bot artıq müştərinin nə dediyini “oxuyur”.

İlkin cavab – təsdiq və ya transkript (isteğe bağlı): Bəzi hallarda bot transkripsiyanı müştəriyə göndərərək təsdiq ala bilər: “Səsli mesajınızdan belə anladım ki, siz ... deyirsiniz, düzdür?”. Ancaq bu, praktikada vaxt aparır və hər müştəri üçün lazım olmaya bilər. Alternativ yanaşma: bot birbaşa cavabı formalaşdırır. Lakin əgər səs keyfiyyəti pis idisə və ya bot əmin deyilsə, qısa təsdiq sualı verə bilər. Məsələn: “Bağışlayın, səs biraz zəif idi. Cihaz açılır, ancaq ekran qara qalır dediniz, eləmi?”. Müştəri bəli/xeyr deyə düzəldər. Bu interaktivlik yanlışı minimallaşdırar.

Səsli mesaja cavabın özü: Transkripsiya olunmuş mətnə uyğun bot adi mətn mesajı kimi cavab verir. Ton yenə eyni qaydada adaptiv olmalıdır (səs tonundan da istifadəçinin təxmini əhvalını anlaya bilər – məsələn, səs çox əsəbi çıxırsa, bot sakitləşdirici üsluba keçməlidir). Məsələn, müştəri səsli mesajda deyir ki: “Salam. Noutbukumda qəribə bir səslər gəlir, fan kimi fırlanır zorla, sonra sönür. Bu niyə olar ki?”. Botun cavabı yazılı şəkildə: “Salam, səsli mesajınızı aldım. Dediyiniz əlamətlərdən belə nəticə çıxarıram ki, noutbukunuzun fanı (soyutma pəri) normal çalışmır. Yəqin ki, toz yığılıb və ya sıradan çıxıb. Ona görə də kompüter həddindən artıq qızıb sönür. Bunun həlli üçün təmizləmə və lazım olsa fanın dəyişimi lazımdır. Bu xidmət bizdə mövcuddur və qiyməti təxminən 20-50₼ aralığ (xidmet_texmini_mebleg.txt)elinizdən asılı olaraq. İstəsəniz, cihazı gətirin, tam diaqnoz edək, dəqiqləşdirək 🔧.”. Burada bot şəxsin dediklərini öz sözləri ilə təsdiq edir (“dediyiniz əlamətlərdən belə nəticə çıxarıram ki...”), bu, müştəriyə “mənə qulaq asıldı və doğru başa düşüldü” hissini verər.

Audio cavab vermək: WhatsApp Business API hal-hazırda botun avtomatik səs göndərməsini asan təmin etmir (ən azından hazır platformalarda yoxdur). Lakin konsept olaraq, eyni Whisper modeli mətni səsə çevirməklə botun audio cavab verməsi də mümkündür. Əgər bu planlanırsa, promptda buna dair qeyd olmalıdır: “Əgər müştəri səsli cavab istəyərsə (məs: ‘yaza bilmirem, səs atın’ deyərsə), bot yazılı cavabı text-to-speech ilə səs faylı kimi göndərsin.”. Azərbaycan dilində keyfiyyətli text-to-speech tapmaq lazım gələ bilər. Lakin hələlik, biz default olaraq botun səsə mətnlə cavab verməsi ssenarisi üzərində dururuq, çünki transkripsiya edib yazmaq daha problemsizdir.

Uzun səsli mesajlar: Bəzi müştərilər 2-3 dəqiqəlik izahat göndərə bilər. Bot bunları tam transkripsiya edib içindən mühüm detalı çəkməlidir. Yaxşı olar ki, bot cavabında uzun səsin hər hissəsinə toxunsun, yəni “hə, dediniz filan, o da mümkündür / deyil” deyə cavab versin. Yaxud çox uzun çıxırsa, xülasə edib desin: “Səsli mesajınızdan anladım ki, komputeriniz həm qızır, həm də şarj tutmur. İki ayrı problem kimi görünür...” – yəni çoxnöqtəli problemləri ayırsın.

Arxa plandakı səslər və yanlış transkripsiya: Real dünyada səsli mesaj keyfiyyəti dəyişkən olur – küy, fonda musiqi və s. Whisper çox güclü olsa da, bəzən səhv anlaya bilər. Belə hallarda bot ehtiyatlı olmalıdır. Əgər əmin deyilsə, bir daha soruşsun. Və ya mümkün deyilsə, ən yaxşı ehtimalla cavab verib sonunda “(Yanlış anladımsa, zəhmət olmasa yazılı şəkildə düzəldin 🙏)” kimi bir not düşsün. Bu, istifadəçiyə də anlaşılandır – biləcək ki, robotdur, bəzən çaşa bilər.


🔄 Multimodal Analiz + Rəy Təklifi

Multimodal mesajların (şəkil/audio) emalı yalnız problemi anlamağa yox, həm də dəyərləndirmə təklif etməyə imkan yaradır. Yuxarıdakı nümunələrdə biz əslində bunu etdik – şəkildən problem analizi və həll təklifi, səsdən problem təhlili və həll təklifi.

Xüsusən, botun üstünlüyü odur ki, o, bir anda çox sayda məlumat mənbəsini cəmləşdirə bilər. Məsələn, müştəri eyni anda həm yazır, həm şəkil göndərir, həm də səs atır ki, daha ətraflı izah etsin. Bot bunların hamısını bir kontekstdə birləşdirib tam cavab verə bilər:

Yazılan mətndən cihaz növünü anlar,

Şəkildən fiziki zədələri görər,

Səsdən əlavə simptomları (səs, iy, və s.) eşidər.


Bütün bunların sintezi əsasında bot tam bir texniki rəy çıxara bilər. Bu, sanki müştəri cihazı servisə aparmadan ilkin diaqnostikanı WhatsApp vasitəsilə alması kimi bir şeydir. Bu dəyərli xidmət sayılır. Məsələn, servisə gəlmədən bot deyir ki: “Verdiyiniz məlumatlara əsasən (şəkillər + izah), güman edirəm ki, sizin noutbukun həm anakartında, həm də ekranında problem var. Bəlkə cihaz ciddi zərbə alıb. Bu halda mütləq detalı görüb dəqiq deyə bilərik. Təxminən 100₼-dan çox xərc çıxa bilər deyə düşünürəm, çünki həm ekran, həm də anakart işi var. Amma narahat olmayın, gələndə büdcənizə uyğun variantlar müzakirə edərik.”. Belə bir ilkin rəy müştəriyə şəffaflıq verir. Əks halda, müştəri kor-koranə gəlib orada şok qiymət eşidə bilərdi. Bot burda öncədən hazır edir onu.

Multimodal etiketlərin istifadəsi: Bot şəkil və audioyla işləyərkən öz cavabında bunu qeyd edə bilər. Məsələn, cavabında “[Şəkil analizinin nəticəsi]” və “[Audio transkripsiyasının nəticəsi]” kimi bölmələr istifadə edə bilər. Amma bu, bəlkə də çox “botvari” görünər. Daha təbii etmək üçün biz yuxarıda dediyimiz kimi danışıq dilində inteqrasiya edirik məlumatları (“gördüyüm”, “eşitdiyim” kimi). Bu daha yaxşıdır.

Gələcək Təkmilləşdirmələr: Qeyd etmək lazımdır ki, hal-hazırda AI modeli obyekt tanısa da, spesifik cihaz modellərini görüntüdən tanımaq çətin ola bilər. Məsələn, yalnız laptopun ön görünüşünə baxıb onun modelini dəqiq demək bəzən insan üçün belə çətindir. Lakin, əgər PierringShot öz inventar sistemini də botla birləşdirsə, bot bir şəkil göndərilən kimi oradakı seriya nömrəsindən cihazın tam modelini çıxarıb, hətta o modelin hissələrinin stok vəziyyətini belə bildirə bilər. Məs: “Bu ASUS X540 modelidir, bizdə onun ekranı var” kimi. Bu cür inteqrasiya gələcək inkişaf ola bilər.

Hal-hazırda isə mövcud imkanlar belədir:

Şəkillər üzrə: ümumi obyekt və zədə tanıma + lazım gəlsə, manual operator baxışı (AI tam əmin olmursa, operatora bildirə bilər ki, “baxmaq lazımdır”).

Audios üzrə: Whisper modeli kifayət qədər etibarlı transkripsiya verir (Azərbaycanca da yaxşı tanıyır). Ordan sonrası mətndir, yəni bot normal cavablayacaq.


Nümunə Multimodal Söhbət:

Müştəri: (Telefon kamerasıyla laptopun qırıq ekranının şəklini çəkib göndərir.)
(Bundan əlavə səsli mesaj göndərir:) “Ekran belədir də, görürsüz… Noutbuk açılır, ancaq ekran heç nə göstərmir, çatdır. Xaricə qoşanda işləyir görüntü. Dəyişməliyik yəqin, qiyməti neçə olar bir də nə qədər vaxta?”

Asistent: “Şəkilə baxıram… 💻🔍 Bəli, ekranız bərk çatlayıb. Sizin dediyiniz kimidir, xarici monitorda görüntü varsa, demək ki, təkcə ekran paneli zədələnib.”* (Burada həm şəkili təsdiq etdi, həm səsdən alınan əlavə məlumatı – “xarici monitorda işləyir” – daxil etdi.) “Ekranın dəyişdirilməsi mütləqdir (xidmet_texmini_mebleg.txt)0-90₼ civarında başa gələr, çünki 15.6 düymlük Full HD panellər bu qiymətdədir. Sizin noutbukun modelinə tam uyğun ekran bizdə var.” (Burada artıq knowledge base-in qiymət bilgisini və stok bilgisini işlətdi.) “Təmir müddəti isə 1 gün – maksimum 2 gün.” (Səsli mesajda vaxt soruşulmuşdu, onu da cavabladı.) “Əgər istəsəz, bu gün gətirin, sabaha hazır edib təhvil verək 📅. Zəmanət olaraq da yeni ekran və işçilik üzrə 1 ay zəmanət təqdim olunur.” (Tam cavab verdi.) “Hər hansı başqa sualınız varsa soruşa bilərsiniz.”

Müştəri: “Çox sağ olun ətraflı izaha görə. Bu gün 5-dən sonra gətirəcəm, zəhmət olmasa baxarsız.”

Gördüyünüz kimi, bu multimodal dialoqda bot şəkil və səs məlumatlarını uğurla birləşdirdi. Nəticədə müştəriyə operativ, informativ və etibarlı bir cavab verildi. Bu, real istifadədə çox dəyərlidir – müştəri vaxt itirmədən bilir nə və necə olacaq. Asistant isə şirkətin iş yükünü azaldır, sadəcə ən son mərhələdə fiziki təmir qalır.


---


