const STORAGE_KEYS = {
  events: "rockwater-events",
  orders: "rockwater-guest-orders",
  ui: "rockwater-ui",
  legacyEvent: "rockwater-event-settings"
};

const MENU_LINKS = {
  barKitchen: "https://www.rockwater.uk/wp-content/uploads/2026/05/RW-BK-HOVE-MAY26-WEB.pdf",
  roofTerrace: "https://www.rockwater.uk/wp-content/uploads/2026/04/Roof-Terrace-SpringSummer-Menu-RW-Hove-.pdf",
  thePub: "https://www.rockwater.uk/wp-content/uploads/2026/05/Pub-Menu-11th-May-2026.pdf",
  desserts: "https://www.rockwater.uk/wp-content/uploads/2026/04/RW_DESSERT_Hove-MARCH26-WEB.pdf",
  kids: "https://www.rockwater.uk/wp-content/uploads/2025/07/New_RW_HOVE_Kids_MAY25.pdf",
  allergenGuide: "https://allergymenu.app/menu/VES662",
  hoveMenus: "https://www.rockwater.uk/hove/#menus"
};

const VENUES = {
  barKitchen: "Bar & Kitchen",
  roofTerrace: "Roof Terrace",
  thePub: "The Pub"
};

const STAFF_EMAIL_MODES = {
  manual: "Manual only",
  deadline: "Send at pre-order deadline",
  dailyDigest: "Daily digest final 7 days"
};

const DEMO_EVENT_ID = "event-demo-hove";

function item(id, name, price, description = "", tags = [], extras = [], options = {}) {
  return { id, name, price, description, tags, extras, ...options };
}

function extra(id, name, price) {
  return { id, name, price };
}

const saladExtras = [
  extra("confit-chicken-leg", "Confit Chicken Leg", "5"),
  extra("grilled-halloumi", "Grilled Halloumi", "5"),
  extra("tofu", "Tofu", "5")
];

const beefBurgerExtras = [
  extra("add-bacon", "Bacon", "1.50"),
  extra("add-cheese", "Extra Cheese", "2")
];
const chickenBurgerExtras = [
  extra("add-bacon-chicken", "Bacon", "1.50"),
  extra("add-cheese-chicken", "Cheese", "2")
];
const plantBurgerExtras = [extra("add-plant-based-cheese", "Plant Based Cheese", "2")];
const pubPlantBurgerExtras = [extra("add-plant-based-cheese", "Add Plant Based Cheese", "2")];
const glutenFreePizzaExtra = [extra("gluten-free-base", "Gluten-free pizza base", "Available")];

const dessertItems = [
  item("lemon-meringue-knickerbocker-glory", "Lemon meringue knickerbocker glory", "9", "Lemon curd, sherbet"),
  item("plant-based-raspberry-pistachio-frangipane-tart", "Plant based raspberry & pistachio frangipane tart", "10", "Vanilla ice cream", ["Vegan"]),
  item("kiwi-pannacotta", "Kiwi pannacotta", "10", "New Forest strawberry salsa, strawberry sorbet"),
  item("dark-chocolate-hazelnut-delice", "Dark chocolate & hazelnut delice", "10", "Tonka bean cream"),
  item("trio-of-british-cheeses", "Trio of British cheeses", "14", "Fruit membrillo, oat biscuits, celery"),
  item("selection-of-ice-cream-sorbets", "Selection of ice cream & sorbets", "3 per scoop", "Ask server for flavours")
];

const roofTerraceDesserts = [
  ...dessertItems,
  item("sussex-strawberries-elderflower", "Sussex strawberries & elderflower", "10", "Clotted cream"),
  item("affogato", "Affogato", "8", "Espresso, vanilla ice cream")
];

const pubDesserts = dessertItems.filter((entry) => (
  ["trio-of-british-cheeses", "selection-of-ice-cream-sorbets"].includes(entry.id)
));

const kidsMainItems = [
  item("kids-sausage-fries", "Sausage & Fries (Kids)", "8.5", "2 Sausages, Fries, Peas", [], [], { isKids: true }),
  item("kids-rockwater-beefburger", "Rockwater Beefburger (Kids)", "8.5", "Waffle Fries", [], [extra("kids-add-cheese", "Add Cheese", "1")], { isKids: true }),
  item("kids-poached-salmon-fillet", "Poached Salmon Fillet (Kids)", "8.5", "Corn, Crushed New Potatoes", [], [], { isKids: true }),
  item("kids-mac-cheese", "Mac & Cheese (Kids)", "8.5", "Parmesan", ["Vegetarian"], [], { isKids: true }),
  item("kids-fish-chips", "Rockwater Fish & Chips (Kids)", "8.5", "Crushed Peas", [], [], { isKids: true })
];

const kidsDessertItems = [
  item("kids-chocolate-brownie", "Chocolate Brownie (Kids)", "4.5", "Served with Ice Cream", [], [], { isKids: true }),
  item("kids-ice-cream-sundae", "Ice Cream Sundae (Kids)", "4.5", "Sprinkles, Berries, Smarties, Chocolate Sauce", [], [], { isKids: true }),
  item("kids-one-scoop", "One Scoop of Ice Cream or Sorbet (Kids)", "3", "Please ask your server for flavours", [], [], { isKids: true })
];

const MENU_BY_VENUE = {
  barKitchen: {
    label: VENUES.barKitchen,
    pdfUrl: MENU_LINKS.barKitchen,
    starterSections: [
      {
        label: "Snacks",
        items: [
          item("pork-scratchings", "Pork Scratchings", "6.5"),
          item("spicy-gordal-olives", "Spicy Gordal Olives", "6.5", "", ["Vegan"]),
          item("warm-sourdough", "Warm Sourdough", "6.5", "Marmite Butter"),
          item("smoked-almonds", "Smoked Almonds", "6.5", "", ["Vegan"])
        ]
      },
      {
        label: "Starters",
        items: [
          item("classic-atlantic-prawn-cocktail", "Classic Atlantic Prawn Cocktail", "13.5", "Iceberg Lettuce, Marie Rose Sauce, Sourdough Toast"),
          item("pea-broad-bean-hummus", "Pea & Broad Bean Hummus", "11", "Pickled Chilli, Garlic Flatbread", ["Vegan"]),
          item("rockwater-seasonal-soup", "Rockwater Seasonal Soup", "9.5", "Sourdough"),
          item("whole-burrata", "Whole Burrata", "14.5", "Tomato & Basil Tartare, Sourdough Toast", ["Vegetarian"]),
          item("devilled-whitebait", "Devilled Whitebait", "8", "Tartare Sauce"),
          item("buffalo-chicken-wings", "Buffalo Chicken Wings", "13", "Blue Cheese Dip"),
          item("salt-pepper-chicken-wings", "Salt & Pepper Chicken Wings", "13", "Sriracha Mayo")
        ]
      }
    ],
    mainSections: [
      {
        label: "Salads",
        items: [
          item("classic-caesar-salad", "Classic Caesar Salad", "18", "Cos, Marinated Anchovies, Parmesan, Caesar Dressing, Garlic Croutons", [], saladExtras),
          item("buddha-bowl", "Buddha Bowl", "18", "Roast Cauliflower Florets, Young Spinach & Herb Salad, Quinoa, Pickled Red Cabbage, Toasted Sunflower Seeds, Salsa Verde, Mint Yoghurt", ["Vegetarian"], saladExtras),
          item("rice-bowl", "Rice Bowl", "18", "Marinated Baked Salmon Fillet or Tofu, Brown Rice, Smashed Avocado with Chilli and Lime, Pickled Cucumber & Radish, Citrus Dressing, Pea Shoots", [], saladExtras)
        ]
      },
      {
        label: "Burgers",
        items: [
          item("rockwater-beef-burger", "Rockwater Beef Burger", "21", "Mature Cheddar, Bacon Jam, Smoked Onion Aioli, Butterleaf Lettuce, Pickled Cucumber, Slaw, Fries", [], beefBurgerExtras),
          item("spicy-chicken-thigh-burger", "Spicy Chicken Thigh Burger", "21", "Sriracha Mayo, Butterleaf Lettuce, Pickled Cucumber, Slaw, Fries", [], chickenBurgerExtras),
          item("moving-mountains-burger", "Moving Mountains Plant Based Burger", "20", "Double Patty, Spicy Mayo, Butterleaf Lettuce, Pickled Cucumber, Slaw, Fries", ["Vegan"], plantBurgerExtras)
        ]
      },
      {
        label: "Mains",
        items: [
          item("grilled-lamb-barnsley-chop", "Grilled Lamb Barnsley Chop", "26", "Provençal Courgettes, Straw Potatoes, Salsa Verde"),
          item("catch-of-the-day", "Catch of the Day", "M.P", "Whole Grilled Fish from Local Day Boats, Seasonal Greens, Caper & Parsley Butter"),
          item("rockwater-battered-haddock", "Rockwater Battered South Coast Haddock", "21", "Crushed Minted Peas, Fries, Tartare Sauce"),
          item("south-coast-mussels-mariniere", "South Coast Mussels Mariniere", "19", "French Fries"),
          item("crab-linguine", "Crab Linguine", "22", "Handpicked Crab Meat, Fermented Chilli Sauce, Dill"),
          item("roast-harissa-aubergine", "Roast Harissa Aubergine", "19", "Tomato, Chickpea & Red Pepper Tagine, Toasted Quinoa, Citrus Labneh, Pine Nuts", ["Vegetarian"])
        ]
      }
    ],
    sides: [
      item("new-potatoes", "New Potatoes", "6.5", "Parsley Butter"),
      item("buttered-seasonal-vegetables", "Buttered Seasonal Vegetables", "6.5"),
      item("french-fries", "French Fries", "6.5"),
      item("waffle-fries-bar-kitchen", "Waffle Fries", "6.5"),
      item("green-salad", "Green Salad", "6.5")
    ],
    desserts: dessertItems,
    kidsMains: kidsMainItems,
    kidsDesserts: kidsDessertItems
  },
  roofTerrace: {
    label: VENUES.roofTerrace,
    pdfUrl: MENU_LINKS.roofTerrace,
    starterSections: [
      {
        label: "Small Plates",
        items: [
          item("rock-oysters-half-dozen", "Rock Oysters", "1/2 Dozen 24", "Shallot Vinegar, Lemon, Sea Herbs"),
          item("rock-oysters-dozen", "Rock Oysters", "Dozen 48", "Shallot Vinegar, Lemon, Sea Herbs"),
          item("dorset-crab-on-toast", "Dorset Crab on Toast", "14"),
          item("chalk-stream-trout-crudo", "Chalk Stream Trout Crudo", "12"),
          item("beef-tartare", "Beef Tartare", "12"),
          item("coppa-ham", "Coppa Ham", "12"),
          item("grilled-tenderstem-broccoli", "Grilled Tenderstem Broccoli", "8", "", ["Vegan"]),
          item("tomato-burrata", "Tomato & Burrata", "15", "", ["Vegetarian"]),
          item("new-forest-asparagus", "New Forest Asparagus", "12", "", ["Vegetarian"]),
          item("salt-baked-heritage-beetroots", "Salt Baked Heritage Beetroots", "14", "", ["Vegan"])
        ]
      },
      {
        label: "Sharers",
        items: [
          item("rockwater-seafood-platter-for-two", "Rockwater Seafood Platter for Two", "75")
        ]
      }
    ],
    mainSections: [
      {
        label: "Mains",
        items: [
          item("king-scallops", "King Scallops", "19"),
          item("bbq-monkfish-skewer", "BBQ Monkfish Skewer", "16"),
          item("aged-beef-fillet-4oz", "4oz Aged Beef Fillet", "22"),
          item("crispy-pork-belly", "Crispy Pork Belly", "16"),
          item("grilled-free-range-suffolk-farm-chicken", "Grilled Free Range Suffolk Farm Chicken", "16")
        ]
      }
    ],
    sides: [
      item("new-potato-salad", "New Potato Salad", "8", "", ["Vegetarian"]),
      item("rocket-coastal-herb-salad", "Rocket & Coastal Herb Salad", "6.5", "", ["Vegan"])
    ],
    desserts: roofTerraceDesserts,
    kidsMains: kidsMainItems,
    kidsDesserts: kidsDessertItems
  },
  thePub: {
    label: VENUES.thePub,
    pdfUrl: MENU_LINKS.thePub,
    starterSections: [
      {
        label: "Snacks",
        items: [
          item("retro-crisps", "Retro Crisps", "1.5"),
          item("olives", "Olives", "6.5", "", ["Vegan", "Gluten-free"]),
          item("pork-scratchings-pub", "Pork Scratchings", "6.5"),
          item("peanuts", "Peanuts", "5", "", ["Vegan"]),
          item("smoked-almonds-pub", "Smoked Almonds", "6.5", "", ["Vegan"]),
          item("rockwater-sausage-roll", "Rockwater Sausage Roll", "8.5"),
          item("plant-based-sausage-roll", "Plant-Based Sausage Roll", "6.5", "", ["Vegan"]),
          item("buffalo-chicken-wings-pub", "Buffalo Chicken Wings", "13"),
          item("salt-pepper-chicken-wings-pub", "Salt & Pepper Chicken Wings", "13")
        ]
      }
    ],
    mainSections: [
      {
        label: "Burgers",
        items: [
          item("rockwater-beef-burger-pub", "Rockwater Beef Burger", "21", "Mature Cheddar, Bacon Jam, Smoked Onion, Aioli, Butterleaf Lettuce, Pickled Cucumber", [], beefBurgerExtras),
          item("spicy-chicken-thigh-burger-pub", "Spicy Chicken Thigh Burger", "21", "Sriracha Mayo, Butterleaf Lettuce, Pickled Cucumber", [], chickenBurgerExtras),
          item("moving-mountains-burger-pub", "Moving Mountains Plant Based Burger", "20", "2 x 4oz Patties, Burger Relish, Tomato Chutney, Butterhead Lettuce, Slaw, Fries", ["Vegan"], plantBurgerExtras),
          item("chicken-goujons-chips", "Chicken Goujons & Chips", "12")
        ]
      },
      {
        label: "Pizzas",
        items: [
          item("margherita", "Margherita", "13", "Tomato, Mozzarella, Basil", ["Vegetarian"], glutenFreePizzaExtra),
          item("double-pepperoni", "Double Pepperoni", "15", "Tomato, Mozzarella, Pepperoni, Hot Honey", [], glutenFreePizzaExtra),
          item("campania", "Campania", "16", "Tomato, Buffalo Mozzarella, Olives, Capers, Anchovies, Oregano & Garlic", [], glutenFreePizzaExtra),
          item("fungi-misti", "Fungi Misti", "17", "Mozzarella, Wild Mushrooms, Garlic & Thyme Veloute, Rocket, Parmesan", ["Vegetarian"], glutenFreePizzaExtra),
          item("diavola", "Diavola", "18", "Tomato, Mozzarella, Salame, Nduja, Roast Red Pepper, Stracciatella, Basil", [], glutenFreePizzaExtra),
          item("lo-carne", "Lo Carne", "18", "Tomato, Mozzarella, Crispy Bacon, Pepperoni, Italian Sausage, Onions, Pecorino", [], glutenFreePizzaExtra),
          item("blue-streaky", "Blue Streaky", "18", "Tomato, Mozzarella, Gorgonzola, Crispy Bacon, Caramelised Onions, Chicory", [], glutenFreePizzaExtra)
        ]
      }
    ],
    sides: [
      item("pizza-garlic-bread", "Pizza Garlic Bread", "10", "", ["Vegetarian"]),
      item("chips", "Chips", "6.5", "", ["Vegan"]),
      item("waffle-fries", "Waffle Fries", "6.5", "", ["Vegan"]),
      item("green-salad-pub", "Green Salad", "6.5", "", ["Vegan"])
    ],
    desserts: pubDesserts,
    kidsMains: kidsMainItems,
    kidsDesserts: kidsDessertItems
  }
};

