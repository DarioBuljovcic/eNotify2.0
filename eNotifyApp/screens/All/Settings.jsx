import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  Image,
} from "react-native";
//import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from "react";
import Colors from "../../components/Color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RazrediList from "../ProfesorskeStranice/RazrediList";

export default function Settings({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [razred, setRazred] = useState("");
  const [razredi, setRazredi] = useState([]);
  const [naziv, setNaziv] = useState("");
  const [role, setRole] = useState("");

  const nabaviPodatke = async () => {
    try {
      const vRazred = await AsyncStorage.getItem("razred");
      const vNaziv = await AsyncStorage.getItem("naziv");
      const vRole = await AsyncStorage.getItem("role");

      setRazred(vRazred);
      setNaziv(vNaziv);
      setRole(vRole);
    } catch (e) {
      console.log(e);
    }
  };

  const promeniRazred = async () => {
    try {
      await AsyncStorage.removeItem("razred");
      console.log("Pokusano menjanje");
      navigation.navigate("Login");
    } catch (e) {
      console.log(e);
    }
  };
  function displayRazred() {
    if (role === "Ucenik") {
      return (
        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.8}
          onPress={() => promeniRazred()}
        >
          <Text style={styles.optionText}>Promeni razred</Text>
          <Text style={styles.optionGrade}>{razred}</Text>
          <Image
            style={{ width: 25, height: 25, marginRight: 12 }}
            source={require("../../images/dots-menu.png")}
          />
        </TouchableOpacity>
      );
    } else {
      return <RazrediList></RazrediList>;
    }
  }

  useEffect(() => {
    nabaviPodatke();
  }, [razred]);

  useEffect(() => {
    const nabaviRazrede = async () => {
      const { data, error, status } = await supabase.from("Razredi").select();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setLoading(true);
        setRazredi([...data].sort((a, b) => (a.razred > b.razred ? 1 : -1)));
      }
    };
    nabaviRazrede();
  }, []);

  // const toggleNotification = () => {
  //   setNotifications((previousState) => !previousState);
  //   console.log("Notification logic");
  // };
  // const toggleDarkMode = () => setDarkMode((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <Text style={styles.lineText}>Informacije</Text>
      <View style={styles.line}></View>
      {
        //notification switch
        /*<TouchableOpacity
        style={styles.option}
        activeOpacity={0.8}
        onPress={() => {
          toggleNotification();
        }}
      >
        <Text style={styles.optionText}>Notifikacije</Text>
        <Switch
          trackColor={{ false: "#b5b5b5", true: "#65C8FF" }}
          thumbColor={notifications ? "#e0f4ff" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleNotification}
          value={notifications}
          style={styles.optionSwitch}
        />
      </TouchableOpacity>*/
      }

      {
        //DARK MODE
        /* <TouchableOpacity style={styles.option} activeOpacity={1} onPress={()=>{
        toggleDarkMode();
      }}>
        <Text style={styles.optionText}>Taman rezim</Text>
        <Switch
          trackColor={{false: '#b5b5b5', true: '#65C8FF'}}
          thumbColor={notifications ? '#e0f4ff' : '#f4f3f4'}
          ios_backgroundColor='#3e3e3e'
          onValueChange={toggleDarkMode}
          value={darkMode}
          style={styles.optionSwitch}
        />
      </TouchableOpacity> */
      }
      <View>
        <Text style={styles.lineText}>{naziv}</Text>
        <Text style={styles.lineText}>{role}</Text>
      </View>
      {role && displayRazred()}

      <TouchableOpacity
        style={styles.option}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Raspored")}
      >
        <Text style={styles.optionText}>Raspored časova</Text>
      </TouchableOpacity>

      <Text style={styles.lineText}>O Aplikaciji</Text>
      <View style={styles.line}></View>

      <TouchableOpacity
        style={styles.option}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("About")}
      >
        <Text style={styles.optionText}>O aplikaciji</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "#fff",
    padding: 20,
  },
  background: {
    width: "100%",
    height: "100%",
    opacity: 0.95,
    padding: 20,
  },
  option: {
    height: 70,
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    padding: 20,

    backgroundColor: Colors.noticationBG,
    marginVertical: 10,
    borderRadius: 10,
    //borderColor: 'gray',
    //borderWidth: 1,

    elevation: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 5 },
    shadowRadius: 1,
  },
  optionText: {
    fontSize: 17,
    flex: 1,
    color: Colors.textPrimary,
  },
  optionGrade: {
    fontSize: 15,
    flex: 1,
    color: Colors.accent,
    marginLeft: 40,
  },
  optionSwitch: {
    flex: 1,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    marginRight: 10,
  },
  line: {
    width: "100%",
    backgroundColor: Colors.textPrimary,
    height: 1,
  },
  lineText: {
    marginTop: 10,
    marginBottom: 3,
    color: Colors.textPrimary,
    textAlign: "center",
  },
});
