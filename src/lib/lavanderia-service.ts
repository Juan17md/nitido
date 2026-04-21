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

export interface PedidoLavanderia {
  id?: string;
  cliente: string;
  servicioId: string;
  nombreServicio: string;
  precio: number;
  estado: 'pendiente' | 'en_proceso' | 'listo' | 'entregado';
  fechaEntrada: Timestamp;
  fechaEntregaEstimada?: Timestamp;
  maquinaId?: string;
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

export const subscribePedidosLavanderia = (callback: (pedidos: PedidoLavanderia[]) => void) => {
  const q = query(collection(db, "lavanderia_pedidos"), orderBy("fechaEntrada", "desc"));
  return onSnapshot(q, (snapshot) => {
    const pedidos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PedidoLavanderia[];
    callback(pedidos);
  }, (error) => {
    console.error("[Nítido] Error en suscripción de pedidos lavandería:", error);
  });
};

export const registrarPedido = async (pedido: Omit<PedidoLavanderia, "id" | "fechaEntrada" | "estado">) => {
  const tieneMaquina = pedido.maquinaId && pedido.maquinaId.length > 0;

  // Registrar el pedido con estado condicional
  const pedidoRef = await addDoc(collection(db, "lavanderia_pedidos"), {
    ...pedido,
    estado: tieneMaquina ? 'en_proceso' : 'pendiente',
    fechaEntrada: Timestamp.now()
  });

  // Si se asignó una máquina, marcarla como ocupada
  if (tieneMaquina) {
    await actualizarEstadoMaquina(pedido.maquinaId!, 'ocupada');
  }

  return pedidoRef;
};

export const actualizarEstadoPedido = async (id: string, nuevoEstado: PedidoLavanderia['estado'], maquinaId?: string) => {
  const ref = doc(db, "lavanderia_pedidos", id);
  await updateDoc(ref, { estado: nuevoEstado });

  // Si el pedido se marca como entregado y tenía una máquina asignada, liberarla
  if (nuevoEstado === 'entregado' && maquinaId) {
    await actualizarEstadoMaquina(maquinaId, 'disponible');
  }
};

export const eliminarPedido = async (id: string) => {
  // Leer el pedido antes de eliminarlo para liberar la máquina si aplica
  const pedidoRef = doc(db, "lavanderia_pedidos", id);
  const pedidoSnap = await getDoc(pedidoRef);

  if (pedidoSnap.exists()) {
    const pedidoData = pedidoSnap.data() as PedidoLavanderia;
    // Si el pedido tenía una máquina asignada y no estaba entregado, liberar la máquina
    if (pedidoData.maquinaId && pedidoData.estado !== 'entregado') {
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
