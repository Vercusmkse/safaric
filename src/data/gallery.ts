export interface GalleryPhoto {
    id: string;
    title: string;
    category: 'rare' | 'predators' | 'giants' | 'birds' | 'cruisers';
    categoryLabel: string;
    location: string;
    src: string;
    caption: string;
}

export const GALLERY_CATEGORIES = [
    { id: 'all', label: 'All Sightings' },
    { id: 'rare', label: 'Wild Dogs & Rare Species' },
    { id: 'predators', label: 'Predators & Big Cats' },
    { id: 'giants', label: 'Elephants, Rhinos & Giants' },
    { id: 'birds', label: 'Birds of Kruger' },
    { id: 'cruisers', label: 'Cruisers & Bush Life' },
] as const;

export const GALLERY_PHOTOS: GalleryPhoto[] = [
    // RARE WILDLIFE (from your recent sightings)
    {
        id: 'wd-1',
        title: 'African Wild Dog (Painted Wolf)',
        category: 'rare',
        categoryLabel: 'Rare Carnivore',
        location: 'Central Kruger Concession',
        src: '/images/gallery/rare-wildlife/wild-dog-pack.jpg',
        caption: 'Encountered an endangered pack of African wild dogs resting in the morning shade.',
    },
    {
        id: 'mon-1',
        title: 'Banded Mongoose Mob',
        category: 'rare',
        categoryLabel: 'Rare Carnivore',
        location: 'Termite Mound Outcrop, Skukuza',
        src: '/images/gallery/rare-wildlife/mongoose-mob.jpg',
        caption: 'Active mob of dwarf mongooses foraging and scouting from an elevated mound.',
    },
    {
        id: 'jac-1',
        title: 'Black-Backed Jackal Pair',
        category: 'rare',
        categoryLabel: 'Rare Carnivore',
        location: 'Lower Sabie Road',
        src: '/images/gallery/rare-wildlife/jackals.jpg',
        caption: 'Alert jackal pair traversing the low shrub belt in early morning.',
    },

    // GIANTS & HERBIVORES
    {
        id: 'ele-1',
        title: 'Matriarch Elephant with Calf',
        category: 'giants',
        categoryLabel: 'Gentle Giants',
        location: 'Sabie Riverbed',
        src: '/images/gallery/giants/elephant-calf.jpg',
        caption: 'Breeding herd navigating the dense riparian vegetation with young calf.',
    },
    {
        id: 'gir-1',
        title: 'Southern Giraffe Journey',
        category: 'giants',
        categoryLabel: 'Gentle Giants',
        location: 'Phabeni Woodland Route',
        src: '/images/gallery/giants/giraffes.jpg',
        caption: 'Adult giraffes browsing the acacia canopy on an open plains traverse.',
    },
    {
        id: 'rhi-1',
        title: 'Southern White Rhinoceros',
        category: 'giants',
        categoryLabel: 'Gentle Giants',
        location: 'Berg-en-Dal Granite Basins',
        src: '/images/gallery/giants/rhino.jpg',
        caption: 'Solitary white rhino grazing peacefully in thick bushveld protection.',
    },

    // BIRDS OF KRUGER
    {
        id: 'hor-1',
        title: 'Southern Ground Hornbill',
        category: 'birds',
        categoryLabel: 'Avian Sightings',
        location: 'Numbi Granitic Corridor',
        src: '/images/gallery/birds/ground-hornbill.jpg',
        caption: 'Vulnerable ground hornbill patrolling the grass line for reptiles and insects.',
    },
    {
        id: 'kin-1',
        title: 'Pied Kingfisher in Detail',
        category: 'birds',
        categoryLabel: 'Avian Sightings',
        location: 'Sunset Dam / Lower Sabie',
        src: '/images/gallery/birds/pied-kingfisher.jpg',
        caption: 'Remarkable plumage detail captured perching before a dive strike.',
    },
    {
        id: 'rol-1',
        title: 'Lilac-Breasted Roller',
        category: 'birds',
        categoryLabel: 'Avian Sightings',
        location: 'Pretoriuskop Outcrops',
        src: '/images/gallery/birds/lilac-roller.jpg',
        caption: 'The national bird of the bushveld displaying brilliant iridescent feathers.',
    },
    {
        id: 'bee-1',
        title: 'Southern Carmine Bee-Eater',
        category: 'birds',
        categoryLabel: 'Avian Sightings',
        location: 'Sand River Sandbanks',
        src: '/images/gallery/birds/bee-eater.jpg',
        caption: 'Striking crimson bird hunting flying insects along open clearings.',
    },

    // PREDATORS
    {
        id: 'hye-1',
        title: 'Spotted Hyena on the Prowl',
        category: 'predators',
        categoryLabel: 'Apex Predator',
        location: 'S100 Grasslands',
        src: '/images/gallery/predators/hyena.jpg',
        caption: 'Curious spotted hyena foraging along the roadside boundary at dawn.',
    },
];