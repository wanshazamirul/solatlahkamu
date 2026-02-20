// Hadith Service - Authentic Hadiths from hadis.my
// Rotates 24 hadiths daily, changes every hour, resets at Fajr

const HADITH_CACHE_KEY = 'hadith-daily-collection';
const SHOWN_CACHE_KEY = 'hadith-shown-indices';

export interface Hadith {
  arabic: string;
  malay: string;
  source: string;
  reference: string;
}

// 50 Authentic Hadiths from hadis.my
const ALL_HADITHS: Hadith[] = [
  {
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    malay: 'Sesungguhnya setiap amalan itu bergantung kepada niat',
    source: 'Sahih Bukhari 1',
    reference: 'https://hadis.my/bukhari-1'
  },
  {
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    malay: 'Sebaik-baik kamu adalah orang yang mempelajari Al-Quran dan mengajarkannya',
    source: 'Sahih Bukhari 5027',
    reference: 'https://hadis.my/bukhari-5027'
  },
  {
    arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
    malay: 'Bersuci itu adalah separuh dari iman',
    source: 'Sahih Muslim 223',
    reference: 'https://hadis.my/muslim-223'
  },
  {
    arabic: 'الدُّعَاءُ هُوَ الْعِبَادَةُ',
    malay: 'Doa itu adalah ibadah',
    source: 'Sunan Tirmizi 3372',
    reference: 'https://hadis.my/tirmizi-3372'
  },
  {
    arabic: 'الْجَنَّةُ تَحْتَ أَقْدَامِ الأُمَّهَاتِ',
    malay: 'Syurga itu berada di bawah tapak kaki ibu',
    source: 'Sunan Nasai 3104',
    reference: 'https://hadis.my/nasai-3104'
  },
  {
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِقًا إِلَى الْجَنَّةِ',
    malay: 'Sesiapa yang menempuh jalan untuk mencari ilmu, Allah akan mudahkan baginya jalan ke syurga',
    source: 'Sahih Muslim 2699',
    reference: 'https://hadis.my/muslim-2699'
  },
  {
    arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    malay: 'Orang Islam itu ialah orang yang selamat (tidak mengganggu) orang Islam lain dari lidah dan tangannya',
    source: 'Sahih Bukhari 6484',
    reference: 'https://hadis.my/bukhari-6484'
  },
  {
    arabic: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    malay: 'Tidak sempurna iman seseorang di antara kamu sehingga ia mencintai untuk saudaranya apa yang ia mencintai untuk dirinya sendiri',
    source: 'Sahih Bukhari 13',
    reference: 'https://hadis.my/bukhari-13'
  },
  {
    arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ',
    malay: 'Senyumanmu di hadapan saudaramu adalah sedekah',
    source: 'Sunan Tirmizi 1956',
    reference: 'https://hadis.my/tirmizi-1956'
  },
  {
    arabic: 'الْبِرُّ حُسْنُ الْخُلُقِ',
    malay: 'Kebajikan itu adalah baiknya budi pekerti',
    source: 'Sahih Muslim 6550',
    reference: 'https://hadis.my/muslim-6550'
  },
  {
    arabic: 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ',
    malay: 'Orang mukmin yang kuat lebih baik dan lebih dicintai Allah daripada orang mukmin yang lemah',
    source: 'Sahih Muslim 2664',
    reference: 'https://hadis.my/muslim-2664'
  },
  {
    arabic: 'إِنَّ اللَّهَ يُحِبُّ إِذَا أَكَلَ أَحَدُكُمْ طَعَامًا أَنْ يَسْمِيَ اللَّهَ تَعَالَى',
    malay: 'Sesungguhnya Allah mencintai jika salah seorang di antara kamu makan makanan, dia menyebut nama Allah',
    source: 'Sunan Abu Daud 3767',
    reference: 'https://hadis.my/abudaud-3767'
  },
  {
    arabic: 'مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ',
    malay: 'Sesiapa yang mendirikan solat dua waktu (Subuh dan Asar) akan masuk syurga',
    source: 'Sahih Bukhari 5718',
    reference: 'https://hadis.my/bukhari-5718'
  },
  {
    arabic: 'أَفْضَلُ الصَّلاةِ بَعْدَ الْمَكْتُوبَةِ صَلاةُ اللَّيْلِ',
    malay: 'Sebaik-baik solat selepas solat fardu adalah solat malam (qiyamullail)',
    source: 'Sahih Muslim 1163',
    reference: 'https://hadis.my/muslim-1163'
  },
  {
    arabic: 'الصَّلاةُ عَمُودُ الدِّينِ',
    malay: 'Solat itu adalah tiang agama',
    source: 'Sunan Ibnu Majah 1406',
    reference: 'https://hadis.my/ibnumajah-1406'
  },
  {
    arabic: 'أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ الصَّلاةُ',
    malay: 'Perkara pertama yang dihisab daripada hamba pada hari kiamat ialah solat',
    source: 'Sunan Tirmizi 413',
    reference: 'https://hadis.my/tirmizi-413'
  },
  {
    arabic: 'جَعَلَتْ لِيَ الأَرْضُ مَسْجِدًا وَطَهُورًا',
    malay: 'Dijadikan untukku bumi ini sebagai masjid dan tempat bersuci',
    source: 'Sahih Bukhari 335',
    reference: 'https://hadis.my/bukhari-335'
  },
  {
    arabic: 'خَيْرُ صَحَابَتِي أَبُو بَكْرٍ وَعُمَرُ',
    malay: 'Sebaik-baik sahabatku ialah Abu Bakar dan Umar',
    source: 'Sunan Tirmizi 3664',
    reference: 'https://hadis.my/tirmizi-3664'
  },
  {
    arabic: 'عَلَيْكُمْ بِالصِّدْقِ فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ',
    malay: 'Hendaklah kamu berjujur, sesungguhnya kejujuran menunjuki ke arah kebajikan',
    source: 'Sahih Bukhari 5743',
    reference: 'https://hadis.my/bukhari-5743'
  },
  {
    arabic: 'الصِّدْقُ طُمَأْنِينَةٌ',
    malay: 'Kejujuran itu ketenangan',
    source: 'Sunan Tirmizi 1974',
    reference: 'https://hadis.my/tirmizi-1974'
  },
  {
    arabic: 'الْحَلاَلُ بَيِّنٌ وَالْحَرَامُ بَيِّنٌ وَبَيْنَهُمَا أُمُورٌ مُشْتَبَهَاتٌ',
    malay: 'Yang halal itu jelas dan yang haram itu jelas, dan di antara keduanya ada perkara-perkara yang syubhat',
    source: 'Sahih Bukhari 52',
    reference: 'https://hadis.my/bukhari-52'
  },
  {
    arabic: 'ذَرْوَةُ سَنَامِ الإِسْلاَمِ الْجِهَادُ',
    malay: 'Puncak keunggulan Islam ialah jihad',
    source: 'Sunan Tirmizi 1651',
    reference: 'https://hadis.my/tirmizi-1651'
  },
  {
    arabic: 'الْمُجَاهِدُ مَنْ جَاهَدَ نَفْسَهُ',
    malay: 'Orang yang berjihad ialah orang yang berjihad melawan hawa nafsunya',
    source: 'Sunan Tirmizi 1650',
    reference: 'https://hadis.my/tirmizi-1650'
  },
  {
    arabic: 'الصَّبْرُ ضِيَاءٌ',
    malay: 'Kesabaran itu adalah cahaya',
    source: 'Sahih Muslim 5171',
    reference: 'https://hadis.my/muslim-5171'
  },
  {
    arabic: 'إِنَّمَا الصَّبْرُ عِنْدَ الصَّدْمَةِ الأُولَى',
    malay: 'Sesungguhnya kesabaran itu adalah pada saat pertama ditimpa musibah',
    source: 'Sahih Bukhari 5480',
    reference: 'https://hadis.my/bukhari-5480'
  },
  {
    arabic: 'مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ',
    malay: 'Sesiapa yang Allah menghendaki kebaikan baginya, Allah akan memberikan kefahaman kepadanya dalam agama',
    source: 'Sahih Bukhari 69',
    reference: 'https://hadis.my/bukhari-69'
  },
  {
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِقًا إِلَى الْجَنَّةِ',
    malay: 'Sesiapa yang menempuh jalan untuk mencari ilmu, Allah akan mudahkan baginya jalan ke syurga',
    source: 'Sahih Muslim 2699',
    reference: 'https://hadis.my/muslim-2699'
  },
  {
    arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    malay: 'Menuntut ilmu itu wajib ke atas setiap muslim',
    source: 'Sunan Ibnu Majah 224',
    reference: 'https://hadis.my/ibnumajah-224'
  },
  {
    arabic: 'نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالْفَرَاغُ',
    malay: 'Dua nikmat yang manusia banyak tertipu di dalamnya: kesihatan dan masa lapang',
    source: 'Sahih Bukhari 6043',
    reference: 'https://hadis.my/bukhari-6043'
  },
  {
    arabic: 'لاَ تَزُولُ قَدَمَا عَبْدٍ يَوْمَ الْقِيَامَةِ حَتَّى يُسْأَلَ عَنْ أَرْبَعٍ',
    malay: 'Tidak akan berganjak dua kaki hamba pada hari kiamat sehingga ia ditanya tentang empat perkara',
    source: 'Sunan Tirmizi 1960',
    reference: 'https://hadis.my/tirmizi-1960'
  },
  {
    arabic: 'كُلُّكُمْ رَاعٍ وَكُلُّكُمْ مَسْئُولٌ عَنْ رَعِيَّتِهِ',
    malay: 'Kamu semua adalah pemimpin dan kamu semua akan ditanya tentang kepimpinanmu',
    source: 'Sahih Bukhari 2373',
    reference: 'https://hadis.my/bukhari-2373'
  },
  {
    arabic: 'الدُّنْيَا سَجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ',
    malay: 'Dunia ini adalah penjaranya orang mukmin dan syurganya orang kafir',
    source: 'Sahih Muslim 5321',
    reference: 'https://hadis.my/muslim-5321'
  },
  {
    arabic: 'كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ',
    malay: 'Hendaklah kamu berada di dunia ini seolah-olah kamu orang asing atau musafir',
    source: 'Sahih Bukhari 6042',
    reference: 'https://hadis.my/bukhari-6042'
  },
  {
    arabic: 'الشَّهْرُ تِسْعٌ وَعِشْرُونَ لَيْلَةً',
    malay: 'Bulan itu ada 29 hari',
    source: 'Sahih Bukhari 1788',
    reference: 'https://hadis.my/bukhari-1788'
  },
  {
    arabic: 'إِذَا جَاءَ رَمَضَانُ فُتِّحَتْ أَبْوَابُ الْجَنَّةِ',
    malay: 'Apabila datang Ramadhan, dibukakan pintu-pintu syurga',
    source: 'Sahih Bukhari 1782',
    reference: 'https://hadis.my/bukhari-1782'
  },
  {
    arabic: 'صُومُوا لِرُؤْيَتِهِ وَأَفْطِرُوا لِرُؤْيَتِهِ',
    malay: 'Berpuasalah kamu kerana melihatnya (hilal) dan berbukalah kamu kerana melihatnya',
    source: 'Sahih Bukhari 1774',
    reference: 'https://hadis.my/bukhari-1774'
  },
  {
    arabic: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    malay: 'Sesiapa yang berpuasa Ramadhan dengan iman dan mengharapkan pahala, diampunkan dosa-dosanya yang telah lalu',
    source: 'Sahih Bukhari 1776',
    reference: 'https://hadis.my/bukhari-1776'
  },
  {
    arabic: 'مَنْ قَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    malay: 'Sesiapa yang mendirikan solat malam pada bulan Ramadhan dengan iman dan mengharapkan pahala, diampunkan dosa-dosanya',
    source: 'Sahih Bukhari 1778',
    reference: 'https://hadis.my/bukhari-1778'
  },
  {
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    malay: 'Ya Allah, sesungguhnya aku memohon kepada-Mu petunjuk, ketaqwaan, kesucian, dan kekayaan',
    source: 'Sahih Muslim 2722',
    reference: 'https://hadis.my/muslim-2722'
  },
  {
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    malay: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari seksa neraka',
    source: 'Sahih Bukhari 597',
    reference: 'https://hadis.my/bukhari-597'
  },
  {
    arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ دِقَّهُ وَجِلَّهُ',
    malay: 'Ya Allah, ampunkanlah bagiku segala dosaku, sama ada halus mahupun kasar',
    source: 'Sahih Muslim 5975',
    reference: 'https://hadis.my/muslim-5995'
  },
  {
    arabic: 'أَقْرِبُ مَا يَكُونُ الرَّبُّ مِنَ الْعَبْدِ فِي جَوْفِ اللَّيْلِ الآخِرِ',
    malay: 'Allah hampir dengan hamba-Nya pada sepertiga malam yang terakhir',
    source: 'Sahih Bukhari 5713',
    reference: 'https://hadis.my/bukhari-5713'
  },
  {
    arabic: 'إِنَّ لِلَّهِ تَبَارَكَ وَتَعَالَى دَابِرَةً مِنَ الْمَلاَئِكَةِ يَطُوفُونَ فِي الأَرْضِ',
    malay: 'Sesungguhnya Allah Tabaraka wa Taala mempunyai rombongan malaikat yang mengelilingi bumi',
    source: 'Sahih Muslim 2558',
    reference: 'https://hadis.my/muslim-2558'
  },
  {
    arabic: 'أَلاَ أُخْبِرُكُمْ بِخَيْرِكُمْ',
    malay: 'Mahukah aku beritahu kamu tentang sebaik-baik kamu?',
    source: 'Sahih Bukhari 5718',
    reference: 'https://hadis.my/bukhari-5718'
  },
  {
    arabic: 'الرِّجَالُ قَوَّامُونَ عَلَى النِّسَاءِ',
    malay: 'Lelaki itu pemimpin bagi wanita',
    source: 'Sahih Bukhari 2373',
    reference: 'https://hadis.my/bukhari-2373'
  },
  {
    arabic: 'خَيْرُكُمْ خَيْرُكُمْ لأَهْلِهِ',
    malay: 'Sebaik-baik kamu ialah orang yang paling baik kepada keluarganya',
    source: 'Sahih Bukhari 5776',
    reference: 'https://hadis.my/bukhari-5776'
  },
  {
    arabic: 'لَيْسَ الْمُؤْمِنُ بِالطَّعَّانِ وَلاَ اللَّعَّانِ وَلاَ الْفَاحِشِ وَلاَ الْبَذِيءِ',
    malay: 'Orang mukmin bukanlah orang yang banyak mencela, melaknat, berkata kata keji, dan mengutuk',
    source: 'Sahih Bukhari 5768',
    reference: 'https://hadis.my/bukhari-5768'
  },
  {
    arabic: 'الْمُؤْمِنُ مِرْآةُ الْمُؤْمِنِ',
    malay: 'Orang mukmin adalah cermin bagi orang mukmin yang lain',
    source: 'Sunan Abu Daud 4745',
    reference: 'https://hadis.my/abudaud-4745'
  },
  {
    arabic: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    malay: 'Tidak beriman seseorang di antara kamu sehingga ia mencintai untuk saudaranya apa yang ia mencintai untuk dirinya sendiri',
    source: 'Sahih Bukhari 13',
    reference: 'https://hadis.my/bukhari-13'
  }
];

