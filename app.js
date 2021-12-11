// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  get,
  set,
  child,
  update,
  remove,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgP5y2rcVAsZAUvagKnOljBUFOvfTk2os",
  authDomain: "brunello-64601.firebaseapp.com",
  databaseURL: "https://brunello-64601-default-rtdb.firebaseio.com",
  projectId: "brunello-64601",
  storageBucket: "brunello-64601.appspot.com",
  messagingSenderId: "506133709201",
  appId: "1:506133709201:web:d9b4ae88c13fd9839b9a30",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();
// Aggiungere bacheche al click
let bachecheList = [];

const addNewBacheca = document.querySelector(".add-new-bacheca");
const addBachecaForm = document.querySelector(".close-form");

addNewBacheca.addEventListener("click", () => {
  addBachecaForm.classList.toggle("close-form");
});

let indexBacheca;

//Form dinamico al submit del todo
// document.addEventListener("click", (e) => {
//   if (e.target.id == "addToDoInput") {
//     const targetInputToDo = e.target.parentElement;
//     console.log(targetInputToDo)

//     const titleOfSingleToDo =
//       e.target.parentElement.parentElement.firstElementChild.textContent; // h4
//     const indexTasklist = bachecheList[indexBacheca].taskList.findIndex(
//       (item) => item.titleTaskList === titleOfSingleToDo
//     );

//     const targetInputValue = e.target;
//     const smallInputOfSmallToDo = e.target;
//     const containerOfSmallToDo =
//       e.target.parentElement.parentElement.lastElementChild;

//     targetInputToDo.addEventListener("submit", (e) => {
//       e.preventDefault();
//       const newToDo = {
//         newToDoList: [targetInputValue.value],
//       };

//       if (!bachecheList[indexBacheca].taskList[indexTasklist].newToDo) {
//         bachecheList[indexBacheca].taskList[indexTasklist].newToDo = newToDo;
//       } else {
//         bachecheList[indexBacheca].taskList[
//           indexTasklist
//         ].newToDo.newToDoList.push(smallInputOfSmallToDo.value);
//       }
//       //Update To do Sul database
//       const user = auth.currentUser.displayName;
//       update(ref(db, "user/" + user), {
//         bacheche: bachecheList,
//       })
//         .then(() => {})
//         .catch((error) => {
//           alert("errore:" + error);
//         });

//       containerOfSmallToDo.innerHTML = "";
//       bachecheList[indexBacheca].taskList[
//         indexTasklist
//       ].newToDo.newToDoList.forEach((todo) => {
//         const divtoDoCreate = document.createElement("div");
//         divtoDoCreate.innerHTML = `
//       <div class="single-todo">
//         <p>${todo}</p>
//         <img src="./images/edit.png" alt="">
//        </div>
//       `;
//         containerOfSmallToDo.appendChild(divtoDoCreate);
//       });
//     });
//   }
// });

//Al click del singolo todo - Eliminarlo
document.addEventListener("click", (e) => {
  if (e.target.id == "deleteXIcon") {
    const titoloTasklist =
      e.target.parentElement.firstElementChild.nextElementSibling.textContent;
    const indexTasklist = bachecheList[indexBacheca].taskList.findIndex(
      (item) => item.titleTaskList === titoloTasklist
    );

    const user = auth.currentUser.displayName;
    if (indexTasklist > -1) {
      bachecheList[indexBacheca].taskList.splice(indexTasklist, 1);
    }
    update(ref(db, "user/" + user), {
      bacheche: bachecheList,
    })
      .then(() => {})
      .catch((error) => {
        alert("errore:" + error);
      });

    //Render Singola TaskList
    toDosContainer.innerHTML = "";
    bachecheList[indexBacheca].taskList.forEach((task) => {
      const todoElement = document.createElement("div");
      todoElement.innerHTML = `
      <div class="todo" id="smallSingleToDoCard">
      <img src="./images/close.png" class="deleteXIcon" id="deleteXIcon"/>
                   <p>${task.titleTaskList}</p>   
       </div>
      `;
      toDosContainer.appendChild(todoElement);
    });
  }
});

