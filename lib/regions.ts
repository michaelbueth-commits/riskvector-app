export interface Region {
  name: string
  country: string
}

export const regions: Region[] = [
  // Germany (16 Bundesländer)
  ...['Baden-Württemberg','Bayern','Berlin','Brandenburg','Bremen','Hamburg','Hessen','Mecklenburg-Vorpommern','Niedersachsen','Nordrhein-Westfalen','Rheinland-Pfalz','Saarland','Sachsen','Sachsen-Anhalt','Schleswig-Holstein','Thüringen'].map(n => ({ name: n, country: 'Germany' })),

  // United States (50 States)
  ...['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'].map(n => ({ name: n, country: 'United States' })),

  // France (18 Regions)
  ...['Île-de-France','Provence-Alpes-Côte d\'Azur','Auvergne-Rhône-Alpes','Occitanie','Nouvelle-Aquitaine','Bretagne','Normandie','Hauts-de-France','Grand Est','Pays de la Loire','Bourgogne-Franche-Comté','Centre-Val de Loire','Corse','Guadeloupe','Martinique','Guyane','La Réunion','Mayotte'].map(n => ({ name: n, country: 'France' })),

  // Turkey (top 30 provinces)
  ...['Istanbul','Ankara','İzmir','Antalya','Muğla','Bursa','Adana','Konya','Gaziantep','Trabzon','Mersin','Kayseri','Eskişehir','Diyarbakır','Samsun','Denizli','Malatya','Erzurum','Şanlıurfa','Van','Aydın','Balıkesir','Manisa','Elazığ','Sakarya','Kocaeli','Hatay','Tekirdağ','Kahramanmaraş','Afyonkarahisar'].map(n => ({ name: n, country: 'Turkey' })),

  // Thailand (top 25 provinces)
  ...['Bangkok','Chiang Mai','Phuket','Krabi','Surat Thani','Chonburi','Pattaya','Nonthaburi','Pathum Thani','Chiang Rai','Udon Thani','Khon Kaen','Nakhon Ratchasima','Ubon Ratchathani','Samut Prakan','Songkhla','Chanthaburi','Kanchanaburi','Lopburi','Sukhothai','Ayutthaya','Prachuap Khiri Khan','Ranong','Trang','Narathiwat'].map(n => ({ name: n, country: 'Thailand' })),

  // Iran (top 25 provinces)
  ...['Tehran','Isfahan','Fars','Khorasan-e Razavi','Mazandaran','Gilan','Khuzestan','East Azerbaijan','West Azerbaijan','Kerman','Sistan and Baluchestan','Alborz','Qom','Kurdistan','Hamedan','Golestan','Lorestan','Markazi','Yazd','Kermanshah','Bushehr','Hormozgan','Semnan','Zanjan','Ardabil'].map(n => ({ name: n, country: 'Iran' })),

  // Spain (17 Communities)
  ...['Andalucía','Cataluña','Madrid','Valencia','Galicia','País Vasco','Aragón','Castilla y León','Castilla-La Mancha','Canarias','Murcia','Navarra','Asturias','Cantabria','Extremadura','Baleares','La Rioja'].map(n => ({ name: n, country: 'Spain' })),

  // Italy (20 Regions)
  ...['Lombardia','Lazio','Campania','Sicilia','Veneto','Emilia-Romagna','Piemonte','Liguria','Toscana','Puglia','Calabria','Sardegna','Friuli Venezia Giulia','Marche','Abruzzo','Trentino-Alto Adige','Umbria','Basilicata','Molise','Valle d\'Aosta'].map(n => ({ name: n, country: 'Italy' })),

  // UK
  ...['England','Scotland','Wales','Northern Ireland','Greater London','Greater Manchester','West Midlands','Merseyside','West Yorkshire','South Yorkshire','Tyne and Wear','Kent','Essex','Lancashire','Hampshire','Surrey','Hertfordshire','Devon','Cornwall','Bristol'].map(n => ({ name: n, country: 'United Kingdom' })),

  // Japan
  ...['Tokyo','Osaka','Kyoto','Hokkaido','Okinawa','Kanagawa','Aichi','Fukuoka','Hyogo','Chiba','Saitama','Hiroshima','Miyagi','Niigata','Nagano','Shizuoka','Ibaraki','Kumamoto','Kagoshima','Okinawa'].map(n => ({ name: n, country: 'Japan' })),

  // China
  ...['Beijing','Shanghai','Guangdong','Sichuan','Zhejiang','Jiangsu','Shandong','Henan','Hubei','Hunan','Fujian','Yunnan','Heilongjiang','Liaoning','Jilin','Anhui','Hebei','Shaanxi','Guangxi','Hainan'].map(n => ({ name: n, country: 'China' })),

  // India
  ...['Maharashtra','Karnataka','Tamil Nadu','Uttar Pradesh','West Bengal','Telangana','Gujarat','Rajasthan','Kerala','Delhi','Madhya Pradesh','Haryana','Punjab','Bihar','Andhra Pradesh','Odisha','Goa','Assam','Jharkhand','Chhattisgarh'].map(n => ({ name: n, country: 'India' })),

  // Brazil
  ...['São Paulo','Rio de Janeiro','Minas Gerais','Bahia','Paraná','Rio Grande do Sul','Pernambuco','Ceará','Goiás','Amazonas','Santa Catarina','Paraíba','Maranhão','Espírito Santo','Rio Grande do Norte','Mato Grosso','Alagoas','Piauí','Sergipe','Tocantins'].map(n => ({ name: n, country: 'Brazil' })),

  // Russia
  ...['Moscow','Saint Petersburg','Krasnodar','Sverdlovsk','Tatarstan','Novosibirsk','Nizhny Novgorod','Samara','Rostov','Chelyabinsk','Krasnoyarsk','Voronezh','Perm','Volgograd','Omsk','Saratov','Tyumen','Tula','Kaliningrad','Murmansk'].map(n => ({ name: n, country: 'Russia' })),

  // Australia
  ...['New South Wales','Victoria','Queensland','Western Australia','South Australia','Tasmania','Northern Territory','Australian Capital Territory'].map(n => ({ name: n, country: 'Australia' })),

  // Canada
  ...['Ontario','Quebec','British Columbia','Alberta','Manitoba','Saskatchewan','Nova Scotia','New Brunswick','Newfoundland and Labrador','Prince Edward Island','Northwest Territories','Yukon','Nunavut'].map(n => ({ name: n, country: 'Canada' })),

  // Mexico
  ...['Ciudad de México','Jalisco','Nuevo León','Quintana Roo','Yucatán','Puebla','Guanajuato','Chiapas','Veracruz','Baja California','Chihuahua','Sonora','Michoacán','Oaxaca','Sinaloa','Coahuila','Guerrero','Hidalgo','Tamaulipas','Aguascalientes'].map(n => ({ name: n, country: 'Mexico' })),
]