const refs = {
  siteAccessGate: document.getElementById("siteAccessGate"),
  siteAccessForm: document.getElementById("siteAccessForm"),
  siteAccessEmail: document.getElementById("siteAccessEmail"),
  siteAccessPassword: document.getElementById("siteAccessPassword"),
  guestView: document.getElementById("guestView"),
  staffView: document.getElementById("staffView"),
  heroGuestBtn: document.getElementById("heroGuestBtn"),
  heroStaffBtn: document.getElementById("heroStaffBtn"),
  guestEventTitle: document.getElementById("guestEventTitle"),
  guestEventDate: document.getElementById("guestEventDate"),
  guestEventVenue: document.getElementById("guestEventVenue"),
  guestMenuLabel: document.getElementById("guestMenuLabel"),
  guestDeadlineText: document.getElementById("guestDeadlineText"),
  guestContactText: document.getElementById("guestContactText"),
  guestLockNotice: document.getElementById("guestLockNotice"),
  orderForm: document.getElementById("orderForm"),
  editingOrderId: document.getElementById("editingOrderId"),
  guestName: document.getElementById("guestName"),
  guestEmail: document.getElementById("guestEmail"),
  kidsToggle: document.getElementById("kidsToggle"),
  menuVenue: document.getElementById("menuVenue"),
  selectedMenuLink: document.getElementById("selectedMenuLink"),
  dessertMenuLink: document.getElementById("dessertMenuLink"),
  kidsMenuLink: document.getElementById("kidsMenuLink"),
  starterSelect: document.getElementById("starterSelect"),
  mainSelect: document.getElementById("mainSelect"),
  dessertSelect: document.getElementById("dessertSelect"),
  starterExtrasWrap: document.getElementById("starterExtrasWrap"),
  starterExtrasOptions: document.getElementById("starterExtrasOptions"),
  mainExtrasWrap: document.getElementById("mainExtrasWrap"),
  mainExtrasOptions: document.getElementById("mainExtrasOptions"),
  sidesOptions: document.getElementById("sidesOptions"),
  allergies: document.getElementById("allergies"),
  specialRequests: document.getElementById("specialRequests"),
  submitOrderBtn: document.getElementById("submitOrderBtn"),
  cancelEditBtn: document.getElementById("cancelEditBtn"),
  guestConfirmationPanel: document.getElementById("guestConfirmationPanel"),
  guestOrdersList: document.getElementById("guestOrdersList"),
  guestOrdersEmptyState: document.getElementById("guestOrdersEmptyState"),
  staffPageTitle: document.getElementById("staffPageTitle"),
  staffPageDescription: document.getElementById("staffPageDescription"),
  previewStaffLoginBtn: document.getElementById("previewStaffLoginBtn"),
  addEventBtn: document.getElementById("addEventBtn"),
  demoModeToggleBtn: document.getElementById("demoModeToggleBtn"),
  loadSampleEventBtn: document.getElementById("loadSampleEventBtn"),
  resetDemoBtn: document.getElementById("resetDemoBtn"),
  eventsScreen: document.getElementById("eventsScreen"),
  eventDetailScreen: document.getElementById("eventDetailScreen"),
  eventSetupScreen: document.getElementById("eventSetupScreen"),
  eventsGrid: document.getElementById("eventsGrid"),
  eventsEmptyState: document.getElementById("eventsEmptyState"),
  eventCardTemplate: document.getElementById("eventCardTemplate"),
  detailEventTitle: document.getElementById("detailEventTitle"),
  detailEventDate: document.getElementById("detailEventDate"),
  detailVenue: document.getElementById("detailVenue"),
  detailGuestCount: document.getElementById("detailGuestCount"),
  detailDeadline: document.getElementById("detailDeadline"),
  detailContact: document.getElementById("detailContact"),
  detailDeposit: document.getElementById("detailDeposit"),
  detailLockStatus: document.getElementById("detailLockStatus"),
  backToEventsBtn: document.getElementById("backToEventsBtn"),
  editSetupBtn: document.getElementById("editSetupBtn"),
  copySummaryBtn: document.getElementById("copySummaryBtn"),
  deleteEventBtn: document.getElementById("deleteEventBtn"),
  staffEmailMode: document.getElementById("staffEmailMode"),
  guestEmailRecipientSelect: document.getElementById("guestEmailRecipientSelect"),
  staffEmailPreviewType: document.getElementById("staffEmailPreviewType"),
  sendGuestEmailBtn: document.getElementById("sendGuestEmailBtn"),
  sendStaffEmailNowBtn: document.getElementById("sendStaffEmailNowBtn"),
  toggleGuestEmailBtn: document.getElementById("toggleGuestEmailBtn"),
  toggleStaffEmailBtn: document.getElementById("toggleStaffEmailBtn"),
  staffGuestEmailWrap: document.getElementById("staffGuestEmailWrap"),
  internalEmailWrap: document.getElementById("internalEmailWrap"),
  staffGuestEmailPreview: document.getElementById("staffGuestEmailPreview"),
  internalEmailPreview: document.getElementById("internalEmailPreview"),
  staffLockNotice: document.getElementById("staffLockNotice"),
  searchInput: document.getElementById("searchInput"),
  filterField: document.getElementById("filterField"),
  filterValue: document.getElementById("filterValue"),
  sortSelect: document.getElementById("sortSelect"),
  ordersList: document.getElementById("ordersList"),
  ordersEmptyState: document.getElementById("ordersEmptyState"),
  orderCardTemplate: document.getElementById("orderCardTemplate"),
  kitchenCountTable: document.getElementById("kitchenCountTable"),
  allergySummary: document.getElementById("allergySummary"),
  requestsSummary: document.getElementById("requestsSummary"),
  totalGuests: document.getElementById("totalGuests"),
  totalStarters: document.getElementById("totalStarters"),
  totalMains: document.getElementById("totalMains"),
  totalSides: document.getElementById("totalSides"),
  totalDesserts: document.getElementById("totalDesserts"),
  serviceNotesSummary: document.getElementById("serviceNotesSummary"),
  eventForm: document.getElementById("eventForm"),
  setupEventTitle: document.getElementById("setupEventTitle"),
  eventName: document.getElementById("eventName"),
  eventDate: document.getElementById("eventDate"),
  venueArea: document.getElementById("venueArea"),
  contactName: document.getElementById("contactName"),
  contactEmail: document.getElementById("contactEmail"),
  deadlineHours: document.getElementById("deadlineHours"),
  eventStaffEmailMode: document.getElementById("eventStaffEmailMode"),
  overrideToggle: document.getElementById("overrideToggle"),
  depositToggle: document.getElementById("depositToggle"),
  depositAmount: document.getElementById("depositAmount"),
  staffNotes: document.getElementById("staffNotes"),
  backFromSetupBtn: document.getElementById("backFromSetupBtn"),
  printEventTitle: document.getElementById("printEventTitle"),
  printEventDate: document.getElementById("printEventDate"),
  printVenue: document.getElementById("printVenue"),
  printGuestCount: document.getElementById("printGuestCount"),
  printDeadline: document.getElementById("printDeadline"),
  printKitchenCounts: document.getElementById("printKitchenCounts"),
  printGuestList: document.getElementById("printGuestList"),
  printAllergyList: document.getElementById("printAllergyList"),
  printKitchenBtn: document.getElementById("printKitchenBtn"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  deleteEventModal: document.getElementById("deleteEventModal"),
  deleteEventModalTitle: document.getElementById("deleteEventModalTitle"),
  deleteEventModalCopy: document.getElementById("deleteEventModalCopy"),
  cancelDeleteEventBtn: document.getElementById("cancelDeleteEventBtn"),
  confirmDeleteEventBtn: document.getElementById("confirmDeleteEventBtn"),
  staffAuthPreviewModal: document.getElementById("staffAuthPreviewModal"),
  closeStaffAuthPreviewBtn: document.getElementById("closeStaffAuthPreviewBtn"),
  staffAuthPreviewForm: document.getElementById("staffAuthPreviewForm"),
  authTabSignIn: document.getElementById("authTabSignIn"),
  authTabSignUp: document.getElementById("authTabSignUp"),
  authTabReset: document.getElementById("authTabReset"),
  authUsername: document.getElementById("authUsername"),
  authPasswordLabel: document.getElementById("authPasswordLabel"),
  authPassword: document.getElementById("authPassword"),
  toggleAuthPasswordBtn: document.getElementById("toggleAuthPasswordBtn"),
  authConfirmPasswordLabel: document.getElementById("authConfirmPasswordLabel"),
  authConfirmPassword: document.getElementById("authConfirmPassword"),
  toggleAuthConfirmPasswordBtn: document.getElementById("toggleAuthConfirmPasswordBtn"),
  authPreviewMessage: document.getElementById("authPreviewMessage"),
  submitStaffAuthPreviewBtn: document.getElementById("submitStaffAuthPreviewBtn"),
  appToast: document.getElementById("appToast")
};

let state = loadAppState();
let pendingDeleteEventId = "";
let guestSavedNoticeOrderId = "";
let toastTimer = null;
let authPreviewMode = "signIn";

init();

function init() {
  initSiteAccessGate();
  bindEvents();
  hydrateGuestFormForCurrentEvent();
  render();
}

function initSiteAccessGate() {
  // Prototype-only front-end gate. Replace with server-side authentication before any production use.
  const hasAccess = sessionStorage.getItem("rockwaterPreordersAccess") === "granted";
  document.body.classList.toggle("auth-locked", !hasAccess);

  if (hasAccess) {
    refs.siteAccessGate?.classList.add("hidden");
  }

  refs.siteAccessForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    sessionStorage.setItem("rockwaterPreordersAccess", "granted");
    refs.siteAccessGate.classList.add("hidden");
    document.body.classList.remove("auth-locked");
  });
}