/*********
 * Effettuo un ciclo sulle singole CARD
 * *******/
document.addEventListener("click", (e) => {
  const target = e.target.textContent;
  const todoTitle = document.querySelector(".singlebacheca__title h3");
  if (e.target.id == "singleCard") {
    singleToDoOfBacheca.style.transform = "translateX(0)";
    todoTitle.innerHTML = target;
    //Al click si seleziona l'oggetto cliccato dell'array
    const indexObjBacheca = bachecheList.findIndex(
      (item) => item.nomeBacheca === target
    );
    indexBacheca = indexObjBacheca;
    toDosContainer.innerHTML = "";
    bachecheList[indexObjBacheca].taskList.forEach((task) => {
      const todoElement = document.createElement("div");
      todoElement.innerHTML = `
        <div class="todo" id="smallSingleToDoCard">
        <img src="./images/close.png" class="deleteXIcon" id="deleteXIcon"/>
                     <p>${task.titleTaskList}</p>
                   
         </div>
        `;

      toDosContainer.appendChild(todoElement);
      // // Creare costanti che pescano gli id
      // const smallSingleToDoCard = document.querySelectorAll(
      //   "#smallSingleToDoCard"
      // );
      // const smallSingleToDoId = document.querySelectorAll("#smallSingleToDoId");
      // console.log(smallSingleToDoId, smallSingleToDoCard);

      // // Cicliamo le singole card
      // for (let i = 0; i < smallSingleToDoCard.length; i++) {
      //   smallSingleToDoId[i].innerHTML = "";
      //   if (bachecheList[indexBacheca].taskList[i].newToDo === undefined) {
      //     continue;
      //   }
      //   //Ciclando i singoli to Do
      //   for (
      //     let j = 0;
      //     j < bachecheList[indexBacheca].taskList[i].newToDo.newToDoList.length;
      //     j++
      //   ) {
      //     var test = bachecheList[indexBacheca].taskList[i].newToDo.newToDoList;
      //     smallSingleToDoId[i].innerHTML += `
      //           <div class="single-todo">
      //               <p>${test[j]}</p>
      //               <img src="./images/edit.png" alt="">
      //             </div>
      //         `;
      //   }
      // }
    });
  }
});
//Passare l'indice nell'update di ogni singola bacheca

//Return to home page from click return to bacheca Icon
const returnTo = document.querySelector(".returnTo");
const singleToDoOfBacheca = document.getElementById("singlebacheca");
returnTo.addEventListener("click", () => {
  singleToDoOfBacheca.style.transform = "translateX(-100%)";
});

/*********
 * Evento submit al FORM del singolo to-do di ogni Card
 *******/
const todoForm = document.getElementById("todo");
const inputToDo = document.querySelector(".addtodo-input");
const toDosContainer = document.querySelector(".singlebacheca_content_todos");
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //Creare oggetto
  let taskList = {
    titleTaskList: inputToDo.value,
  };

  if (!bachecheList[indexBacheca].taskList) {
    bachecheList[indexBacheca].taskList = [taskList];
  } else {
    bachecheList[indexBacheca].taskList.push(taskList);
  }
  const user = auth.currentUser.displayName;
  update(ref(db, "user/" + user), {
    bacheche: bachecheList,
  })
    .then(() => {})
    .catch((error) => {
      alert("errore:" + error);
    });
  toDosContainer.innerHTML = "";
  bachecheList[indexBacheca].taskList.forEach((task) => {
    const todoElement = document.createElement("div");
    todoElement.innerHTML = `
      <div class="todo" id="smallSingleToDoCard">
      <img src="./images/close.png" class="deleteXIcon" id="deleteXIcon"/>
                   <p>${task.titleTaskList}</p>
                      
       </div>
      `;

    toDosContainer.appendChild(todoElement);
    todoForm.reset();
  });

  // /*********
  //  * Effettuo un ciclo sulle singole CARD
  //  * *******/
  // const smallSingleToDoCard = document.querySelectorAll("#smallSingleToDoCard");
  // const smallSingleToDoId = document.querySelectorAll("#smallSingleToDoId");
  // for (let i = 0; i < smallSingleToDoCard.length; i++) {
  //   smallSingleToDoId[i].innerHTML = "";
  //   if (bachecheList[indexBacheca].taskList[i].newToDo === undefined) {
  //     continue;
  //   }
  //   /*********
  //    * Effettuo un ogni singolo to-do di ogni singola CARD
  //    * *******/
  //   for (
  //     let j = 0;
  //     j < bachecheList[indexBacheca].taskList[i].newToDo.newToDoList.length;
  //     j++
  //   ) {
  //     var test = bachecheList[indexBacheca].taskList[i].newToDo.newToDoList;
  //     smallSingleToDoId[i].innerHTML += `
  //           <div class="single-todo">
  //               <p>${test[j]}</p>
  //               <img src="./images/edit.png" alt="">
  //             </div>
  //         `;
  //   }
  // }
  //
});

