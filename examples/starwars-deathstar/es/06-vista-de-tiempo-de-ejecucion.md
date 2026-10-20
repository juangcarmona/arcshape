---
title: "Vista de tiempo de ejecución"
arc42-section: "06"
description: "Comportamiento e interacciones en tres escenarios de la Estrella de la Muerte."
---

## Escenarios clave

### Secuencia de destrucción planetaria

El Mando Imperial ordena disparar el sistema de armas. Comando y Control solicita energía al reactor, el reactor la canaliza al superláser y el arma apunta al planeta designado. El sistema de enfriamiento supervisa la energía y puede pedir que se reduzca la salida del reactor.

```mermaid
accTitle: Secuencia de destrucción planetaria - vista de ejecución de la Estrella de la Muerte
sequenceDiagram
    actor MandoImperial as Mando Imperial
    participant ComandoControl as Comando y Control
    participant Reactor as Núcleo del Reactor
    participant Superlaser as Sistema de Superláser
    participant Enfriamiento as Sistema de Enfriamiento
    participant Planeta as Planeta objetivo
    MandoImperial->>ComandoControl: Ordenar destrucción planetaria
    ComandoControl->>Reactor: Solicitar energía máxima
    Reactor->>Superlaser: Canalizar energía
    Reactor-->>Enfriamiento: Informar niveles de energía
    Enfriamiento-->>Reactor: Regular salida si hay sobrecalentamiento
    Superlaser->>Planeta: Disparar al objetivo designado
    alt Sobrecalentamiento detectado
        Enfriamiento->>ComandoControl: Avisar de riesgo de sobrecalentamiento
        ComandoControl->>Reactor: Reducir salida de energía
    end
```

### Detección y respuesta ante intrusos

Las Matrices de Sensores informan de una presencia no autorizada. Comando y Control envía una escuadra de asalto. Si falla el envío automático, el sistema de alarmas solicita una respuesta manual y despliega unidades de respaldo.

```mermaid
accTitle: Detección y respuesta ante intrusos - vista de ejecución de la Estrella de la Muerte
sequenceDiagram
    participant Sensores as Matrices de Sensores
    participant ComandoControl as Comando y Control
    participant Alarmas as Sistema de Alarmas
    participant Escuadra as Escuadra de asalto
    Sensores->>ComandoControl: Informar presencia no autorizada
    ComandoControl->>Escuadra: Enviar escuadra a la ubicación
    alt Falla el envío automático
        Sensores->>Alarmas: Activar alarma
        Alarmas->>ComandoControl: Solicitar respuesta manual
        ComandoControl->>Escuadra: Desplegar unidades de respaldo
    end
```

### Activación del hiperimpulsor y navegación

Control de Navegación solicita una reubicación. Comando y Control pide al Núcleo del Reactor que suministre energía al hiperimpulsor. Navegación calcula entonces la ruta hiperespacial; si falla el cálculo, se inician protocolos de respaldo y la energía del reactor vuelve a los sistemas principales.

```mermaid
accTitle: Activación del hiperimpulsor y navegación - vista de ejecución de la Estrella de la Muerte
sequenceDiagram
    participant Navegacion as Control de Navegación
    participant ComandoControl as Comando y Control
    participant Reactor as Núcleo del Reactor
    participant Hiperimpulsor as Sistema de Hiperimpulsor
    Navegacion->>ComandoControl: Solicitar reubicación
    ComandoControl->>Reactor: Redirigir energía al hiperimpulsor
    Reactor->>Hiperimpulsor: Suministrar energía
    Navegacion->>Hiperimpulsor: Calcular ruta hiperespacial
    Hiperimpulsor-->>Navegacion: Devolver estado de la ruta
    alt Falla la navegación
        Navegacion->>ComandoControl: Informar fallo de ruta
        ComandoControl->>Reactor: Devolver energía a sistemas principales
        ComandoControl->>Navegacion: Iniciar protocolos de navegación de respaldo
    end
```

## Motivación

Estos escenarios muestran las interacciones entre los bloques de la Estrella de la Muerte durante operaciones críticas y cómo se escalan los fallos.
