export type Hotspot = {
  id: string;
  name: string;
  /** World-space anchor of the marker */
  position: [number, number, number];
  category: string;
  summary: string;
  facts: string[];
};

export type SceneModule = {
  id: string;
  title: string;
  subject: string;
  tagline: string;
  description: string;
  level: "Foundation" | "Intermediate" | "Advanced";
  duration: string;
  accentLabel: string;
  /** Domain framing handed to the AI tutor as system context */
  tutorContext: string;
  capabilities?: {
    animations: string[];
    labels: boolean;
    isolation: boolean;
  };
  relations?: Array<{
    from: string;
    type: "flows_to" | "adjacent_to" | "supplies" | "part_of";
    to: string;
  }>;
  camera: { position: [number, number, number]; target: [number, number, number] };
  hotspots: Hotspot[];
};

export const scenes: SceneModule[] = [
  {
    id: "cardiac",
    title: "The Human Heart",
    subject: "Anatomy & Physiology",
    tagline: "Four chambers, two circuits, one pump",
    description:
      "Walk around a sectioned cardiac model and interrogate every chamber, valve and great vessel. Follow deoxygenated blood from the vena cava to the lungs and back out through the aorta.",
    level: "Foundation",
    duration: "12 min guided",
    accentLabel: "Anatomy",
    tutorContext:
      "You are teaching human cardiac anatomy and physiology to an undergraduate health-science student. Use correct anatomical terminology (superior/inferior, anterior/posterior), relate structure to function, and mention clinically relevant details when useful.",
    capabilities: { animations: ["pulse"], labels: true, isolation: true },
    relations: [
      { from: "right-atrium", type: "flows_to", to: "right-ventricle" },
      { from: "right-ventricle", type: "flows_to", to: "pulmonary-artery" },
      { from: "left-atrium", type: "flows_to", to: "mitral-valve" },
      { from: "mitral-valve", type: "flows_to", to: "left-ventricle" },
      { from: "left-ventricle", type: "flows_to", to: "aortic-valve" },
      { from: "aortic-valve", type: "flows_to", to: "aorta" },
      { from: "coronary", type: "supplies", to: "left-ventricle" },
      { from: "left-ventricle", type: "adjacent_to", to: "right-ventricle" },
    ],
    camera: { position: [4.2, 2.6, 5.4], target: [0, 0.2, 0] },
    hotspots: [
      {
        id: "left-ventricle",
        name: "Left Ventricle",
        position: [-1.05, -0.85, 0.55],
        category: "Chamber",
        summary:
          "The high-pressure pump of the systemic circuit, with a myocardial wall roughly three times thicker than the right ventricle.",
        facts: [
          "Ejects ~70 mL per beat (stroke volume)",
          "Peak systolic pressure ≈ 120 mmHg",
          "Wall thickness ≈ 10–12 mm",
        ],
      },
      {
        id: "right-ventricle",
        name: "Right Ventricle",
        position: [1.15, -0.8, 0.6],
        category: "Chamber",
        summary:
          "A thin-walled, crescent-shaped chamber that drives blood a short distance into the low-resistance pulmonary circuit.",
        facts: ["Peak pressure ≈ 25 mmHg", "Wall thickness ≈ 3–5 mm", "Shares the interventricular septum"],
      },
      {
        id: "left-atrium",
        name: "Left Atrium",
        position: [-1.0, 0.95, -0.35],
        category: "Chamber",
        summary:
          "Receives oxygenated blood from four pulmonary veins and delivers it across the mitral valve during diastole.",
        facts: ["Most posterior cardiac chamber", "Atrial kick adds ~20% of filling", "Site of most atrial fibrillation"],
      },
      {
        id: "right-atrium",
        name: "Right Atrium",
        position: [1.1, 1.0, -0.3],
        category: "Chamber",
        summary:
          "Collection chamber for systemic venous return via the superior and inferior vena cava; houses the sinoatrial node.",
        facts: ["Contains the SA node pacemaker", "Normal pressure 2–6 mmHg", "Drains the coronary sinus"],
      },
      {
        id: "aorta",
        name: "Aortic Arch",
        position: [-0.35, 2.35, -0.1],
        category: "Great Vessel",
        summary:
          "The body's largest artery. Its elastic recoil during diastole maintains perfusion pressure between beats — the Windkessel effect.",
        facts: ["Diameter ≈ 25 mm at the root", "Gives off three arch branches", "Elastic lamellae store systolic energy"],
      },
      {
        id: "pulmonary-artery",
        name: "Pulmonary Trunk",
        position: [0.75, 2.15, 0.45],
        category: "Great Vessel",
        summary:
          "The only artery in the adult body carrying deoxygenated blood, bifurcating toward each lung for gas exchange.",
        facts: ["Splits into left and right branches", "Low resistance circuit", "Guarded by the pulmonary valve"],
      },
      {
        id: "coronary",
        name: "Coronary Arteries",
        position: [-1.55, 0.15, 1.05],
        category: "Perfusion",
        summary:
          "Vessels that perfuse the myocardium itself, filling paradoxically during diastole when the muscle relaxes.",
        facts: ["LAD supplies ~50% of the LV", "Occlusion → myocardial infarction", "Flow peaks in diastole"],
      },
      {
        id: "mitral-valve",
        name: "Mitral Valve",
        position: [-0.9, 0.2, 0.9],
        category: "Valve",
        summary:
          "The bicuspid atrioventricular valve, tethered by chordae tendineae to papillary muscles that prevent prolapse under pressure.",
        facts: ["Two leaflets, anterior and posterior", "Closure produces the S1 heart sound", "Area ≈ 4–6 cm²"],
      },
      {
        id: "aortic-valve",
        name: "Aortic Valve",
        position: [-1.0, -0.15, 0.55],
        category: "Valve",
        summary:
          "The three-cusped semilunar valve at the left-ventricular outflow tract, opening into the aortic root during systole and preventing diastolic backflow.",
        facts: ["Three semilunar cusps", "Opens during ventricular systole", "Closure contributes to the S2 heart sound"],
      },
    ],
  },
  {
    id: "caffeine",
    title: "Caffeine, C₈H₁₀N₄O₂",
    subject: "Molecular Chemistry",
    tagline: "A purine alkaloid at true bond geometry",
    description:
      "Inspect a space-accurate caffeine molecule. Rotate through the fused xanthine ring system, probe individual atoms, and see why planarity and nitrogen lone pairs govern its receptor affinity.",
    level: "Intermediate",
    duration: "9 min guided",
    accentLabel: "Chemistry",
    tutorContext:
      "You are teaching organic and medicinal chemistry. Explain hybridisation, resonance, planarity, polarity and structure–activity relationships for the caffeine molecule at an undergraduate level.",
    camera: { position: [0, 1.4, 8.5], target: [0, 0, 0] },
    hotspots: [
      {
        id: "purine-core",
        name: "Fused Purine Core",
        position: [0, 0, 0],
        category: "Ring System",
        summary:
          "A pyrimidinedione fused to an imidazole ring. The entire bicycle is planar and aromatic in character, which lets caffeine stack into adenosine receptor pockets.",
        facts: ["Bicyclic xanthine scaffold", "Fully conjugated π system", "Planarity drives receptor binding"],
      },
      {
        id: "n-methyls",
        name: "Three N-Methyl Groups",
        position: [2.6, 1.5, 0],
        category: "Substituent",
        summary:
          "Methylation at N1, N3 and N7 blocks hydrogen-bond donation and raises lipophilicity — this is why caffeine crosses the blood–brain barrier easily.",
        facts: ["1,3,7-trimethylxanthine", "log P ≈ -0.07", "Removing methyls gives theobromine/theophylline"],
      },
      {
        id: "carbonyls",
        name: "Carbonyl Oxygens",
        position: [-2.9, 0.9, 0],
        category: "Functional Group",
        summary:
          "Two sp²-hybridised C=O groups act as strong hydrogen-bond acceptors and dominate the molecule's dipole moment.",
        facts: ["Both are amide-like carbonyls", "Key acceptors at the A2A receptor", "Dipole ≈ 3.6 D"],
      },
      {
        id: "imidazole-n",
        name: "Imidazole Nitrogen (N9)",
        position: [2.3, -1.6, 0],
        category: "Heteroatom",
        summary:
          "The unmethylated nitrogen keeps a lone pair in the ring plane — the weakly basic site responsible for caffeine's salt formation.",
        facts: ["pKa of conjugate acid ≈ 0.6", "sp² lone pair, in-plane", "Coordination site for metal complexes"],
      },
      {
        id: "planarity",
        name: "Molecular Plane",
        position: [0, -2.6, 0],
        category: "Geometry",
        summary:
          "Every ring atom lies within a fraction of an ångström of one plane, allowing π-stacking with aromatic residues such as phenylalanine.",
        facts: ["Bond angles ≈ 120°", "Stacks at ~3.4 Å spacing", "Explains crystal packing behaviour"],
      },
    ],
  },
  {
    id: "cathedral",
    title: "Gothic Cathedral Bay",
    subject: "Architectural History",
    tagline: "How stone learned to carry light",
    description:
      "Step inside a single structural bay of a High Gothic cathedral. Trace the load path from rib vault to flying buttress and understand why the wall could finally dissolve into glass.",
    level: "Advanced",
    duration: "14 min guided",
    accentLabel: "Architecture",
    tutorContext:
      "You are teaching Gothic architectural history and structural logic (c. 1140–1350). Reference real precedents such as Saint-Denis, Chartres, Amiens and Beauvais, and explain load paths in plain structural terms.",
    camera: { position: [9, 5.5, 12], target: [0, 4, 0] },
    hotspots: [
      {
        id: "rib-vault",
        name: "Quadripartite Rib Vault",
        position: [0, 10.4, 0],
        category: "Structure",
        summary:
          "Diagonal stone ribs channel the vault's weight into four discrete points instead of a continuous wall, freeing the bay between piers.",
        facts: ["Replaces heavy groin vaults", "Ribs built first as permanent centering", "Webbing can be thin infill"],
      },
      {
        id: "pointed-arch",
        name: "Pointed Arch",
        position: [0, 7.2, 3.1],
        category: "Structure",
        summary:
          "Steepening the arch redirects thrust downward rather than outward, and lets arches of different spans reach the same height.",
        facts: ["Reduces lateral thrust", "Decouples span from height", "Arrived via Islamic building traditions"],
      },
      {
        id: "compound-pier",
        name: "Compound Pier",
        position: [3.3, 3.0, 3.1],
        category: "Support",
        summary:
          "A bundle of engaged shafts, each visually continuing a rib above, so the structural diagram is legible from the floor.",
        facts: ["Shafts mirror vault ribs", "Carries concentrated point loads", "Expresses verticality"],
      },
      {
        id: "flying-buttress",
        name: "Flying Buttress",
        position: [6.6, 7.6, 0],
        category: "Support",
        summary:
          "An external half-arch that catches lateral vault thrust and walks it out to a weighted pier, keeping the nave wall free of mass.",
        facts: ["Pinnacles add stabilising weight", "Beauvais failed by overreaching", "Enables 40 m+ vault heights"],
      },
      {
        id: "clerestory",
        name: "Clerestory Window",
        position: [-3.3, 8.2, 0],
        category: "Light",
        summary:
          "With the wall relieved of load, the upper storey becomes tracery and glass — theology rendered as luminosity.",
        facts: ["Bar tracery after Reims", "Coloured light as divine metaphor", "Wall becomes a membrane"],
      },
      {
        id: "triforium",
        name: "Triforium",
        position: [-3.3, 5.6, 0],
        category: "Elevation",
        summary:
          "The shadowed middle storey of the three-part elevation, masking the aisle roof and setting up a rhythm of dark and light.",
        facts: ["Arcade → triforium → clerestory", "Often a narrow walkway", "Later glazed at Saint-Denis"],
      },
    ],
  },
  {
    id: "solar-system",
    title: "Orbital Mechanics",
    subject: "Astronomy & Physics",
    tagline: "Gravity written as motion",
    description:
      "Navigate a scaled orbital system and examine how velocity, distance and mass produce stable paths. Compare terrestrial and giant-planet orbits from any angle.",
    level: "Intermediate",
    duration: "11 min guided",
    accentLabel: "Astronomy",
    tutorContext:
      "You are teaching introductory orbital mechanics and astronomy. Explain gravity, orbital velocity, inclination and scale clearly while distinguishing this schematic model from true astronomical scale.",
    camera: { position: [7.8, 5.4, 8.8], target: [0, 0, 0] },
    hotspots: [
      { id: "sun", name: "Central Star", position: [0, 0, 0], category: "Star", summary: "The dominant mass in the system; its gravity supplies the centripetal acceleration that bends planetary motion into orbits.", facts: ["Contains over 99% of system mass", "Gravity falls with distance squared", "Fusion powers its luminosity"] },
      { id: "earth-orbit", name: "Terrestrial Orbit", position: [3.25, 0.28, 0.55], category: "Orbit", summary: "A near-circular path where tangential velocity continually carries the planet forward as gravity pulls it inward.", facts: ["One revolution defines a year", "Orbital speed is about 29.8 km/s", "Eccentricity is low"] },
      { id: "moon", name: "Natural Satellite", position: [3.78, 0.34, 0.55], category: "Satellite", summary: "A secondary body bound to a planet while both orbit their common barycentre and the central star.", facts: ["Tidally locked", "Drives most ocean tides", "Orbit slowly expands"] },
      { id: "mars", name: "Outer Terrestrial Planet", position: [-4.45, 0.45, 1.2], category: "Planet", summary: "A smaller rocky world on a wider, slower orbit, illustrating the relationship described by Kepler's third law.", facts: ["Orbital period about 687 days", "Two small moons", "More eccentric orbit than Earth"] },
      { id: "jupiter", name: "Gas Giant", position: [5.55, -0.35, -2.3], category: "Planet", summary: "The system's largest planet strongly perturbs smaller bodies and helps shape resonances in the asteroid belt.", facts: ["Largest planetary mass", "Rapid ten-hour rotation", "Powerful magnetosphere"] },
    ],
  },
  {
    id: "tectonics",
    title: "Tectonic Boundaries",
    subject: "Earth Science",
    tagline: "Continents in continuous motion",
    description:
      "Inspect a divergent plate boundary in section. Trace mantle upwelling, new crust formation and the faults that reshape the ocean floor over geological time.",
    level: "Foundation",
    duration: "10 min guided",
    accentLabel: "Geology",
    tutorContext:
      "You are teaching physical geology and plate tectonics. Explain crust, mantle convection, faulting, volcanism and geological timescales using the visible cross-section.",
    camera: { position: [7, 5.5, 8], target: [0, -0.2, 0] },
    hotspots: [
      { id: "ridge", name: "Mid-Ocean Ridge", position: [0, 1.25, 0], category: "Landform", summary: "An underwater mountain chain built where plates separate and hot material rises to create new oceanic crust.", facts: ["Longest mountain system on Earth", "High heat flow", "Hosts hydrothermal vents"] },
      { id: "left-plate", name: "Diverging Plate", position: [-2.1, 0.25, 0], category: "Lithosphere", summary: "A rigid slab moving away from the spreading centre as new crust is added along its inner edge.", facts: ["Moves centimetres per year", "Carries symmetric magnetic stripes", "Cools and thickens with age"] },
      { id: "magma", name: "Mantle Upwelling", position: [0, -1.15, 0], category: "Mantle", summary: "Hot mantle rises and partially melts as pressure falls, feeding basaltic magma into the spreading axis.", facts: ["Decompression melting", "Produces basalt", "Transfers interior heat"] },
      { id: "rift", name: "Axial Rift", position: [0, 0.45, 1.5], category: "Fault Zone", summary: "The central valley where extension fractures young crust and focuses volcanic activity.", facts: ["Dominated by normal faults", "Frequent shallow earthquakes", "Crust is youngest here"] },
    ],
  },
  {
    id: "gearbox",
    title: "Mechanical Gear Train",
    subject: "Mechanical Engineering",
    tagline: "Torque, speed and contact in motion",
    description:
      "Study a live compound gear train. Follow power through meshing teeth and compare how gear diameter changes rotational speed, direction and torque.",
    level: "Intermediate",
    duration: "8 min guided",
    accentLabel: "Engineering",
    tutorContext:
      "You are teaching mechanical engineering fundamentals. Explain gear ratios, torque, angular velocity, contact forces and efficiency using the visible gear train.",
    camera: { position: [5.8, 4.5, 7.2], target: [0, -0.2, 0] },
    hotspots: [
      { id: "drive-gear", name: "Drive Gear", position: [-1.25, 0.2, 0.4], category: "Input", summary: "The input gear receives shaft power and establishes the starting angular velocity and torque for the train.", facts: ["Input member", "Rotation drives adjacent gear oppositely", "Power equals torque × angular velocity"] },
      { id: "driven-gear", name: "Driven Gear", position: [1.45, 0.55, 0.4], category: "Output", summary: "A smaller meshing gear rotates faster than the larger driver while transmitting proportionally less torque, before losses.", facts: ["Speed ratio follows tooth count", "Direction reverses at each mesh", "Contact occurs along tooth profiles"] },
      { id: "idler", name: "Idler Gear", position: [0.65, -1.45, 0.4], category: "Transfer", summary: "An intermediate gear changes rotation direction and spacing without changing the overall ratio set by input and output gears.", facts: ["Does not alter overall ratio", "Redirects motion", "Adds bearing and mesh losses"] },
      { id: "gear-mesh", name: "Meshing Teeth", position: [0.15, 0.4, 0.45], category: "Contact", summary: "Involute tooth profiles maintain a nearly constant velocity ratio as contact travels across each pair of teeth.", facts: ["Involute profile", "Requires backlash", "Lubrication limits wear"] },
    ],
  },
  {
    id: "binary-tree",
    title: "Binary Search Tree",
    subject: "Computer Science",
    tagline: "Data structures you can walk around",
    description:
      "Fly through a live binary search tree. See why height — not node count — sets lookup cost, and how an unbalanced insert order degrades the structure toward a linked list.",
    level: "Foundation",
    duration: "10 min guided",
    accentLabel: "Computer Science",
    tutorContext:
      "You are teaching data structures and algorithms to a first-year computer science student. Explain binary search trees, tree height, traversal orders, big-O complexity and balancing, referring to the visible node layout.",
    camera: { position: [0, 2.2, 11], target: [0, 0.6, 0] },
    hotspots: [
      { id: "root", name: "Root Node", position: [0, 2.2, 0], category: "Node", summary: "The entry point of every search. Each comparison at the root discards roughly half the remaining keys when the tree is balanced.", facts: ["Holds key 50 here", "Every search starts here", "No parent pointer"] },
      { id: "left-subtree", name: "Left Subtree", position: [-2.4, 0.5, 0], category: "Invariant", summary: "Every key in this subtree is smaller than its parent — the ordering invariant that makes search logarithmic instead of linear.", facts: ["All keys < parent", "Checked on every insert", "In-order walk yields sorted keys"] },
      { id: "leaf", name: "Leaf Node", position: [-3.6, -1.2, 0], category: "Node", summary: "A node with no children. Searches that reach a leaf without a match have failed, costing one comparison per level travelled.", facts: ["Zero children", "Where inserts attach", "Deepest comparison point"] },
      { id: "height", name: "Tree Height", position: [4.6, -2.8, 0], category: "Complexity", summary: "The longest root-to-leaf path. Balanced trees keep it near log₂(n), giving O(log n) search; sorted inserts push it to n and O(n).", facts: ["Balanced: O(log n)", "Degenerate: O(n)", "AVL and red-black trees rebalance"] },
      { id: "traversal", name: "Traversal Order", position: [2.4, 0.5, 0], category: "Algorithm", summary: "In-order, pre-order and post-order visits differ only in when the node is read relative to its children — same walk, different output.", facts: ["In-order returns sorted data", "Pre-order copies structure", "Post-order frees safely"] },
    ],
  },
  {
    id: "dna",
    title: "DNA Double Helix",
    subject: "Molecular Biology",
    tagline: "The molecule that stores you",
    description:
      "Orbit a right-handed B-form double helix. Examine the sugar-phosphate backbone, complementary base pairing and the grooves that proteins read information through.",
    level: "Intermediate",
    duration: "11 min guided",
    accentLabel: "Biology",
    tutorContext:
      "You are teaching molecular biology. Explain nucleotide structure, complementary base pairing, antiparallel strands, helix geometry, grooves, replication and transcription, referring to the visible helix.",
    camera: { position: [0, 1.2, 9.5], target: [0, 0, 0] },
    hotspots: [
      { id: "backbone", name: "Sugar-Phosphate Backbone", position: [1.5, 3.2, 0], category: "Structure", summary: "Alternating deoxyribose and phosphate groups form a covalent, negatively charged rail that gives the molecule its directionality.", facts: ["Linked by phosphodiester bonds", "Runs 5′ → 3′", "Negative charge aids protein binding"] },
      { id: "base-pair", name: "Complementary Base Pair", position: [0, 0.4, 0], category: "Chemistry", summary: "Adenine pairs with thymine via two hydrogen bonds; guanine pairs with cytosine via three — which is why GC-rich DNA melts at a higher temperature.", facts: ["A–T: 2 hydrogen bonds", "G–C: 3 hydrogen bonds", "Pairing enables faithful copying"] },
      { id: "antiparallel", name: "Antiparallel Strands", position: [-1.5, -2.4, 0], category: "Geometry", summary: "The two strands run in opposite chemical directions, which forces replication to be continuous on one strand and fragmented on the other.", facts: ["One 5′→3′, one 3′→5′", "Leading vs lagging strand", "Okazaki fragments on the lagging strand"] },
      { id: "grooves", name: "Major and Minor Grooves", position: [1.6, -4.4, 0], category: "Recognition", summary: "Unequal backbone spacing creates a wide and a narrow groove; transcription factors read base identity mostly through the major groove.", facts: ["Major groove ≈ 2.2 nm wide", "Protein recognition site", "Minor groove binds small drugs"] },
      { id: "pitch", name: "Helical Pitch", position: [0, 5.4, 0], category: "Geometry", summary: "One full turn spans about 10.5 base pairs and 3.4 nm, so each base pair sits 0.34 nm above and roughly 34° around from the last.", facts: ["Right-handed B-form", "3.4 nm per turn", "0.34 nm base-pair rise"] },
    ],
  },
  {
    id: "wave-interference",
    title: "Wave Interference",
    subject: "Physics",
    tagline: "Superposition made visible",
    description:
      "Watch two coherent sources radiate across a live surface. Trace the nodal lines where crests cancel troughs and see why path difference — not distance — decides intensity.",
    level: "Intermediate",
    duration: "9 min guided",
    accentLabel: "Physics",
    tutorContext:
      "You are teaching wave physics and optics. Explain superposition, coherence, path difference, constructive and destructive interference, wavelength and the double-slit result using the animated surface.",
    camera: { position: [0, 7.5, 10.5], target: [0, -0.5, 0] },
    hotspots: [
      { id: "source-a", name: "Coherent Source A", position: [-2.4, 0.6, 2.2], category: "Source", summary: "A point source radiating circular wavefronts at a fixed frequency and phase — coherence is what makes a stable pattern possible.", facts: ["Fixed frequency", "Constant phase relationship", "Amplitude falls with distance"] },
      { id: "source-b", name: "Coherent Source B", position: [2.4, 0.6, 2.2], category: "Source", summary: "A second identical source. Its separation from source A sets the angular spacing of the resulting fringes.", facts: ["Same wavelength as A", "Separation sets fringe spacing", "Analogous to a double slit"] },
      { id: "constructive", name: "Constructive Ridge", position: [0, 1.6, 0], category: "Superposition", summary: "Along the perpendicular bisector both waves arrive in phase, so displacements add and amplitude doubles.", facts: ["Path difference = nλ", "Amplitude adds", "Intensity ∝ amplitude²"] },
      { id: "destructive", name: "Nodal Line", position: [2.9, 0, -1.8], category: "Superposition", summary: "Where the path difference is an odd number of half wavelengths, one crest meets a trough and the surface stays flat.", facts: ["Path difference = (n+½)λ", "Total cancellation", "Energy is redistributed, not lost"] },
      { id: "wavelength", name: "Wavelength", position: [-3.4, 0.4, -2.2], category: "Quantity", summary: "The crest-to-crest spacing. Shorter wavelengths pack fringes closer together for the same source separation.", facts: ["λ = v / f", "Sets fringe spacing", "Same maths for light, sound and water"] },
    ],
  },
  {
    id: "lattice",
    title: "Ionic Crystal Lattice",
    subject: "Chemistry",
    tagline: "Why salt is hard and brittle",
    description:
      "Inspect a face-centred cubic sodium chloride lattice. Compare ionic radii, count coordination numbers and connect lattice energy to melting point and cleavage.",
    level: "Foundation",
    duration: "8 min guided",
    accentLabel: "Chemistry",
    tutorContext:
      "You are teaching inorganic and physical chemistry. Explain ionic bonding, coordination number, ionic radii, lattice energy, cleavage planes and physical properties using the visible NaCl lattice.",
    camera: { position: [7.5, 5.5, 8.5], target: [0, 0, 0] },
    hotspots: [
      { id: "cation", name: "Sodium Cation", position: [-1.5, 1.5, 1.5], category: "Ion", summary: "Losing one electron shrinks sodium dramatically, so the cation slots into the gaps between much larger chloride ions.", facts: ["Ionic radius ≈ 102 pm", "Charge +1", "Six chloride neighbours"] },
      { id: "anion", name: "Chloride Anion", position: [0, 1.5, 1.5], category: "Ion", summary: "Gaining an electron expands the ion; chloride dominates the lattice volume and defines the packing arrangement.", facts: ["Ionic radius ≈ 181 pm", "Charge −1", "Six sodium neighbours"] },
      { id: "coordination", name: "Coordination Number", position: [1.5, 0, 0], category: "Geometry", summary: "Each ion is octahedrally surrounded by six of the opposite charge — the 6:6 arrangement typical of the rock-salt structure.", facts: ["6:6 coordination", "Octahedral geometry", "Set by the radius ratio"] },
      { id: "lattice-energy", name: "Lattice Energy", position: [0, -2.4, 0], category: "Energetics", summary: "The energy released as gaseous ions assemble into the lattice; its size explains the 801 °C melting point and low solubility of harder salts.", facts: ["≈ −787 kJ/mol for NaCl", "Rises with charge, falls with radius", "Drives high melting points"] },
      { id: "cleavage", name: "Cleavage Plane", position: [2.4, 2.4, -2.4], category: "Property", summary: "Sliding one layer by a single ion aligns like charges, so the crystal shatters along flat planes instead of deforming.", facts: ["Brittle failure", "Cleaves at 90° angles", "No delocalised electrons to flow"] },
    ],
  },
];

export function getScene(id: string): SceneModule | undefined {
  return scenes.find((s) => s.id === id);
}
