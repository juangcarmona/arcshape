---
title: Native diagram family gallery
description: Fictional examples used to inspect the supported diagram families.
---

# Native diagram family gallery

These examples describe the fictional Brisa reservation system, not ArcShape services. They demonstrate renderer coverage, not universal Mermaid compatibility. Canonical ArcShape diagrams remain in their owning sections.

## architecture

```archify
{
  "schema_version": 1,
  "diagram_type": "architecture",
  "meta": {
    "title": "Brisa · contexto del sistema",
    "locale": "es",
    "quality_profile": "showcase",
    "visual_preset": "blueprint",
    "legend": {
      "mode": "auto",
      "entries": {
        "backend": {
          "label": "Sistema"
        }
      }
    }
  },
  "components": [
    {
      "id": "viajero",
      "type": "external",
      "label": "Viajero",
      "sublabel": "Busca y reserva",
      "pos": [
        40,
        60
      ],
      "size": [
        170,
        72
      ]
    },
    {
      "id": "brisa",
      "type": "backend",
      "label": "Brisa",
      "sublabel": "Sistema de reservas",
      "pos": [
        360,
        60
      ],
      "size": [
        170,
        72
      ]
    },
    {
      "id": "pagos",
      "type": "external",
      "label": "Pagos",
      "sublabel": "Proveedor externo",
      "pos": [
        700,
        60
      ],
      "size": [
        170,
        72
      ]
    },
    {
      "id": "anfitrion",
      "type": "external",
      "label": "Anfitrión",
      "sublabel": "Gestiona alojamientos",
      "pos": [
        40,
        300
      ],
      "size": [
        170,
        72
      ]
    },
    {
      "id": "correo",
      "type": "external",
      "label": "Correo",
      "sublabel": "Proveedor externo",
      "pos": [
        360,
        300
      ],
      "size": [
        170,
        72
      ]
    }
  ],
  "connections": [
    {
      "id": "viajero-brisa",
      "from": "viajero",
      "to": "brisa",
      "label": "Reserva",
      "variant": "emphasis"
    },
    {
      "id": "brisa-pagos",
      "from": "brisa",
      "to": "pagos",
      "label": "Autoriza",
      "variant": "default"
    },
    {
      "id": "anfitrion-brisa",
      "from": "anfitrion",
      "to": "brisa",
      "label": "Publica",
      "variant": "default"
    },
    {
      "id": "brisa-correo",
      "from": "brisa",
      "to": "correo",
      "label": "Confirma",
      "variant": "dashed"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "C4 · nivel 1",
      "items": [
        "Brisa se muestra como una caja negra.",
        "Pagos y correo pertenecen a terceros."
      ]
    },
    {
      "dot": "cyan",
      "title": "Sistema ficticio",
      "items": [
        "Las relaciones describen el ejemplo Brisa.",
        "No representan servicios reales de ArcShape."
      ]
    }
  ]
}
```

## class

```archify
{
  "schema_version": 1,
  "diagram_type": "class",
  "meta": {
    "title": "Contrato de persistencia",
    "locale": "es",
    "quality_profile": "showcase",
    "visual_preset": "blueprint"
  },
  "layout": {
    "mode": "grid",
    "gapX": 110,
    "gapY": 100
  },
  "types": [
    {
      "id": "servicio",
      "label": "ConfirmarReserva",
      "kind": "class",
      "row": 0,
      "col": 0,
      "methods": [
        {
          "name": "ejecutar",
          "parameters": "solicitud",
          "returns": "Reserva"
        }
      ]
    },
    {
      "id": "puerto",
      "label": "Reservas",
      "kind": "interface",
      "row": 0,
      "col": 1,
      "methods": [
        {
          "name": "guardar",
          "parameters": "reserva",
          "returns": "void",
          "abstract": true
        }
      ]
    },
    {
      "id": "adaptador",
      "label": "ReservasPostgres",
      "kind": "class",
      "row": 1,
      "col": 1,
      "methods": [
        {
          "name": "guardar",
          "parameters": "reserva",
          "returns": "void"
        }
      ]
    },
    {
      "id": "reserva",
      "label": "Reserva",
      "kind": "class",
      "row": 1,
      "col": 0,
      "attributes": [
        {
          "name": "id",
          "type": "UUID"
        },
        {
          "name": "estado",
          "type": "Estado"
        }
      ],
      "methods": [
        {
          "name": "confirmar",
          "returns": "void"
        }
      ]
    }
  ],
  "relationships": [
    {
      "id": "usa",
      "from": "servicio",
      "to": "puerto",
      "kind": "dependency",
      "label": "Usa"
    },
    {
      "id": "implementa",
      "from": "adaptador",
      "to": "puerto",
      "kind": "realization"
    },
    {
      "id": "crea",
      "from": "servicio",
      "to": "reserva",
      "kind": "dependency",
      "label": "Crea"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Detalle selectivo",
      "items": [
        "El servicio depende del contrato de persistencia.",
        "Se omiten miembros que no explican esa decisión."
      ]
    }
  ]
}
```

