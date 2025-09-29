const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const app = express();
app.use(cors());

// Initializar Firebase
app.use(express.json());
const serviceAccount = require("./firebase-key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Rutas
const db = admin.firestore();

app.get("/", (req, res) => {
    res.send("Servidor corriendo Firebase");
});

// ========== CLIENTES (CÓDIGO ORIGINAL - SIN CAMBIOS) ==========
app.get("/clientes/ver", async (req, res) => {
    try {
        const items = await db.collection("clientes").get();
        const usuarios = items.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                nombre: data.nombre,
                email: data.email,
                telefono: data.telefono
            };
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/cliente/add", async (req, res) => {
    try {
        const { nombre, email, telefono } = req.body;
        const docRef = await db.collection("clientes").add({ nombre, email, telefono });
        res.json({ id: docRef.id, message: "cliente agregado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/cliente/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await db.collection("clientes").doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        const data = doc.data();
        res.json({
            id: doc.id,
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/cliente/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, telefono } = req.body;

        const docRef = db.collection("clientes").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        await docRef.update({
            nombre,
            email,
            telefono,
            fechaActualizacion: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ message: "Cliente actualizado correctamente", id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/cliente/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("clientes").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        await docRef.delete();
        res.json({ message: "Cliente eliminado correctamente", id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========== DETALLEVENTAS ==========
app.get("/detalleventas/ver", async (req, res) => {
    try {
        const items = await db.collection("DetalleVentas").get();
        const detalleVentas = items.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                Precio: data.Precio,
                Producto: data.Producto,
                Vendido_el: data.Vendido_el,
                Cantidad: data.cantidad
            };
        });
        res.json(detalleVentas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/detalleventa/add", async (req, res) => {
    try {
        const { Precio, Producto, Vendido_el, cantidad } = req.body;
        const docRef = await db.collection("DetalleVentas").add({ 
            Precio, 
            Producto, 
            Vendido_el, 
            Cantidad
        });
        res.json({ id: docRef.id, message: "detalle venta agregado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/detalleventa/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await db.collection("DetalleVentas").doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Detalle venta no encontrado" });
        }

        const data = doc.data();
        res.json({
            id: doc.id,
            Precio: data.Precio,
            Producto: data.Producto,
            Vendido_el: data.Vendido_el,
            Cantidad: data.cantidad
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/detalleventa/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { Precio, Producto, Vendido_el, cantidad } = req.body;

        const docRef = db.collection("DetalleVentas").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Detalle venta no encontrado" });
        }

        await docRef.update({
            Precio,
            Producto,
            Vendido_el,
            Cantidad,
            fechaActualizacion: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ message: "Detalle venta actualizado correctamente", id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/detalleventa/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("DetalleVentas").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Detalle venta no encontrado" });
        }

        await docRef.delete();
        res.json({ message: "Detalle venta eliminado correctamente", id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========== PRODUCTOS ==========
app.get("/productos/ver", async (req, res) => {
    try {
        const items = await db.collection("productos").get();
        const productos = items.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                categoria: data.categoria,
                nombre: data.nombre,
                existencia: data.existencia,
                precio: data.precio
            };
        });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/producto/add", async (req, res) => {
    try {
        const { categoria, nombre, existencia, precio } = req.body;
        const docRef = await db.collection("productos").add({ 
            categoria, 
            nombre, 
            existencia, 
            precio 
        });
        res.json({ id: docRef.id, message: "producto agregado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/producto/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await db.collection("productos").doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const data = doc.data();
        res.json({
            id: doc.id,
            categoria: data.categoria,
            nombre: data.nombre,
            existencia: data.existencia,
            precio: data.precio
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/producto/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { categoria, nombre, existencia, precio } = req.body;

        const docRef = db.collection("productos").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await docRef.update({
            categoria,
            nombre,
            existencia,
            precio,
            fechaActualizacion: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ message: "Producto actualizado correctamente", id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/producto/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("productos").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await docRef.delete();
        res.json({ message: "Producto eliminado correctamente", id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========== VENTAS ==========
app.get("/ventas/ver", async (req, res) => {
    try {
        const items = await db.collection("ventas").get();
        const ventas = items.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                cliente: data.cliente,
                fecha: data.fecha,
                total: data.total
            };
        });
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/venta/add", async (req, res) => {
    try {
        const { cliente, fecha, total } = req.body;
        const docRef = await db.collection("ventas").add({ 
            cliente, 
            fecha, 
            total 
        });
        res.json({ id: docRef.id, message: "venta agregada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/venta/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await db.collection("ventas").doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Venta no encontrada" });
        }

        const data = doc.data();
        res.json({
            id: doc.id,
            cliente: data.cliente,
            fecha: data.fecha,
            total: data.total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/venta/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { cliente, fecha, total } = req.body;

        const docRef = db.collection("ventas").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Venta no encontrada" });
        }

        await docRef.update({
            cliente,
            fecha,
            total,
            fechaActualizacion: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ message: "Venta actualizada correctamente", id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/venta/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = db.collection("ventas").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Venta no encontrada" });
        }

        await docRef.delete();
        res.json({ message: "Venta eliminada correctamente", id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Conexión al servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));