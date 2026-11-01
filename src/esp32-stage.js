import {
  R as Group,
  en as Mesh,
  gt as BoxGeometry,
  an as MeshStandardMaterial,
} from "./kit.js";

const common = {
  GND: "GND1",
  SDA: "GPIO21",
  SCL: "GPIO22",
};

const lessonPins = {
  board: { D13: "GPIO2" },
  blink: { D13: "GPIO2" },
  button: { D2: "GPIO4", D13: "GPIO2" },
  knob: { A0: "GPIO34", D9: "GPIO2" },
  rgb: { D9: "GPIO16", D10: "GPIO17", D11: "GPIO18" },
  light: { A0: "GPIO35", D9: "GPIO2" },
  sensor: { D9: "GPIO5", D10: "GPIO18" },
  sound: { D8: "GPIO19" },
  piano: {
    D2: "GPIO13", D3: "GPIO14", D4: "GPIO27", D5: "GPIO26",
    D6: "GPIO25", D7: "GPIO33", D8: "GPIO32", D9: "GPIO4", D10: "GPIO19",
  },
  motor: { D6: "GPIO18" },
  heat: { A0: "GPIO36" },
  servo: { D9: "GPIO13" },
  stepper: { D2: "GPIO4", D8: "GPIO19", D9: "GPIO18", D10: "GPIO5", D11: "GPIO17" },
  plant: { A0: "GPIO32" },
  force: { A0: "GPIO33", D9: "GPIO2", D13: "GPIO2", D8: "GPIO19" },
  project: { D9: "GPIO5", D10: "GPIO18", D4: "GPIO23", D3: "GPIO22", D2: "GPIO21" },
  touch: { D2: "GPIO4", D13: "GPIO2" },
  wifi: { D13: "GPIO2" },
};

const lowVoltageLessons = new Set(["button", "knob", "light", "heat", "plant", "piano", "force", "stepper", "touch"]);

export function esp32Pin(lesson, pin) {
  if (!pin) return pin;
  if (pin === "5V") return lowVoltageLessons.has(lesson) ? "3V3" : "VIN";
  return lessonPins[lesson]?.[pin] ?? common[pin] ?? pin;
}

export function adaptESP32Parts(lesson, parts) {
  let result = parts;
  if (lesson === "heat") {
    result = result.filter((part) => !["fan", "r1k", "transistor", "w-d6", "w-fan-plus", "w-fan-minus"].includes(part.id));
  }
  if (lesson === "force") {
    result = result.filter((part) => !["meter", "buzzer", "w-d8", "w-s-sig", "w-s-5v", "w-s-gnd"].includes(part.id));
  }
  if (lesson === "touch") {
    const button = result.find((part) => part.id === "button");
    result = result.filter((part) => !["button", "pulldown"].includes(part.id));
    if (button) {
      result.push({
        id: "touchpad",
        build: buildTouchPad,
        at: button.at,
        interact: { type: "press", input: "touch" },
      });
    }
  }
  if (lesson === "wifi") result = [];
  return result.map((part) => {
    const signal = part.signal && Object.fromEntries(
      Object.entries(part.signal).map(([key, value]) => [
        key,
        ["a", "b", "follow"].includes(key) ? esp32Pin(lesson, value) : value,
      ]),
    );
    return { ...part, signal };
  });
}

function buildTouchPad() {
  const group = new Group();
  const metal = new MeshStandardMaterial({ color: "#b77d36", metalness: 0.75, roughness: 0.32 });
  const dark = new MeshStandardMaterial({ color: "#173f35", roughness: 0.75 });
  const base = new Mesh(new BoxGeometry(12, 1.1, 12), dark);
  base.position.y = 0.55;
  group.add(base);
  const pad = new Mesh(new BoxGeometry(9.5, 0.35, 9.5), metal);
  pad.position.y = 1.3;
  group.add(pad);
  group.userData.part = {
    name: "Bidang sentuh · GPIO4 / Touch0",
    desc: "Tekan bidang tembaga untuk mensimulasikan sentuhan kapasitif.",
  };
  group.userData.anchor = pad;
  return group;
}

export function adaptESP32Schematic(lesson, schematic) {
  if (!schematic) return schematic;
  const mapNode = (node) => {
    if (!node || typeof node !== "object") return node;
    const copy = { ...node };
    if (copy.t === "VCC" && copy.label === "5V" && lowVoltageLessons.has(lesson)) copy.label = "3V3";
    for (const key of ["up", "down"]) {
      if (Array.isArray(copy[key])) copy[key] = copy[key].map(mapNode);
    }
    return copy;
  };
  const rows = schematic.rows && Object.fromEntries(
    Object.entries(schematic.rows)
      .filter(([pin]) => lesson !== "heat" || pin !== "D6")
      .filter(([pin]) => lesson !== "force" || pin !== "D8")
      .map(([pin, nodes]) => [esp32Pin(lesson, pin), nodes.map(mapNode)]),
  );
  const blocks = schematic.blocks
    ?.filter((block) => !(lesson === "force" && block.part === "meter"))
    .map((block) => ({
      ...block,
      pins: block.pins.map(([name, pin]) => [name, esp32Pin(lesson, pin)]),
    }));
  return {
    ...schematic,
    note: lesson === "piano" ? "Input memakai pull-down eksternal; logika 3.3 V" : schematic.note,
    pins: schematic.pins
      .filter((pin) => !(lesson === "heat" && pin === "D6"))
      .filter((pin) => !(lesson === "force" && ["D8", "D9"].includes(pin)))
      .map((pin) => esp32Pin(lesson, pin)),
    rows,
    blocks,
  };
}