//Al submit del form bacheca
const addForm = document.querySelector("#add-form");
const addFormInput = document.querySelector(".bacheca-input");
addForm.addEventListener("submit", (e) => {
  const mainBacheca = document.querySelector(".section-bacheca-cards");
  e.preventDefault();
  //Creare oggetto
  let bacheca = {
    nomeBacheca: addFormInput.value,
  };
  bachecheList.push(bacheca);
  //Ti permette di avere la variabile User a
  //livello locale da utilizzare dentro la chiamata server con il metodo
  //update
  const user = auth.currentUser.displayName;
  //Update sul singolo user con update inserendo il contenuto delle bacheche
  update(ref(db, "user/" + user), {
    bacheche: bachecheList,
  })
    .then(() => {})
    .catch((error) => {
      alert("errore:" + error);
    });

  /***********
   * Mostra gli elementi quando vengono aggiunti
   ***********/
  mainBacheca.innerHTML = "";
  bachecheList.forEach((bacheca) => {
    const newBacheca = document.createElement("div");
    newBacheca.innerHTML = `
        <div class="section-bacheca__card">
        <img src="./images/close.png" class="deleteIcon" id="deleteIcon"/>
          <img
            src="https://cdn.crispedge.com/4d91c6.png"
          />
          <h3 class="card-title" id="singleCard">${bacheca.nomeBacheca}</h3>
        </div>
        `;
    mainBacheca.appendChild(newBacheca);
    addForm.reset();
  });
});

/**********
 * Funzione per accedere con email e password
 *******************/
const nomeUser = document.querySelector(".saluto");
function signInUser() {
  const password = document.querySelector(".password-input2").value;
  const email = document.querySelector(".nameEmail-input").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      nomeUser.innerHTML = user.displayName;
      alert("User collegato con successo");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
}
const formlogin = document.querySelector(".form-login");
formlogin.addEventListener("submit", (e) => {
  e.preventDefault();
  signInUser();
});

/********
 * Se l'utente è registrato allora cambia schermata tramite questo metodo
 *************/

onAuthStateChanged(auth, (user) => {
  const bacheca = document.querySelector(".bacheca");
  if (user) {
    bacheca.style.transform = "translateX(0)";
    nomeUser.innerHTML = user.displayName;
    // Prendere i dati dell'utente dal database
    const starCountRef = ref(db, "user/" + user.displayName);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();

      /**********************
       * Single Bacheca
       *************************/

      const singleBacheca = data.bacheche;
      bachecheList = [];
      const mainBacheca = document.querySelector(".section-bacheca-cards");
      //Riaggiungere le task e riaggiornare quelle esistenti
      singleBacheca.forEach((task) => {
        bachecheList.push(task);
        const newBacheca = document.createElement("div");
        newBacheca.innerHTML = `
        <div class="section-bacheca__card">
        <img src="./images/close.png" class="deleteIcon" id="deleteIcon"/>
          <img
            src="https://cdn.crispedge.com/4d91c6.png"
          />
          <h3 class="card-title" id="singleCard">${task.nomeBacheca}</h3>
        </div>
        `;
        mainBacheca.appendChild(newBacheca);
      });
    });
  } else {
    bacheca.style.transform = "translate(-100%)";
  }
});
//al click sloggati
function logout() {
  auth.signOut().then(() => {
    alert("Logout effettuato");
  });
}

