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
    "title": "Brisa · system context",
    "locale": "en",
    "quality_profile": "showcase",
    "visual_preset": "blueprint",
    "legend": {
      "mode": "auto",
      "entries": {
        "backend": {
          "label": "System"
        }
      }
    }
  },
  "components": [
    {
      "id": "viajero",
      "type": "external",
      "label": "Traveler",
      "sublabel": "Searches and books",
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
      "sublabel": "Booking system",
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
      "label": "Payments",
      "sublabel": "External provider",
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
      "label": "Host",
      "sublabel": "Manages properties",
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
      "label": "Email",
      "sublabel": "External provider",
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
      "label": "Books",
      "variant": "emphasis"
    },
    {
      "id": "brisa-pagos",
      "from": "brisa",
      "to": "pagos",
      "label": "Authorizes",
      "variant": "default"
    },
    {
      "id": "anfitrion-brisa",
      "from": "anfitrion",
      "to": "brisa",
      "label": "Lists properties",
      "variant": "default"
    },
    {
      "id": "brisa-correo",
      "from": "brisa",
      "to": "correo",
      "label": "Sends confirmation",
      "variant": "dashed"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "C4 · level 1",
      "items": [
        "Brisa is shown as a black box.",
        "Payments and email are third-party services."
      ]
    },
    {
      "dot": "cyan",
      "title": "Fictional system",
      "items": [
        "These relationships describe the Brisa example.",
        "They do not represent real ArcShape services."
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
    "title": "Persistence contract",
    "locale": "en",
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
      "label": "ConfirmBooking",
      "kind": "class",
      "row": 0,
      "col": 0,
      "methods": [
        {
          "name": "execute",
          "parameters": "request",
          "returns": "Booking"
        }
      ]
    },
    {
      "id": "puerto",
      "label": "Bookings",
      "kind": "interface",
      "row": 0,
      "col": 1,
      "methods": [
        {
          "name": "save",
          "parameters": "booking",
          "returns": "void",
          "abstract": true
        }
      ]
    },
    {
      "id": "adaptador",
      "label": "PostgresBookings",
      "kind": "class",
      "row": 1,
      "col": 1,
      "methods": [
        {
          "name": "save",
          "parameters": "booking",
          "returns": "void"
        }
      ]
    },
    {
      "id": "reserva",
      "label": "Booking",
      "kind": "class",
      "row": 1,
      "col": 0,
      "attributes": [
        {
          "name": "id",
          "type": "UUID"
        },
        {
          "name": "status",
          "type": "Status"
        }
      ],
      "methods": [
        {
          "name": "confirm",
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
      "label": "Uses"
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
      "label": "Creates"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Selective detail",
      "items": [
        "The service depends on the persistence contract.",
        "Members unrelated to that decision are omitted."
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
    "title": "From bookings to statistics",
    "locale": "en",
    "quality_profile": "showcase",
    "visual_preset": "blueprint"
  },
  "stages": [
    {
      "label": "Source"
    },
    {
      "label": "Privacy"
    },
    {
      "label": "Storage"
    },
    {
      "label": "Consumption"
    }
  ],
  "nodes": [
    {
      "id": "outbox",
      "type": "database",
      "label": "Outbox",
      "sublabel": "Bookings",
      "stage": 0,
      "row": 0
    },
    {
      "id": "minimizar",
      "type": "security",
      "label": "Minimize",
      "sublabel": "Removes identity",
      "stage": 1,
      "row": 0
    },
    {
      "id": "metricas",
      "type": "database",
      "label": "Metrics",
      "sublabel": "By day and area",
      "stage": 2,
      "row": 0
    },
    {
      "id": "panel",
      "type": "frontend",
      "label": "Panel",
      "sublabel": "Occupancy",
      "stage": 3,
      "row": 0
    },
    {
      "id": "retencion",
      "type": "backend",
      "label": "Retention",
      "sublabel": "Deletes old data",
      "stage": 2,
      "row": 2
    }
  ],
  "flows": [
    {
      "id": "outbox-minimizar",
      "from": "outbox",
      "to": "minimizar",
      "label": "Events",
      "variant": "dashed"
    },
    {
      "id": "minimizar-metricas",
      "from": "minimizar",
      "to": "metricas",
      "label": "Aggregates",
      "variant": "security"
    },
    {
      "id": "metricas-panel",
      "from": "metricas",
      "to": "panel",
      "label": "Totals",
      "variant": "default"
    },
    {
      "id": "metricas-retencion",
      "from": "metricas",
      "to": "retencion",
      "label": "Expired data",
      "variant": "default"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Minimal data",
      "items": [
        "The dashboard receives totals, not names or email addresses.",
        "This flow is a fictional decision in the example."
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
    "title": "Brisa relational model",
    "locale": "en",
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
      "id": "traveler",
      "label": "traveler",
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
      "id": "booking",
      "label": "booking",
      "row": 0,
      "col": 1,
      "attributes": [
        {
          "name": "id",
          "type": "uuid",
          "key": "pk"
        },
        {
          "name": "traveler_id",
          "type": "uuid",
          "key": "fk",
          "references": "traveler.id"
        },
        {
          "name": "property_id",
          "type": "uuid",
          "key": "fk",
          "references": "property.id"
        },
        {
          "name": "check_in",
          "type": "date"
        },
        {
          "name": "check_out",
          "type": "date"
        },
        {
          "name": "status",
          "type": "varchar"
        }
      ]
    },
    {
      "id": "property",
      "label": "property",
      "row": 0,
      "col": 2,
      "attributes": [
        {
          "name": "id",
          "type": "uuid",
          "key": "pk"
        },
        {
          "name": "name",
          "type": "varchar"
        },
        {
          "name": "capacity",
          "type": "integer"
        }
      ]
    }
  ],
  "relationships": [
    {
      "id": "booking-traveler",
      "from": "booking",
      "to": "traveler",
      "label": "Traveler",
      "fromCardinality": "many",
      "toCardinality": "one"
    },
    {
      "id": "booking-property",
      "from": "booking",
      "to": "property",
      "label": "Stay",
      "fromCardinality": "many",
      "toCardinality": "one"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Reduced schema",
      "items": [
        "All columns of these three fictional tables are shown.",
        "The outbox and billing are outside this view."
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
    "title": "Booking lifecycle",
    "locale": "en",
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
      "label": "Requested"
    },
    {
      "id": "retenida",
      "type": "waiting",
      "label": "Held",
      "sublabel": "Awaiting authorization"
    },
    {
      "id": "confirmada",
      "type": "active",
      "label": "Confirmed"
    },
    {
      "id": "completada",
      "type": "success",
      "label": "Completed"
    },
    {
      "id": "caducada",
      "type": "neutral",
      "label": "Expired"
    },
    {
      "id": "cancelada",
      "type": "failure",
      "label": "Cancelled"
    }
  ],
  "transitions": [
    {
      "id": "solicitada-retenida",
      "from": "solicitada",
      "to": "retenida",
      "label": "Space available",
      "variant": "default"
    },
    {
      "id": "retenida-confirmada",
      "from": "retenida",
      "to": "confirmada",
      "label": "Authorized",
      "variant": "emphasis"
    },
    {
      "id": "confirmada-completada",
      "from": "confirmada",
      "to": "completada",
      "label": "Stay",
      "variant": "default"
    },
    {
      "id": "retenida-caducada",
      "from": "retenida",
      "to": "caducada",
      "label": "Hold expired",
      "variant": "default"
    },
    {
      "id": "confirmada-cancelada",
      "from": "confirmada",
      "to": "cancelada",
      "label": "Cancellation",
      "variant": "default"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Prepayment variant",
      "items": [
        "An expired hold releases the space.",
        "A confirmed booking may be cancelled under the fictional policy."
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
    "title": "Confirm a booking",
    "locale": "en",
    "quality_profile": "showcase",
    "visual_preset": "blueprint",
    "legend": {
      "mode": "auto",
      "entries": {
        "dashed": {
          "label": "Deferred work"
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
      "label": "Email"
    }
  ],
  "messages": [
    {
      "id": "request",
      "from": "portal",
      "to": "api",
      "y": 165,
      "label": "POST /bookings",
      "variant": "emphasis"
    },
    {
      "id": "save",
      "from": "api",
      "to": "db",
      "y": 215,
      "label": "Booking + outbox",
      "note": "One transaction"
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
      "label": "201 confirmed",
      "variant": "return"
    },
    {
      "id": "poll",
      "from": "worker",
      "to": "db",
      "y": 385,
      "label": "Reads pending",
      "variant": "dashed"
    },
    {
      "id": "event",
      "from": "db",
      "to": "worker",
      "y": 430,
      "label": "BookingConfirmed",
      "variant": "return"
    },
    {
      "id": "notify",
      "from": "worker",
      "to": "mail",
      "y": 480,
      "label": "Sends confirmation",
      "variant": "dashed"
    },
    {
      "id": "ack",
      "from": "mail",
      "to": "worker",
      "y": 525,
      "label": "Accepted",
      "variant": "return"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Response to traveler",
      "items": [
        "The 201 response follows the COMMIT.",
        "Email is delivered later, outside the request."
      ]
    },
    {
      "dot": "cyan",
      "title": "Example scope",
      "items": [
        "This booking does not require prepayment.",
        "The payment authorization path is not shown here."
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
    "title": "Fictional notification incident",
    "locale": "en",
    "quality_profile": "showcase",
    "visual_preset": "blueprint",
    "evidence": "illustrative",
    "timezone": "Europe/Madrid"
  },
  "lanes": [
    {
      "id": "sistema",
      "label": "System"
    },
    {
      "id": "equipo",
      "label": "Team"
    }
  ],
  "events": [
    {
      "id": "caida",
      "at": "2026-10-20T10:00:00+02:00",
      "title": "Email unavailable",
      "lane": "sistema",
      "kind": "alert"
    },
    {
      "id": "cola",
      "at": "2026-10-20T10:05:00+02:00",
      "title": "Outbox backlog grows",
      "lane": "sistema",
      "kind": "alert"
    },
    {
      "id": "revision",
      "at": "2026-10-20T10:10:00+02:00",
      "title": "Check provider",
      "lane": "equipo",
      "kind": "action"
    },
    {
      "id": "recuperacion",
      "at": "2026-10-20T10:20:00+02:00",
      "title": "Email service restored",
      "lane": "sistema",
      "kind": "recovery"
    },
    {
      "id": "drenado",
      "at": "2026-10-20T10:30:00+02:00",
      "title": "Backlog drained",
      "lane": "equipo",
      "kind": "recovery"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Illustrative data",
      "items": [
        "The timestamps are illustrative.",
        "The sequence shows delayed notifications, not lost bookings."
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
    "title": "Capability decomposition",
    "locale": "en",
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
      "label": "Catalog"
    },
    {
      "id": "reservas",
      "parent": "brisa",
      "label": "Bookings"
    },
    {
      "id": "operaciones",
      "parent": "brisa",
      "label": "Operations"
    },
    {
      "id": "buscar",
      "parent": "catalogo",
      "label": "Search"
    },
    {
      "id": "publicar",
      "parent": "catalogo",
      "label": "List property"
    },
    {
      "id": "confirmar",
      "parent": "reservas",
      "label": "Confirm"
    },
    {
      "id": "cancelar",
      "parent": "reservas",
      "label": "Cancel"
    },
    {
      "id": "notificar",
      "parent": "operaciones",
      "label": "Notify"
    },
    {
      "id": "observar",
      "parent": "operaciones",
      "label": "Monitor"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "How to read this tree",
      "items": [
        "Lines show ownership, not traffic.",
        "Each capability has exactly one parent."
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
    "title": "Request time budget",
    "locale": "en",
    "quality_profile": "showcase",
    "visual_preset": "blueprint",
    "evidence": "illustrative",
    "unit": "ms"
  },
  "spans": [
    {
      "id": "peticion",
      "name": "POST /bookings",
      "start": 0,
      "end": 320,
      "service": "API"
    },
    {
      "id": "identidad",
      "name": "Verify identity",
      "start": 0,
      "end": 35,
      "parent": "peticion",
      "service": "API"
    },
    {
      "id": "disponibilidad",
      "name": "Check availability",
      "start": 35,
      "end": 150,
      "parent": "peticion",
      "service": "PostgreSQL"
    },
    {
      "id": "precio",
      "name": "Calculate price",
      "start": 35,
      "end": 100,
      "parent": "peticion",
      "service": "API"
    },
    {
      "id": "transaccion",
      "name": "Booking + outbox",
      "start": 150,
      "end": 290,
      "parent": "peticion",
      "service": "PostgreSQL"
    },
    {
      "id": "respuesta",
      "name": "Prepare response",
      "start": 290,
      "end": 320,
      "parent": "peticion",
      "service": "API"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Illustrative timings",
      "items": [
        "These are not measurements or performance commitments.",
        "Price and availability are calculated in parallel."
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
    "title": "From request to confirmation",
    "locale": "en",
    "quality_profile": "showcase",
    "visual_preset": "blueprint",
    "legend": {
      "mode": "auto",
      "entries": {
        "frontend": {
          "label": "Interaction"
        },
        "backend": {
          "label": "Process"
        },
        "security": {
          "label": "Decision"
        },
        "database": {
          "label": "Persistence"
        }
      }
    }
  },
  "lanes": [
    {
      "id": "viajero",
      "label": "Traveler"
    },
    {
      "id": "reservas",
      "label": "Bookings"
    },
    {
      "id": "excepcion",
      "label": "No availability",
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
      "label": "Request",
      "sublabel": "Selected dates"
    },
    {
      "id": "validar",
      "lane": "reservas",
      "col": 1,
      "type": "security",
      "label": "Check",
      "sublabel": "Space available?"
    },
    {
      "id": "guardar",
      "lane": "reservas",
      "col": 2,
      "type": "database",
      "label": "Confirm",
      "sublabel": "Booking + outbox"
    },
    {
      "id": "confirmar",
      "lane": "viajero",
      "col": 3,
      "type": "frontend",
      "label": "View booking",
      "sublabel": "201 confirmed"
    },
    {
      "id": "rechazar",
      "lane": "excepcion",
      "col": 1,
      "type": "backend",
      "label": "Reject",
      "sublabel": "409 conflict"
    },
    {
      "id": "alternativa",
      "lane": "excepcion",
      "col": 3,
      "type": "frontend",
      "label": "Other dates",
      "sublabel": "New request"
    }
  ],
  "edges": [
    {
      "id": "solicitar-validar",
      "from": "solicitar",
      "to": "validar",
      "label": "Checks",
      "variant": "default"
    },
    {
      "id": "validar-guardar",
      "from": "validar",
      "to": "guardar",
      "label": "Available",
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
      "label": "Unavailable",
      "variant": "security",
      "role": "error"
    },
    {
      "id": "rechazar-alternativa",
      "from": "rechazar",
      "to": "alternativa",
      "label": "Suggests",
      "variant": "default",
      "role": "branch"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "Two outcomes",
      "items": [
        "The initial check does not replace the database constraint.",
        "A concurrent conflict also returns 409."
      ]
    }
  ]
}
```
