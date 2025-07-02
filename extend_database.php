<?php
/**
 * Extended Countries Database Setup
 * Expands the flag game database with 195+ countries
 */

require_once __DIR__ . '/config/database.php';

// Make sure the Database class is available
if (!class_exists('Database')) {
    require_once __DIR__ . '/classes/Database.php';
}

try {
    $pdo = Database::getInstance()->getConnection();
    
    echo "Iniziando popolamento esteso del database...\n";
    
    // Lista completa di paesi del mondo con coordinate precise
    $extended_countries = [
        // Europa
        ['Albania', 'Tirana', 'AL', 'ALB', 41.3275, 19.8187, 'L\'aquila a due teste è il simbolo nazionale albanese.'],
        ['Andorra', 'Andorra la Vella', 'AD', 'AND', 42.5063, 1.5218, 'Piccolo principato tra Francia e Spagna.'],
        ['Austria', 'Vienna', 'AT', 'AUT', 47.5162, 14.5501, 'La bandiera austriaca è una delle più antiche del mondo.'],
        ['Belgio', 'Bruxelles', 'BE', 'BEL', 50.5039, 4.4699, 'I colori derivano dallo stemma del Ducato di Brabante.'],
        ['Bosnia e Erzegovina', 'Sarajevo', 'BA', 'BIH', 43.9159, 17.6791, 'Le stelle rappresentano l\'infinito e l\'Europa.'],
        ['Bulgaria', 'Sofia', 'BG', 'BGR', 42.7339, 25.4858, 'Il bianco simboleggia la pace, il verde la natura, il rosso il coraggio.'],
        ['Croazia', 'Zagabria', 'HR', 'HRV', 45.1000, 15.2000, 'Lo stemma a scacchi è il simbolo storico croato.'],
        ['Cipro', 'Nicosia', 'CY', 'CYP', 35.1264, 33.4299, 'L\'isola è rappresentata nella sua forma geografica.'],
        ['Repubblica Ceca', 'Praga', 'CZ', 'CZE', 49.8175, 15.4730, 'Il triangolo blu rappresenta la Moravia e la Slesia.'],
        ['Danimarca', 'Copenaghen', 'DK', 'DNK', 56.2639, 9.5018, 'Il Dannebrog è considerato la bandiera nazionale più antica.'],
        ['Estonia', 'Tallinn', 'EE', 'EST', 58.5953, 25.0136, 'I colori rappresentano il cielo, la terra nera e la neve.'],
        ['Finlandia', 'Helsinki', 'FI', 'FIN', 61.9241, 25.7482, 'La croce nordica su fondo bianco e blu.'],
        ['Francia', 'Parigi', 'FR', 'FRA', 46.6034, 1.8883, 'Il tricolore francese rappresenta libertà, uguaglianza e fraternità.'],
        ['Germania', 'Berlino', 'DE', 'DEU', 51.1657, 10.4515, 'I colori nero, rosso e oro hanno origini storiche medievali.'],
        ['Grecia', 'Atene', 'GR', 'GRC', 39.0742, 21.8243, 'La croce rappresenta la fede ortodossa greca.'],
        ['Ungheria', 'Budapest', 'HU', 'HUN', 47.1625, 19.5033, 'I colori derivano dalle armi reali ungheresi.'],
        ['Islanda', 'Reykjavik', 'IS', 'ISL', 64.9631, -19.0208, 'La croce nordica con i colori del fuoco e del ghiaccio.'],
        ['Irlanda', 'Dublino', 'IE', 'IRL', 53.4129, -8.2439, 'Il verde rappresenta i cattolici, l\'arancione i protestanti.'],
        ['Italia', 'Roma', 'IT', 'ITA', 41.8719, 12.5674, 'Il tricolore italiano è ispirato alla bandiera francese.'],
        ['Lettonia', 'Riga', 'LV', 'LVA', 56.8796, 24.6032, 'Una delle bandiere più antiche del mondo.'],
        ['Liechtenstein', 'Vaduz', 'LI', 'LIE', 47.1660, 9.5554, 'La corona dorata fu aggiunta per distinguerla da Haiti.'],
        ['Lituania', 'Vilnius', 'LT', 'LTU', 55.1694, 23.8813, 'I colori rappresentano il coraggio, la fedeltà e la speranza.'],
        ['Lussemburgo', 'Lussemburgo', 'LU', 'LUX', 49.8153, 6.1296, 'Simile ai Paesi Bassi ma con blu più chiaro.'],
        ['Malta', 'La Valletta', 'MT', 'MLT', 35.9375, 14.3754, 'La croce di San Giorgio fu aggiunta da Re Giorgio VI.'],
        ['Moldavia', 'Chișinău', 'MD', 'MDA', 47.4116, 28.3699, 'Lo stemma include un\'aquila con una croce nel becco.'],
        ['Monaco', 'Monaco', 'MC', 'MCO', 43.7502, 7.4128, 'I colori derivano dalle armi araldiche dei Grimaldi.'],
        ['Montenegro', 'Podgorica', 'ME', 'MNE', 42.7087, 19.3744, 'L\'aquila a due teste simboleggia Chiesa e Stato.'],
        ['Paesi Bassi', 'Amsterdam', 'NL', 'NLD', 52.1326, 5.2913, 'Il tricolore arancione-bianco-blu, poi rosso-bianco-blu.'],
        ['Macedonia del Nord', 'Skopje', 'MK', 'MKD', 41.6086, 21.7453, 'Il sole nascente con otto raggi.'],
        ['Norvegia', 'Oslo', 'NO', 'NOR', 60.4720, 8.4689, 'La croce nordica con i colori di Francia e Stati Uniti.'],
        ['Polonia', 'Varsavia', 'PL', 'POL', 51.9194, 19.1451, 'Il bianco e rosso sono i colori nazionali polacchi.'],
        ['Portogallo', 'Lisbona', 'PT', 'PRT', 39.3999, -8.2245, 'La sfera armillare rappresenta l\'era delle scoperte.'],
        ['Romania', 'Bucarest', 'RO', 'ROU', 45.9432, 24.9668, 'I colori derivano dalle province storiche.'],
        ['Russia', 'Mosca', 'RU', 'RUS', 61.5240, 105.3188, 'Il tricolore pan-slavo bianco-blu-rosso.'],
        ['San Marino', 'San Marino', 'SM', 'SMR', 43.9424, 12.4578, 'Il più antico stato sovrano del mondo.'],
        ['Serbia', 'Belgrado', 'RS', 'SRB', 44.0165, 21.0059, 'I colori pan-slavi con lo stemma nazionale.'],
        ['Slovacchia', 'Bratislava', 'SK', 'SVK', 48.6690, 19.6990, 'I colori pan-slavi con lo stemma nazionale.'],
        ['Slovenia', 'Lubiana', 'SI', 'SVN', 46.1512, 14.9955, 'Lo stemma include il monte Triglav e due fiumi.'],
        ['Spagna', 'Madrid', 'ES', 'ESP', 40.4637, -3.7492, 'Lo stemma al centro rappresenta i regni storici spagnoli.'],
        ['Svezia', 'Stoccolma', 'SE', 'SWE', 60.1282, 18.6435, 'La croce gialla su sfondo blu.'],
        ['Svizzera', 'Berna', 'CH', 'CHE', 46.8182, 8.2275, 'La croce bianca su sfondo rosso, simbolo di neutralità.'],
        ['Ucraina', 'Kiev', 'UA', 'UKR', 48.3794, 31.1656, 'Il blu rappresenta il cielo, il giallo i campi di grano.'],
        ['Regno Unito', 'Londra', 'GB', 'GBR', 55.3781, -3.4360, 'La Union Jack combina le croci di Inghilterra, Scozia e Irlanda.'],
        ['Città del Vaticano', 'Città del Vaticano', 'VA', 'VAT', 41.9029, 12.4534, 'Le chiavi di San Pietro e la tiara papale.'],

        // Asia
        ['Afghanistan', 'Kabul', 'AF', 'AFG', 33.9391, 67.7100, 'I colori nero, rosso e verde rappresentano il passato, il presente e il futuro.'],
        ['Armenia', 'Yerevan', 'AM', 'ARM', 40.0691, 45.0382, 'I colori rappresentano il sangue versato, la terra e la speranza.'],
        ['Azerbaigian', 'Baku', 'AZ', 'AZE', 40.1431, 47.5769, 'La mezzaluna e la stella rappresentano l\'Islam.'],
        ['Bahrain', 'Manama', 'BH', 'BHR', 25.9304, 50.6378, 'I cinque triangoli rappresentano i cinque pilastri dell\'Islam.'],
        ['Bangladesh', 'Dhaka', 'BD', 'BGD', 23.6850, 90.3563, 'Il cerchio rosso rappresenta il sole che sorge sul Bengala.'],
        ['Bhutan', 'Thimphu', 'BT', 'BTN', 27.5142, 90.4336, 'Il drago rappresenta il nome del paese: "Terra del Drago".'],
        ['Brunei', 'Bandar Seri Begawan', 'BN', 'BRN', 4.5353, 114.7277, 'Lo stemma include un parasole reale e due mani.'],
        ['Cambogia', 'Phnom Penh', 'KH', 'KHM', 12.5657, 104.9910, 'Angkor Wat è rappresentato al centro della bandiera.'],
        ['Cina', 'Pechino', 'CN', 'CHN', 35.8617, 104.1954, 'Le cinque stelle rappresentano l\'unità del popolo cinese.'],
        ['Corea del Nord', 'Pyongyang', 'KP', 'PRK', 40.3399, 127.5101, 'La stella rossa simboleggia il comunismo.'],
        ['Corea del Sud', 'Seoul', 'KR', 'KOR', 35.9078, 127.7669, 'Il Taegeuk rappresenta l\'equilibrio cosmico.'],
        ['Emirati Arabi Uniti', 'Abu Dhabi', 'AE', 'ARE', 23.4241, 53.8478, 'I colori pan-arabi con una barra verticale rossa.'],
        ['Filippine', 'Manila', 'PH', 'PHL', 12.8797, 121.7740, 'Il sole a otto raggi rappresenta le otto province che si ribellarono.'],
        ['Georgia', 'Tbilisi', 'GE', 'GEO', 42.3154, 43.3569, 'Le cinque croci rappresentano le ferite di Cristo.'],
        ['Giappone', 'Tokyo', 'JP', 'JPN', 36.2048, 138.2529, 'Il cerchio rosso rappresenta il sole nascente.'],
        ['Giordania', 'Amman', 'JO', 'JOR', 30.5852, 36.2384, 'I colori pan-arabi con la stella a sette punte.'],
        ['India', 'Nuova Delhi', 'IN', 'IND', 20.5937, 78.9629, 'La ruota al centro è il Chakra di Ashoka.'],
        ['Indonesia', 'Giacarta', 'ID', 'IDN', -0.7893, 113.9213, 'Il rosso e bianco sono i colori tradizionali indonesiani.'],
        ['Iran', 'Teheran', 'IR', 'IRN', 32.4279, 53.6880, 'Lo stemma al centro contiene la parola "Allah" stilizzata.'],
        ['Iraq', 'Baghdad', 'IQ', 'IRQ', 33.2232, 43.6793, 'La scritta "Allahu Akbar" in caratteri cufici.'],
        ['Israele', 'Gerusalemme', 'IL', 'ISR', 31.0461, 34.8516, 'La Stella di David tra due strisce blu.'],
        ['Kazakistan', 'Nur-Sultan', 'KZ', 'KAZ', 48.0196, 66.9237, 'L\'aquila dorata vola sotto il sole.'],
        ['Kirghizistan', 'Bishkek', 'KG', 'KGZ', 41.2044, 74.7661, 'Il sole a 40 raggi rappresenta le 40 tribù kirghise.'],
        ['Kuwait', 'Kuwait City', 'KW', 'KWT', 29.3117, 47.4818, 'I colori pan-arabi in una disposizione unica.'],
        ['Laos', 'Vientiane', 'LA', 'LAO', 19.8563, 102.4955, 'Il cerchio bianco rappresenta la luna sul fiume Mekong.'],
        ['Libano', 'Beirut', 'LB', 'LBN', 33.8547, 35.8623, 'Il cedro del Libano è il simbolo nazionale.'],
        ['Malesia', 'Kuala Lumpur', 'MY', 'MYS', 4.2105, 101.9758, 'Le 14 strisce rappresentano gli stati federali.'],
        ['Maldive', 'Malé', 'MV', 'MDV', 3.2028, 73.2207, 'La mezzaluna rappresenta la fede islamica.'],
        ['Mongolia', 'Ulaanbaatar', 'MN', 'MNG', 46.8625, 103.8467, 'Il simbolo Soyombo rappresenta la libertà.'],
        ['Myanmar', 'Naypyidaw', 'MM', 'MMR', 21.9162, 95.9560, 'La stella bianca rappresenta l\'unione perpetua.'],
        ['Nepal', 'Kathmandu', 'NP', 'NPL', 28.3949, 84.1240, 'L\'unica bandiera non rettangolare al mondo.'],
        ['Oman', 'Muscat', 'OM', 'OMN', 21.4735, 55.9754, 'Lo stemma include due spade incrociate e un khanjar.'],
        ['Pakistan', 'Islamabad', 'PK', 'PAK', 30.3753, 69.3451, 'La mezzaluna e la stella rappresentano l\'Islam.'],
        ['Qatar', 'Doha', 'QA', 'QAT', 25.3548, 51.1839, 'I nove triangoli bianchi separano il marrone dal bianco.'],
        ['Arabia Saudita', 'Riad', 'SA', 'SAU', 23.8859, 45.0792, 'La shahada (professione di fede islamica) e una spada.'],
        ['Singapore', 'Singapore', 'SG', 'SGP', 1.3521, 103.8198, 'Le cinque stelle rappresentano democrazia, pace, progresso, giustizia e uguaglianza.'],
        ['Sri Lanka', 'Sri Jayawardenepura Kotte', 'LK', 'LKA', 7.8731, 80.7718, 'Il leone rappresenta il coraggio del popolo singalese.'],
        ['Siria', 'Damasco', 'SY', 'SYR', 34.8021, 38.9968, 'I colori pan-arabi con due stelle verdi.'],
        ['Tagikistan', 'Dušanbe', 'TJ', 'TJK', 38.8610, 71.2761, 'La corona con sette stelle rappresenta l\'unità.'],
        ['Tailandia', 'Bangkok', 'TH', 'THA', 15.8700, 100.9925, 'I cinque colori rappresentano nazione, religione e monarchia.'],
        ['Timor Est', 'Dili', 'TL', 'TLS', -8.8742, 125.7275, 'La stella rappresenta la luce che guida il popolo.'],
        ['Turchia', 'Ankara', 'TR', 'TUR', 38.9637, 35.2433, 'La mezzaluna e la stella sono simboli islamici.'],
        ['Turkmenistan', 'Ashgabat', 'TM', 'TKM', 38.9697, 59.5563, 'Il tappeto tradizionale rappresenta le cinque tribù.'],
        ['Uzbekistan', 'Tashkent', 'UZ', 'UZB', 41.3775, 64.5853, 'Le 12 stelle rappresentano i mesi dell\'anno.'],
        ['Vietnam', 'Hanoi', 'VN', 'VNM', 14.0583, 108.2772, 'La stella a cinque punte rappresenta l\'unità del popolo.'],
        ['Yemen', 'Sana\'a', 'YE', 'YEM', 15.5527, 48.5164, 'I colori pan-arabi in strisce orizzontali.'],

        // Africa
        ['Algeria', 'Algeri', 'DZ', 'DZA', 28.0339, 1.6596, 'Il verde rappresenta l\'Islam, la mezzaluna e la stella la fede.'],
        ['Angola', 'Luanda', 'AO', 'AGO', -11.2027, 17.8739, 'La stella rappresenta il progresso e la solidarietà internazionale.'],
        ['Benin', 'Porto-Novo', 'BJ', 'BEN', 9.3077, 2.3158, 'Il verde rappresenta la speranza di rinnovamento.'],
        ['Botswana', 'Gaborone', 'BW', 'BWA', -22.3285, 24.6849, 'Le strisce blu rappresentano l\'acqua e la pioggia.'],
        ['Burkina Faso', 'Ouagadougou', 'BF', 'BFA', 12.2383, -1.5616, 'La stella rappresenta la luce guida della rivoluzione.'],
        ['Burundi', 'Gitega', 'BI', 'BDI', -3.3731, 29.9189, 'Le tre stelle rappresentano i tre gruppi etnici principali.'],
        ['Camerun', 'Yaoundé', 'CM', 'CMR', 7.3697, 12.3547, 'La stella rappresenta l\'unità nazionale.'],
        ['Capo Verde', 'Praia', 'CV', 'CPV', 16.5388, -24.0132, 'Le dieci stelle rappresentano le dieci isole principali.'],
        ['Repubblica Centrafricana', 'Bangui', 'CF', 'CAF', 6.6111, 20.9394, 'La stella rappresenta un futuro radioso.'],
        ['Ciad', 'N\'Djamena', 'TD', 'TCD', 15.4542, 18.7322, 'I colori rappresentano il cielo, la speranza e il progresso.'],
        ['Comore', 'Moroni', 'KM', 'COM', -11.6455, 43.3333, 'Le quattro stelle rappresentano le quattro isole.'],
        ['Repubblica del Congo', 'Brazzaville', 'CG', 'COG', -0.2280, 15.8277, 'I colori pan-africani in diagonale.'],
        ['Repubblica Democratica del Congo', 'Kinshasa', 'CD', 'COD', -4.0383, 21.7587, 'La stella rappresenta un futuro radioso per il paese.'],
        ['Costa d\'Avorio', 'Yamoussoukro', 'CI', 'CIV', 7.5400, -5.5471, 'I colori rappresentano il progresso, la pace e la terra.'],
        ['Gibuti', 'Gibuti', 'DJ', 'DJI', 11.8251, 42.5903, 'La stella rappresenta l\'unità tra i diversi gruppi etnici.'],
        ['Egitto', 'Il Cairo', 'EG', 'EGY', 26.0975, 30.0444, 'L\'aquila di Saladino rappresenta la forza e il potere.'],
        ['Guinea Equatoriale', 'Malabo', 'GQ', 'GNQ', 1.6508, 10.2679, 'L\'albero della ceiba rappresenta l\'unità nazionale.'],
        ['Eritrea', 'Asmara', 'ER', 'ERI', 15.7394, 39.7823, 'Il ramo d\'ulivo rappresenta la pace.'],
        ['Etiopia', 'Addis Abeba', 'ET', 'ETH', 9.1450, 40.4897, 'I colori pan-africani con il Leone di Giuda.'],
        ['Gabon', 'Libreville', 'GA', 'GAB', -0.8037, 11.6094, 'Il verde rappresenta le foreste, il giallo l\'equatore.'],
        ['Gambia', 'Banjul', 'GM', 'GMB', 13.4432, -15.3101, 'Le strisce rappresentano il sole, il fiume e la terra.'],
        ['Ghana', 'Accra', 'GH', 'GHA', 7.9465, -1.0232, 'La stella nera rappresenta la lodestar della libertà africana.'],
        ['Guinea', 'Conakry', 'GN', 'GIN', 9.9456, -9.6966, 'I colori rappresentano il lavoro, la giustizia e la solidarietà.'],
        ['Guinea-Bissau', 'Bissau', 'GW', 'GNB', 11.8037, -15.1804, 'La stella rappresenta l\'unità africana.'],
        ['Kenya', 'Nairobi', 'KE', 'KEN', -0.0236, 37.9062, 'Lo scudo e le lance rappresentano la difesa della libertà.'],
        ['Lesotho', 'Maseru', 'LS', 'LSO', -29.6100, 28.2336, 'Il cappello basotho rappresenta la cultura nazionale.'],
        ['Liberia', 'Monrovia', 'LR', 'LBR', 6.4281, -9.4295, 'Simile alla bandiera USA, riflette le origini del paese.'],
        ['Libia', 'Tripoli', 'LY', 'LBY', 26.3351, 17.2283, 'I colori rappresentano il sangue, la purezza e la speranza.'],
        ['Madagascar', 'Antananarivo', 'MG', 'MDG', -18.7669, 46.8691, 'I colori rappresentano la tradizione e l\'indipendenza.'],
        ['Malawi', 'Lilongwe', 'MW', 'MWI', -13.2543, 34.3015, 'Il sole rappresenta l\'alba di una nuova era.'],
        ['Mali', 'Bamako', 'ML', 'MLI', 17.5707, -3.9962, 'I colori pan-africani verticali.'],
        ['Marocco', 'Rabat', 'MA', 'MAR', 31.7917, -7.0926, 'La stella verde rappresenta il Sigillo di Salomone.'],
        ['Mauritania', 'Nouakchott', 'MR', 'MRT', 21.0079, -10.9408, 'La mezzaluna e la stella rappresentano l\'Islam.'],
        ['Mauritius', 'Port Louis', 'MU', 'MUS', -20.3484, 57.5522, 'I quattro colori rappresentano i diversi gruppi etnici.'],
        ['Mozambico', 'Maputo', 'MZ', 'MOZ', -18.6657, 35.5296, 'L\'AK-47 rappresenta la lotta per l\'indipendenza.'],
        ['Namibia', 'Windhoek', 'NA', 'NAM', -22.9576, 18.4904, 'Il sole rappresenta la vita e l\'energia.'],
        ['Niger', 'Niamey', 'NE', 'NER', 17.6078, 8.0817, 'Il cerchio arancione rappresenta il sole.'],
        ['Nigeria', 'Abuja', 'NG', 'NGA', 9.0765, 8.6753, 'Il verde rappresenta l\'agricoltura, il bianco l\'unità.'],
        ['Ruanda', 'Kigali', 'RW', 'RWA', -1.9403, 29.8739, 'Il sole rappresenta l\'illuminazione che combatte l\'ignoranza.'],
        ['São Tomé e Príncipe', 'São Tomé', 'ST', 'STP', 0.1864, 6.6131, 'Le due stelle rappresentano le due isole principali.'],
        ['Senegal', 'Dakar', 'SN', 'SEN', 14.4974, -14.4524, 'La stella verde rappresenta l\'Islam e la speranza.'],
        ['Seychelles', 'Victoria', 'SC', 'SYC', -4.6796, 55.4920, 'I cinque colori rappresentano un popolo dinamico.'],
        ['Sierra Leone', 'Freetown', 'SL', 'SLE', 8.4606, -11.7799, 'I colori rappresentano l\'unità, la giustizia e la pace.'],
        ['Somalia', 'Mogadiscio', 'SO', 'SOM', 5.1521, 46.1996, 'La stella rappresenta l\'unità dei popoli somali.'],
        ['Sudafrica', 'Città del Capo', 'ZA', 'ZAF', -30.5595, 22.9375, 'La Y rappresenta la convergenza di diverse tradizioni.'],
        ['Sudan del Sud', 'Juba', 'SS', 'SSD', 6.8770, 31.3070, 'La stella rappresenta l\'unità degli stati federali.'],
        ['Sudan', 'Khartoum', 'SD', 'SDN', 12.8628, 30.2176, 'I colori pan-arabi con il triangolo nero.'],
        ['Tanzania', 'Dodoma', 'TZ', 'TZA', -6.3690, 34.8888, 'I colori rappresentano il popolo, la terra e l\'oceano.'],
        ['Togo', 'Lomé', 'TG', 'TGO', 8.6195, 0.8248, 'La stella rappresenta la speranza.'],
        ['Tunisia', 'Tunisi', 'TN', 'TUN', 33.8869, 9.5375, 'La mezzaluna e la stella rappresentano l\'Islam.'],
        ['Uganda', 'Kampala', 'UG', 'UGA', 1.3733, 32.2903, 'La gru coronata grigia è l\'uccello nazionale.'],
        ['Zambia', 'Lusaka', 'ZM', 'ZMB', -13.1339, 27.8493, 'L\'aquila rappresenta la capacità di elevarsi sopra i problemi.'],
        ['Zimbabwe', 'Harare', 'ZW', 'ZWE', -19.0154, 29.1549, 'L\'uccello di Zimbabwe rappresenta la storia nazionale.'],

        // Americhe
        ['Antigua e Barbuda', 'Saint John\'s', 'AG', 'ATG', 17.0608, -61.7964, 'Il sole rappresenta l\'alba di una nuova era.'],
        ['Argentina', 'Buenos Aires', 'AR', 'ARG', -38.4161, -63.6167, 'Il sole di maggio rappresenta la rivoluzione di maggio.'],
        ['Bahamas', 'Nassau', 'BS', 'BHS', 25.0343, -77.3963, 'Il triangolo nero rappresenta la determinazione del popolo.'],
        ['Barbados', 'Bridgetown', 'BB', 'BRB', 13.1939, -59.5432, 'Il tridente rotto rappresenta la rottura con il passato coloniale.'],
        ['Belize', 'Belmopan', 'BZ', 'BLZ', 17.1899, -88.4976, 'Lo stemma è circondato da una corona di 50 foglie.'],
        ['Bolivia', 'Sucre', 'BO', 'BOL', -16.2902, -63.5887, 'I colori rappresentano il coraggio, la purezza e la ricchezza.'],
        ['Brasile', 'Brasília', 'BR', 'BRA', -14.2350, -51.9253, 'Il rombo giallo rappresenta le ricchezze minerarie del paese.'],
        ['Canada', 'Ottawa', 'CA', 'CAN', 56.1304, -106.3468, 'La foglia d\'acero è il simbolo nazionale del Canada.'],
        ['Cile', 'Santiago', 'CL', 'CHL', -35.6751, -71.5430, 'La stella rappresenta i poteri del governo.'],
        ['Colombia', 'Bogotá', 'CO', 'COL', 4.5709, -74.2973, 'Il giallo rappresenta la ricchezza, il blu il mare, il rosso il sangue.'],
        ['Costa Rica', 'San José', 'CR', 'CRI', 9.7489, -83.7534, 'I colori rappresentano la pace, il cielo e il sangue versato.'],
        ['Cuba', 'L\'Avana', 'CU', 'CUB', 21.5218, -77.7812, 'Le strisce rappresentano le province originali.'],
        ['Dominica', 'Roseau', 'DM', 'DMA', 15.4150, -61.3710, 'Il pappagallo sisserou è l\'uccello nazionale.'],
        ['Repubblica Dominicana', 'Santo Domingo', 'DO', 'DOM', 18.7357, -70.1627, 'La croce rappresenta la fede cristiana.'],
        ['Ecuador', 'Quito', 'EC', 'ECU', -1.8312, -78.1834, 'Il condor rappresenta il potere, la grandezza e la forza.'],
        ['El Salvador', 'San Salvador', 'SV', 'SLV', 13.7942, -88.8965, 'Lo stemma include il triangolo massonico.'],
        ['Grenada', 'Saint George\'s', 'GD', 'GRD', 12.1165, -61.6790, 'Le sette stelle rappresentano le sette parrocchie.'],
        ['Guatemala', 'Città del Guatemala', 'GT', 'GTM', 15.7835, -90.2308, 'Il quetzal rappresenta la libertà.'],
        ['Guyana', 'Georgetown', 'GY', 'GUY', 4.8604, -58.9302, 'L\'arrowhead dorato rappresenta le risorse minerarie.'],
        ['Haiti', 'Port-au-Prince', 'HT', 'HTI', 18.9712, -72.2852, 'Lo stemma include il motto "L\'Union fait la force".'],
        ['Honduras', 'Tegucigalpa', 'HN', 'HND', 15.2000, -86.2419, 'Le cinque stelle rappresentano le cinque nazioni centroamericane.'],
        ['Giamaica', 'Kingston', 'JM', 'JAM', 18.1096, -77.2975, 'L\'unica bandiera nazionale senza rosso, bianco o blu.'],
        ['Messico', 'Città del Messico', 'MX', 'MEX', 23.6345, -102.5528, 'L\'aquila che divora un serpente è una leggenda azteca.'],
        ['Nicaragua', 'Managua', 'NI', 'NIC', 12.8654, -85.2072, 'Il triangolo rappresenta l\'uguaglianza.'],
        ['Panama', 'Panama City', 'PA', 'PAN', 8.5380, -80.7821, 'I quadranti rappresentano i due partiti politici principali.'],
        ['Paraguay', 'Asunción', 'PY', 'PRY', -23.4425, -58.4438, 'Una delle poche bandiere con design diversi sui due lati.'],
        ['Perù', 'Lima', 'PE', 'PER', -9.1900, -75.0152, 'I colori derivano dalla visione di San Martín dei fenicotteri.'],
        ['Saint Kitts e Nevis', 'Basseterre', 'KN', 'KNA', 17.3578, -62.7830, 'Le due stelle rappresentano le due isole.'],
        ['Saint Lucia', 'Castries', 'LC', 'LCA', 13.9094, -60.9789, 'Il triangolo rappresenta i Pitons, montagne iconiche.'],
        ['Saint Vincent e Grenadine', 'Kingstown', 'VC', 'VCT', 12.9843, -61.2872, 'I diamanti rappresentano le isole Grenadine.'],
        ['Suriname', 'Paramaribo', 'SR', 'SUR', 3.9193, -56.0278, 'La stella rappresenta l\'unità nella diversità.'],
        ['Trinidad e Tobago', 'Port of Spain', 'TT', 'TTO', 10.6918, -61.2225, 'Il nero rappresenta la dedizione, il rosso la vitalità.'],
        ['Stati Uniti', 'Washington D.C.', 'US', 'USA', 37.0902, -95.7129, 'Le 50 stelle rappresentano i 50 stati federali.'],
        ['Uruguay', 'Montevideo', 'UY', 'URY', -32.5228, -55.7658, 'Il sole di maggio rappresenta l\'indipendenza.'],
        ['Venezuela', 'Caracas', 'VE', 'VEN', 6.4238, -66.5897, 'Le sette stelle rappresentano le province che firmarono l\'indipendenza.'],

        // Oceania
        ['Australia', 'Canberra', 'AU', 'AUS', -25.2744, 133.7751, 'La Union Jack ricorda i legami storici con il Regno Unito.'],
        ['Figi', 'Suva', 'FJ', 'FJI', -16.7784, 179.4144, 'Lo stemma include una colomba della pace.'],
        ['Kiribati', 'Tarawa', 'KI', 'KIR', -3.3704, -168.7340, 'L\'uccello fregata vola sopra il sole nascente.'],
        ['Isole Marshall', 'Majuro', 'MH', 'MHL', 7.1315, 171.1845, 'La stella rappresenta la croce del sud.'],
        ['Micronesia', 'Palikir', 'FM', 'FSM', 7.4256, 150.5508, 'Le quattro stelle rappresentano i quattro stati.'],
        ['Nauru', 'Yaren', 'NR', 'NRU', -0.5228, 166.9315, 'La stella rappresenta la posizione geografica.'],
        ['Nuova Zelanda', 'Wellington', 'NZ', 'NZL', -40.9006, 174.8860, 'La Union Jack e la Croce del Sud.'],
        ['Palau', 'Ngerulmud', 'PW', 'PLW', 7.5150, 134.5825, 'Il cerchio giallo rappresenta la luna piena.'],
        ['Papua Nuova Guinea', 'Port Moresby', 'PG', 'PNG', -6.3150, 143.9555, 'L\'uccello del paradiso e la Croce del Sud.'],
        ['Samoa', 'Apia', 'WS', 'WSM', -13.7590, -172.1046, 'Le cinque stelle rappresentano la Croce del Sud.'],
        ['Isole Salomone', 'Honiara', 'SB', 'SLB', -9.6457, 160.1562, 'Le cinque stelle rappresentano i cinque gruppi di isole.'],
        ['Tonga', 'Nuku\'alofa', 'TO', 'TON', -21.1789, -175.1982, 'La croce rappresenta la fede cristiana.'],
        ['Tuvalu', 'Funafuti', 'TV', 'TUV', -7.1095, 177.6493, 'Le nove stelle rappresentano i nove atolli.'],
        ['Vanuatu', 'Port Vila', 'VU', 'VUT', -15.3767, 166.9592, 'Il cinghiale rappresenta la prosperità.']
    ];

    $inserted_count = 0;
    
    foreach ($extended_countries as $country_data) {
        // Controlla se il paese esiste già
        $stmt = $pdo->prepare("SELECT id FROM countries WHERE iso2_code = ?");
        $stmt->execute([$country_data[2]]);
        $existing_country = $stmt->fetch();
        
        if (!$existing_country) {
            // Inserisci il paese solo se non esiste
            $stmt = $pdo->prepare("INSERT INTO countries (name, capital, iso2_code, iso3_code, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$country_data[0], $country_data[1], $country_data[2], $country_data[3], $country_data[4], $country_data[5]]);
            $country_id = $pdo->lastInsertId();
            $inserted_count++;
        } else {
            $country_id = $existing_country['id'];
        }
        
        // Inserisci il suggerimento
        if ($country_id) {
            $stmt = $pdo->prepare("SELECT id FROM tips WHERE country_id = ?");
            $stmt->execute([$country_id]);
            if (!$stmt->fetch()) {
                $stmt = $pdo->prepare("INSERT INTO tips (country_id, tip_text) VALUES (?, ?)");
                $stmt->execute([$country_id, $country_data[6]]);
            }
            
            // Inserisci anche la bandiera usando FlagCDN
            $flag_url = "https://flagcdn.com/w320/" . strtolower($country_data[2]) . ".png";
            $stmt = $pdo->prepare("SELECT id FROM flags WHERE country_id = ?");
            $stmt->execute([$country_id]);
            if (!$stmt->fetch()) {
                $stmt = $pdo->prepare("INSERT INTO flags (country_id, image_url) VALUES (?, ?)");
                $stmt->execute([$country_id, $flag_url]);
            }
        }
    }
    
    // Conta i paesi totali nel database
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM countries");
    $total_countries = $stmt->fetch()['total'];
    
    echo "✅ Database esteso completato!\n";
    echo "📊 Paesi aggiunti in questa sessione: $inserted_count\n";
    echo "🌍 Totale paesi nel database: $total_countries\n";
    echo "🎮 Il gioco ora ha una varietà molto più ampia di bandiere!\n";
    
} catch (Exception $e) {
    echo "❌ Errore durante l'espansione del database: " . $e->getMessage() . "\n";
}
?>
