import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import { db, isFirebaseReady } from "./firebase";
import {
  CATEGORY_COLOR_OPTIONS,
  DEFAULT_CATEGORIES,
  DEFAULT_ITEMS,
  generateId,
  getRandomColor,
} from "./constants";

const initialModalState = {
  isOpen: false,
  title: "",
  placeholder: "",
  value: "",
  onConfirm: null,
  isDelete: false,
  deleteText: "",
  color: "",
  colorOptions: [],
};

function buildFirebaseError(message, code = "firebase/not-configured") {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function useTripPackerApp() {
  const [firebaseError, setFirebaseError] = useState(() =>
    !isFirebaseReady || !db
      ? buildFirebaseError("Faltan variables de entorno de Firebase. Revisa tu archivo .env.local.")
      : null,
  );
  const [syncState, setSyncState] = useState("synced");
  const [syncErrorMsg, setSyncErrorMsg] = useState("");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(Boolean(db));
  const [view, setView] = useState("home");
  const [activeTripId, setActiveTripId] = useState(null);
  const [modal, setModal] = useState(initialModalState);
  const getCollectionRef = (collectionName) => collection(db, collectionName);
  const getDocumentRef = (collectionName, id) => doc(db, collectionName, id);

  useEffect(() => {
    if (!isFirebaseReady || !db) {
      setFirebaseError(
        buildFirebaseError("Faltan variables de entorno de Firebase. Revisa tu archivo .env.local."),
      );
      return undefined;
    }

    setFirebaseError(null);

    let isFirstCategoryLoad = true;
    let categoriesLoaded = false;
    let itemsLoaded = false;
    let tripsLoaded = false;
    const markLoaded = () => {
      if (categoriesLoaded && itemsLoaded && tripsLoaded) {
        setLoading(false);
      }
    };

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
          return;
        }

        isFirstCategoryLoad = false;
        setCategories(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
        categoriesLoaded = true;
        markLoaded();
      },
      (error) => {
        console.error(error);
        setSyncState("error");
        setSyncErrorMsg("Error de lectura en Firestore. Revisa las reglas de seguridad.");
        categoriesLoaded = true;
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
        itemsLoaded = true;
        markLoaded();
      },
      (error) => {
        console.error(error);
        setSyncState("error");
        setSyncErrorMsg("No se pudieron cargar los items.");
        itemsLoaded = true;
        setLoading(false);
      },
    );

    const unsubscribeTrips = onSnapshot(
      getCollectionRef("trips"),
      (snapshot) => {
        setTrips(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
        tripsLoaded = true;
        markLoaded();
      },
      (error) => {
        console.error(error);
        setSyncState("error");
        setSyncErrorMsg("No se pudieron cargar los viajes.");
        tripsLoaded = true;
        setLoading(false);
      },
    );

    return () => {
      unsubscribeCategories();
      unsubscribeItems();
      unsubscribeTrips();
    };
  }, []);

  const openInputModal = (title, placeholder, initialValue, onConfirm) => {
    setModal({
      isOpen: true,
      title,
      placeholder,
      value: initialValue,
      onConfirm,
      isDelete: false,
      deleteText: "",
      color: "",
      colorOptions: [],
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
      color: "",
      colorOptions: [],
    });
  };

  const openCategoryModal = (title, initialValue, initialColor, onConfirm) => {
    setModal({
      isOpen: true,
      title,
      placeholder: "Nombre",
      value: initialValue,
      onConfirm,
      isDelete: false,
      deleteText: "",
      color: initialColor,
      colorOptions: CATEGORY_COLOR_OPTIONS,
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
      openCategoryModal("Nueva categoria", "", getRandomColor(), (name, color) => {
        runWithSync(() =>
          setDoc(getDocumentRef("categories", generateId()), {
            name,
            color,
          }),
        );
      });
    },
    editCategory: (category) => {
      openCategoryModal("Editar categoria", category.name, category.color, (name, color) => {
        runWithSync(() =>
          updateDoc(getDocumentRef("categories", category.id), {
            name,
            color,
          }),
        );
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
            type: "item",
          });
        });
      });
    },
    addSeparator: (categoryId) => {
      openInputModal("Nuevo separador", "Ej: Documentos importantes", "", (name) => {
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
            type: "separator",
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
    exportJson: () => {
      const exportData = {
        exportedAt: new Date().toISOString(),
        categories,
        items,
        trips,
      };
      const fileName = `trip-packer-export-${new Date().toISOString().slice(0, 10)}.json`;
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = fileName;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    },
  };

  return {
    actions,
    activeTripId,
    firebaseError,
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
    view,
  };
}
