import { useCallback, useEffect, useState } from "react";
import { signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import {
  appId,
  auth,
  db,
  firebaseReadyPromise,
  isCanvasEnvironment,
  isFirebaseReady,
} from "./firebase";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_ITEMS,
  generateId,
  getRandomColor,
} from "./tripPackerData";

const initialModalState = {
  isOpen: false,
  title: "",
  placeholder: "",
  value: "",
  onConfirm: null,
  isDelete: false,
  deleteText: "",
};

function buildFirebaseError(message, code = "firebase/not-configured") {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function useTripPackerApp() {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(() =>
    !isFirebaseReady || !auth
      ? buildFirebaseError(
          "Faltan variables de entorno de Firebase. Revisa tu archivo .env.local.",
        )
      : null,
  );
  const [syncState, setSyncState] = useState("synced");
  const [syncErrorMsg, setSyncErrorMsg] = useState("");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(isFirebaseReady && Boolean(auth));
  const [view, setView] = useState("home");
  const [activeTripId, setActiveTripId] = useState(null);
  const [modal, setModal] = useState(initialModalState);

  useEffect(() => {
    if (!isFirebaseReady || !auth) {
      return undefined;
    }

    let isMounted = true;

    const initAuth = async () => {
      try {
        await firebaseReadyPromise;

        if (
          isCanvasEnvironment &&
          typeof globalThis.__initial_auth_token !== "undefined" &&
          globalThis.__initial_auth_token
        ) {
          await signInWithCustomToken(auth, globalThis.__initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        if (isMounted) {
          setAuthError(error);
          setLoading(false);
        }
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      if (!isMounted) {
        return;
      }

      setUser(nextUser);

      if (!nextUser) {
        setLoading(true);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const getCollectionRef = useCallback((collectionName) => {
    if (isCanvasEnvironment) {
      return collection(db, "artifacts", appId, "users", user.uid, collectionName);
    }

    return collection(db, "users", user.uid, collectionName);
  }, [user]);

  const getDocumentRef = useCallback((collectionName, id) => {
    if (isCanvasEnvironment) {
      return doc(db, "artifacts", appId, "users", user.uid, collectionName, id);
    }

    return doc(db, "users", user.uid, collectionName, id);
  }, [user]);

  useEffect(() => {
    if (!user || !db) {
      return undefined;
    }

    let isFirstCategoryLoad = true;

    const unsubscribeCategories = onSnapshot(
      getCollectionRef("categories"),
      async (snapshot) => {
        if (snapshot.empty && isFirstCategoryLoad) {
          const batch = writeBatch(db);

          DEFAULT_CATEGORIES.forEach((category) => {
            batch.set(getDocumentRef("categories", category.id), category);
          });

          DEFAULT_ITEMS.forEach((item) => {
            batch.set(getDocumentRef("items", item.id), item);
          });

          await batch.commit();
        }

        isFirstCategoryLoad = false;
        setCategories(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
      },
      (error) => {
        console.error(error);
        setSyncState("error");
        setSyncErrorMsg("Error de lectura en Firestore. Revisa las reglas de seguridad.");
        setLoading(false);
      },
    );

    const unsubscribeItems = onSnapshot(
      getCollectionRef("items"),
      (snapshot) => {
        const sortedItems = snapshot.docs
          .map((entry) => ({ id: entry.id, ...entry.data() }))
          .sort((first, second) => (first.order || 0) - (second.order || 0));

        setItems(sortedItems);
      },
      (error) => {
        console.error(error);
        setSyncState("error");
        setSyncErrorMsg("No se pudieron cargar los items.");
      },
    );

    const unsubscribeTrips = onSnapshot(
      getCollectionRef("trips"),
      (snapshot) => {
        setTrips(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setSyncState("error");
        setSyncErrorMsg("No se pudieron cargar los viajes.");
        setLoading(false);
      },
    );

    return () => {
      unsubscribeCategories();
      unsubscribeItems();
      unsubscribeTrips();
    };
  }, [user, getCollectionRef, getDocumentRef]);

  const openInputModal = (title, placeholder, initialValue, onConfirm) => {
    setModal({
      isOpen: true,
      title,
      placeholder,
      value: initialValue,
      onConfirm,
      isDelete: false,
      deleteText: "",
    });
  };

  const openConfirmModal = (title, deleteText, onConfirm) => {
    setModal({
      isOpen: true,
      title,
      placeholder: "",
      value: "",
      onConfirm,
      isDelete: true,
      deleteText,
    });
  };

  const closeModal = () => {
    setModal(initialModalState);
  };

  const runWithSync = async (operation) => {
    setSyncState("syncing");
    setSyncErrorMsg("");

    try {
      await operation();
      setSyncState("synced");
    } catch (error) {
      console.error("Firebase Sync Error:", error);
      setSyncState("error");
      setSyncErrorMsg(error.message);
    }
  };

  const actions = {
    addCategory: () => {
      openInputModal("Nueva categoria", "Ej: Playa", "", (name) => {
        runWithSync(() =>
          setDoc(getDocumentRef("categories", generateId()), {
            name,
            color: getRandomColor(),
          }),
        );
      });
    },
    editCategory: (category) => {
      openInputModal("Editar categoria", "Nombre", category.name, (name) => {
        runWithSync(() => updateDoc(getDocumentRef("categories", category.id), { name }));
      });
    },
    deleteCategory: (category) => {
      openConfirmModal(
        "Eliminar categoria",
        `Se borrara "${category.name}" y todos los items que contiene.`,
        () => {
          runWithSync(async () => {
            const batch = writeBatch(db);
            const itemsToDelete = items
              .filter((item) => item.categoryId === category.id)
              .map((item) => item.id);

            batch.delete(getDocumentRef("categories", category.id));
            itemsToDelete.forEach((itemId) => {
              batch.delete(getDocumentRef("items", itemId));
            });

            trips.forEach((trip) => {
              const newSelectedItems = trip.selectedItems.filter(
                (itemId) => !itemsToDelete.includes(itemId),
              );
              const newPackedItems = trip.packedItems.filter(
                (itemId) => !itemsToDelete.includes(itemId),
              );

              if (newSelectedItems.length !== trip.selectedItems.length) {
                batch.update(getDocumentRef("trips", trip.id), {
                  selectedItems: newSelectedItems,
                  packedItems: newPackedItems,
                });
              }
            });

            await batch.commit();
          });
        },
      );
    },
    addItem: (categoryId) => {
      openInputModal("Nuevo item", "Ej: Gafas de sol", "", (name) => {
        runWithSync(async () => {
          const categoryItems = items.filter((item) => item.categoryId === categoryId);
          const nextOrder =
            categoryItems.length > 0
              ? Math.max(...categoryItems.map((item) => item.order || 0)) + 1
              : 1;

          await setDoc(getDocumentRef("items", generateId()), {
            categoryId,
            name,
            order: nextOrder,
          });
        });
      });
    },
    editItem: (item) => {
      openInputModal("Editar item", "Nombre", item.name, (name) => {
        runWithSync(() => updateDoc(getDocumentRef("items", item.id), { name }));
      });
    },
    deleteItem: (item) => {
      openConfirmModal("Eliminar item", `Se borrara "${item.name}" definitivamente.`, () => {
        runWithSync(async () => {
          const batch = writeBatch(db);
          batch.delete(getDocumentRef("items", item.id));

          trips.forEach((trip) => {
            if (!trip.selectedItems.includes(item.id)) {
              return;
            }

            batch.update(getDocumentRef("trips", trip.id), {
              selectedItems: trip.selectedItems.filter((itemId) => itemId !== item.id),
              packedItems: trip.packedItems.filter((itemId) => itemId !== item.id),
            });
          });

          await batch.commit();
        });
      });
    },
    moveItem: (item, direction) => {
      runWithSync(async () => {
        const categoryItems = items.filter((entry) => entry.categoryId === item.categoryId);
        const index = categoryItems.findIndex((entry) => entry.id === item.id);

        if (direction === "up" && index > 0) {
          const previousItem = categoryItems[index - 1];
          const batch = writeBatch(db);

          batch.update(getDocumentRef("items", item.id), { order: previousItem.order });
          batch.update(getDocumentRef("items", previousItem.id), { order: item.order });
          await batch.commit();
        }

        if (direction === "down" && index < categoryItems.length - 1) {
          const nextItem = categoryItems[index + 1];
          const batch = writeBatch(db);

          batch.update(getDocumentRef("items", item.id), { order: nextItem.order });
          batch.update(getDocumentRef("items", nextItem.id), { order: item.order });
          await batch.commit();
        }
      });
    },
    saveTrip: (draftTrip) => {
      runWithSync(async () => {
        await setDoc(getDocumentRef("trips", draftTrip.id), {
          name: draftTrip.name,
          selectedItems: draftTrip.selectedItems,
          packedItems: draftTrip.packedItems,
        });

        setView("home");
      });
    },
    deleteTrip: (tripId) => {
      openConfirmModal(
        "Eliminar viaje",
        "Se perdera toda la informacion de este viaje.",
        () => {
          runWithSync(async () => {
            await deleteDoc(getDocumentRef("trips", tripId));
            setView("home");
          });
        },
      );
    },
    togglePacked: (tripId, itemId, currentPackedItems) => {
      runWithSync(async () => {
        const nextPackedItems = currentPackedItems.includes(itemId)
          ? currentPackedItems.filter((packedItemId) => packedItemId !== itemId)
          : [...currentPackedItems, itemId];

        await updateDoc(getDocumentRef("trips", tripId), {
          packedItems: nextPackedItems,
        });
      });
    },
  };

  return {
    actions,
    activeTripId,
    authError,
    categories,
    closeModal,
    items,
    loading,
    modal,
    setActiveTripId,
    setModal,
    setView,
    syncErrorMsg,
    syncState,
    trips,
    user,
    view,
  };
}
