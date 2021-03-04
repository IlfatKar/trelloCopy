import firebase from "firebase/app";
import "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyCaDvny4ni_HqvnYnVJiImUYGnBZGvw3dM",
  authDomain: "trello-61724.firebaseapp.com",
  databaseURL: "https://trello-61724-default-rtdb.firebaseio.com",
  projectId: "trello-61724",
  storageBucket: "trello-61724.appspot.com",
  messagingSenderId: "362162602999",
  appId: "1:362162602999:web:95075fb6295a18703824f2"
};

firebase.initializeApp(firebaseConfig);

const dispatch = {
  async saveTasks(tasks){
    const ref = await firebase.database().ref('/tasks').push()
    await ref.set(tasks)
    return ref.key
  },
  async getTasks(id){
    return  (await firebase.database().ref(`/tasks/${id}`).once('value')).val()
  },
}

export default dispatch