// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
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
  const q = query(collection(db, "Notifications"), orderBy("Date", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();

    newData.push({
      NotificationId: data.NotificationId,
      Title: data.Title,
      Text: data.Text,
      From: data.From,
      Date: data.Date,
      Class: data.Class,
    });
  });
  return newData;
};
export const getStudents = async () => {
  const newData = [];
  const q = query(
    collection(db, "Users"),
    where("Role", "==", "Student"),
    orderBy("Class"),
    orderBy("Name")
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();

    newData.push({
      UserID: data.UserID,
      Name: data.Name,
      Email: data.Email,
      Class: data.Class,
    });
  });
  return newData;
};
export const getProfessors = async () => {
  const newData = [];
  const q = query(
    collection(db, "Users"),
    where("Role", "==", "Professor"),
    orderBy("Name")
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    newData.push({
      UserID: data.UserID,
      Name: data.Name,
      Email: data.Email,
      Class: data.Class,
    });
  });
  return newData;
};
export const postStudentsFile = async (data) => {
  for (let item of data) {
    const name = item.Name + " " + item.Surname;
    try {
      const userID = generatePassword(7);
      const data = {
        Name: name,
        Email: item.Email,
        Class: item.Class,
        Role: "Student",
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
};
export const postProfessorsFile = async (data) => {
  for (let item of data) {
    const name = item.Name + " " + item.Surname;
    try {
      const userID = generatePassword(7);
      const data = {
        Name: name,
        Email: item.Email,
        Class: item.Class,
        Role: "Professor",
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
};
export const postOneStudent = async (item) => {
  const name = item.Name + " " + item.Surname;
  try {
    const userID = generatePassword(7);
    const data = {
      Name: name,
      Email: item.Email,
      Class: item.Class,
      Role: "Student",
      UserID: userID,
      LogOut: true,
    };
    const list = await getStudents();

    if (list.every((obj) => obj.Email !== item.Email)) {
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
      return true;
    }
    return false;
  } catch (error) {
    throw new Error("Nije uspešno dodat student");
  }
};
export const postOneProfessor = async (item) => {
  const name = item.Name + " " + item.Surname;
  try {
    const userID = generatePassword(7);
    const data = {
      Name: name,
      Email: item.Email,
      Class: item.Class,
      Role: "Professor",
      UserID: userID,
      LogOut: true,
    };
    const list = await getStudents();

    if (list.every((obj) => obj.Email !== item.Email)) {
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
    }
    return false;
  } catch (error) {
    throw new Error("Nije uspešno dodat student");
  }
};
export const getAllClasses = async () => {
  const newData = [];
  const q = query(collection(db, "Classes"), orderBy("Class", "asc"));
  const querySnapshot = await getDocs(q);
  const profs = query(
    collection(db, "Users"),
    where("Role", "==", "Professor")
  );
  const profesors = await getDocs(profs);
  querySnapshot.forEach(async (doc) => {
    const data = doc.data();
    let ProfessorsList = "";

    profesors.docs.forEach((prof) => {
      if (data.ProfessorsList.includes(prof.data().UserID))
        ProfessorsList += `${prof.data().Name}, `;
    });

    newData.push({
      label: data.Class,
      value: data.Class,
      text: data.Class,
      url: data.Table,
      Class: data.Class,
      ProfessorsList: ProfessorsList,
      Professor: data.Professor,
    });
  });
  return newData;
};
export const sendNotification = async (item) => {
  let fileArray = [];

  if (item.Files) {
    fileArray = [...item.Files];
    fileArray.forEach((f) => {
      const storageRef = ref(storage, f?.name);
      uploadBytes(storageRef, f)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }
  try {
    const dataToInsert = {
      NotificationId: generatePassword(7),
      Class: item.Classes,
      Date: new Date(),
      Files: fileArray.length > 0 ? `${fileArray.map((f) => f.name)}` : ``,
      Text: item.Text,
      Title: item.Title,
      Type: `T${fileArray.length > 0 ? "F" : ""}`,
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
    sendData();
    console.log("radiiii");
    await addDoc(collection(db, "Notifications"), dataToInsert);
  } catch (error) {
    throw new Error("Neuspešno slanje");
  }
};
export const deleteUserDocuments = async (users) => {
  for (const user of users) {
    const q = query(
      collection(db, "Users"),
      where("UserID", "==", user.UserID)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, "Users", docId));
      console.log(`Document with ID ${docId} deleted.`);
    } else {
      console.log(`No document found for UserID ${user.UserID}`);
    }
  }
};
export const deleteNotificationDocuments = async (notifications) => {
  for (const notification of notifications) {
    const q = query(
      collection(db, "Notifications"),
      where("NotificationId", "==", notification.NotificationId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, "Notifications", docId));
      console.log(`Document with ID ${docId} deleted.`);
    } else {
      console.log(
        `No document found for NotificationId ${notification.NotificationId}`
      );
    }
  }
};
export const getImage = async (image) => {
  try {
    const imageRef = ref(storage, image); // Adjust the path if necessary
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error("Error fetching image:", error);
  }
  return null;
};
export const setImage = async (Class, image) => {
  try {
    const storageRef = ref(storage, image.name);
    uploadBytes(storageRef, image)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
      })
      .catch((e) => {
        console.log(e);
      });
    const q = query(collection(db, "Classes"), where("Class", "==", Class));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await updateDoc(doc(db, "Classes", docId), {
        Table: image.name,
      });
      console.log("Document successfully updated!");
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error updating document:", error);
  }
};
export const editUser = async (user, newValue) => {
  const q = query(collection(db, "Users"), where("UserID", "==", user.UserID));
  const querySnapshot = await getDocs(q);
  const docId = querySnapshot.docs[0].id;
  console.log(newValue.Class);
  await updateDoc(doc(db, "Users", docId), {
    Name: newValue.Name,
    Class: newValue.Class,
    Email: newValue.Email,
  });
};
export const editNotification = async (notification, newValue) => {
  const q = query(
    collection(db, "Notifications"),
    where("NotificationId", "==", notification.NotificationId)
  );
  const querySnapshot = await getDocs(q);
  const docId = querySnapshot.docs[0].id;
  await updateDoc(doc(db, "Notifications", docId), {
    Text: newValue.Text,
    Title: newValue.Title,
    Class: newValue.Class,
  });
};
export const postClass = async (dataToInsert, file) => {
  if (file) {
    const storageRef = ref(storage, file?.name);
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
      })
      .catch((e) => {
        console.log(e);
      });
  }
  try {
    await addDoc(collection(db, "Classes"), {
      ...dataToInsert,
      Table: file ? file.name : "",
    });
  } catch {
    throw new Error("alo");
  }
};
export const editClass = async (Class, newValue) => {
  console.log(newValue);
  const q = query(collection(db, "Classes"), where("Class", "==", Class.Class));
  const querySnapshot = await getDocs(q);
  const docId = querySnapshot.docs[0].id;
  console.log();
  await updateDoc(doc(db, "Classes", docId), {
    Professor: newValue.Professor,
    ProfessorsList: newValue.ProfessorsList,
  });
};
export const Login = async (password) => {
  const q = query(collection(db, "Schools"), where("SchoolID", "==", password));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty ? false : true;
};
export const deleteClassesDocuments = async (Classes) => {
  for (const Class of Classes) {
    console.log(Class);
    const q = query(
      collection(db, "Classes"),
      where("Class", "==", Class.Class)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, "Classes", docId));
      console.log(`Document with ID ${docId} deleted.`);
    } else {
      console.log(`No document found for NotificationId ${Class.Class}`);
    }
  }
};
export const nextYear = async (Users) => {};