function bindEvents() {
  refs.heroGuestBtn.addEventListener("click", () => switchView("guest"));
  refs.heroStaffBtn.addEventListener("click", () => switchView("staff"));
  refs.orderForm.addEventListener("submit", handleOrderSubmit);
  refs.kidsToggle.addEventListener("change", handleKidsToggleChange);
  refs.starterSelect.addEventListener("change", () => renderExtrasForSlot("starter"));
  refs.mainSelect.addEventListener("change", () => renderExtrasForSlot("main"));
  refs.cancelEditBtn.addEventListener("click", resetGuestForm);
  refs.previewStaffLoginBtn.addEventListener("click", openStaffAuthPreviewModal);
  refs.addEventBtn.addEventListener("click", startNewEvent);
  refs.demoModeToggleBtn.addEventListener("click", toggleDemoMode);
  refs.loadSampleEventBtn.addEventListener("click", loadSampleEvent);
  refs.resetDemoBtn.addEventListener("click", resetDemoState);
  refs.backToEventsBtn.addEventListener("click", () => switchStaffScreen("events"));
  refs.editSetupBtn.addEventListener("click", () => switchStaffScreen("setup"));
  refs.backFromSetupBtn.addEventListener("click", () => switchStaffScreen("events"));
  refs.copySummaryBtn.addEventListener("click", copyEventSummary);
  refs.deleteEventBtn.addEventListener("click", openDeleteEventModal);
  refs.sendGuestEmailBtn.addEventListener("click", sendGuestEmailNow);
  refs.sendStaffEmailNowBtn.addEventListener("click", markStaffEmailSentNow);
  refs.guestEmailRecipientSelect.addEventListener("change", rerenderCurrentEventEmails);
  refs.staffEmailPreviewType.addEventListener("change", rerenderCurrentEventEmails);
  refs.toggleGuestEmailBtn.addEventListener("click", () => toggleEmailPreview("guest"));
  refs.toggleStaffEmailBtn.addEventListener("click", () => toggleEmailPreview("staff"));
  refs.staffEmailMode.addEventListener("change", handleStaffEmailModeChange);
  refs.searchInput.addEventListener("input", (e) => {
    state.filters.search = e.target.value.trim().toLowerCase();
    renderOrdersList(getFilteredOrdersForSelectedEvent());
  });
  refs.filterField.addEventListener("change", (e) => {
    state.filters.field = e.target.value;
    renderOrdersList(getFilteredOrdersForSelectedEvent());
  });
  refs.filterValue.addEventListener("input", (e) => {
    state.filters.value = e.target.value.trim().toLowerCase();
    renderOrdersList(getFilteredOrdersForSelectedEvent());
  });
  refs.sortSelect.addEventListener("change", (e) => {
    state.filters.sort = e.target.value;
    renderOrdersList(getFilteredOrdersForSelectedEvent());
  });
  refs.eventForm.addEventListener("submit", handleEventSetupSave);
  refs.overrideToggle.addEventListener("click", () => toggleSelectedEventFlag("adminOverride", refs.overrideToggle));
  refs.depositToggle.addEventListener("click", () => toggleSelectedEventFlag("depositTaken", refs.depositToggle));
  refs.printKitchenBtn.addEventListener("click", () => window.print());
  refs.exportCsvBtn.addEventListener("click", exportSelectedEventCsv);
  refs.cancelDeleteEventBtn.addEventListener("click", closeDeleteEventModal);
  refs.confirmDeleteEventBtn.addEventListener("click", confirmDeleteEvent);
  refs.closeStaffAuthPreviewBtn.addEventListener("click", closeStaffAuthPreviewModal);
  refs.staffAuthPreviewForm.addEventListener("submit", handleStaffAuthPreviewSubmit);
  [refs.authTabSignIn, refs.authTabSignUp, refs.authTabReset].forEach((button) => {
    button.addEventListener("click", () => setAuthPreviewMode(button.dataset.authMode));
  });
  refs.toggleAuthPasswordBtn.addEventListener("click", () => togglePasswordField(refs.authPassword, refs.toggleAuthPasswordBtn));
  refs.toggleAuthConfirmPasswordBtn.addEventListener("click", () => togglePasswordField(refs.authConfirmPassword, refs.toggleAuthConfirmPasswordBtn));
  refs.deleteEventModal.addEventListener("click", (event) => {
    if (event.target === refs.deleteEventModal) {
      closeDeleteEventModal();
    }
  });
  refs.staffAuthPreviewModal.addEventListener("click", (event) => {
    if (event.target === refs.staffAuthPreviewModal) {
      closeStaffAuthPreviewModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !refs.deleteEventModal.classList.contains("hidden")) {
      closeDeleteEventModal();
    }
    if (event.key === "Escape" && !refs.staffAuthPreviewModal.classList.contains("hidden")) {
      closeStaffAuthPreviewModal();
    }
  });
}

function loadAppState() {
  const storedEvents = loadFromStorage(STORAGE_KEYS.events, null);
  const orders = loadFromStorage(STORAGE_KEYS.orders, []);
  const ui = loadFromStorage(STORAGE_KEYS.ui, null);
  const events = Array.isArray(storedEvents) ? sanitizeEvents(storedEvents) : null;

  if (events && Array.isArray(events) && ui) {
    const selectedEventId = events.some((event) => event.id === ui.selectedEventId)
      ? ui.selectedEventId
      : events[0]?.id || "";
    return {
      view: ui.view || "guest",
      staffScreen: "events",
      demoMode: Boolean(ui.demoMode),
      selectedEventId,
      lastGuestOrderId: ui.lastGuestOrderId || "",
      draftEvent: null,
      emailPanels: {
        guestCollapsed: Boolean(ui.emailPanels?.guestCollapsed),
        staffCollapsed: Boolean(ui.emailPanels?.staffCollapsed)
      },
      events,
      orders: orders.map(normalizeOrder),
      filters: { search: "", field: "all", value: "", sort: "recent" }
    };
  }

  const legacyEvent = loadFromStorage(STORAGE_KEYS.legacyEvent, null);
  if (legacyEvent && typeof legacyEvent === "object") {
    const migratedEvent = {
      ...createEmptyEvent(),
      id: `event-${Date.now()}`,
      name: legacyEvent.eventName || "",
      date: legacyEvent.eventDate || "",
      venueArea: legacyEvent.venueArea || "",
      contactName: legacyEvent.contactName || "",
      contactEmail: legacyEvent.contactEmail || "",
      deadlineHours: Number(legacyEvent.deadlineHours) || 48,
      adminOverride: Boolean(legacyEvent.adminOverride),
      depositTaken: false,
      depositAmount: "",
      staffNotes: legacyEvent.staffNotes || "",
      staffEmailMode: "deadline",
      lastStaffEmailSentAt: "",
      guestEmailSimulatedAt: ""
    };
    return {
      view: "guest",
      staffScreen: "events",
      demoMode: false,
      selectedEventId: migratedEvent.id,
      lastGuestOrderId: "",
      draftEvent: null,
      emailPanels: {
        guestCollapsed: false,
        staffCollapsed: false
      },
      events: [migratedEvent],
      orders: orders.map((order) => normalizeOrder({ ...order, eventId: migratedEvent.id })),
      filters: { search: "", field: "all", value: "", sort: "recent" }
    };
  }

  return createDemoState();
}

function normalizeOrder(order) {
  if (order.starterId || order.mainId || order.dessertId) {
    return {
      ...order,
      starterExtras: order.starterExtras || [],
      mainExtras: order.mainExtras || [],
      sides: order.sides || [],
      isKids: Boolean(order.isKids),
      edited: Boolean(order.edited),
      guestToken: order.guestToken || createGuestToken(),
      editLink: order.editLink || buildEditLink(order.eventId || DEMO_EVENT_ID, order.guestToken || createGuestToken())
    };
  }

  const venueKey = order.menuVenue || "barKitchen";
  const starterId = matchItemIdByLabel(venueKey, "starter", order.starter);
  const mainId = matchItemIdByLabel(venueKey, "main", order.main);
  const dessertId = matchItemIdByLabel(venueKey, "dessert", order.dessert);
  const guestToken = order.guestToken || createGuestToken();
  return {
    id: order.id || `order-${Date.now()}`,
    eventId: order.eventId || DEMO_EVENT_ID,
    guestName: order.guestName || "",
    guestEmail: order.guestEmail || "",
    menuVenue: venueKey,
    starterId,
    starterExtras: [],
    mainId,
    mainExtras: [],
    sides: [],
    dessertId,
    isKids: Boolean(order.isKids),
    allergies: order.allergies || "",
    specialRequests: order.specialRequests || "",
    guestToken,
    editLink: order.editLink || buildEditLink(order.eventId || DEMO_EVENT_ID, guestToken),
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || new Date().toISOString(),
    edited: Boolean(order.edited)
  };
}

function createDemoState() {
  const demoEvent = {
    id: DEMO_EVENT_ID,
    name: "Rockwater Summer Celebration",
    date: createFutureDatetime(10, 19, 30),
    venueArea: "barKitchen",
    contactName: "Hannah Lewis",
    contactEmail: "hannah@example.com",
    deadlineHours: 48,
    adminOverride: false,
    depositTaken: true,
    depositAmount: "£500.00",
    staffNotes: "Welcome drink on arrival. Birthday speech after mains. Table near sea-facing side.",
    staffEmailMode: "deadline",
    lastStaffEmailSentAt: "",
    guestEmailSimulatedAt: ""
  };

  const avaToken = createGuestToken();
  const noahToken = createGuestToken();

  return {
    view: "guest",
    staffScreen: "events",
    demoMode: true,
    selectedEventId: demoEvent.id,
    lastGuestOrderId: "",
    draftEvent: null,
    emailPanels: {
      guestCollapsed: false,
      staffCollapsed: false
    },
    events: [demoEvent],
    orders: [
      {
        id: "order-demo-1",
        eventId: demoEvent.id,
        guestName: "Ava Thompson",
        guestEmail: "ava@example.com",
        menuVenue: "barKitchen",
        starterId: "classic-atlantic-prawn-cocktail",
        starterExtras: [],
        mainId: "classic-caesar-salad",
        mainExtras: ["confit-chicken-leg"],
        sides: ["green-salad"],
        dessertId: "kiwi-pannacotta",
        isKids: false,
        allergies: "Shellfish allergy",
        specialRequests: "Seat near family",
        guestToken: avaToken,
        editLink: buildEditLink(demoEvent.id, avaToken),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        edited: false
      },
      {
        id: "order-demo-2",
        eventId: demoEvent.id,
        guestName: "Noah Patel",
        guestEmail: "",
        menuVenue: "barKitchen",
        starterId: "",
        starterExtras: [],
        mainId: "moving-mountains-burger",
        mainExtras: [],
        sides: ["french-fries", "green-salad"],
        dessertId: "plant-based-raspberry-pistachio-frangipane-tart",
        isKids: false,
        allergies: "Vegan",
        specialRequests: "None noted",
        guestToken: noahToken,
        editLink: buildEditLink(demoEvent.id, noahToken),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        edited: true
      }
    ],
    filters: { search: "", field: "all", value: "", sort: "recent" }
  };
}

