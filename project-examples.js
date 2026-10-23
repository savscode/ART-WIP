// ============================================================================
// Projektexempel för "Se projektexempel"-rutan på varje parameter (A–O).
//
// Texterna nedan är hämtade från "källfiler/Texter Best Practice.docx"
// (ligger utanför sajtmappen så att den inte publiceras)
// (importerat 2026-10-15). OBS: sidan läser INTE Word-filen live - om du
// ändrar i .docx-filen måste du be Claude läsa in den på nytt så den här
// filen uppdateras igen.
//
// SÅ HÄR LÄGGER DU IN EN BILD ELLER FILM:
// Lägg filen i mappen "projektexempel/" och döp den till:
//   <Namn>-<nummer>.<filändelse>
// t.ex. "Nyttjande-1.jpg", "Flexibilitet-2.mp4", "Resiliens-3.png"
// Numret (1, 2 eller 3) avgör vilket av de tre exemplen det blir.
// Filändelsen spelar ingen roll - systemet letar automatiskt efter
// .jpg/.jpeg/.png/.gif (bild) och .mp4/.mov (film) och visar det som finns.
// Saknas filen helt visas en grå platshållarbild istället.
//
// Namnen nedan (t.ex. categoryA -> "Nyttjande") måste matcha filnamnen exakt.
// ============================================================================

window.categoryFileNames = {
    categoryA: 'Nyttjande',
    categoryB: 'Välmående',
    categoryC: 'Inkludering',
    categoryD: 'Beteendeförändring',
    categoryE: 'Biodiversitet',
    categoryF: 'Klimatavtryck',
    categoryG: 'Mark',
    categoryH: 'Energi',
    categoryI: 'Pengar',
    categoryJ: 'Resursutnyttjande',
    categoryK: 'Resiliens',
    categoryL: 'Skönhet',
    categoryM: 'Flexibilitet',
    categoryN: 'Ägandeskap',
    categoryO: 'Demonterbarhet'
};