## dataflow

```archify
{
  "schema_version": 1,
  "diagram_type": "dataflow",
  "meta": {
    "title": "De reservas a estadísticas",
    "locale": "es",
    "quality_profile": "showcase",
    "visual_preset": "blueprint"
  },
  "stages": [
    {
      "label": "Origen"
    },
    {
      "label": "Privacidad"
    },
    {
      "label": "Almacén"
    },
    {
      "label": "Consumo"
    }
  ],
  "nodes": [
    {
      "id": "outbox",
      "type": "database",
      "label": "Outbox",
      "sublabel": "Reservas",
      "stage": 0,
      "row": 0
    },
    {
      "id": "minimizar",
      "type": "security",
      "label": "Minimizar",
      "sublabel": "Quita identidad",
      "stage": 1,
      "row": 0
    },
    {
      "id": "metricas",
      "type": "database",
      "label": "Métricas",
      "sublabel": "Por día y zona",
      "stage": 2,
      "row": 0
    },
    {
      "id": "panel",
      "type": "frontend",
      "label": "Panel",
      "sublabel": "Ocupación",
      "stage": 3,
      "row": 0
    },
    {
      "id": "retencion",
      "type": "backend",
      "label": "Retención",
      "sublabel": "Borra antiguos",
      "stage": 2,
      "row": 2
    }
  ],
  "flows": [
    {
      "id": "outbox-minimizar",
      "from": "outbox",
      "to": "minimizar",
      "label": "Eventos",
      "variant": "dashed"
    },
    {
      "id": "minimizar-metricas",
      "from": "minimizar",
      "to": "metricas",
      "label": "Agregados",
      "variant": "security"
    },
    {
      "id": "metricas-panel",
      "from": "metricas",
      "to": "panel",
      "label": "Totales",
      "variant": "default"
    },
    {
      "id": "metricas-retencion",
      "from": "metricas",
      "to": "retencion",
      "label": "Caducados",
      "variant": "default"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Datos mínimos",
      "items": [
        "El panel recibe totales, no nombres ni correos.",
        "El flujo es una decisión ficticia del ejemplo."
      ]
    }
  ]
}
```

## erd

```archify
{
  "schema_version": 1,
  "diagram_type": "erd",
  "meta": {
    "title": "Modelo relacional de Brisa",
    "locale": "es",
    "quality_profile": "showcase",
    "visual_preset": "blueprint"
  },
  "layout": {
    "mode": "grid",
    "gapX": 100,
    "gapY": 70,
    "entityW": 240
  },
  "entities": [
    {
      "id": "viajero",
      "label": "viajero",
      "row": 0,
      "col": 0,
      "attributes": [
        {
          "name": "id",
          "type": "uuid",
          "key": "pk"
        },
        {
          "name": "email",
          "type": "varchar",
          "key": "uk"
        }
      ]
    },
    {
      "id": "reserva",
      "label": "reserva",
      "row": 0,
      "col": 1,
      "attributes": [
        {
          "name": "id",
          "type": "uuid",
          "key": "pk"
        },
        {
          "name": "viajero_id",
          "type": "uuid",
          "key": "fk",
          "references": "viajero.id"
        },
        {
          "name": "alojamiento_id",
          "type": "uuid",
          "key": "fk",
          "references": "alojamiento.id"
        },
        {
          "name": "entrada",
          "type": "date"
        },
        {
          "name": "salida",
          "type": "date"
        },
        {
          "name": "estado",
          "type": "varchar"
        }
      ]
    },
    {
      "id": "alojamiento",
      "label": "alojamiento",
      "row": 0,
      "col": 2,
      "attributes": [
        {
          "name": "id",
          "type": "uuid",
          "key": "pk"
        },
        {
          "name": "nombre",
          "type": "varchar"
        },
        {
          "name": "capacidad",
          "type": "integer"
        }
      ]
    }
  ],
  "relationships": [
    {
      "id": "reserva-viajero",
      "from": "reserva",
      "to": "viajero",
      "label": "Titular",
      "fromCardinality": "many",
      "toCardinality": "one"
    },
    {
      "id": "reserva-alojamiento",
      "from": "reserva",
      "to": "alojamiento",
      "label": "Estancia",
      "fromCardinality": "many",
      "toCardinality": "one"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Esquema reducido",
      "items": [
        "Se muestran todas las columnas de estas tres tablas ficticias.",
        "El outbox y la facturación quedan fuera de esta vista."
      ]
    }
  ]
}
```

