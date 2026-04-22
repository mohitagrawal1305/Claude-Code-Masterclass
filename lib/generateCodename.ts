const adjectives = [
  "Silent", "Clever", "Phantom", "Sneaky", "Cunning",
  "Daring", "Elusive", "Nimble", "Wily", "Brazen",
  "Stealthy", "Reckless", "Shadowy", "Slippery", "Devious",
  "Crafty", "Bold", "Swift", "Sly", "Fearless",
]

const colours = [
  "Crimson", "Cobalt", "Amber", "Jade", "Violet",
  "Scarlet", "Indigo", "Teal", "Onyx", "Ivory",
  "Azure", "Fuchsia", "Coral", "Obsidian", "Chartreuse",
  "Sienna", "Cerulean", "Mauve", "Ochre", "Vermillion",
]

const animals = [
  "Ferret", "Jackal", "Magpie", "Raccoon", "Weasel",
  "Panther", "Viper", "Raven", "Mongoose", "Coyote",
  "Meerkat", "Falcon", "Otter", "Lynx", "Dingo",
  "Gecko", "Badger", "Marlin", "Kestrel", "Porcupine",
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateCodename(): string {
  return pick(adjectives) + pick(colours) + pick(animals)
}
