import { 
  collection, 
  addDoc, 
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'compras_dolares';

export interface CompraDolares {
  id?: string;
  aQuien: string;
  cantidad: number;
  tasa: number;
  fecha: Timestamp;
}

export const registrarCompraDolares = async (datos: Omit<CompraDolares, 'id' | 'fecha'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...datos,
      fecha: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al registrar la compra de dólares: ", error);
    throw error;
  }
};

export const eliminarCompraDolares = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error al eliminar la compra de dólares: ", error);
    throw error;
  }
};

export const subscribeComprasDolares = (callback: (data: CompraDolares[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('fecha', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const compras: CompraDolares[] = [];
    snapshot.forEach((doc) => {
      compras.push({ id: doc.id, ...doc.data() } as CompraDolares);
    });
    callback(compras);
  }, (error) => {
    console.error("Error subscribiéndose a compras de dólares:", error);
  });
};