const logOutBtn = document.querySelector(".logOut-bacheca");
logOutBtn.addEventListener("click", () => {
  logout();
});

//Cancella La singola Bacheca 2
document.addEventListener("click", (e) => {
  if (e.target.id == "deleteIcon") {
    /*********
     * CANCELLO LA SINGOLA BACHECA
     *******/
    const deleteIconButton = document.querySelectorAll(".deleteIcon");
    const deleteMainBacheca = document.querySelector(".section-bacheca-cards");

    deleteIconButton.forEach((button) => {
      button.addEventListener("click", (e) => {
        const titleBacheca =
          e.target.parentElement.lastElementChild.textContent;
        const indexOfBacheca = bachecheList.findIndex(
          (item) => item.nomeBacheca === titleBacheca
        );
        bachecheList.splice(indexOfBacheca, 1);
        //Update Bacheche
        const user = auth.currentUser.displayName;
        update(ref(db, "user/" + user), {
          bacheche: bachecheList,
        })
          .then(() => {})
          .catch((error) => {
            alert("errore:" + error);
          });

        deleteMainBacheca.innerHTML = "";
        for (let i = 0; i < bachecheList.length; i++) {
          const nuovaBacheca = document.createElement("div");
          nuovaBacheca.innerHTML = `
                 <div class="section-bacheca__card">
                   <img src="./images/close.png" class="deleteIcon" id="deleteIcon"/>
                     <img
                       src="https://cdn.crispedge.com/4d91c6.png"
                     />
                     <h3 class="card-title" id="singleCard">${bachecheList[i].nomeBacheca}</h3>
                 </div>
                 `;
          deleteMainBacheca.appendChild(nuovaBacheca);
        }
      });
    });
  }
});

function createUser() {
  const nameInput = document.querySelector(".name-input1").value;
  const password = document.querySelector(".password-input2").value;
  const email = document.querySelector(".email-input").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: nameInput,
        photoURL:
          "https://mpng.subpng.com/20180224/uxe/kisspng-avatar-clip-art-blue-avatar-icon-5a91720f768551.3259122115194813594855.jpg",
      })
        .then(() => {
          // Profile updated!
          // ...
        })
        .catch((error) => {
          // An error occurred
          // ...
        });

      //aggiunge l'utente al database
      set(ref(db, "user/" + nameInput), {
        name: nameInput,
        email: email,
      })
        .then(() => {
          alert("utente creato con successo sul db");
        })
        .catch((error) => {
          alert("errore:" + error);
        });

      alert("Utente Registrato");
      const successMsg = document.querySelector(".successMessage");
      successMsg.innerHTML = "Registrazione Avvenuta con Successo";
      // ...
    })

    .catch((error) => {
      // Gestione errori nella registrzione
      const errorCode = error.code;
      const errorMessage = error.message;
      // const errorMsg = document.querySelector('.error')
      // errorMsg.innerHTML = "La password deve essere almeno di 6 caratteri"
      // ..
    });
}

window.addEventListener("DOMContentLoaded", () => {
  const registrati = document.querySelector(".registrati");
  const accedi = document.querySelector(".accedi");
  const signUpForm = document.querySelector(".sign-up");
  const signInForm = document.querySelector(".home-section-form");
  function showForms() {
    signInForm.classList.add("hidden");
    signUpForm.classList.add("is-showed");
  }

  registrati.addEventListener("click", (e) => {
    e.preventDefault();
    showForms();
  });

  const signUp = document.getElementById("register-form");
  signUp.addEventListener("submit", (e) => {
    e.preventDefault();
    setTimeout(function () {
      signInForm.classList.remove("hidden");
      signUpForm.classList.remove("is-showed");
    }, 3000);
    createUser();
  });
});