## lifecycle

```archify
{
  "schema_version": 3,
  "diagram_type": "lifecycle",
  "meta": {
    "title": "Ciclo de vida de una reserva",
    "locale": "es",
    "quality_profile": "showcase",
    "visual_preset": "blueprint"
  },
  "mainPath": [
    "solicitada",
    "retenida",
    "confirmada",
    "completada"
  ],
  "states": [
    {
      "id": "solicitada",
      "type": "start",
      "label": "Solicitada"
    },
    {
      "id": "retenida",
      "type": "waiting",
      "label": "Retenida",
      "sublabel": "Espera autorización"
    },
    {
      "id": "confirmada",
      "type": "active",
      "label": "Confirmada"
    },
    {
      "id": "completada",
      "type": "success",
      "label": "Completada"
    },
    {
      "id": "caducada",
      "type": "neutral",
      "label": "Caducada"
    },
    {
      "id": "cancelada",
      "type": "failure",
      "label": "Cancelada"
    }
  ],
  "transitions": [
    {
      "id": "solicitada-retenida",
      "from": "solicitada",
      "to": "retenida",
      "label": "Hay plazas",
      "variant": "default"
    },
    {
      "id": "retenida-confirmada",
      "from": "retenida",
      "to": "confirmada",
      "label": "Autorizada",
      "variant": "emphasis"
    },
    {
      "id": "confirmada-completada",
      "from": "confirmada",
      "to": "completada",
      "label": "Estancia",
      "variant": "default"
    },
    {
      "id": "retenida-caducada",
      "from": "retenida",
      "to": "caducada",
      "label": "Plazo agotado",
      "variant": "default"
    },
    {
      "id": "confirmada-cancelada",
      "from": "confirmada",
      "to": "cancelada",
      "label": "Cancelación",
      "variant": "default"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Variante con pago previo",
      "items": [
        "La retención libera plazas al caducar.",
        "Una reserva confirmada puede cancelarse según la política ficticia."
      ]
    }
  ]
}
```

## sequence

```archify
{
  "schema_version": 1,
  "diagram_type": "sequence",
  "meta": {
    "title": "Confirmar una reserva",
    "locale": "es",
    "quality_profile": "showcase",
    "visual_preset": "blueprint",
    "legend": {
      "mode": "auto",
      "entries": {
        "dashed": {
          "label": "Trabajo diferido"
        }
      }
    }
  },
  "participants": [
    {
      "id": "portal",
      "type": "frontend",
      "label": "Portal"
    },
    {
      "id": "api",
      "type": "backend",
      "label": "API"
    },
    {
      "id": "db",
      "type": "database",
      "label": "PostgreSQL"
    },
    {
      "id": "worker",
      "type": "backend",
      "label": "Worker"
    },
    {
      "id": "mail",
      "type": "external",
      "label": "Correo"
    }
  ],
  "messages": [
    {
      "id": "request",
      "from": "portal",
      "to": "api",
      "y": 165,
      "label": "POST /reservas",
      "variant": "emphasis"
    },
    {
      "id": "save",
      "from": "api",
      "to": "db",
      "y": 215,
      "label": "Reserva + outbox",
      "note": "Una sola transacción"
    },
    {
      "id": "commit",
      "from": "db",
      "to": "api",
      "y": 280,
      "label": "COMMIT",
      "variant": "return"
    },
    {
      "id": "response",
      "from": "api",
      "to": "portal",
      "y": 325,
      "label": "201 confirmada",
      "variant": "return"
    },
    {
      "id": "poll",
      "from": "worker",
      "to": "db",
      "y": 385,
      "label": "Lee pendientes",
      "variant": "dashed"
    },
    {
      "id": "event",
      "from": "db",
      "to": "worker",
      "y": 430,
      "label": "ReservaConfirmada",
      "variant": "return"
    },
    {
      "id": "notify",
      "from": "worker",
      "to": "mail",
      "y": 480,
      "label": "Envía confirmación",
      "variant": "dashed"
    },
    {
      "id": "ack",
      "from": "mail",
      "to": "worker",
      "y": 525,
      "label": "Aceptado",
      "variant": "return"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Respuesta al viajero",
      "items": [
        "El 201 sigue al COMMIT.",
        "El correo se entrega después, fuera de la petición."
      ]
    },
    {
      "dot": "cyan",
      "title": "Alcance del ejemplo",
      "items": [
        "Se muestra una reserva sin pago previo.",
        "La rama de autorización de pago no se representa aquí."
      ]
    }
  ]
}
```

