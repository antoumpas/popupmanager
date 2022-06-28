const initialData = [
  {
    content: "<div><h1>Delay Popup</h1></div>",
    title: "Delay popup",
    since: null,
    frequency: {
      value: 1,
      type: "days", // days | weeks | months
    },
    triggers: [
      {
        type: "delay",
        options: {
          seconds: 30,
        },
      },
    ],
  },
  {
    content: "<div><h1>Scroll Popup</h1></div>",
    title: "Scroll Popup",
    since: null,
    frequency: {
      value: 1,
      type: "days", // days | weeks | months
    },
    triggers: [
      {
        type: "scroll",
        options: {
          percentage: 50,
        },
      },
    ],
  },
  {
    content: "<div><h1>Exit intent Popup</h1></div>",
    title: "Exit intent Popup",
    since: null,
    frequency: {
      value: 1,
      type: "days", // days | weeks | months
    },
    triggers: [
      {
        type: "exit-intent",
        options: {},
      },
    ],
  },
];

const dbName = "popup_manager";
const storeName = "popups";

export const dbPromise = new Promise((resolve, reject) => {
  let db;
  const request = indexedDB.open(dbName, 1);
  request.onerror = (event) => {
    reject(event);
  };
  request.onsuccess = (event) => {
    db = event.target.result;
    resolve(db);
  };
  request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore(storeName, {
      keyPath: "key",
      autoIncrement: true,
    });
    objectStore.createIndex("content", "content", { unique: false });
    objectStore.createIndex("title", "title", { unique: false });
    objectStore.createIndex("since", "since", { unique: false });
    objectStore.createIndex("frequency", "frequency", { unique: false });
    objectStore.createIndex("triggers", "triggers", { unique: false });

    objectStore.transaction.oncomplete = () => {
      // Store values in the newly created objectStore.
      const popupObjectStore = db
        .transaction(storeName, "readwrite")
        .objectStore(storeName);
      initialData.forEach(function (popup) {
        popupObjectStore.add(popup);
      });
    };
  };
});

export const getAllPopups = (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const objectStore = transaction.objectStore(storeName);
    objectStore.getAll().onsuccess = (event) => {
      resolve(event.target.result);
    };
    objectStore.getAll().onerror = (event) => {
      reject(event);
    };
  });
};

export const updatePopup = (db, popup) => {
  return new Promise((resolve, reject) => {
    const objectStore = db
      .transaction([storeName], "readwrite")
      .objectStore(storeName);
    const requestUpdate = objectStore.put(popup);
    requestUpdate.onerror = (event) => {
      reject(event);
    };
    requestUpdate.onsuccess = (event) => {
      resolve(event);
    };
  });
};

export const createPopup = (db, popup) => {
  return new Promise((resolve, reject) => {
    const objectStore = db
      .transaction([storeName], "readwrite")
      .objectStore(storeName);
    const requestCreate = objectStore.add(popup);
    requestCreate.onerror = (event) => {
      reject(event);
    };
    requestCreate.onsuccess = (event) => {
      resolve(event);
    };
  });
};

export const deletePopup = (db, popup) => {
  return new Promise((resolve, reject) => {
    const objectStore = db
      .transaction([storeName], "readwrite")
      .objectStore(storeName);
    const deleteRequest = objectStore.delete(popup.key);
    deleteRequest.onerror = (event) => {
      reject(event);
    };
    deleteRequest.onsuccess = (event) => {
      resolve(event);
    };
  });
};