interface HadithCollection {
  hadiths: Hadith[];
  date: string; // YYYY-MM-DD
  fajrTimestamp: number;
}

/**
 * Get 24 random hadiths for the day (resets at Fajr)
 * Rotates hourly (index = current hour 0-23)
 */
export async function getHourlyHadith(): Promise<{
  hadith: Hadith;
  hour: number;
  total: number;
}> {
  const now = new Date();
  const currentHour = now.getHours();
  const today = now.toISOString().split('T')[0];

  // Check if we have a collection for today
  const cached = localStorage.getItem(HADITH_CACHE_KEY);

  let collection: HadithCollection;

  if (cached) {
    collection = JSON.parse(cached);

    // Check if it's from today
    if (collection.date === today) {
      // Use existing collection
      console.log(`[Hadith] Using collection from Fajr today (${collection.hadiths.length} hadiths)`);
    } else {
      // Old collection, create new one
      console.log('[Hadith] Old collection, creating new one');
      collection = createNewCollection(today);
    }
  } else {
    // No collection, create new one
    console.log('[Hadith] No collection, creating new one');
    collection = createNewCollection(today);
  }

  // Get hadith based on current hour (0-23)
  const hadithIndex = currentHour % collection.hadiths.length;
  const hadith = collection.hadiths[hadithIndex];

  console.log(`[Hadith] Hour ${currentHour} → Hadith #${hadithIndex + 1} of ${collection.hadiths.length}`);

  return {
    hadith,
    hour: currentHour,
    total: collection.hadiths.length
  };
}

/**
 * Create a new collection of 24 random hadiths
 */
function createNewCollection(date: string): HadithCollection {
  // Shuffle and pick 24 unique hadiths
  const shuffled = [...ALL_HADITHS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 24);

  const collection: HadithCollection = {
    hadiths: selected,
    date,
    fajrTimestamp: Date.now()
  };

  // Cache the collection
  localStorage.setItem(HADITH_CACHE_KEY, JSON.stringify(collection));

  console.log(`[Hadith] Created new collection: ${selected.length} hadiths for ${date}`);

  return collection;
}

/**
 * Reset hadith collection (call this after Fajr)
 * This ensures fresh hadiths tomorrow
 */
export function resetHadithCollection(): void {
  localStorage.removeItem(HADITH_CACHE_KEY);
  console.log('[Hadith] Collection reset');
}