## timeline

```archify
{
  "schema_version": 1,
  "diagram_type": "timeline",
  "meta": {
    "title": "Incidente ficticio de notificaciones",
    "locale": "es",
    "quality_profile": "showcase",
    "visual_preset": "blueprint",
    "evidence": "illustrative",
    "timezone": "Europe/Madrid"
  },
  "lanes": [
    {
      "id": "sistema",
      "label": "Sistema"
    },
    {
      "id": "equipo",
      "label": "Equipo"
    }
  ],
  "events": [
    {
      "id": "caida",
      "at": "2026-10-20T10:00:00+02:00",
      "title": "Correo caído",
      "lane": "sistema",
      "kind": "alert"
    },
    {
      "id": "cola",
      "at": "2026-10-20T10:05:00+02:00",
      "title": "Outbox crece",
      "lane": "sistema",
      "kind": "alert"
    },
    {
      "id": "revision",
      "at": "2026-10-20T10:10:00+02:00",
      "title": "Revisar proveedor",
      "lane": "equipo",
      "kind": "action"
    },
    {
      "id": "recuperacion",
      "at": "2026-10-20T10:20:00+02:00",
      "title": "Correo recuperado",
      "lane": "sistema",
      "kind": "recovery"
    },
    {
      "id": "drenado",
      "at": "2026-10-20T10:30:00+02:00",
      "title": "Cola drenada",
      "lane": "equipo",
      "kind": "recovery"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Datos inventados",
      "items": [
        "Los horarios son ilustrativos.",
        "La secuencia muestra retraso en avisos, no pérdida de reservas."
      ]
    }
  ]
}
```

## tree

```archify
{
  "schema_version": 1,
  "diagram_type": "tree",
  "meta": {
    "title": "Descomposición por capacidades",
    "locale": "es",
    "quality_profile": "showcase",
    "visual_preset": "blueprint"
  },
  "nodes": [
    {
      "id": "brisa",
      "label": "Brisa"
    },
    {
      "id": "catalogo",
      "parent": "brisa",
      "label": "Catálogo"
    },
    {
      "id": "reservas",
      "parent": "brisa",
      "label": "Reservas"
    },
    {
      "id": "operaciones",
      "parent": "brisa",
      "label": "Operaciones"
    },
    {
      "id": "buscar",
      "parent": "catalogo",
      "label": "Buscar"
    },
    {
      "id": "publicar",
      "parent": "catalogo",
      "label": "Publicar"
    },
    {
      "id": "confirmar",
      "parent": "reservas",
      "label": "Confirmar"
    },
    {
      "id": "cancelar",
      "parent": "reservas",
      "label": "Cancelar"
    },
    {
      "id": "notificar",
      "parent": "operaciones",
      "label": "Notificar"
    },
    {
      "id": "observar",
      "parent": "operaciones",
      "label": "Observar"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Cómo leer este árbol",
      "items": [
        "Las líneas significan pertenencia, no tráfico.",
        "Cada capacidad tiene exactamente un padre."
      ]
    }
  ]
}
```

## waterfall

