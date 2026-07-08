const request = require('supertest');
const express = require('express');

const { obtenerObjetivos } = require('../controllers/action/objectives');
const actionRoutes = require('../routes/actionRoutes');

// ── Pruebas unitarias del controlador (req/res simulados) ──
describe('obtenerObjetivos (unitarias)', () => {

    // Crea un res falso que registra lo que el controlador le envía
    const crearResFalso = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    test('responde con status 200', async () => {
        const req = {};
        const res = crearResFalso();

        await obtenerObjetivos(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('devuelve un array de objetivos', async () => {
        const req = {};
        const res = crearResFalso();

        await obtenerObjetivos(req, res);

        const objetivos = res.json.mock.calls[0][0];
        console.log(objetivos);
        expect(Array.isArray(objetivos)).toBe(true);
        expect(objetivos.length).toBeGreaterThan(0);
    });

    test('cada objetivo tiene los campos de la tabla', async () => {
        const req = {};
        const res = crearResFalso();

        await obtenerObjetivos(req, res);

        const objetivos = res.json.mock.calls[0][0];
        objetivos.forEach((obj) => {
            expect(obj).toEqual(
                expect.objectContaining({
                    objetivo: expect.any(String),
                    descripcion: expect.any(String),
                    valorMensualAhorrar: expect.any(Number),
                    implementado: expect.any(Boolean)
                })
            );
            // En el Excel pueden venir como número o como texto (ej. "Analizar")
            expect(['string', 'number']).toContain(typeof obj.plazoAnios);
            expect(['string', 'number']).toContain(typeof obj.valorObjetivo);
        });
    });
});

// ── Pruebas de integración de la ruta (HTTP real con supertest) ──
describe('GET /api/action/objetivos (integración)', () => {

    const app = express();
    app.use(express.json());
    app.use('/api/action', actionRoutes);

    test('responde 200 con JSON', async () => {
        const respuesta = await request(app).get('/api/action/objetivos');

        expect(respuesta.status).toBe(200);
        expect(respuesta.headers['content-type']).toMatch(/json/);
    });

    test('devuelve el array con los campos esperados', async () => {
        const respuesta = await request(app).get('/api/action/objetivos');

        expect(Array.isArray(respuesta.body)).toBe(true);
        expect(respuesta.body[0]).toHaveProperty('objetivo');
        expect(respuesta.body[0]).toHaveProperty('descripcion');
        expect(respuesta.body[0]).toHaveProperty('plazoAnios');
        expect(respuesta.body[0]).toHaveProperty('valorObjetivo');
        expect(respuesta.body[0]).toHaveProperty('valorMensualAhorrar');
    });

    test('una ruta inexistente responde 404', async () => {
        const respuesta = await request(app).get('/api/action/noexiste');

        expect(respuesta.status).toBe(404);
    });
});
