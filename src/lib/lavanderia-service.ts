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
  getDoc,
  getDocs,
  where
} from "firebase/firestore";
import { db } from "./firebase";

// Tipos
export interface ServicioLavanderia {
  id?: string;
  nombre: string;
  precio: number;
  tipo: 'lavado' | 'secado' | 'completo' | 'otros';
  descripcion: string;
  createdAt: Timestamp;
}

export interface AlquilerLavanderia {
  id?: string;
  cliente: string;
  servicioId: string;
  nombreServicio: string;
  precio: number;
  fechaEntrada: Timestamp;
  fechaRecibida?: Timestamp;
  recepcionAutomatica?: boolean;
  maquinaId?: string;
  // Compatibilidad temporal con datos antiguos
  estado?: 'pendiente' | 'en_proceso' | 'listo' | 'entregado';
}

export interface Maquina {
  id?: string;
  nombre: string;
  tipo: 'lavadora' | 'secadora';
  estado: 'disponible' | 'ocupada' | 'mantenimiento';
  ultimaRevision: Timestamp;
}

export interface GastoLavanderia {
  id?: string;
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: Timestamp;
}

// --- SERVICIOS ---

export const subscribeServiciosLavanderia = (callback: (servicios: ServicioLavanderia[]) => void) => {
  const q = query(collection(db, "lavanderia_servicios"), orderBy("nombre", "asc"));
  return onSnapshot(q, (snapshot) => {
    const servicios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ServicioLavanderia[];
    callback(servicios);
  }, (error) => {
    console.error("[Nítido] Error en suscripción de servicios lavandería:", error);
  });
};

export const agregarServicioLavanderia = async (servicio: Omit<ServicioLavanderia, "id" | "createdAt">) => {
  return addDoc(collection(db, "lavanderia_servicios"), {
    ...servicio,
    createdAt: Timestamp.now()
  });
};

export const eliminarServicioLavanderia = async (id: string) => {
  return deleteDoc(doc(db, "lavanderia_servicios", id));
};

export const actualizarServicioLavanderia = async (id: string, servicio: Partial<ServicioLavanderia>) => {
  return updateDoc(doc(db, "lavanderia_servicios", id), servicio);
};

// --- PEDIDOS ---

export const subscribeAlquileresLavanderia = (callback: (alquileres: AlquilerLavanderia[]) => void) => {
  const q = query(collection(db, "lavanderia_pedidos"), orderBy("fechaEntrada", "desc"));
  return onSnapshot(q, (snapshot) => {
    const alquileres = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AlquilerLavanderia[];

    void autoRecibirAlquileresVencidos(alquileres);
    callback(alquileres);
  }, (error) => {
    console.error("[Nítido] Error en suscripción de pedidos lavandería:", error);
  });
};

export const registrarAlquiler = async (alquiler: Omit<AlquilerLavanderia, "id" | "fechaEntrada" | "fechaRecibida" | "recepcionAutomatica" | "estado">) => {
  const tieneMaquina = alquiler.maquinaId && alquiler.maquinaId.length > 0;

  // Registrar el pedido y cobrar al instante en finanzas por fechaEntrada
  const alquilerRef = await addDoc(collection(db, "lavanderia_pedidos"), {
    ...alquiler,
    fechaEntrada: Timestamp.now()
  });

  // Si se asignó una máquina, marcarla como ocupada
  if (tieneMaquina) {
    await actualizarEstadoMaquina(alquiler.maquinaId!, 'ocupada');
  }

  return alquilerRef;
};

export const marcarAlquilerRecibido = async (id: string, maquinaId?: string, automatico = false) => {
  const ref = doc(db, "lavanderia_pedidos", id);
  const alquilerSnap = await getDoc(ref);
  if (!alquilerSnap.exists()) return;

  const alquilerData = alquilerSnap.data() as AlquilerLavanderia;
  if (alquilerData.fechaRecibida) return;

  await updateDoc(ref, {
    fechaRecibida: Timestamp.now(),
    recepcionAutomatica: automatico
  });

  const maquinaAsignada = maquinaId || alquilerData.maquinaId;
  if (maquinaAsignada) {
    await actualizarEstadoMaquina(maquinaAsignada, 'disponible');
  }
};