```archify
{
  "schema_version": 1,
  "diagram_type": "waterfall",
  "meta": {
    "title": "Presupuesto de una petición",
    "locale": "es",
    "quality_profile": "showcase",
    "visual_preset": "blueprint",
    "evidence": "illustrative",
    "unit": "ms"
  },
  "spans": [
    {
      "id": "peticion",
      "name": "POST /reservas",
      "start": 0,
      "end": 320,
      "service": "API"
    },
    {
      "id": "identidad",
      "name": "Verificar identidad",
      "start": 0,
      "end": 35,
      "parent": "peticion",
      "service": "API"
    },
    {
      "id": "disponibilidad",
      "name": "Consultar fechas",
      "start": 35,
      "end": 150,
      "parent": "peticion",
      "service": "PostgreSQL"
    },
    {
      "id": "precio",
      "name": "Calcular precio",
      "start": 35,
      "end": 100,
      "parent": "peticion",
      "service": "API"
    },
    {
      "id": "transaccion",
      "name": "Reserva + outbox",
      "start": 150,
      "end": 290,
      "parent": "peticion",
      "service": "PostgreSQL"
    },
    {
      "id": "respuesta",
      "name": "Preparar respuesta",
      "start": 290,
      "end": 320,
      "parent": "peticion",
      "service": "API"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Tiempos ilustrativos",
      "items": [
        "No son mediciones ni compromisos de rendimiento.",
        "Precio y disponibilidad se consultan en paralelo."
      ]
    }
  ]
}
```

## workflow

```archify
{
  "schema_version": 2,
  "diagram_type": "workflow",
  "meta": {
    "title": "De la solicitud a la confirmación",
    "locale": "es",
    "quality_profile": "showcase",
    "visual_preset": "blueprint",
    "legend": {
      "mode": "auto",
      "entries": {
        "frontend": {
          "label": "Interacción"
        },
        "backend": {
          "label": "Proceso"
        },
        "security": {
          "label": "Decisión"
        },
        "database": {
          "label": "Persistencia"
        }
      }
    }
  },
  "lanes": [
    {
      "id": "viajero",
      "label": "Viajero"
    },
    {
      "id": "reservas",
      "label": "Reservas"
    },
    {
      "id": "excepcion",
      "label": "Sin disponibilidad",
      "variant": "exception"
    }
  ],
  "mainPath": [
    "solicitar",
    "validar",
    "guardar",
    "confirmar"
  ],
  "nodes": [
    {
      "id": "solicitar",
      "lane": "viajero",
      "col": 0,
      "type": "frontend",
      "label": "Solicitar",
      "sublabel": "Fechas elegidas"
    },
    {
      "id": "validar",
      "lane": "reservas",
      "col": 1,
      "type": "security",
      "label": "Validar",
      "sublabel": "¿Hay plazas?"
    },
    {
      "id": "guardar",
      "lane": "reservas",
      "col": 2,
      "type": "database",
      "label": "Confirmar",
      "sublabel": "Reserva + outbox"
    },
    {
      "id": "confirmar",
      "lane": "viajero",
      "col": 3,
      "type": "frontend",
      "label": "Ver reserva",
      "sublabel": "201 confirmada"
    },
    {
      "id": "rechazar",
      "lane": "excepcion",
      "col": 1,
      "type": "backend",
      "label": "Rechazar",
      "sublabel": "409 conflicto"
    },
    {
      "id": "alternativa",
      "lane": "excepcion",
      "col": 3,
      "type": "frontend",
      "label": "Otras fechas",
      "sublabel": "Nueva solicitud"
    }
  ],
  "edges": [
    {
      "id": "solicitar-validar",
      "from": "solicitar",
      "to": "validar",
      "label": "Consulta",
      "variant": "default"
    },
    {
      "id": "validar-guardar",
      "from": "validar",
      "to": "guardar",
      "label": "Disponible",
      "variant": "emphasis"
    },
    {
      "id": "guardar-confirmar",
      "from": "guardar",
      "to": "confirmar",
      "label": "COMMIT",
      "variant": "default"
    },
    {
      "id": "validar-rechazar",
      "from": "validar",
      "to": "rechazar",
      "label": "Ocupado",
      "variant": "security",
      "role": "error"
    },
    {
      "id": "rechazar-alternativa",
      "from": "rechazar",
      "to": "alternativa",
      "label": "Propone",
      "variant": "default",
      "role": "branch"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Dos resultados",
      "items": [
        "La validación inicial no sustituye la restricción de la base de datos.",
        "Un conflicto concurrente también termina en 409."
      ]
    }
  ]
}
```
