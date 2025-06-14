// import { openDB } from 'idb';

// const dbPromise = openDB('my-db', 1, {
//   upgrade(db) {
//     db.createObjectStore('userStore', { keyPath: 'id' });
//   },
// });

// export const saveUser = async (user) => {
//   const db = await dbPromise;
//   await db.put('userStore', user);
// };

// export const getUser = async (id) => {
//   const db = await dbPromise;
//   return await db.get('userStore', id);
// };

// export const deleteUser = async (id) => {
//   const db = await dbPromise;
//   await db.delete('userStore', id);
// };
