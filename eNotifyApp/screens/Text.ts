interface LanguageData {
    Tittles: {
      Schedule: string;
      NotificationLoader: string;
      Account: string;
      Register: string; // Add the missing keys
    };
    AccountText: {
      AboutTittle: string;
      AboutText: string;
    };
    Navigation: {
      Home: string;
      Schedule: string;
      Account: string;
    };
  }
  
  interface LanguageText {
    [key: string]: LanguageData;
  }

const LanguageText: LanguageText = {
  RS: {
    Tittles: {
      Schedule: 'Raspored',
      NotificationLoader: 'Obaveštenja',
      Account: 'Moj Nalog',
      Register: 'Unesite kod',
    },
    AccountText: {
      AboutTittle: 'O aplikaciji',
      AboutText: `"eNotify" je moćan alat za efikasno obaveštavanje učenika o važnim
      događajima, aktivnostima i informacijama u vezi sa njihovom
      školom. Ova aplikacija omogućava školama da lako komuniciraju sa
      svojim učenicima putem brzih, pouzdanih i personalizovanih
      obaveštenja.`,
    },
    Navigation: {
      Home: 'Obaveštenja',
      Schedule: 'Raspored',
      Account: 'Moj Nalog',
    },
  },
  HU: {
    Tittles: {
      Schedule: 'Órarend',
      NotificationLoader: 'Értesítések',
      Account: 'Számla',
      Register: 'Unesite kod',
    },
    AccountText: {
      AboutTittle: 'Az alkalmazásról',
      AboutText: `"eNotify" egy erős eszköz a diákok hatékony tájékoztatására fontos eseményekről, 
      tevékenységekről és információkról az iskolájukkal kapcsolatban. Ez az alkalmazás lehetővé 
      teszi az iskoláknak, hogy könnyen kommunikáljanak a diákjaikkal gyors, megbízható és személyre 
      szabott értesítések útján.`,
    },
    Navigation: {
      Home: 'Kezdőlap',
      Schedule: 'Órarend',
      Account: 'Számla',
    },
  },
};

export default LanguageText