function createEmptyEvent() {
  return {
    id: `event-${Date.now()}`,
    name: "",
    date: "",
    venueArea: "",
    contactName: "",
    contactEmail: "",
    deadlineHours: 48,
    adminOverride: false,
    depositTaken: false,
    depositAmount: "",
    staffNotes: "",
    staffEmailMode: "deadline",
    lastStaffEmailSentAt: "",
    guestEmailSimulatedAt: ""
  };
}

function sanitizeEvents(events) {
  return events
    .map((event) => normalizeEvent(event))
    .filter((event) => event.id && !isEmptyLegacyEvent(event));
}

function normalizeEvent(event) {
  const base = createEmptyEvent();
  return {
    ...base,
    ...event,
    id: event?.id || base.id,
    name: event?.name || "",
    date: event?.date || "",
    venueArea: event?.venueArea || "",
    contactName: event?.contactName || "",
    contactEmail: event?.contactEmail || "",
    deadlineHours: Number(event?.deadlineHours) || 48,
    adminOverride: Boolean(event?.adminOverride),
    depositTaken: Boolean(event?.depositTaken),
    depositAmount: event?.depositAmount || "",
    staffNotes: event?.staffNotes || "",
    staffEmailMode: event?.staffEmailMode || "deadline",
    lastStaffEmailSentAt: event?.lastStaffEmailSentAt || "",
    guestEmailSimulatedAt: event?.guestEmailSimulatedAt || ""
  };
}

function isEmptyLegacyEvent(event) {
  return !event.name && !event.date && !event.venueArea && !event.contactName && !event.contactEmail && !event.staffNotes && !event.depositAmount;
}

function persistState() {
  localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(state.events));
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(state.orders));
  localStorage.setItem(STORAGE_KEYS.ui, JSON.stringify({
    view: state.view,
    staffScreen: state.staffScreen,
    demoMode: state.demoMode,
    selectedEventId: state.selectedEventId,
    lastGuestOrderId: state.lastGuestOrderId,
    emailPanels: state.emailPanels
  }));
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getSelectedEvent() {
  return state.events.find((event) => event.id === state.selectedEventId) || state.events[0] || null;
}

function getOrdersForEvent(eventId = state.selectedEventId) {
  return state.orders.filter((order) => order.eventId === eventId);
}

function getLatestGuestOrder() {
  return state.orders.find((order) => order.id === state.lastGuestOrderId) || null;
}

function hydrateGuestFormForCurrentEvent(options = {}) {
  const event = getSelectedEvent();
  const lockedVenue = event?.venueArea || "";
  refs.menuVenue.value = lockedVenue in VENUES ? lockedVenue : "";
  refs.guestMenuLabel.textContent = getVenueLabel(refs.menuVenue.value) || "To be confirmed";
  refs.kidsToggle.checked = Boolean(options.isKids);
  populateCourseSelects(refs.menuVenue.value, options);
  updateMenuLink();
}

function populateCourseSelects(venueKey, options = {}) {
  if (!MENU_BY_VENUE[venueKey]) {
    buildGroupedSelect(refs.starterSelect, [], "Menu to be confirmed");
    buildGroupedSelect(refs.mainSelect, [], "Menu to be confirmed");
    buildFlatSelect(refs.dessertSelect, [], "Menu to be confirmed");
    renderSidesOptions("", []);
    renderExtrasForSlot("starter");
    renderExtrasForSlot("main");
    return;
  }
  const menu = MENU_BY_VENUE[venueKey];
  const isKids = Boolean(options.isKids ?? refs.kidsToggle.checked);
  if (isKids) {
    buildGroupedSelect(refs.starterSelect, [], "No starter");
    refs.starterSelect.disabled = true;
    buildGroupedSelect(refs.mainSelect, [{ label: "Kids menu", items: menu.kidsMains || [] }], "Please choose a kids main");
    buildFlatSelect(refs.dessertSelect, [...menu.desserts, ...(menu.kidsDesserts || [])], "No dessert");
  } else {
    buildGroupedSelect(refs.starterSelect, menu.starterSections, "No starter");
    refs.starterSelect.disabled = false;
    buildGroupedSelect(refs.mainSelect, menu.mainSections, "Please choose a main");
    buildFlatSelect(refs.dessertSelect, menu.desserts, "No dessert");
  }
  renderSidesOptions(venueKey, options.keepSides ? getSelectedSideIds() : []);
  renderExtrasForSlot("starter");
  renderExtrasForSlot("main");
}

function buildGroupedSelect(select, sections, emptyLabel) {
  const currentValue = select.value;
  select.innerHTML = `<option value="">${escapeHtml(emptyLabel)}</option>` + sections.map((section) => {
    const options = section.items.map((menuItem) => `<option value="${menuItem.id}">${escapeHtml(formatDishLabel(menuItem))}</option>`).join("");
    return `<optgroup label="${escapeAttribute(section.label)}">${options}</optgroup>`;
  }).join("");
  if ([...select.options].some((option) => option.value === currentValue)) {
    select.value = currentValue;
  }
}

function buildFlatSelect(select, items, emptyLabel) {
  const currentValue = select.value;
  select.innerHTML = `<option value="">${escapeHtml(emptyLabel)}</option>` + items.map((menuItem) => (
    `<option value="${menuItem.id}">${escapeHtml(formatDishLabel(menuItem))}</option>`
  )).join("");
  if ([...select.options].some((option) => option.value === currentValue)) {
    select.value = currentValue;
  }
}

function renderSidesOptions(venueKey, selectedIds = []) {
  const sideItems = MENU_BY_VENUE[venueKey]?.sides || [];
  refs.sidesOptions.innerHTML = sideItems.map((side) => `
    <label class="checkbox-chip">
      <input type="checkbox" name="sideOption" value="${side.id}" ${selectedIds.includes(side.id) ? "checked" : ""}>
      <span>${escapeHtml(formatDishLabel(side))}</span>
    </label>
  `).join("");
}

function renderExtrasForSlot(slot) {
  const venueKey = refs.menuVenue.value;
  const menuItem = slot === "starter" ? getStarterItemById(venueKey, refs.starterSelect.value) : getMainItemById(venueKey, refs.mainSelect.value);
  const wrap = slot === "starter" ? refs.starterExtrasWrap : refs.mainExtrasWrap;
  const optionsContainer = slot === "starter" ? refs.starterExtrasOptions : refs.mainExtrasOptions;
  const selectedExtras = getSelectedExtraIds(slot);

  if (!menuItem?.extras?.length) {
    wrap.classList.add("hidden");
    optionsContainer.innerHTML = "";
    return;
  }

  wrap.classList.remove("hidden");
  optionsContainer.innerHTML = menuItem.extras.map((menuExtra) => `
    <label class="checkbox-chip">
      <input type="checkbox" name="${slot}ExtraOption" value="${menuExtra.id}" ${selectedExtras.includes(menuExtra.id) ? "checked" : ""}>
      <span>${escapeHtml(formatExtraLabel(menuExtra))}</span>
    </label>
  `).join("");
}

function getSelectedExtraIds(slot) {
  const selector = slot === "starter" ? "input[name='starterExtraOption']:checked" : "input[name='mainExtraOption']:checked";
  return Array.from(document.querySelectorAll(selector)).map((input) => input.value);
}

function getSelectedSideIds() {
  return Array.from(document.querySelectorAll("input[name='sideOption']:checked")).map((input) => input.value);
}

function updateMenuLink() {
  const venueKey = refs.menuVenue.value;
  refs.selectedMenuLink.href = MENU_BY_VENUE[venueKey]?.pdfUrl || MENU_LINKS.barKitchen;
  refs.selectedMenuLink.textContent = `View ${getVenueLabel(venueKey) || "venue"} menu`;
  refs.selectedMenuLink.classList.toggle("hidden", !venueKey);
  refs.dessertMenuLink.classList.toggle("hidden", !venueKey || venueKey === "thePub");
  refs.kidsMenuLink.classList.toggle("hidden", !refs.kidsToggle.checked);
}

function switchView(view) {
  state.view = view;
  if (view === "staff") {
    state.staffScreen = "events";
  }
  persistState();
  render();
}

function switchStaffScreen(screen) {
  state.staffScreen = screen;
  if (screen !== "setup") {
    state.draftEvent = null;
  }
  persistState();
  render();
}

function render() {
  renderViewState();
  renderGuestEvent();
  renderGuestConfirmation();
  renderGuestOrdersSection();
  renderStaffToolbar();
  renderEventsGrid();
  renderStaffScreen();
  renderPrintSheet();
}

function renderViewState() {
  const guestActive = state.view === "guest";
  refs.guestView.classList.toggle("hidden", !guestActive);
  refs.staffView.classList.toggle("hidden", guestActive);
  refs.heroGuestBtn.classList.toggle("is-active", guestActive);
  refs.heroStaffBtn.classList.toggle("is-active", !guestActive);
}

function renderGuestEvent() {
  const event = getSelectedEvent();
  if (!event) {
    refs.guestEventTitle.textContent = "Private event";
    refs.guestEventDate.textContent = "To be confirmed";
    refs.guestEventVenue.textContent = "Rockwater Hove";
    refs.guestMenuLabel.textContent = "To be confirmed";
    refs.guestDeadlineText.textContent = "Set event to calculate";
    refs.guestContactText.textContent = "To be confirmed";
    updateNotice(refs.guestLockNotice, "Event details will appear here once Rockwater confirms the event and menu.");
    updateGuestFormLock(null);
    return;
  }
  refs.guestEventTitle.textContent = event.name || "Private event";
  refs.guestEventDate.textContent = event.date ? formatDate(event.date) : "To be confirmed";
  refs.guestEventVenue.textContent = getVenueLabel(event.venueArea) || "Rockwater Hove";
  refs.guestMenuLabel.textContent = getVenueLabel(event.venueArea) || "To be confirmed";
  refs.guestDeadlineText.textContent = getDeadlineText(event);
  refs.guestContactText.textContent = buildContactText(event);
  updateNotice(refs.guestLockNotice, getGuestLockMessage(event));
  updateGuestFormLock(event);
}

function updateGuestFormLock(event) {
  const locked = isEventLocked(event) || !event?.venueArea;
  Array.from(refs.orderForm.elements).forEach((element) => {
    if (element.id !== "editingOrderId") {
      element.disabled = locked;
    }
  });
  Array.from(document.querySelectorAll("input[name='sideOption'], input[name='starterExtraOption'], input[name='mainExtraOption']")).forEach((input) => {
    input.disabled = locked;
  });
  if (!locked && refs.kidsToggle.checked) {
    refs.starterSelect.disabled = true;
  }
}

function getGuestLockMessage(event) {
  if (!event.venueArea) {
    return "Menu details will appear here once Rockwater confirms the event venue.";
  }
  if (!event.date) {
    return "Event details will appear here once Rockwater confirms the date and ordering window.";
  }
  if (isEventLocked(event)) {
    return `Pre-orders closed on <strong>${formatDate(computeDeadlineDate(event))}</strong>. Please contact the organiser or Rockwater team if you need help.`;
  }
  return `You can update your pre-order until <strong>${formatDate(computeDeadlineDate(event))}</strong>.`;
}

function renderGuestConfirmation() {
  const order = getLatestGuestOrder();
  if (!order || order.eventId !== state.selectedEventId || guestSavedNoticeOrderId !== order.id) {
    refs.guestConfirmationPanel.classList.add("hidden");
    return;
  }
  refs.guestConfirmationPanel.classList.remove("hidden");
}

