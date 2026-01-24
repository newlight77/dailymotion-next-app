import { useLocalStorage } from "@/core/core-lib/shared/useLocalStorage";
import { useState } from "react";

type Storage = {
  uid: string,
  keywords?: string,
  title?: string,
  owner?: string,
  order?: number,
}

export type UseStorageType = typeof useStorage;

export function useStorage<S extends Storage>(key: string, defaultValue: S[]):
  {
    item: S | undefined,
    items: S[] | undefined,
    remove: (uid: string) => void,
    addOrUpdate: (value: S) => void,
    loadData: (data: S[]) => void,
    reset: () => void,
    clear: () => void,
  } {

  const [item, setItem] = useState<S>();
  const [items, setItems] = useLocalStorage<S[]>(key, defaultValue);

  function isSame(a: S, b: S): boolean {
    if (a.uid && b.uid && a.uid === b.uid) return true;
    if (a.keywords && b.keywords && a.keywords === b.keywords) return true;
    if (a.title && b.title && a.title === b.title) return true;
    if (a.owner && b.owner && a.owner === b.owner) return true;
    return false
  }

  const loadData = (data: S[]) => {
    if (data) {
      try {
        const newItems = data.reduce<S[]>((acc, curr) => acc.some(item => isSame(item, curr)) ? acc : [...acc, curr], []);
        setItems(newItems);
      } catch (error) {
        // display error later
        alert(`there is an error with the json you try to load : ${error}`);
      }
    }
  };

  const remove = (uid: string) => {
    if (items) {
      const updatedItems = items.filter(f => f.uid !== uid);
      setItems(updatedItems);
    }
  }

  const addOrUpdate = (item: S) => {
    // console.log('useStorage before addOrUpdate', items)

    if (item && items) {
      const found = items.find(f => isSame(f, item));
      if (found) {
        const updatedItem = {...found, ...item, uid: found.uid ? found.uid : crypto.randomUUID().toString()};
        // let updatedItems = data.filter(f => !isSame(f, item));
        const updatedItems = [updatedItem, ...items]
          // dedup to remove former item
          .reduce<S[]>((acc, curr) => acc.some(item => isSame(item, curr)) ? acc : [...acc, curr], [])
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        insertAtAndShiftAllItemsOrder(found.order!, updatedItem);
        setItems(updatedItems);
      } else {
        const newItem: S = { ...item, uid: item.uid ? item.uid : crypto.randomUUID().toString() }
        const updatedItems = [newItem, ...items]
          // dedup
          .reduce<S[]>((acc, curr) => acc.some(item => isSame(item, curr)) ? acc : [...acc, curr], [])
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        insertAtAndShiftAllItemsOrder(updatedItems.length, newItem);
        setItems(updatedItems);
        setItem(newItem);
      }
    }
  }

  const shiftItems = (originalOrder: number, changed: S, current: S) => {
      if (changed.order !== undefined && changed.order < originalOrder) {
          if (changed.order <= current.order! && current.order !== undefined && current.order <= originalOrder) {
              current.order += 1;
          }
      }
      if (changed.order !== undefined && changed.order > originalOrder) {
          if (changed.order >= current.order! && current.order !== undefined && current.order >= originalOrder) {
              current.order -= 1;
          }
      }
  }

  const insertAtAndShiftAllItemsOrder = (originalOrder: number, changed?: S) => {
      if (changed && items && changed.order !== undefined) {
          const sortedItems = items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          // Adjust the order of all items that have an order greater than the new order
          sortedItems.forEach(f => {
              shiftItems(originalOrder, changed, f);
          });

          const updatedItems = sortedItems
          .map(f => {
              if (f.uid === changed.uid) {
                return { ...f, order: changed.order };
              }
              return f;
          })
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setItems(updatedItems);
      }
  }

  function clear(): void {
    setItems([]);
  }

  function reset(): void {
    setItems(defaultValue);
  }

  return {item, items, remove, addOrUpdate, loadData, reset, clear};
};