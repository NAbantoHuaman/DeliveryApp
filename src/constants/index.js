export const COLORS = {
  primary: '#4c8479', // Verde Chasky
  primaryDark: '#3a665d',
  accent: '#F08080', // Salmón
  gold: '#e8b931', // Amarillo/Dorado de Chaskys
  buttonDark: '#427165', // Botón oscuro del login
  buttonLight: '#98b5ad', // Botón claro del login
  background: '#f8fafc',
  white: '#ffffff'
};

export const CATEGORIES = [
  { id: 1, name: 'Burgers', icon: '🍔' },
  { id: 2, name: 'Pizza', icon: '🍕' },
  { id: 3, name: 'Sushi', icon: '🍣' },
  { id: 4, name: 'Postres', icon: '🍩' },
  { id: 5, name: 'Criollo', icon: '🥘' },
  { id: 6, name: 'Vegano', icon: '🥗' },
];

export const RESTAURANTS = [
  // --- BURGERS ---
  {
    id: 101,
    name: "Burger King",
    rating: 4.5,
    time: "15-25 min",
    deliveryFee: 1.99,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=60",
    category: "Burgers",
    menu: [
      { id: 10101, name: "Whopper", price: 18.90, desc: "La clásica a la parrilla con lechuga, tomate y mayonesa.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=60" },
      { id: 10102, name: "Stacker Doble", price: 22.90, desc: "Doble carne, queso, tocino y salsa stacker.", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=200&q=60" },
      { id: 10103, name: "King de Pollo", price: 14.90, desc: "Pollo crujiente con lechuga y mayonesa.", image: "https://images.unsplash.com/photo-1615297348960-cf0b5e7c51dd?auto=format&fit=crop&w=200&q=60" }
    ]
  },
  {
    id: 102,
    name: "Bembos",
    rating: 4.7,
    time: "20-35 min",
    deliveryFee: 2.50,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=60",
    category: "Burgers",
    menu: [
      { id: 10201, name: "Hamburguesa a lo Pobre", price: 16.90, desc: "Con plátano frito, huevo y papitas.", image: "https://www.bembos.com.pe/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/h/a/hamburguesa-a-lo-pobre_1.jpg" },
      { id: 10202, name: "La Extrema", price: 18.90, desc: "Doble carne, tocino y salsa golf.", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=200&q=60" }
    ]
  },
  {
    id: 103,
    name: "La Lucha Sanguchería",
    rating: 4.9,
    time: "25-40 min",
    deliveryFee: 3.00,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=60",
    category: "Burgers",
    menu: [
      { id: 10301, name: "Pan con Chicharrón", price: 19.90, desc: "Clásico chicharrón con camote frito y sarza criolla.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=60" },
      { id: 10302, name: "Sanguche de Pavo", price: 18.90, desc: "Pavo horneado a la leña con juguito.", image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=200&q=60" },
      { id: 10303, name: "Club Sandwich", price: 24.90, desc: "Pollo, jamón, queso, tocino, huevo y papas.", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=200&q=60" }
    ]
  },

  // --- PIZZA ---
  {
    id: 201,
    name: "Pizza Hut",
    rating: 4.6,
    time: "30-45 min",
    deliveryFee: 3.00,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=60",
    category: "Pizza",
    menu: [
      { id: 20101, name: "Super Suprema", price: 28.90, desc: "Pepperoni, carne, pimientos y champiñones.", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=200&q=60" },
      { id: 20102, name: "Hawaiana", price: 24.90, desc: "Jamón y piña.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=60" },
      { id: 20103, name: "Pan de Ajo", price: 8.90, desc: "6 unidades con queso.", image: "https://images.unsplash.com/photo-1573140247632-f84660f67627?auto=format&fit=crop&w=200&q=60" }
    ]
  },
  {
    id: 202,
    name: "Papa John's",
    rating: 4.7,
    time: "25-40 min",
    deliveryFee: 2.90,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=60",
    category: "Pizza",
    menu: [
      { id: 20201, name: "All The Meats", price: 32.00, desc: "Pepperoni, salchicha, carne, tocino.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=60" },
      { id: 20202, name: "Rolls de Canela", price: 12.00, desc: "Postre clásico.", image: "https://images.unsplash.com/photo-1605490364377-62f92f99d9cb?auto=format&fit=crop&w=200&q=60" }
    ]
  },
  {
    id: 203,
    name: "Domino's Pizza",
    rating: 4.4,
    time: "25-35 min",
    deliveryFee: 0,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Domino%27s_pizza_logo.svg/1200px-Domino%27s_pizza_logo.svg.png",
    category: "Pizza",
    menu: [
      { id: 20301, name: "Extravaganzza", price: 34.90, desc: "Pepperoni, jamón, carne, salchicha, aceitunas y pimientos.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=60" },
      { id: 20302, name: "Pepperoni Feast", price: 29.90, desc: "Doble pepperoni y extra queso mozzarella.", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=200&q=60" },
      { id: 20303, name: "Honolulu Hawaiian", price: 32.90, desc: "Jamón, piña, tocino y pimientos rojos.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=60" }
    ]
  },

  // --- SUSHI ---
  {
    id: 301,
    name: "Edo Sushi Bar",
    rating: 4.9,
    time: "40-60 min",
    deliveryFee: 5.00,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=60",
    category: "Sushi",
    menu: [
      { id: 30101, name: "Acevichado Roll", price: 35.00, desc: "Langostino furai, palta, cubierto de atún y salsa acevichada.", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=200&q=60" },
      { id: 30102, name: "Maki Furai", price: 28.00, desc: "Empanizado y frito.", image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=200&q=60" }
    ]
  },
  {
    id: 302,
    name: "Mr. Sushi",
    rating: 4.5,
    time: "30-45 min",
    deliveryFee: 3.50,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=60",
    category: "Sushi",
    menu: [
      { id: 30201, name: "California Roll", price: 22.00, desc: "Cangrejo, palta y pepino.", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=200&q=60" }
    ]
  },

  // --- CRIOLLO ---
  {
    id: 501,
    name: "Madam Tusan",
    rating: 4.7,
    time: "35-50 min",
    deliveryFee: 4.50,
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=60",
    category: "Criollo",
    menu: [
      { id: 50101, name: "Arroz Chaufa Tusán", price: 32.00, desc: "Con chancho asado, pollo y langostinos.", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=200&q=60" },
      { id: 50102, name: "Tallarín Saltado", price: 34.00, desc: "Fideos crocantes con pollo y verduras.", image: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=200&q=60" },
      { id: 50103, name: "Wantán Frito", price: 18.00, desc: "Rellenos de cerdo y langostinos (6 und).", image: "https://images.unsplash.com/photo-1541696490-8744a5dc0228?auto=format&fit=crop&w=200&q=60" }
    ]
  },
  {
    id: 502,
    name: "El Rincón que no Conoces",
    rating: 4.8,
    time: "45-60 min",
    deliveryFee: 4.00,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=60",
    category: "Criollo",
    menu: [
      { id: 50201, name: "Ají de Gallina", price: 26.00, desc: "Cremoso, con nueces y queso.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=200&q=60" },
      { id: 50202, name: "Causa Rellena", price: 15.00, desc: "De pollo con mayonesa.", image: "https://images.unsplash.com/photo-1599021456807-25db0f974334?auto=format&fit=crop&w=200&q=60" }
    ]
  },
  {
    id: 503,
    name: "Pardos Chicken",
    rating: 4.9,
    time: "30-50 min",
    deliveryFee: 3.50,
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Logo_Pardos.jpg",
    category: "Criollo",
    menu: [
      { id: 50301, name: "1/4 de Pollo a la Brasa", price: 22.90, desc: "Con papas y ensalada.", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=200&q=60" },
      { id: 50302, name: "Anticuchos", price: 19.90, desc: "Corazón de res a la parrilla.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=60" }
    ]
  },

  // --- VEGANO ---
  {
    id: 601,
    name: "Raw Cafe",
    rating: 4.7,
    time: "20-35 min",
    deliveryFee: 2.00,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=60",
    category: "Vegano",
    menu: [
      { id: 60101, name: "Bowl de Quinoa", price: 22.00, desc: "Quinoa, palta, tofu y verduras.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=60" },
      { id: 60102, name: "Wrap Vegano", price: 18.00, desc: "Tortilla integral con hummus.", image: "https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&w=200&q=60" }
    ]
  },
  {
    id: 602,
    name: "Veda Restaurante",
    rating: 4.8,
    time: "30-45 min",
    deliveryFee: 3.50,
    image: "https://images.unsplash.com/photo-1584776293029-4bd749a8820b?auto=format&fit=crop&w=800&q=60",
    category: "Vegano",
    menu: [
      { id: 60201, name: "Pizza Vegana", price: 36.00, desc: "Queso de anacardos, champiñones y rúcula.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=60" },
      { id: 60202, name: "Lasaña de Berenjena", price: 32.00, desc: "Sin gluten, con salsa pomodoro.", image: "https://images.unsplash.com/photo-1584776293029-4bd749a8820b?auto=format&fit=crop&w=200&q=60" },
      { id: 60203, name: "Bowl Proteico", price: 28.00, desc: "Quinoa, tofu, palta y vegetales asados.", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=60" }
    ]
  },

  // --- POSTRES ---
  {
    id: 401,
    name: "Maria Almenara",
    rating: 4.9,
    time: "15-30 min",
    deliveryFee: 2.00,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=60",
    category: "Postres",
    menu: [
      { id: 40101, name: "Torta de Chocolate", price: 14.00, desc: "Húmeda y con mucho fudge.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=60" },
      { id: 40102, name: "Cheesecake de Fresa", price: 15.00, desc: "Clásico estilo New York.", image: "https://images.unsplash.com/photo-1524351199678-941a58a3df26?auto=format&fit=crop&w=200&q=60" }
    ]
  },
  {
    id: 402,
    name: "Manolo",
    rating: 4.8,
    time: "10-20 min",
    deliveryFee: 1.50,
    image: "https://images.unsplash.com/photo-1626015449073-d09f7a932158?auto=format&fit=crop&w=800&q=60",
    category: "Postres",
    menu: [
      { id: 40201, name: "Churros Rellenos", price: 6.00, desc: "Rellenos de manjarblanco o chocolate.", image: "https://images.unsplash.com/photo-1626015449073-d09f7a932158?auto=format&fit=crop&w=200&q=60" }
    ]
  }
];

export const AVAILABLE_ORDERS = [
  { id: 'ORD-001', client: 'Jorge Peréz', address: 'Av. Abancay 123', price: 10.20, distance: '2.5km', status: 'pending' },
  { id: 'ORD-002', client: 'Maria Teresa', address: 'Jr. Apurimac 555', price: 5.00, distance: '1.1km', status: 'pending' },
  { id: 'ORD-003', client: 'Luis Enrique', address: 'Av. Petit Thouars 315', price: 15.70, distance: '3.8km', status: 'pending' },
];

export const CLIENT_ORDERS = [
  { id: 'PED-001', restaurant: 'Burger King', items: '1x Whopper', price: 18.90, date: '27 Nov, 2:30 PM', status: 'En camino', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=60' },
  { id: 'PED-002', restaurant: 'Madam Tusan', items: '1x Arroz Chaufa Tusán', price: 32.00, date: '25 Nov, 1:15 PM', status: 'Entregado', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=200&q=60' },
  { id: 'PED-003', restaurant: 'Pizza Hut', items: '1x Super Suprema', price: 28.90, date: '20 Nov, 8:00 PM', status: 'Entregado', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=200&q=60' },
];