function renderGuestOrdersSection() {
  const event = getSelectedEvent();
  const orders = event ? getOrdersForEvent(event.id) : [];
  renderOrderCards(refs.guestOrdersList, refs.guestOrdersEmptyState, orders);
}

function renderStaffToolbar() {
  refs.demoModeToggleBtn.textContent = `Demo mode: ${state.demoMode ? "On" : "Off"}`;
}

function renderEventsGrid() {
  refs.eventsGrid.innerHTML = "";
  refs.eventsEmptyState.classList.toggle("hidden", state.events.length !== 0);
  state.events.forEach((event) => {
    const fragment = refs.eventCardTemplate.content.cloneNode(true);
    const orders = getOrdersForEvent(event.id);
    const allergyCount = orders.filter((order) => order.allergies).length;
    const deadlineBadge = fragment.querySelector(".event-status");
    fragment.querySelector(".event-card-title").textContent = event.name || "Untitled event";
    fragment.querySelector(".event-card-meta").textContent = `${event.date ? formatDate(event.date) : "Date not set"} · ${getVenueLabel(event.venueArea) || "Venue not selected"}`;
    fragment.querySelector(".event-guests").textContent = String(orders.length);
    fragment.querySelector(".event-allergies").textContent = String(allergyCount);
    deadlineBadge.textContent = getEventStatusLabel(event);
    deadlineBadge.classList.toggle("is-locked", isEventLocked(event));
    deadlineBadge.classList.toggle("is-open", !isEventLocked(event));
    deadlineBadge.addEventListener("click", () => openStaffEvent(event.id, "detail"));
    fragment.querySelector(".copy-link-btn").addEventListener("click", () => copyEventGuestLink(event));
    fragment.querySelector(".view-event-btn").addEventListener("click", () => openStaffEvent(event.id, "detail"));
    fragment.querySelector(".edit-event-btn").addEventListener("click", () => openStaffEvent(event.id, "setup"));
    refs.eventsGrid.appendChild(fragment);
  });
}

function openStaffEvent(eventId, screen = "detail") {
  const event = state.events.find((eventItem) => eventItem.id === eventId);
  if (!event) {
    return;
  }
  state.selectedEventId = event.id;
  state.draftEvent = null;
  state.staffScreen = screen;
  persistState();
  render();
}

function getEventStatusLabel(event) {
  if (state.demoMode) {
    return "Demo active";
  }
  if (!event.date || !event.venueArea || !event.name) {
    return "Awaiting setup";
  }
  return isEventLocked(event) ? "Deadline passed" : "Open";
}

function renderStaffScreen() {
  refs.eventsScreen.classList.toggle("hidden", state.staffScreen !== "events");
  refs.eventDetailScreen.classList.toggle("hidden", state.staffScreen !== "detail");
  refs.eventSetupScreen.classList.toggle("hidden", state.staffScreen !== "setup");

  if (state.staffScreen === "events") {
    refs.staffPageTitle.textContent = "Events";
    refs.staffPageDescription.textContent = "Choose an event to manage guest orders, setup, and kitchen handover.";
    return;
  }

  const event = state.draftEvent || getSelectedEvent();
  if (!event) {
    return;
  }

  if (state.staffScreen === "setup") {
    refs.staffPageTitle.textContent = state.draftEvent ? "Add new event" : "Edit setup";
    refs.staffPageDescription.textContent = "Update the selected event details, deadline, deposit, notes, and staff email behaviour.";
    hydrateEventSetupForm(event);
    return;
  }

  refs.staffPageTitle.textContent = "Event detail";
  refs.staffPageDescription.textContent = "Guest orders, kitchen counts, allergy notes, requests, print sheet, and export all in one place.";
  renderEventDetail(event);
}

function hydrateEventSetupForm(event) {
  refs.setupEventTitle.textContent = event.name || "Edit setup";
  refs.eventName.value = event.name;
  refs.eventDate.value = event.date;
  refs.venueArea.value = event.venueArea;
  refs.contactName.value = event.contactName;
  refs.contactEmail.value = event.contactEmail;
  refs.deadlineHours.value = event.deadlineHours;
  refs.eventStaffEmailMode.value = event.staffEmailMode;
  refs.depositAmount.value = event.depositAmount;
  refs.staffNotes.value = event.staffNotes;
  syncToggle(refs.overrideToggle, event.adminOverride);
  syncToggle(refs.depositToggle, event.depositTaken);
  refs.depositAmount.disabled = !event.depositTaken;
}

function renderEventDetail(event) {
  const filteredOrders = getFilteredOrdersForSelectedEvent();
  const eventOrders = getOrdersForEvent(event.id);

  refs.detailEventTitle.textContent = event.name || "Selected event";
  refs.detailEventDate.textContent = event.date ? formatDate(event.date) : "To be confirmed";
  refs.detailVenue.textContent = getVenueLabel(event.venueArea) || "Not selected";
  refs.detailGuestCount.textContent = String(eventOrders.length);
  refs.detailDeadline.textContent = getDeadlineText(event);
  refs.detailContact.textContent = buildContactText(event);
  refs.detailDeposit.textContent = event.depositTaken ? event.depositAmount || "Taken" : "Not taken";
  refs.detailLockStatus.textContent = getEventStatusLabel(event);
  refs.staffEmailMode.value = event.staffEmailMode;
  updateNotice(refs.staffLockNotice, getStaffLockMessage(event));
  renderOrdersList(filteredOrders);
  renderKitchenSummary(event, eventOrders);
  renderStaffEmailPreviews(event, eventOrders);
}

