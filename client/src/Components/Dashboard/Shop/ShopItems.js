// Example concept pack images - replace with your actual image paths
import ConceptImage1 from "../../../assets/concept_sheep.png";
import ConceptImage2 from "../../../assets/concept_sheep1.png";
import ConceptImage3 from "../../../assets/concept_sheep2.png";

// Mail theme preview image
import ElfMailPreview from "../../../assets/elf.png";
import WifeMailPreview from "../../../assets/wifu.png";

export const shopItems = [
  // New Mail Themes
  {
    id: "mailtheme_elf_from_elbaf",
    name: "Elf From Elbaf Mail Theme",
    price: 450,
    category: "mailtheme",
    featured: "New",
    featuredStyle: "feature-card",
    isEmoji: false,
    cardClass: "card-elf-theme",
    previewClass: "elf-theme-preview card-elf-theme", // Added card-elf-theme for consistent styling
    previewHtml: `
  <div class="card-elf-theme" style="
  background-image: url('${ElfMailPreview}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 2rem;
  color: white;
  font-family: 'Merriweather', 'Cinzel', serif;
  min-height: 400px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
">
  <div style="position: relative; z-index: 2;">
    <p>Ara~ did the stars guide you back to me again, wanderer? <br /></p>
    <p>Elaniel, an elf of Elbaf's twilight groves, whispers with the stars and walks where moonlight lingers. 🌙</p>
    <p><br />~ Elaniel Moonshade</p>
  </div>
</div>
`,
  },
  {
    id: "mailtheme_wifu",
    name: "Rexona",
    price: 450,
    category: "mailtheme",
    featured: "New",
    featuredStyle: "feature-card",
    isEmoji: false,
    cardClass: "card-waifu-theme",
    previewClass: "waifu-theme-preview card-waifu-theme", // Added card-waifu-theme for consistent styling
    previewHtml: `
  <div class="card-waifu-theme" style="
  background-image: url('${WifeMailPreview}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 2rem;
  color: white;
  font-family: 'Merriweather', 'Cinzel', serif;
  min-height: 400px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
">
  <div style="position: relative; z-index: 2;">
    <p>~Hi, my darling senpai! 💖</p>
    <p>Rexona, your sweet and sparkly wifu from the pastel realms, dreams of mochi dates and cozy cuddles under sakura trees. 🌸</p>
    <p><br />~ Rexona</p>
  </div>
</div>
`,
  },
  // New Concept Packs
  {
    id: "concept_pack_maple_woolly",
    name: "Maple & Woolly's Little Journey",
    description: "Set of 3 Illustrated Scenes",
    story:
      "Maple wasn't a hero. Just a little wanderer with a big hat, a woolly friend, and a map full of dreams.\nEvery morning, they picked a new direction. Some led to glowing caves where stars whispered.\nOthers to towering mountains bathed in peachy skies.\nAnd sometimes they just rested beneath cherry blossoms and scribbled in journals, not chasing anything at all.\nBecause to them, the best journeys weren't about reaching anywhere—they were about wandering together.",
    price: 450,
    category: "conceptpack",
    featured: "New",
    featuredStyle: "feature-card",
    conceptImages: [
      {
        id: "maple_wolly_toward_the_peaks",
        image: ConceptImage1,
        name: "Toward the Peaks",
        description: "Part of the Maple & Woolly's Little Journey",
        parentPack: "concept_pack_maple_woolly",
      },
      {
        id: "maple_wolly_glowpath_wanderers",
        image: ConceptImage2,
        name: "Glowpath Wanderers",
        description: "Part of the Maple & Woolly's Little Journey",
        parentPack: "concept_pack_maple_woolly",
      },
      {
        id: "maple_wolly_dragons_lair",
        image: ConceptImage3,
        name: "Dragon's Lair",
        description: "Part of the Maple & Woolly's Little Journey",
        parentPack: "concept_pack_maple_woolly",
      },
    ],
  },
  // Original shop items
  {
    id: "theme_christmas",
    name: "Christmas",
    description: "Celebrate the holidays with a festive theme",
    price: 0,
    cardClass: "card-christmas",
    category: "theme",
    featured: "Seasonal 2025",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_cozy_room",
    name: "Cozy Room",
    description: "Relax and unwind in a cozy room",
    price: 100,
    cardClass: "card-cozy-room",
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_country_side",
    name: "Country Side",
    description: "Immerse yourself in a picturesque country side",
    price: 100,
    cardClass: "card-country-side",
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_magical_room",
    name: "Magical Room",
    description: "Enter a world of enchantment and magic",
    price: 100,
    cardClass: "card-magical-room",
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_northern_lights",
    name: "Northern Lights",
    description: "Immerse yourself in the mesmerizing northern lights",
    price: 100,
    cardClass: "card-northern-lights",
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_post_apocalyptic",
    name: "Post-Apocalyptic",
    description: "Enter a world of dystopia and apocalypse",
    price: 100,
    cardClass: "card-post-apocalyptic",
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_space_observe",
    name: "Space Observe",
    description: "Immerse yourself in the vastness of space",
    price: 100,
    cardClass: "card-space-observe",
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_winter_cabin",
    name: "Winter Cabin",
    description: "Relax and unwind in a cozy winter cabin",
    price: 100,
    cardClass: "card-winter-cabin",
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_forest",
    name: "Forest Theme",
    description: "Transform your journal with serene forest visuals",
    price: 100,
    cardClass: "card-forest",
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_ocean",
    name: "Ocean Theme",
    description: "Immerse yourself in tranquil ocean waves",
    price: 50,
    cardClass: "card-ocean",
    category: "theme",
    isEmoji: false,
  },
  {
    id: "theme_black",
    name: "Black Theme",
    description: "Enter a world of darkness and intrigue",
    price: 50,
    cardClass: "card-black",
    category: "theme",
    isEmoji: false,
  },
  {
    id: "theme_calm_ocean",
    name: "Calm Ocean Theme",
    description: "Relax and unwind in a serene coastal haven",
    price: 50,
    cardClass: "card-calm-ocean",
    category: "theme",
    isEmoji: false,
  },
  {
    id: "theme_night_sky",
    name: "Night Sky Theme",
    description: "Immerse yourself in a mesmerizing night sky",
    price: 50,
    cardClass: "card-night-sky",
    category: "theme",
    isEmoji: false,
  },
  {
    id: "theme_energetic_yellow",
    name: "Energetic Yellow Theme",
    description: "Immerse yourself in a vibrant and energetic yellow theme",
    price: 50,
    cardClass: "card-energetic-yellow",
    category: "theme",
    isEmoji: false,
  },
  {
    id: "theme_solid_pink",
    name: "Dusty Rose",
    description: "A warm and muted pink theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    cardClass: "card-solid-pink",
  },
  {
    id: "theme_solid_blue",
    name: "Deep Indigo",
    description: "A calming deep indigo theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    cardClass: "card-solid-blue",
  },
  {
    id: "theme_solid_green",
    name: "Moss Green",
    description: "A soothing moss green theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    cardClass: "card-solid-green",
  },
  {
    id: "theme_solid_lavender",
    name: "Twilight Lavender",
    description: "A deep lavender-gray theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    cardClass: "card-solid-lavender",
  },
  {
    id: "theme_solid_peach",
    name: "Burnt Peach",
    description: "A cozy burnt peach theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    cardClass: "card-solid-peach",
  },
  {
    id: "theme_solid_mint",
    name: "Ashen Mint",
    description: "A deep mint theme with ashen tones",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    cardClass: "card-solid-mint",
  },
  {
    id: "theme_solid_yellow",
    name: "Golden Ember",
    description: "A warm golden ember theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    cardClass: "card-solid-yellow",
  },
  {
    id: "theme_solid_coral",
    name: "Muted Coral",
    description: "A toned-down coral theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    cardClass: "card-solid-coral",
  },
  {
    id: "theme_solid_lilac",
    name: "Vintage Lilac",
    description: "A muted lilac-gray theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    cardClass: "card-solid-lilac",
  },
  {
    id: "theme_solid_aqua",
    name: "Ashen Aqua",
    description: "A deep aqua theme with ashen tones",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    cardClass: "card-solid-aqua",
  },
];
