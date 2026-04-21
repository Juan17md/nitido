import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp,
  getDoc
} from "firebase/firestore";
import { db } from "./firebase";

// Tipos
export interface Servicio {
  id?: string;
  nombre: string;
  precio: number;
  descripcion: string;
  createdAt: Timestamp;
}

export interface HistorialServicio {
  id?: string;
  servicioId: string;
  nombreServicio: string;
  cliente: string;
  precio: number;
  fecha: Timestamp;
}

export interface Producto {
  id?: string;
  nombre: string;
  stock: number;
  unidad: string;
  status: 'ok' | 'low';
  minStock?: number;
}

export interface Gasto {
  id?: string;
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: Timestamp;
}

// --- SERVICIOS ---

export const subscribeServicios = (callback: (servicios: Servicio[]) => void) => {
  const q = query(collection(db, "barberia_servicios"), orderBy("nombre", "asc"));
  return onSnapshot(q, (snapshot) => {
    const servicios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Servicio[];
    callback(servicios);
  }, (error) => {
    console.error("[Nítido] Error en suscripción de servicios barbería:", error);
  });
};

export const agregarServicio = async (servicio: Omit<Servicio, "id" | "createdAt">) => {
  return addDoc(collection(db, "barberia_servicios"), {
    ...servicio,
    createdAt: Timestamp.now()
  });
};

export const eliminarServicio = async (id: string) => {
  return deleteDoc(doc(db, "barberia_servicios", id));
};

export const actualizarServicio = async (id: string, servicio: Partial<Servicio>) => {
  return updateDoc(doc(db, "barberia_servicios", id), servicio);
};

// --- HISTORIAL ---

export const subscribeHistorial = (callback: (historial: HistorialServicio[]) => void) => {
  const q = query(collection(db, "barberia_historial"), orderBy("fecha", "desc"));
  return onSnapshot(q, (snapshot) => {
    const historial = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HistorialServicio[];
    callback(historial);
  }, (error) => {
    console.error("[Nítido] Error en suscripción de historial barbería:", error);
  });
};

export const registrarVenta = async (venta: Omit<HistorialServicio, "id" | "fecha">) => {
  return addDoc(collection(db, "barberia_historial"), {
    ...venta,
    fecha: Timestamp.now()
  });
};

export const eliminarVenta = async (id: string) => {
  return deleteDoc(doc(db, "barberia_historial", id));
};

export const actualizarVenta = async (id: string, venta: Partial<HistorialServicio>) => {
  return updateDoc(doc(db, "barberia_historial", id), venta);
};

// --- INVENTARIO ---

export const subscribeInventario = (callback: (productos: Producto[]) => void) => {
  const q = query(collection(db, "barberia_inventario"), orderBy("nombre", "asc"));
  return onSnapshot(q, (snapshot) => {
    const productos = snapshot.docs.map(doc => {
      const data = doc.data();
      const stock = data.stock ?? 0;
      const minStock = data.minStock ?? 0;
      // Auto-calcular status basado en stock vs minStock
      const status: 'ok' | 'low' = (minStock > 0 && stock <= minStock) ? 'low' : 'ok';
      return {
        id: doc.id,
        ...data,
        status
      };
    }) as Producto[];
    callback(productos);
  }, (error) => {
    console.error("[Nítido] Error en suscripción de inventario barbería:", error);
  });
};

export const ajustarStock = async (id: string, cantidad: number) => {
  const ref = doc(db, "barberia_inventario", id);
  // Leer stock actual para evitar valores negativos
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const stockActual = snap.data().stock ?? 0;
  const nuevoStock = Math.max(0, stockActual + cantidad);
  return updateDoc(ref, {
    stock: nuevoStock
  });
};

export const agregarProducto = async (producto: Omit<Producto, "id">) => {
  return addDoc(collection(db, "barberia_inventario"), producto);
};

export const actualizarProducto = async (id: string, producto: Partial<Producto>) => {
  return updateDoc(doc(db, "barberia_inventario", id), producto);
};

export const eliminarProducto = async (id: string) => {
  return deleteDoc(doc(db, "barberia_inventario", id));
};

// --- FINANZAS / GASTOS ---

export const subscribeGastos = (callback: (gastos: Gasto[]) => void) => {
  const q = query(collection(db, "barberia_gastos"), orderBy("fecha", "desc"));
  return onSnapshot(q, (snapshot) => {
    const gastos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Gasto[];
    callback(gastos);
  }, (error) => {
    console.error("[Nítido] Error en suscripción de gastos barbería:", error);
  });
};

export const registrarGasto = async (gasto: Omit<Gasto, "id" | "fecha">) => {
  return addDoc(collection(db, "barberia_gastos"), {
    ...gasto,
    fecha: Timestamp.now()
  });
};

export const eliminarGasto = async (id: string) => {
  return deleteDoc(doc(db, "barberia_gastos", id));
};