// Rubrik, projekt och kort brödtext per exempel. Bilden/filmen kopplas
// automatiskt utifrån kategorinamnet + numret ovan.
window.projectExamples = {
    categoryA: [ // NYTTJANDE
        {
            title: 'Bo stort på liten yta',
            project: 'Helsingkrona studentboende ”Villan”, Lund',
            text: 'Studentboendet Villan är ett kollektivboende med 9 rum i storlägenheter. Bostäderna är utformade för en hållbar livsstil där gemensamma ytor maximerar varje m2. Man delar på kök, matrum, vardagsrum, balkong och takterrass vilket möjliggör att bo stort på liten yta.'
        },
        {
            title: 'Inga tomma rum',
            project: 'Strategisk lokalplanering, t.ex. skolor Ljungby kommun, Kävlinge kommun m.fl',
            text: 'Strategisk lokalplanering är en process som innebär kartläggning, analys av lokalers nyttjande och långsiktigt behov för att optimera så ytorna används effektivt och flexibelt över tid. Det är ett verktyg för ekonomisk hållbarhet och minskad miljöpåverkan.'
        },
        {
            title: 'Från skoldag till kvällsscen',
            project: 'Skola Kv Mimer, Stockholm',
            text: 'En ny entrépaviljong skapar flexibilitet i nyttjandet av befintliga hus som gör att de olika gymnasieprogrammens storlek kan varieras över tid, och anpassas utifrån samhällets behov. Skolans aula kan avgränsas vilket möjliggör användning för andra ändamål utanför skoltid.'
        }
    ],
    categoryB: [ // VÄLMÅENDE
        {
            title: 'Ett grönt välkomnande',
            project: 'Kontorshus Dungen, Malmö',
            text: 'I Dungen är det första man möter tre stora träd. Sen rör man sig upp mot atriet, husets hjärta, och trädkronornas lövverk. Byggnaden kännetecknas av varma träinslag och mycket grönska som skapar en lugn, välkomnande miljö som stärker trivsel och fokus.'
        },
        {
            title: 'Rörelse i vardagen',
            project: 'Stadsdelen Jägersro, Malmö',
            text: 'Jägersro ska bli Öresunds mest hållbara stadsdel som främjar hälsa och välmående. Alla vardagens funktioner kommer att finnas inom gångavstånd. Strukturen är uppbyggd för att prioritera cyklister och fotgängare och uppmuntra till hållbar mobilitet.'
        },
        {
            title: 'Att äta med alla sinnen',
            project: 'Restaurang Vyn, Simrishamn',
            text: 'Restaurang Vyn har en lokalt förankrad arkitektur med fokus på naturmaterial som skapar en lugn, harmonisk miljö som sätter måltiden i fokus. Rum, inredning, design, landskap och matkultur kopplas samman till en helhetsupplevelse.'
        }
    ],
    categoryC: [ // INKLUDERING
        {
            title: 'Ett oseriöst utegym',
            project: 'Equalizer, verktyg för att störa platsbundna normer.',
            text: 'Equalizer är resultatet av ett forskningsprojekt med syfte att skapa jämställda och inkluderande miljöer för fysisk aktivitet genom att undersöka och utmana normer. Genom samarbete mellan arkitekter, forskare, kommuner och ungdomar har projektet utvecklat metoder och verktyg för att underlätta för fler att ta plats och aktivera det offentliga rummet.'
        },
        {
            title: 'En idrottshall där tjejerna får dominera',
            project: 'Riksby idrottshall, Bromma',
            text: 'Riksby idrottshall blir en plats för idrott och umgänge med huvudfokus på tjejdominerade sporter. En multihall som rymmer en isbana specialanpassad för konståkning, gymnastik, och truppgymnastik. Det finns ett socialt torg där idrotternas utövare kan vistas före och efter träning för exempelvis läxläsning och måltider.'
        },
        {
            title: 'Har Broängsskolan framtidens arkitekter?',
            project: 'Inkluderade brukarprocess skola, Ex Broängsskolan Botkyrka',
            text: 'Ett forskningsprojekt för att väcka intresse för arkitektur bland barn och unga samt ge inblick i vad det innebär att arbeta som arkitekt. Här utvecklar vi ett arbetssätt för att tillvarata elevernas perspektiv på hur platser uppfattas och används, genom text, ritningar och modell.'
        }
    ],
    categoryD: [ // BETEENDEFÖRÄNDRING
        {
            title: 'När resan blir målet',
            project: 'Keldur, Island',
            text: 'En stadsdel som helt utgår ifrån hållbar mobilitet: kring en central bussgata utvecklas ett tätt, blandat och grönt område i Reyjkavík där allt som behövs i vardagen är nära. När färdmedelsfördelningen ska gå från 70% resor med bil till en tredjedel står gång, cykel och public transport i fokus och utformas för att ge livskvalitet till människor.'
        },
        {
            title: 'Rulla hela vägen in',
            project: 'Kronprinsens cykelgarage, Malmö',
            text: 'På Kronprinsen får cykeln ta plats på riktigt. En unik cykelpassage leder hela vägen in i stadsdelscentrat och gör det enkelt att cykla direkt till handel och service. Ett vardagsnära grepp för hållbar mobilitet.'
        },
        {
            title: 'Alla under ett och samma tak',
            project: 'Kv Förrådet Nyköping',
            text: 'Tidigare var HSB Södermanlands verksamhet uppdelad i två byggnader, men nu samlas alla funktioner under ett och samma tak. Den ombonade och varierade inredningen, tillsammans med en layout som uppmuntrar till rörelse, samarbete och spontana möten, bidrar till starkare samspel mellan avdelningarna och en bättre kultur.'
        }
    ],
    categoryE: [ // BIODIVERSITET
        {
            title: 'En trädgårdsstad för salamandrar',
            project: 'Lalala projekt, stad', // OBS: ser ut som oifylld platshållartext i Word-filen - fyll i rätt projektnamn
            text: 'Här får människan njuta av en sammanhängande blågrön struktur – utformad efter salamandrarnas behov av att jaga, para sig och leka. Den skyddade arten får sätta spelreglerna och forma rekreationsmiljöer för både människobarn och grodyngel.'
        },
        {
            title: 'Verktyg för ökad grönska i städer',
            project: 'Treeable',
            text: 'FOJABs verktyg Treeable identifierar var nya träd kan ge störst nytta i befintlig stad. Genom att väga samman bland annat ledningar, markanvändning och skyddsavstånd kan krontäckningen öka effektivt, vilket bidrar till biologisk mångfald, svalare stadsmiljöer, renare luft och bättre dagvattenhantering.'
        },
        {
            title: 'Med fokus på växter och fåglar',
            project: 'P-huset Fullriggaren, Malmö',
            text: 'P-huset Fullriggaren visar hur urban biologisk mångfald kan integreras i arkitekturen. Klättrande bokharabinda och blåregn, självgående vild grönska i växtlådor och knallgula fågel- och fladdermusholkar skapar liv från mark till tak.'
        }
    ],
    categoryF: [ // KLIMATAVTRYCK
        {
            title: 'Mer återbruk, mindre avtryck',
            project: 'Kv Olivin, Stockholm',
            text: 'I kontorshuset Olivin minskas klimatpåverkan genom användning av klimatförbättrad betong, trä i delar av stommen samt återbruk av innerdörrar, fasadzink och särskilt genom återanvändning av håldäck som ger stor effekt.'
        },
        {
            title: 'Koll från första skiss',
            project: 'Leaf Cutter Ant – Urban Concept tillsammans med plant.',
            text: 'FOJAB har utvecklat egna verktyg för klimatberäkning. Med Leaf Cutter Ant och Urban Concept blir klimatpåverkan en aktiv del av gestaltningen från första skiss. Verktyget visar hur form, material och konstruktion påverkar klimatavtrycket och gör det enkelt att jämföra och optimera olika designalternativ.'
        },
        {
            title: 'Trä från stomme till fasad',
            project: 'Trummens strand, Växjö',
            text: 'Trummens Strand är byggt helt i trä, med stomme av massivträ, träfasader och synliga träkonstruktioner. Genom att använda ett naturligt och förnybart material skapas bostäder med lågt klimatavtryck och en tydlig koppling till Växjös träbyggnadstradition.'
        }
    ],
    categoryG: [ // MARK
        {
            title: 'När restytan blir stad',
            project: 'Kv Gränden, Lund',
            text: 'Genom att bebygga tidigare impedimentytor utnyttjar Gränden marken mer effektivt. Den nedsänkta parkeringsgatan omvandlas till bostäder och levande stadsmiljö, samtidigt som ny bebyggelse läker samman områdets tidigare åtskilda delar.'
        },
        {
            title: 'Som en pusselbit',
            project: 'Kv Modellen, Stockholm',
            text: 'Ett nytt gårdshus med 20 hyreslägenheter i kvarteret Modellen i Vasastan. Byggnaden fyller ett tomrum mellan två befintliga hus och har en oregelbunden form, vilket har resulterat i en dynamisk och överraskande planlösning. För att minska koldioxidavtrycket har väggar och bjälklag byggts i KL-trä, ett materialval som också medför fördelar såsom kortare byggtid, renare arbetsmiljö och mindre ljud.'
        },
        {
            title: 'Parkera på höjden, bygg staden på marken',
            project: 'Utveckling av Drottninghög, Helsingborg',
            text: 'I Drottninghög blev parkeringshuset en katalysator för förändring. Genom att samla parkeringen på höjden frigjordes stora markytor för nya bostäder och möjliggjorde omvandlingen från ett glest miljonprogramsområde till en tätare stadsdel.'
        }
    ],
    categoryH: [ // ENERGI
        {
            title: 'Låt fasaden göra jobbet',
            project: 'Mobilitetshuset Solkvarteret',
            text: 'I Solkvarteret blir energin en del av arkitekturen. Integrerade solceller producerar lokal el och tillsammans med batterilagring och smarta energilösningar kan energin användas effektivare, samtidigt som byggnaden bidrar till ett mer hållbart energisystem.'
        },
        {
            title: 'Tillvarata energin',
            project: 'Ekerö Strand',
            text: 'Bostadsprojektet i Ekerö Strand kombinerar hållbarhet och komfort med bergvärme, solceller och golvvärme i alla lägenheter. Projektet har en kulvert som förbinder huskropparna och fungerar som ledningsstråk. Byggnaderna har bra U-värden och minimerar köldbryggor genom bland annat fristående balkonger.'
        },
        {
            title: 'Minskat energiläckage',
            project: 'Kronprinsen, Malmö',
            text: 'Kronprinsen visar värdet av att vårda det vi redan har. Genom underhåll, energieffektivisering och varsam förnyelse kan äldre byggnader få längre liv, lägre energibehov och samtidigt behålla de arkitektoniska kvaliteter som skapar identitet.'
        }
    ],
    categoryI: [ // PENGAR
        {
            title: 'När kalkylen skapar stadsliv',
            project: 'Mobilitetshuset Parkside, Malmö',
            text: 'I Parkside omsattes yteffektiv parkering direkt i samhällsnytta. En smart lösning frigjorde ekonomi till ett publikt tak med utegym, där projektets förutsättningar användes för att skapa största möjliga värde och glädje.'
        },
        {
            title: 'Stor effekt med enkla medel',
            project: 'Entré, Malmö',
            text: 'Delar av Entré Malmö har omvandlats från köpcentrum till kontor. FOJAB tog fram en lösning för att skapa ljusa, funktionella kontor med minimal ombyggnad genom att vinkla råglasfasaden 90 grader för att möjliggöra ljusinsläpp och utblick.'
        },
        {
            title: 'Så lite som möjligt, så mycket som behövs',
            project: 'Göteborgs Länsresidens', // Platshållaren i Word-filen ("Projekt La la la, Stad") ersatt med namnet från brödtexten - dubbelkolla gärna
            text: 'I Göteborgs Länsresidens har vi bevarat även det mindre självklara och koncentrerat ombyggnaden till det som verkligen behövde förändras. Det har sparat resurser och skapat god ekonomi. Samtidigt har tillgängligheten förbättrats, en öppnare entré skapats och Länsstyrelsen kunnat stanna kvar i sina befintliga lokaler.'
        }
    ],
    categoryJ: [ // RESURSUTNYTTJANDE
        {
            title: 'Från utdömt till eftertraktat',
            project: 'Hamiltones kontor, Markaryd',
            text: 'I Markaryd förvandlades en nedgången bilverkstad till ett modernt kontor genom att ta vara på det som redan fanns. Med få ingrepp, återbruk och bevarade industridetaljer skapades en unik miljö med ny attraktivitet som medarbetarna älskar.'
        },
        {
            title: '100 procent återbruk. 100 procent arkitektur',
            project: 'Mobilitetshus Hyllieäng, Malmö',
            text: 'FOJAB har skapat en fasad av 100% återbrukade material, inklusive industriskrot och delar från lärarhögskolans (Orkanen) gamla glasfasad. Projektet visar hur man kan designa med osäkerhet och navigera bygglov trots okända materialförutsättningar.'
        },
        {
            title: 'Från byggnad till stad',
            project: 'Kv Stinsen, Sollentuna', // OBS: Word-filen hade även en rad "Projekt La la la, Stad" ovanför den här - verkar vara oifylld platshållartext, dubbelkolla gärna
            text: 'FOJAB visar att det går att bevara och förädla befintlig struktur i stället för att riva. Förslaget utvecklar en hel stadsdel med blandade funktioner. Den gamla bilbutiken bidrar till både strukturell ryggrad, parkeringslösningar och platsens identitet.'
        }
    ],
    categoryK: [ // RESILIENS
        {
            title: 'Vatten som skapar fler värden',
            project: 'WiCiD – Vatten I Staden',
            text: 'WiCiD är ett digitalt beslutsverktyg som jämför olika lösningar för dagvatten och skyfall. Genom att väga dem mot projektets mål synliggörs lösningar som kan minska klimatavtrycket, stärka biologisk mångfald och skapa sociala värden.'
        },
        {
            title: 'Med höjd för vattnet',
            project: 'Åstaden, Kävlinge',
            text: 'I Åstaden blev översvämningsrisken från Kävlingeån en aktiv del av planeringen. Bebyggelsen följer ”Venedigprincipen” där vattnet får stiga in vid höga flöden och husen närmast ån står på pelare så att det kan flöda under dem. Svämytan kan därmed bevaras som en grön resurs för biologisk mångfald och rekreation.'
        },
        {
            title: 'En lågpunkt med potential',
            project: 'Teaterparken i Landskrona',
            text: 'Teaterparken har man utnyttjat platsens läge som en naturlig lågpunkt i staden. Gröningen fungerar som en öppen park- och aktivitetsyta i vardagen, men kan vid kraftiga regn ta emot och fördröja stora mängder vatten.'
        }
    ],
    categoryL: [ // SKÖNHET
        {
            title: 'Skönhet som består',
            project: 'Lunds Tingsrätt',
            text: 'God arkitektur gör mer än att lösa en funktion. Lunds tingsrätt visar hur form, material och ljus kan skapa skönhet, värdighet och identitet, och samtidigt ge något bestående tillbaka till staden och människorna.'
        },
        {
            title: 'Ett fönster till döden',
            project: 'Göteborgs Krematorium',
            text: 'Krematoriets arkitektur bygger på balans mellan stram geometri och poetiska detaljer. Den tydliga kompositionen, konkava fasaderna och lekfullt placerade fönstren skapar tillsammans med ljus och material en harmonisk, värdig och vacker helhet.'
        },
        {
            title: 'När gammalt och nytt lyfter varandra',
            project: 'Kino, Lund',
            text: 'Kino visar hur gammalt och nytt kan bilda en vacker helhet. Varsamt framlyfta originaldetaljer möter ett nytt formspråk med egen karaktär, där kontrasten skapar harmoni och låter byggnadens historia leva vidare.'
        }
    ],
    categoryM: [ // FLEXIBILITET
        {
            title: 'Ett hem som följer med livet',
            project: 'Ryktborsten, Laröd',
            text: 'I Ryktborsten testade vi ett nytt sätt att tänka kring flexibelt boende. Ett koncept där bostadens storlek och planlösning kan varieras över tid skapar ett kvarter med ett livslångt perspektiv, anpassat för livets olika faser.'
        },
        {
            title: 'En byggnad – många liv',
            project: 'Hylliehybriden, Malmö',
            text: 'Hylliehybriden är ett hus byggt för förändring. En flexibel struktur gör det möjligt att växla mellan bostäder, kontor och hotell över tid, så att byggnaden kan möta nya behov och få ett längre liv.'
        },
        {
            title: 'Industribyggnadens generositet',
            project: 'Fabriken, Malmö',
            text: 'Att bygga hållbart är också att bygga för förändring. Kontorshuset Fabriken lånar industribyggnadens generositet för att möta framtidens behov. Här ger generös takhöjd, stora glaspartier och ett robust installationssystem en flexibel grund som gör byggnaden redo för nya verksamheter, behov och arbetssätt.'
        }
    ],
    categoryN: [ // ÄGANDESKAP
        {
            title: 'Arkitektur på frimärke och i Kalle Anka',
            project: 'MAX IV, Lund',
            text: 'MAX IV visar kraften i en stark arkitektonisk identitet. Som frimärksmotiv och medverkan i en Kalle Anka-serie har byggnaden blivit en symbol för Lund som skapar stolthet, berättelser och igenkänning.'
        },
        {
            title: 'När trapphusen blir konsthall',
            project: 'Mobilitetshus Oxbacken, Västerås',
            text: 'I parkeringshusets trapphus blir vardagen en konstupplevelse. Genom en konsttävling skapades vertikala konsthallar där ett lokalt verk, inspirerat av Västerås historia som invandrarstad, synliggör människorna och berättelserna som format staden.'
        },
        {
            title: 'Kultur genom delaktighet',
            project: 'Inredning ECIT',
            text: 'Inredningsprojektet inleddes med en workshop för att samla medarbetarnas synpunkter och önskemål inför det nya kontoret. Det handlade om att samlokalisera fyra olika verksamheter under ett tak och skapa en kultur som bygger på mänskliga möten. Genom att involvera människor i processen ökar deras känsla av delaktighet och ägandeskap.'
        }
    ],
    categoryO: [ // DEMONTERBARHET
        {
            title: 'Parkera nu, transformera sen',
            project: 'Omställning av parkeringsanläggning från parkering till bostäder/kontor',
            text: 'Genom FOJABlab har vi utforskat hur dagens mobilitetshus kan bli morgondagens bostäder och kontor. Genom att från början planera för framtida omställning kan byggnaden leva längre, möta förändrade behov och minska behovet av att riva och bygga nytt.'
        },
        {
            title: 'Anpassningsbar fasad',
            project: 'Venterminalen, Landskrona',
            text: 'Venterminalen är ritad med enkelhet och förändring i åtanke. En tydlig struktur och fasad med synliga infästningar gör att byggnaden bejakar en enkelhet och ärlighet samtidigt som det blir lätt att demontera, bygga om och anpassa när verksamhetens behov förändras över tid.'
        },
        {
            title: 'Dagens hus, morgondagens material',
            project: 'Trikåfabriken, Malmö',
            text: 'I Trikåfabriken har demonterbarhet varit en viktig del av den cirkulära strategin. Hybridstommen består av återbrukat stål och trä, och byggnadsdelarna är utformade för att kunna demonteras och återbrukas i framtida projekt. På så sätt blir huset inte bara en byggnad, utan också en materialbank för framtiden.'
        }
    ]
};