const autoRecibirAlquileresVencidos = async (alquileres: AlquilerLavanderia[]) => {
  const ahora = Date.now();
  const veinticuatroHorasMs = 24 * 60 * 60 * 1000;

  const alquileresVencidos = alquileres.filter((alquiler) => {
    if (!alquiler.id || alquiler.fechaRecibida || !alquiler.fechaEntrada) return false;
    const fechaEntradaMs = alquiler.fechaEntrada.toDate().getTime();
    return ahora - fechaEntradaMs >= veinticuatroHorasMs;
  });

  if (alquileresVencidos.length === 0) return;

  await Promise.all(
    alquileresVencidos.map((alquiler) =>
      marcarAlquilerRecibido(alquiler.id!, alquiler.maquinaId, true).catch((error) => {
        console.error("[Nítido] Error en auto-recepción de alquiler:", error);
      })
    )
  );
};

export const actualizarEstadoPedido = async (id: string, nuevoEstado: AlquilerLavanderia['estado'], maquinaId?: string) => {
  if (nuevoEstado === 'entregado') {
    await marcarAlquilerRecibido(id, maquinaId, false);
    return;
  }

  // Mantener compatibilidad para datos antiguos mientras se simplifica la UI
  const ref = doc(db, "lavanderia_pedidos", id);
  await updateDoc(ref, { estado: nuevoEstado });
};

export const eliminarAlquiler = async (id: string) => {
  // Leer el pedido antes de eliminarlo para liberar la máquina si aplica
  const pedidoRef = doc(db, "lavanderia_pedidos", id);
  const pedidoSnap = await getDoc(pedidoRef);

  if (pedidoSnap.exists()) {
    const pedidoData = pedidoSnap.data() as AlquilerLavanderia;
    // Si tenía máquina y aún no fue recibido, liberar máquina al eliminar
    if (pedidoData.maquinaId && !pedidoData.fechaRecibida) {
      await actualizarEstadoMaquina(pedidoData.maquinaId, 'disponible');
    }
  }

  return deleteDoc(pedidoRef);
};


// --- MÁQUINAS ---

export const subscribeMaquinas = (callback: (maquinas: Maquina[]) => void) => {
  const q = query(collection(db, "lavanderia_maquinas"), orderBy("nombre", "asc"));
  return onSnapshot(q, (snapshot) => {
    const maquinas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Maquina[];
    callback(maquinas);
  }, (error) => {
    console.error("[Nítido] Error en suscripción de máquinas lavandería:", error);
  });
};

export const actualizarEstadoMaquina = async (id: string, nuevoEstado: Maquina['estado']) => {
  const ref = doc(db, "lavanderia_maquinas", id);
  return updateDoc(ref, { estado: nuevoEstado });
};

export const agregarMaquina = async (maquina: Omit<Maquina, "id" | "ultimaRevision">) => {
  return addDoc(collection(db, "lavanderia_maquinas"), {
    ...maquina,
    ultimaRevision: Timestamp.now()
  });
};

export const eliminarMaquina = async (id: string) => {
  // Limpiar referencia de maquinaId en pedidos activos que referencian esta máquina
  const pedidosQuery = query(
    collection(db, "lavanderia_pedidos"),
    where("maquinaId", "==", id)
  );
  const pedidosSnap = await getDocs(pedidosQuery);

  const actualizaciones = pedidosSnap.docs.map(pedidoDoc => {
    return updateDoc(doc(db, "lavanderia_pedidos", pedidoDoc.id), {
      maquinaId: ""
    });
  });
  await Promise.all(actualizaciones);

  return deleteDoc(doc(db, "lavanderia_maquinas", id));
};

// --- FINANZAS / GASTOS ---

export const subscribeGastosLavanderia = (callback: (gastos: GastoLavanderia[]) => void) => {
  const q = query(collection(db, "lavanderia_gastos"), orderBy("fecha", "desc"));
  return onSnapshot(q, (snapshot) => {
    const gastos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GastoLavanderia[];
    callback(gastos);
  }, (error) => {
    console.error("[Nítido] Error en suscripción de gastos lavandería:", error);
  });
};

export const registrarGastoLavanderia = async (gasto: Omit<GastoLavanderia, "id" | "fecha">) => {
  return addDoc(collection(db, "lavanderia_gastos"), {
    ...gasto,
    fecha: Timestamp.now()
  });
};

export const eliminarGastoLavanderia = async (id: string) => {
  return deleteDoc(doc(db, "lavanderia_gastos", id));
};
