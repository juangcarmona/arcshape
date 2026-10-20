---
title: "Runtime view"
arc42-section: "06"
description: "Runtime behavior and interactions in three Death Star scenarios."
---

## Key scenarios

### Planetary destruction sequence

Imperial Command orders the weapon system to fire. Command and Control requests reactor power, the reactor channels energy to the superlaser, and the weapon targets the designated planet. Cooling monitors energy and can ask Command and Control to reduce reactor output.

```mermaid
accTitle: Planetary destruction sequence - Death Star runtime view
sequenceDiagram
    actor ImperialCommand as Imperial Command
    participant CommandControl as Command and Control
    participant Reactor as Reactor Core
    participant Superlaser as Superlaser Weapon System
    participant Cooling as Cooling System
    participant Planet as Target planet
    ImperialCommand->>CommandControl: Order planetary destruction
    CommandControl->>Reactor: Request maximum power
    Reactor->>Superlaser: Channel energy
    Reactor-->>Cooling: Report energy levels
    Cooling-->>Reactor: Regulate output if overheating
    Superlaser->>Planet: Fire at designated target
    alt Overheating detected
        Cooling->>CommandControl: Raise overheating warning
        CommandControl->>Reactor: Reduce power output
    end
```

### Intruder detection and response

Sensor Arrays report an unauthorized presence. Command and Control dispatches a Stormtrooper squad. If automated dispatch fails, the alarm system calls for a manual response and backup units.

```mermaid
accTitle: Intruder detection and response - Death Star runtime view
sequenceDiagram
    participant Sensors as Sensor Arrays
    participant CommandControl as Command and Control
    participant Alarm as Alarm System
    participant Squad as Stormtrooper squad
    Sensors->>CommandControl: Report unauthorized presence
    CommandControl->>Squad: Dispatch squad to location
    alt Automated dispatch fails
        Sensors->>Alarm: Trigger alarm
        Alarm->>CommandControl: Request manual response
        CommandControl->>Squad: Deploy backup units
    end
```

### Hyperdrive activation and navigation

Navigation Control requests relocation. Command and Control directs the Reactor Core to supply the Hyperdrive. Navigation then calculates the hyperspace route; a failed calculation starts backup navigation protocols and returns reactor power to the main systems.

```mermaid
accTitle: Hyperdrive activation and navigation - Death Star runtime view
sequenceDiagram
    participant Navigation as Navigation Control
    participant CommandControl as Command and Control
    participant Reactor as Reactor Core
    participant Hyperdrive as Hyperdrive System
    Navigation->>CommandControl: Request relocation
    CommandControl->>Reactor: Redirect power to hyperdrive
    Reactor->>Hyperdrive: Supply power
    Navigation->>Hyperdrive: Calculate hyperspace route
    Hyperdrive-->>Navigation: Return route status
    alt Navigation fails
        Navigation->>CommandControl: Report route failure
        CommandControl->>Reactor: Return power to main systems
        CommandControl->>Navigation: Start backup navigation protocols
    end
```

## Motivation

These scenarios show how the Death Star's building blocks interact during mission-critical operations and how failures are escalated.