function getFilteredOrdersForSelectedEvent() {
  const eventOrders = getOrdersForEvent();
  const { search, field, value, sort } = state.filters;
  const filtered = eventOrders.filter((order) => {
    const haystack = [
      order.guestName,
      getVenueLabel(order.menuVenue),
      formatSelection(order.menuVenue, "starter", order.starterId),
      formatSelection(order.menuVenue, "main", order.mainId),
      formatSelection(order.menuVenue, "dessert", order.dessertId),
      formatSides(order.menuVenue, order.sides),
      formatExtras(order.menuVenue, "starter", order.starterId, order.starterExtras),
      formatExtras(order.menuVenue, "main", order.mainId, order.mainExtras),
      order.allergies,
      order.specialRequests
    ].join(" ").toLowerCase();

    if (search && !haystack.includes(search)) {
      return false;
    }
    if (!value) {
      return true;
    }
    if (field === "all") {
      return haystack.includes(value);
    }
    if (field === "menuVenue") {
      return getVenueLabel(order.menuVenue).toLowerCase().includes(value);
    }
    if (field === "starter") {
      return formatSelection(order.menuVenue, "starter", order.starterId).toLowerCase().includes(value);
    }
    if (field === "main") {
      return formatSelection(order.menuVenue, "main", order.mainId).toLowerCase().includes(value);
    }
    if (field === "dessert") {
      return formatSelection(order.menuVenue, "dessert", order.dessertId).toLowerCase().includes(value);
    }
    if (field === "sides") {
      return formatSides(order.menuVenue, order.sides).toLowerCase().includes(value);
    }
    if (field === "extras") {
      return `${formatExtras(order.menuVenue, "starter", order.starterId, order.starterExtras)} ${formatExtras(order.menuVenue, "main", order.mainId, order.mainExtras)}`.toLowerCase().includes(value);
    }
    if (field === "allergies") {
      return (order.allergies || "").toLowerCase().includes(value);
    }
    return haystack.includes(value);
  });

  return filtered.sort((a, b) => {
    if (sort === "name") {
      return a.guestName.localeCompare(b.guestName);
    }
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
}

function renderOrdersList(orders) {
  renderOrderCards(refs.ordersList, refs.ordersEmptyState, orders);
}

function renderOrderCards(container, emptyState, orders) {
  container.innerHTML = "";
  emptyState.classList.toggle("hidden", orders.length !== 0);
  orders.forEach((order) => {
    const fragment = refs.orderCardTemplate.content.cloneNode(true);
    fragment.querySelector(".guest-title").textContent = order.guestName;
    fragment.querySelector(".guest-meta").textContent = `${getVenueLabel(order.menuVenue)}${order.isKids ? " · Kids order" : ""}`;
    fragment.querySelector(".starter-value").textContent = formatSelection(order.menuVenue, "starter", order.starterId) || "No starter";
    fragment.querySelector(".main-value").textContent = formatSelection(order.menuVenue, "main", order.mainId) || "No main selected";
    fragment.querySelector(".dessert-value").textContent = formatSelection(order.menuVenue, "dessert", order.dessertId) || "No dessert";
    fragment.querySelector(".extras-row").textContent = buildExtrasRowText(order);
    fragment.querySelector(".sides-row").textContent = `Sides: ${formatSides(order.menuVenue, order.sides)}`;
    const allergyRow = fragment.querySelector(".allergy-row");
    allergyRow.textContent = order.allergies ? `Allergy warning: ${order.allergies}` : "Allergy warning: None noted";
    allergyRow.classList.toggle("is-alert", Boolean(order.allergies));
    fragment.querySelector(".request-row").textContent = order.specialRequests ? `Special requests: ${order.specialRequests}` : "Special requests: None noted";
    fragment.querySelector(".link-row").textContent = `Edit link generated · ${order.edited ? "Edited" : "Original"} · Last updated ${formatShortDate(order.updatedAt)}`;
    const editButton = fragment.querySelector(".edit-order-btn");
    const deleteButton = fragment.querySelector(".delete-order-btn");
    editButton.disabled = isEventLocked(getSelectedEvent());
    deleteButton.disabled = isEventLocked(getSelectedEvent());
    editButton.addEventListener("click", () => loadOrderIntoGuestForm(order.id));
    deleteButton.addEventListener("click", () => deleteOrder(order.id));
    container.appendChild(fragment);
  });
}

function buildExtrasRowText(order) {
  const starterExtras = formatExtras(order.menuVenue, "starter", order.starterId, order.starterExtras);
  const mainExtras = formatExtras(order.menuVenue, "main", order.mainId, order.mainExtras);
  const pieces = [];
  if (starterExtras) {
    pieces.push(`Starter add-ons: ${starterExtras}`);
  }
  if (mainExtras) {
    pieces.push(`Main add-ons: ${mainExtras}`);
  }
  return pieces.length ? pieces.join(" · ") : "Add-ons: None";
}

function renderKitchenSummary(event, orders) {
  renderSummaryList(refs.kitchenCountTable, buildKitchenCounts(orders), "No kitchen counts yet");
  renderSummaryList(refs.allergySummary, buildAllergySummary(orders), "No allergy or dietary notes recorded");
  renderSummaryList(refs.requestsSummary, buildRequestSummary(orders), "No special requests recorded");
  renderSummaryList(refs.serviceNotesSummary, buildServiceNotesSummary(event), "No staff notes recorded");

  refs.totalGuests.textContent = String(orders.length);
  refs.totalStarters.textContent = String(orders.filter((o) => o.starterId).length);
  refs.totalMains.textContent = String(orders.filter((o) => o.mainId).length);
  refs.totalSides.textContent = String(orders.reduce((count, order) => count + order.sides.length, 0));
  refs.totalDesserts.textContent = String(orders.filter((o) => o.dessertId).length);
}

function buildKitchenCounts(orders) {
  const counts = new Map();

  orders.forEach((order) => {
    const mainCourse = order.isKids ? "Kids Main" : "Main";
    const dessertCourse = isKidsDessert(order.menuVenue, order.dessertId) ? "Kids Dessert" : "Dessert";
    addKitchenCount(counts, "Starter", formatSelection(order.menuVenue, "starter", order.starterId), formatExtras(order.menuVenue, "starter", order.starterId, order.starterExtras));
    addKitchenCount(counts, mainCourse, formatSelection(order.menuVenue, "main", order.mainId), formatExtras(order.menuVenue, "main", order.mainId, order.mainExtras));
    addKitchenCount(counts, dessertCourse, formatSelection(order.menuVenue, "dessert", order.dessertId), "");
    order.sides.forEach((sideId) => addKitchenCount(counts, "Side", formatSelection(order.menuVenue, "side", sideId), ""));
  });

  const courseOrder = {
    Starter: 1,
    Main: 2,
    "Kids Main": 3,
    Side: 4,
    Dessert: 5,
    "Kids Dessert": 6
  };

  return Array.from(counts.values()).sort((a, b) => {
    const courseDiff = (courseOrder[a.course] || 99) - (courseOrder[b.course] || 99);
    if (courseDiff !== 0) {
      return courseDiff;
    }
    return a.dish.localeCompare(b.dish);
  });
}

function addKitchenCount(counts, course, dish, extrasText) {
  if (!dish) {
    return;
  }
  const key = `${course}|${dish}|${extrasText}`;
  if (!counts.has(key)) {
    counts.set(key, {
      label: `${course} · ${dish}${extrasText ? ` · ${extrasText}` : ""}`,
      value: "0",
      course,
      dish,
      extras: extrasText
    });
  }
  const entry = counts.get(key);
  entry.value = String(Number(entry.value) + 1);
}

function buildAllergySummary(orders) {
  return orders
    .filter((order) => order.allergies)
    .map((order) => ({ label: order.guestName, value: order.allergies }));
}

function buildRequestSummary(orders) {
  return orders
    .filter((order) => order.specialRequests && order.specialRequests.toLowerCase() !== "none noted")
    .map((order) => ({ label: order.guestName, value: order.specialRequests }));
}

function buildServiceNotesSummary(event) {
  const rows = [];
  if (event.depositTaken) {
    rows.push({ label: "Deposit", value: event.depositAmount || "Taken" });
  }
  if (event.staffNotes) {
    rows.push({ label: "Staff notes", value: event.staffNotes });
  }
  return rows;
}

function renderSummaryList(container, items, emptyMessage) {
  if (!items.length) {
    container.innerHTML = `<p class="empty-copy">${emptyMessage}</p>`;
    return;
  }
  container.innerHTML = items.map((item) => `<div class="summary-item"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`).join("");
}

function renderStaffEmailPreviews(event, orders) {
  populateGuestEmailRecipientOptions(event.id, orders);
  const selectedGuestOrder = getSelectedGuestEmailOrder(event.id, orders);
  const previewType = refs.staffEmailPreviewType.value || "summary";

  refs.staffGuestEmailPreview.innerHTML = selectedGuestOrder
    ? buildGuestEmailPreview(event, selectedGuestOrder)
    : buildEmptyEmailPreview("Guest confirmation email", "A guest confirmation preview will appear here after the first submission.");

  refs.internalEmailPreview.innerHTML = previewType === "fullList"
    ? buildFullPreorderListEmailPreview(event, orders)
    : buildStaffEmailPreview(event, orders);

  refs.sendStaffEmailNowBtn.textContent = previewType === "fullList" ? "Send Full List Email" : "Send Staff Email";
  syncEmailPanel("guest");
  syncEmailPanel("staff");
}

function getLatestOrderForEvent(eventId) {
  return getOrdersForEvent(eventId).slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] || null;
}

function populateGuestEmailRecipientOptions(eventId, orders) {
  const sortedOrders = orders.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const currentValue = refs.guestEmailRecipientSelect.value;
  refs.guestEmailRecipientSelect.innerHTML = sortedOrders.length
    ? sortedOrders.map((order, index) => (
      `<option value="${order.id}">${escapeHtml(order.guestName)}${order.guestEmail ? ` · ${escapeHtml(order.guestEmail)}` : " · No email provided"}${index === 0 ? " · Latest" : ""}</option>`
    )).join("")
    : `<option value="">No guest orders yet</option>`;

  const validSelection = sortedOrders.some((order) => order.id === currentValue);
  refs.guestEmailRecipientSelect.value = validSelection ? currentValue : sortedOrders[0]?.id || "";
  refs.guestEmailRecipientSelect.disabled = !sortedOrders.length;
}

function getSelectedGuestEmailOrder(eventId, orders) {
  const selectedId = refs.guestEmailRecipientSelect.value;
  return orders.find((order) => order.id === selectedId) || getLatestOrderForEvent(eventId);
}

function buildGuestEmailPreview(event, order) {
  const orderRows = [
    ["Menu", getVenueLabel(order.menuVenue)],
    ["Starter / small plate", formatSelection(order.menuVenue, "starter", order.starterId) || "No starter"],
    ["Main", formatSelection(order.menuVenue, "main", order.mainId) || "No main selected"],
    ["Sides", formatSides(order.menuVenue, order.sides)],
    ["Dessert", formatSelection(order.menuVenue, "dessert", order.dessertId) || "No dessert"],
    ["Add-ons", formatOrderAddOns(order)],
    ["Allergies / dietary", order.allergies || "None noted"],
    ["Special requests", order.specialRequests || "None noted"]
  ];
  return `
    <div class="email-shell">
      <div class="email-header">
        <span class="email-brand">Rockwater Hove</span>
        <strong>Guest confirmation</strong>
      </div>
      <div class="email-envelope">
        <p><span>Subject</span><strong>Your Rockwater pre-order is confirmed</strong></p>
        <p><span>To</span><strong>${escapeHtml(order.guestEmail || `${order.guestName} (email not provided)`)}</strong></p>
        <p><span>From</span><strong>events@rockwater.uk</strong></p>
      </div>
      <div class="email-content">
        <p>Hello ${escapeHtml(order.guestName)},</p>
        <p>Thanks for submitting your pre-order for <strong>${escapeHtml(event.name || "your Rockwater event")}</strong>. We’ve saved the details below.</p>
        <div class="email-summary-list">
          ${orderRows.map(([label, value]) => `<div class="email-summary-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
        </div>
        <div class="email-callout${order.allergies ? " is-alert" : ""}">
          <strong>Event details</strong>
          <p>${escapeHtml(event.date ? formatDate(event.date) : "Date to be confirmed")} · ${escapeHtml(getVenueLabel(event.venueArea) || "Venue to be confirmed")}</p>
        </div>
        <div class="email-callout">
          <strong>Edit link</strong>
          <p>${escapeHtml(order.editLink)}</p>
        </div>
      </div>
      <div class="email-footer">Rockwater Hove private events</div>
    </div>
  `;
}

function buildStaffEmailPreview(event, orders) {
  const kitchenCounts = buildKitchenCounts(orders);
  const allergies = buildAllergySummary(orders);
  return `
    <div class="email-shell">
      <div class="email-header">
        <span class="email-brand">Rockwater Hove</span>
        <strong>Staff summary</strong>
      </div>
      <div class="email-envelope">
        <p><span>Subject</span><strong>${escapeHtml(event.name || "Private event")} · pre-order summary</strong></p>
        <p><span>To</span><strong>hove@rockwater.uk</strong></p>
        <p><span>From</span><strong>events@rockwater.uk</strong></p>
      </div>
      <div class="email-content">
        <div class="email-summary-list">
          ${[
            ["Event", event.name || "Not set"],
            ["Date", event.date ? formatDate(event.date) : "To be confirmed"],
            ["Venue", getVenueLabel(event.venueArea) || "Not selected"],
            ["Guest count", String(orders.length)],
            ["Delivery mode", STAFF_EMAIL_MODES[event.staffEmailMode]]
          ].map(([label, value]) => `<div class="email-summary-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
        </div>
        <div class="email-callout">
          <strong>Kitchen counts</strong>
          <p>${kitchenCounts.length ? kitchenCounts.map((item) => `${escapeHtml(item.course)} · ${escapeHtml(item.dish)}${item.extras ? ` (${escapeHtml(item.extras)})` : ""} × ${escapeHtml(item.value)}`).join("<br>") : "No dishes ordered yet."}</p>
        </div>
        <div class="email-callout${allergies.length ? " is-alert" : ""}">
          <strong>Allergy summary</strong>
          <p>${allergies.length ? allergies.map((item) => `${escapeHtml(item.label)}: ${escapeHtml(item.value)}`).join("<br>") : "None noted."}</p>
        </div>
        <div class="email-callout">
          <strong>Workspace link</strong>
          <p>/preorder/${escapeHtml(event.id)}/workspace</p>
        </div>
      </div>
      <div class="email-footer">Rockwater Hove private events</div>
    </div>
  `;
}

function buildFullPreorderListEmailPreview(event, orders) {
  const guestRows = orders.length
    ? orders.map((order) => `
      <div class="email-summary-row">
        <span>${escapeHtml(order.guestName)}${order.isKids ? " · Kids" : ""}</span>
        <strong>${escapeHtml([
          formatSelection(order.menuVenue, "starter", order.starterId) || "No starter",
          withExtras(formatSelection(order.menuVenue, "main", order.mainId) || "No main selected", formatExtras(order.menuVenue, "main", order.mainId, order.mainExtras)),
          formatSides(order.menuVenue, order.sides),
          formatSelection(order.menuVenue, "dessert", order.dessertId) || "No dessert"
        ].join(" · "))}</strong>
      </div>
    `).join("")
    : `<p>No guest orders have been submitted yet.</p>`;

  return `
    <div class="email-shell">
      <div class="email-header">
        <span class="email-brand">Rockwater Hove</span>
        <strong>Full pre-order list</strong>
      </div>
      <div class="email-envelope">
        <p><span>Subject</span><strong>${escapeHtml(event.name || "Private event")} · full pre-order list</strong></p>
        <p><span>To</span><strong>hove@rockwater.uk</strong></p>
        <p><span>From</span><strong>events@rockwater.uk</strong></p>
      </div>
      <div class="email-content">
        <div class="email-summary-list">
          <div class="email-summary-row"><span>Event</span><strong>${escapeHtml(event.name || "Not set")}</strong></div>
          <div class="email-summary-row"><span>Date</span><strong>${escapeHtml(event.date ? formatDate(event.date) : "To be confirmed")}</strong></div>
          <div class="email-summary-row"><span>Venue</span><strong>${escapeHtml(getVenueLabel(event.venueArea) || "Not selected")}</strong></div>
          <div class="email-summary-row"><span>Guest count</span><strong>${escapeHtml(String(orders.length))}</strong></div>
        </div>
        <div class="email-callout">
          <strong>Full pre-order list</strong>
          <div class="email-summary-list">${guestRows}</div>
        </div>
        <div class="email-callout">
          <strong>Workspace link</strong>
          <p>/preorder/${escapeHtml(event.id)}/workspace</p>
        </div>
      </div>
      <div class="email-footer">Rockwater Hove private events</div>
    </div>
  `;
}

function buildEmptyEmailPreview(title, message) {
  return `
    <div class="email-shell">
      <div class="email-header">
        <span class="email-brand">Rockwater Hove</span>
        <strong>${escapeHtml(title)}</strong>
      </div>
      <div class="email-content">
        <p>${escapeHtml(message)}</p>
      </div>
      <div class="email-footer">Rockwater Hove private events</div>
    </div>
  `;
}

function renderPrintSheet() {
  const event = getSelectedEvent();
  if (!event) {
    refs.printEventTitle.textContent = "Selected event";
    refs.printEventDate.textContent = "To be confirmed";
    refs.printVenue.textContent = "Not selected";
    refs.printGuestCount.textContent = "0";
    refs.printDeadline.textContent = "Set event to calculate";
    refs.printKitchenCounts.innerHTML = buildPrintRows(["Course", "Dish", "Extras", "Quantity"], [], 4);
    refs.printGuestList.innerHTML = buildPrintRows(["Guest", "Starter", "Main", "Sides", "Dessert", "Allergies", "Requests"], [], 7);
    refs.printAllergyList.innerHTML = buildPrintRows(["Guest", "Allergy"], [], 2);
    return;
  }
  const orders = getOrdersForEvent(event.id);
  const kitchenCounts = buildKitchenCounts(orders);
  refs.printEventTitle.textContent = event.name || "Selected event";
  refs.printEventDate.textContent = event.date ? formatDate(event.date) : "To be confirmed";
  refs.printVenue.textContent = getVenueLabel(event.venueArea) || "Not selected";
  refs.printGuestCount.textContent = String(orders.length);
  refs.printDeadline.textContent = getDeadlineText(event);
  refs.printKitchenCounts.innerHTML = buildPrintRows(
    ["Course", "Dish", "Extras", "Quantity"],
    kitchenCounts.map((item) => [item.course, item.dish, item.extras || "-", item.value]),
    4
  );
  refs.printGuestList.innerHTML = buildPrintRows(
    ["Guest", "Starter", "Main", "Sides", "Dessert", "Allergies", "Requests"],
    orders.map((order) => [
      order.guestName,
      withExtras(formatSelection(order.menuVenue, "starter", order.starterId) || "No starter", formatExtras(order.menuVenue, "starter", order.starterId, order.starterExtras)),
      withExtras(formatSelection(order.menuVenue, "main", order.mainId) || "No main selected", formatExtras(order.menuVenue, "main", order.mainId, order.mainExtras)),
      formatSides(order.menuVenue, order.sides),
      formatSelection(order.menuVenue, "dessert", order.dessertId) || "No dessert",
      order.allergies || "None",
      order.specialRequests || "None"
    ]),
    7
  );
  refs.printAllergyList.innerHTML = buildPrintRows(
    ["Guest", "Allergy"],
    buildAllergySummary(orders).map((item) => [item.label, item.value]),
    2
  );
}

function buildPrintRows(headers, rows, columns) {
  const cls = columns === 4 ? "compact-three" : columns === 2 ? "compact-two" : "";
  const headerHtml = `<div class="print-row-head ${cls}">${headers.map((header) => `<div>${escapeHtml(header)}</div>`).join("")}</div>`;
  const bodyHtml = rows.length
    ? rows.map((row) => `<div class="print-row ${cls}">${row.map((cell) => `<div>${escapeHtml(cell)}</div>`).join("")}</div>`).join("")
    : `<div class="print-row ${cls}">${headers.map(() => "<div>-</div>").join("")}</div>`;
  return `${headerHtml}${bodyHtml}`;
}

function handleOrderSubmit(event) {
  event.preventDefault();
  const selectedEvent = getSelectedEvent();
  if (!selectedEvent || isEventLocked(selectedEvent)) {
    return;
  }

  const existingOrder = state.orders.find((order) => order.id === refs.editingOrderId.value);
  const guestToken = existingOrder?.guestToken || createGuestToken();
  const order = {
    id: existingOrder?.id || `order-${Date.now()}`,
    eventId: selectedEvent.id,
    guestName: refs.guestName.value.trim(),
    guestEmail: refs.guestEmail.value.trim(),
    menuVenue: selectedEvent.venueArea || refs.menuVenue.value || "barKitchen",
    starterId: refs.starterSelect.value,
    starterExtras: getSelectedExtraIds("starter"),
    mainId: refs.mainSelect.value,
    mainExtras: getSelectedExtraIds("main"),
    sides: getSelectedSideIds(),
    dessertId: refs.dessertSelect.value,
    isKids: refs.kidsToggle.checked,
    allergies: refs.allergies.value.trim(),
    specialRequests: refs.specialRequests.value.trim(),
    guestToken,
    editLink: buildEditLink(selectedEvent.id, guestToken),
    createdAt: existingOrder?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    edited: Boolean(existingOrder)
  };

  if (!order.guestName) {
    return;
  }
  if (!order.mainId) {
    window.alert("Please choose a main before submitting the pre-order.");
    return;
  }

  const index = state.orders.findIndex((entry) => entry.id === order.id);
  if (index >= 0) {
    state.orders[index] = order;
  } else {
    state.orders.unshift(order);
  }

  if (state.demoMode) {
    selectedEvent.guestEmailSimulatedAt = new Date().toISOString();
  }

  state.lastGuestOrderId = order.id;
  guestSavedNoticeOrderId = existingOrder ? "" : order.id;
  persistState();
  render();
  resetGuestForm();
}

function resetGuestForm() {
  refs.orderForm.reset();
  refs.editingOrderId.value = "";
  refs.submitOrderBtn.textContent = "Submit pre-order";
  refs.cancelEditBtn.classList.add("hidden");
  hydrateGuestFormForCurrentEvent();
}

function handleKidsToggleChange() {
  const selectedVenue = refs.menuVenue.value;
  populateCourseSelects(selectedVenue, { isKids: refs.kidsToggle.checked });
  refs.starterSelect.value = "";
  refs.mainSelect.value = "";
  refs.dessertSelect.value = "";
  updateMenuLink();
}

function loadOrderIntoGuestForm(orderId) {
  const order = state.orders.find((entry) => entry.id === orderId);
  if (!order) {
    return;
  }
  guestSavedNoticeOrderId = "";
  state.selectedEventId = order.eventId;
  state.view = "guest";
  refs.editingOrderId.value = order.id;
  refs.guestName.value = order.guestName;
  refs.guestEmail.value = order.guestEmail;
  refs.kidsToggle.checked = Boolean(order.isKids);
  refs.menuVenue.value = getSelectedEvent()?.venueArea || order.menuVenue;
  populateCourseSelects(refs.menuVenue.value, { keepSides: true, isKids: order.isKids });
  refs.starterSelect.value = order.starterId;
  refs.mainSelect.value = order.mainId;
  refs.dessertSelect.value = order.dessertId;
  renderExtrasForSlot("starter");
  renderExtrasForSlot("main");
  setCheckedValues("starterExtraOption", order.starterExtras);
  setCheckedValues("mainExtraOption", order.mainExtras);
  setCheckedValues("sideOption", order.sides);
  refs.allergies.value = order.allergies;
  refs.specialRequests.value = order.specialRequests;
  refs.submitOrderBtn.textContent = "Save changes";
  refs.cancelEditBtn.classList.remove("hidden");
  persistState();
  render();
  refs.orderForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function startNewEvent() {
  state.selectedEventId = "";
  state.draftEvent = createEmptyEvent();
  state.staffScreen = "setup";
  persistState();
  render();
}

function openStaffAuthPreviewModal() {
  setAuthPreviewMode(authPreviewMode);
  clearAuthPreviewMessage();
  refs.staffAuthPreviewForm.reset();
  refs.staffAuthPreviewModal.classList.remove("hidden");
  refs.authUsername.focus();
}

function closeStaffAuthPreviewModal() {
  refs.staffAuthPreviewModal.classList.add("hidden");
}

function setAuthPreviewMode(mode) {
  authPreviewMode = mode;
  [refs.authTabSignIn, refs.authTabSignUp, refs.authTabReset].forEach((button) => {
    button.classList.toggle("is-active", button.dataset.authMode === mode);
  });

  const isReset = mode === "reset";
  const isSignUp = mode === "signUp";

  refs.authPasswordLabel.classList.toggle("hidden", isReset);
  refs.authConfirmPasswordLabel.classList.toggle("hidden", !isSignUp);
  refs.submitStaffAuthPreviewBtn.textContent = isReset
    ? "Send reset link"
    : isSignUp
      ? "Create preview account"
      : "Sign in";
  clearAuthPreviewMessage();
}

function handleStaffAuthPreviewSubmit(event) {
  event.preventDefault();
  const username = refs.authUsername.value.trim() || "firstname.lastname";
  const emailAddress = `${username}@rockwater.uk`;
  const messageMap = {
    signIn: `Signed in as ${emailAddress}.`,
    signUp: `Verification sent to ${emailAddress}.`,
    reset: `Password reset link sent to ${emailAddress}.`
  };
  showAuthPreviewMessage(messageMap[authPreviewMode], true);
}

function clearAuthPreviewMessage() {
  refs.authPreviewMessage.textContent = "";
  refs.authPreviewMessage.classList.add("hidden");
  refs.authPreviewMessage.classList.remove("is-success");
}

function showAuthPreviewMessage(message, success = false) {
  refs.authPreviewMessage.textContent = message;
  refs.authPreviewMessage.classList.remove("hidden");
  refs.authPreviewMessage.classList.toggle("is-success", success);
}

function togglePasswordField(input, button) {
  const isVisible = input.type === "text";
  input.type = isVisible ? "password" : "text";
  button.textContent = isVisible ? "Show" : "Hide";
  button.setAttribute("aria-pressed", String(!isVisible));
}

function openDeleteEventModal() {
  const event = getSelectedEvent();
  if (!event) {
    return;
  }
  pendingDeleteEventId = event.id;
  refs.deleteEventModalTitle.textContent = `Are you sure you want to delete ${event.name || "this event"}?`;
  refs.deleteEventModalCopy.textContent = "This will permanently remove the event and all linked guest pre-orders from this workspace.";
  refs.deleteEventModal.classList.remove("hidden");
  refs.confirmDeleteEventBtn.focus();
}

function closeDeleteEventModal() {
  pendingDeleteEventId = "";
  refs.deleteEventModal.classList.add("hidden");
}

function confirmDeleteEvent() {
  if (!pendingDeleteEventId) {
    return;
  }
  const eventId = pendingDeleteEventId;
  state.events = state.events.filter((event) => event.id !== eventId);
  state.orders = state.orders.filter((order) => order.eventId !== eventId);
  if (state.lastGuestOrderId && !state.orders.some((order) => order.id === state.lastGuestOrderId)) {
    state.lastGuestOrderId = "";
  }
  if (guestSavedNoticeOrderId && !state.orders.some((order) => order.id === guestSavedNoticeOrderId)) {
    guestSavedNoticeOrderId = "";
  }
  state.selectedEventId = state.events[0]?.id || "";
  state.staffScreen = "events";
  state.draftEvent = null;
  closeDeleteEventModal();
  persistState();
  hydrateGuestFormForCurrentEvent();
  render();
}

function deleteOrder(orderId) {
  const order = state.orders.find((entry) => entry.id === orderId);
  if (!order) {
    return;
  }
  if (!window.confirm(`Delete the pre-order for ${order.guestName}?`)) {
    return;
  }
  state.orders = state.orders.filter((entry) => entry.id !== orderId);
  if (state.lastGuestOrderId === orderId) {
    state.lastGuestOrderId = "";
  }
  if (guestSavedNoticeOrderId === orderId) {
    guestSavedNoticeOrderId = "";
  }
  persistState();
  render();
}

function handleEventSetupSave(event) {
  event.preventDefault();
  if (!refs.eventForm.reportValidity()) {
    return;
  }
  const baseEvent = state.draftEvent || getSelectedEvent();
  if (!baseEvent) {
    return;
  }

  const updatedEvent = {
    ...baseEvent,
    name: refs.eventName.value.trim(),
    date: refs.eventDate.value,
    venueArea: refs.venueArea.value,
    contactName: refs.contactName.value.trim(),
    contactEmail: refs.contactEmail.value.trim(),
    deadlineHours: Number(refs.deadlineHours.value) || 48,
    staffEmailMode: refs.eventStaffEmailMode.value,
    depositAmount: refs.depositAmount.value.trim(),
    staffNotes: refs.staffNotes.value.trim()
  };

  if (state.draftEvent) {
    state.events.unshift(updatedEvent);
    state.selectedEventId = updatedEvent.id;
    state.draftEvent = null;
  } else {
    state.events = state.events.map((eventItem) => (
      eventItem.id === updatedEvent.id ? updatedEvent : eventItem
    ));
    state.selectedEventId = updatedEvent.id;
  }
  state.staffScreen = "detail";
  persistState();
  hydrateGuestFormForCurrentEvent();
  render();
}

function toggleSelectedEventFlag(flag, toggle) {
  const event = state.draftEvent || getSelectedEvent();
  if (!event) {
    return;
  }
  event[flag] = !event[flag];
  syncToggle(toggle, event[flag]);
  if (flag === "depositTaken") {
    refs.depositAmount.disabled = !event.depositTaken;
  }
  persistState();
  render();
}

function handleStaffEmailModeChange() {
  const event = getSelectedEvent();
  if (!event) {
    return;
  }
  event.staffEmailMode = refs.staffEmailMode.value;
  refs.eventStaffEmailMode.value = event.staffEmailMode;
  persistState();
  render();
}

function copyEventSummary() {
  const event = getSelectedEvent();
  if (!event || !navigator.clipboard?.writeText) {
    return;
  }
  const summary = [
    `Event: ${event.name || "Not set"}`,
    `Date: ${event.date ? formatDate(event.date) : "Not set"}`,
    `Venue: ${getVenueLabel(event.venueArea) || "Not set"}`,
    `Contact: ${buildContactText(event)}`,
    `Deadline: ${getDeadlineText(event)}`,
    `Deposit: ${event.depositTaken ? event.depositAmount || "Taken" : "Not taken"}`,
    `Guest count: ${getOrdersForEvent(event.id).length}`,
    `Staff email mode: ${STAFF_EMAIL_MODES[event.staffEmailMode]}`,
    `Staff notes: ${event.staffNotes || "None"}`
  ].join("\n");
  navigator.clipboard.writeText(summary);
}

async function copyEventGuestLink(event) {
  if (!event || !navigator.clipboard?.writeText) {
    return;
  }
  const link = buildGuestPreorderLink(event.id);
  await navigator.clipboard.writeText(link);
  showToast(`${event.name || "This event"} Pre-Order Guest Link has been copied to your Clipboard`);
}

function markStaffEmailSentNow() {
  const event = getSelectedEvent();
  if (!event) {
    return;
  }
  event.lastStaffEmailSentAt = new Date().toISOString();
  persistState();
  render();
}

function sendGuestEmailNow() {
  const event = getSelectedEvent();
  const eventOrders = event ? getOrdersForEvent(event.id) : [];
  const selectedOrder = event ? getSelectedGuestEmailOrder(event.id, eventOrders) : null;
  if (!event || !selectedOrder) {
    return;
  }
  event.guestEmailSimulatedAt = new Date().toISOString();
  persistState();
  render();
}

function rerenderCurrentEventEmails() {
  const event = getSelectedEvent();
  if (!event || state.staffScreen !== "detail") {
    return;
  }
  renderStaffEmailPreviews(event, getOrdersForEvent(event.id));
}

function copyLatestEditLink() {
  const order = getLatestGuestOrder();
  if (!order || !navigator.clipboard?.writeText) {
    return;
  }
  navigator.clipboard.writeText(order.editLink);
}

function editLatestOrderFromGuest() {
  const order = getLatestGuestOrder();
  if (!order) {
    return;
  }
  loadOrderIntoGuestForm(order.id);
}

function toggleDemoMode() {
  state.demoMode = !state.demoMode;
  if (state.demoMode && state.events.length === 0) {
    state = createDemoState();
  }
  persistState();
  render();
}

function resetDemoState() {
  if (!window.confirm("Reset the Rockwater demo workspace?")) {
    return;
  }
  const preservedEvents = state.events.filter((event) => event.id !== DEMO_EVENT_ID);
  const preservedOrders = state.orders.filter((order) => order.eventId !== DEMO_EVENT_ID);
  const demoState = createDemoState();
  state.events = [demoState.events[0], ...preservedEvents];
  state.orders = [...demoState.orders, ...preservedOrders];
  state.selectedEventId = DEMO_EVENT_ID;
  state.lastGuestOrderId = "";
  state.draftEvent = null;
  persistState();
  hydrateGuestFormForCurrentEvent();
  render();
}

function loadSampleEvent() {
  const preservedEvents = state.events.filter((event) => event.id !== DEMO_EVENT_ID);
  const preservedOrders = state.orders.filter((order) => order.eventId !== DEMO_EVENT_ID);
  const demoState = createDemoState();
  state.events = [demoState.events[0], ...preservedEvents];
  state.orders = [...demoState.orders, ...preservedOrders];
  state.selectedEventId = DEMO_EVENT_ID;
  state.draftEvent = null;
  state.staffScreen = "detail";
  persistState();
  hydrateGuestFormForCurrentEvent();
  render();
}

function toggleEmailPreview(type) {
  if (type === "guest") {
    state.emailPanels.guestCollapsed = !state.emailPanels.guestCollapsed;
  } else {
    state.emailPanels.staffCollapsed = !state.emailPanels.staffCollapsed;
  }
  persistState();
  syncEmailPanel("guest");
  syncEmailPanel("staff");
}

function syncEmailPanel(type) {
  const collapsed = type === "guest" ? state.emailPanels.guestCollapsed : state.emailPanels.staffCollapsed;
  const button = type === "guest" ? refs.toggleGuestEmailBtn : refs.toggleStaffEmailBtn;
  const wrap = type === "guest" ? refs.staffGuestEmailWrap : refs.internalEmailWrap;
  wrap.classList.toggle("hidden", collapsed);
  button.textContent = collapsed ? "Expand" : "Collapse";
  button.setAttribute("aria-expanded", String(!collapsed));
}

function exportSelectedEventCsv() {
  const event = getSelectedEvent();
  if (!event) {
    return;
  }
  const rows = [
    ["Guest Name", "Email", "Order Type", "Venue Menu", "Starter", "Starter Extras", "Main", "Main Extras", "Sides", "Dessert", "Allergies", "Requests", "Edit Link", "Updated At"],
    ...getOrdersForEvent(event.id).map((order) => [
      order.guestName,
      order.guestEmail,
      order.isKids ? "Kids" : "Standard",
      getVenueLabel(order.menuVenue),
      formatSelection(order.menuVenue, "starter", order.starterId) || "No starter",
      formatExtras(order.menuVenue, "starter", order.starterId, order.starterExtras),
      formatSelection(order.menuVenue, "main", order.mainId) || "No main selected",
      formatExtras(order.menuVenue, "main", order.mainId, order.mainExtras),
      formatSides(order.menuVenue, order.sides),
      formatSelection(order.menuVenue, "dessert", order.dessertId) || "No dessert",
      order.allergies,
      order.specialRequests,
      order.editLink,
      formatDate(order.updatedAt)
    ])
  ];

  const csv = rows.map((row) => row.map((cell) => `"${String(cell || "").replaceAll(`"`, `""`)}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "rockwater-event-preorders.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function computeDeadlineDate(event) {
  if (!event?.date) {
    return null;
  }
  return new Date(new Date(event.date).getTime() - Number(event.deadlineHours || 48) * 60 * 60 * 1000);
}

function isEventLocked(event) {
  if (!event) {
    return false;
  }
  if (state.demoMode || event.adminOverride) {
    return false;
  }
  const deadline = computeDeadlineDate(event);
  return Boolean(deadline && new Date() > deadline);
}

function getDeadlineText(event) {
  if (!event?.venueArea) {
    return "Select venue to continue";
  }
  const deadline = computeDeadlineDate(event);
  if (!deadline) {
    return "Set event to calculate";
  }
  return `${formatDate(deadline)} (${event.deadlineHours}h prior)`;
}

function getStaffLockMessage(event) {
  if (!event.name && !event.date && !event.venueArea) {
    return "Complete the event name, date and time, and venue to activate guest ordering.";
  }
  if (!event.name) {
    return "Add an event name so the guest and staff views show the correct booking.";
  }
  if (!event.date && !event.venueArea) {
    return "Add the event date and time and select a venue to activate guest ordering.";
  }
  if (!event.date) {
    return "Add the event date and time to activate the guest ordering deadline.";
  }
  if (!event.venueArea) {
    return "Select a venue to lock the correct menu for guests.";
  }
  if (state.demoMode) {
    return "Demo mode ignores deadlines so you can test edits freely.";
  }
  if (isEventLocked(event)) {
    return `Deadline passed on <strong>${formatDate(computeDeadlineDate(event))}</strong>. Orders are read-only unless admin override is enabled.`;
  }
  return `Guest ordering stays open until <strong>${formatDate(computeDeadlineDate(event))}</strong>.`;
}

function buildContactText(event) {
  if (event.contactName && event.contactEmail) {
    return `${event.contactName} · ${event.contactEmail}`;
  }
  return event.contactName || event.contactEmail || "To be confirmed";
}

function createFutureDatetime(daysAhead, hours, minutes) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  date.setHours(hours, minutes, 0, 0);
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function buildEditLink(eventId, guestToken) {
  return `/preorder/${eventId}/${guestToken}`;
}

function buildGuestPreorderLink(eventId) {
  const url = new URL(window.location.href);
  url.searchParams.set("view", "guest");
  url.searchParams.set("eventId", eventId);
  return url.toString();
}

function createGuestToken() {
  return Math.random().toString(36).slice(2, 10);
}

function reviewRow(label, value) {
  return `<div class="review-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "-")}</strong></div>`;
}

function formatDishLabel(menuItem) {
  const parts = [menuItem.name];
  if (menuItem.price) {
    parts.push(menuItem.price);
  }
  if (menuItem.tags?.length) {
    parts.push(menuItem.tags.join(", "));
  }
  return parts.join(" | ");
}

function formatExtraLabel(menuExtra) {
  return `${menuExtra.name} | ${menuExtra.price}`;
}

function getVenueLabel(key) {
  return VENUES[key] || "";
}

function getAllItemsForSlot(venueKey, slot) {
  const menu = MENU_BY_VENUE[venueKey];
  if (!menu) {
    return [];
  }
  if (slot === "starter") {
    return menu.starterSections.flatMap((section) => section.items);
  }
  if (slot === "main") {
    return [...menu.mainSections.flatMap((section) => section.items), ...(menu.kidsMains || [])];
  }
  if (slot === "dessert") {
    return [...menu.desserts, ...(menu.kidsDesserts || [])];
  }
  if (slot === "side") {
    return menu.sides;
  }
  return [];
}

function findItem(venueKey, slot, itemId) {
  return getAllItemsForSlot(venueKey, slot).find((entry) => entry.id === itemId) || null;
}

function getStarterItemById(venueKey, itemId) {
  return findItem(venueKey, "starter", itemId);
}

function getMainItemById(venueKey, itemId) {
  return findItem(venueKey, "main", itemId);
}

function getDessertItemById(venueKey, itemId) {
  return findItem(venueKey, "dessert", itemId);
}

function formatSelection(venueKey, slot, itemId) {
  const itemFound = findItem(venueKey, slot, itemId);
  return itemFound ? formatDishLabel(itemFound) : "";
}

function formatExtras(venueKey, slot, itemId, extraIds = []) {
  const itemFound = findItem(venueKey, slot, itemId);
  if (!itemFound?.extras?.length || !extraIds.length) {
    return "";
  }
  return extraIds.map((extraId) => {
    const extraFound = itemFound.extras.find((entry) => entry.id === extraId);
    return extraFound ? formatExtraLabel(extraFound) : "";
  }).filter(Boolean).join(", ");
}

function formatSides(venueKey, sideIds = []) {
  if (!sideIds.length) {
    return "No sides";
  }
  return sideIds.map((sideId) => formatSelection(venueKey, "side", sideId)).filter(Boolean).join(", ");
}

function isKidsDessert(venueKey, itemId) {
  return Boolean(findItem(venueKey, "dessert", itemId)?.isKids);
}

function withExtras(dish, extrasText) {
  return extrasText ? `${dish} (${extrasText})` : dish;
}

function formatOrderAddOns(order) {
  const starterExtras = formatExtras(order.menuVenue, "starter", order.starterId, order.starterExtras);
  const mainExtras = formatExtras(order.menuVenue, "main", order.mainId, order.mainExtras);
  return [starterExtras, mainExtras].filter(Boolean).join(" | ") || "None";
}

function matchItemIdByLabel(venueKey, slot, legacyLabel) {
  if (!legacyLabel || /^No starter|^No dessert|^Please choose a main/.test(legacyLabel)) {
    return "";
  }
  const prefix = legacyLabel.split(" | ")[0].trim().toLowerCase();
  return getAllItemsForSlot(venueKey, slot).find((entry) => entry.name.toLowerCase() === prefix || prefix.startsWith(entry.name.toLowerCase()))?.id || "";
}

function setCheckedValues(name, values) {
  const valueSet = new Set(values);
  document.querySelectorAll(`input[name='${name}']`).forEach((input) => {
    input.checked = valueSet.has(input.value);
  });
}

function updateNotice(element, message) {
  if (message) {
    element.innerHTML = message;
    element.classList.remove("hidden");
  } else {
    element.classList.add("hidden");
  }
}

function showToast(message) {
  refs.appToast.textContent = message;
  refs.appToast.classList.remove("hidden");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    refs.appToast.classList.add("hidden");
  }, 2800);
}

function syncToggle(toggle, value) {
  toggle.setAttribute("aria-pressed", String(value));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
