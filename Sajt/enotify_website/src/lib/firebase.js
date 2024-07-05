// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getMessaging } from "firebase/messaging";
import axios from "axios";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApd5LMDAX_GrmRbr7PFdjepcHdxhdTTrE",
  authDomain: "enotify-c579a.firebaseapp.com",
  projectId: "enotify-c579a",
  storageBucket: "enotify-c579a.appspot.com",
  messagingSenderId: "441876563435",
  appId: "1:441876563435:web:b559d5b6a51e9cee6205ae",
  measurementId: "G-YD0VKVZPNE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
export const storage = getStorage(app);
export default app;

const generatePassword = (length) => {
  // Define the length of the password
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Define the character set
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export const getNotifications = async () => {
  const newData = [];
  const q = query(collection(db, "Notifications"), orderBy("Date","desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();

    newData.push({
      NotificationId:data.NotificationId,
      Tittle:data.Tittle,
      Text:data.Text,
      From:data.From,
      Date:data.Date,
    });
  });
  return newData;
};
export const getStudents = async () => {
  const newData = [];
  const q = query(collection(db, "Users"),where("Role","==","Student"),orderBy("Class"),orderBy("Name"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();

    newData.push({
      UserID:data.UserID,
      Name:data.Name,
      Email:data.Email,
      Class:data.Class,
    });
  });
  return newData;
};
export const getProfessors = async () => {
  const newData = [];
  const q = query(collection(db, "Users"),where("Role","==","Professor"),orderBy("Name"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    console.log(data);
    newData.push({
      UserID:data.UserID,
      Name:data.Name,
      Email:data.Email,
      Class:data.Class,
      
    });
  });
  return newData;
};
export const postStudentsFile = async (data)=>{
  for (let item of data) {
    console.log(item);
    const name = item.Name + " " + item.Surname;
    try {
      const userID = generatePassword(7);
      const data = {
        Name: name,
        Email: item.Email,
        Class: item.Class,
        Role: 'Student',
        UserID: userID,
        LogOut: true,
      };
      
      axios
        .post(
          "https://enotifyserver2.netlify.app/.netlify/functions/api/send-email",
          {
            to: item.Email,
            subject: "Vaš kod",
            text: userID,
          }
        )
        .then((response) => {
          
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error sending email:", error);
        });
      await addDoc(collection(db, "Users"), data);
    } catch (error) {
      console.error(error);
    }
  }
}
export const postProfessorsFile = async (data)=>{
  for (let item of data) {
    console.log(item);
    const name = item.Name + " " + item.Surname;
    try {
      const userID = generatePassword(7);
      const data = {
        Name: name,
        Email: item.Email,
        Class: item.Class,
        Role: 'Professor',
        UserID: userID,
        LogOut: true,
      };
      
      axios
        .post(
          "https://enotifyserver2.netlify.app/.netlify/functions/api/send-email",
          {
            to: item.Email,
            subject: "Vaš kod",
            text: userID,
          }
        )
        .then((response) => {
          
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error sending email:", error);
        });
      await addDoc(collection(db, "Users"), data);
    } catch (error) {
      console.error(error);
    }
  }
}
export const postOneStudent = async (item)=>{
    const name = item.Name + " " + item.Surname;
    try {
      const userID = generatePassword(7);
      const data = {
        Name: name,
        Email: item.Email,
        Class: item.Class,
        Role: 'Student',
        UserID: userID,
        LogOut: true,
      };
      
      axios
        .post(
          "https://enotifyserver2.netlify.app/.netlify/functions/api/send-email",
          {
            to: item.Email,
            subject: "Vaš kod",
            text: userID,
          }
        )
        .then((response) => {
          
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error sending email:", error);
        });
      await addDoc(collection(db, "Users"), data);
    } catch (error) {
      throw new Error("Nije uspešno dodat student");
      
    }
}
export const postOneProfessor = async (item)=>{
  const name = item.Name + " " + item.Surname;
  try {
    const userID = generatePassword(7);
    const data = {
      Name: name,
      Email: item.Email,
      Class: item.Class,
      Role: 'Professor',
      UserID: userID,
      LogOut: true,
    };
    
    axios
      .post(
        "https://enotifyserver2.netlify.app/.netlify/functions/api/send-email",
        {
          to: item.Email,
          subject: "Vaš kod",
          text: userID,
        }
      )
      .then((response) => {
        
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
    await addDoc(collection(db, "Users"), data);
  } catch (error) {
    throw new Error("Nije uspešno dodat student");
  }
}
export const getAllClasses = async ()=>{
  const newData = [];
  const q = query(collection(db, "Classes"),orderBy("Class","asc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();

    newData.push({
      value: data.Class,
      text: data.Class,
    });
  });
  return newData;
}
export const sendNotification = async (files,item) => {
  if (files) {
    files.forEach((f) => {
      const storageRef = ref(storage, f?.name);
      // uploadBytes(storageRef, f)
      //   .then((snapshot) => {
      //     console.log("Uploaded a blob or file!");
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
    });
  }
  try {
  const dataToInsert = {
    NotificationId: generatePassword(7),
    Class: item.Classes,
    Date: new Date(),
    Files: files.length > 0 ? `${files.map((f) => f.name)}` : ``,
    Text: item.Text,
    Tittle: item.Title,
    Type: `T${files.length > 0 ? "F" : ""}`,
    Seen: "",
    From: "Uprava škole",
  };

    const sendData = async () => {
      try {
        const response = await axios.post(
          "https://enotifyserver2.netlify.app/.netlify/functions/api/data",
          dataToInsert
        );
      } catch (error) {
        console.error("Error sending data:", error);
      }
    };
    // sendData();
    
      await addDoc(collection(db, "Notifications"), dataToInsert);
    } catch (error) {
      throw new Error("Neuspešno slanje");
    }
}