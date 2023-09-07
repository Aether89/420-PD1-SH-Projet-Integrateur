import axios from 'axios';
import { useAppStore } from '@/store/app';
const debug = useAppStore().debug;

const debugVehicle = { 
    vin: "W1KWJ8HB0LG005616",
    img: [ "./src/assets/lemon.png", "./src/assets/lemon.png", "./src/assets/lemon.png"],
    shortDescription: "Très bien entretenu/ Un seul proprio",
    longDescription: "Découvrez l'ultime perfectionnement routier : un équilibre parfait entre élégance et performance. Des lignes fluides captivantes à un intérieur luxueux, ce véhicule est conçu pour impressionner. Profitez également d'accessoires haut de gamme tels que le système audio supérieur et les sièges chauffants pour une expérience de conduite inégalée. Prenez le volant et entrez dans une nouvelle dimension de sophistication automobile.",
    price: 35000.00,
    promo: 400,
    km: 5000,
    colour: "red"
};

const debugVehicles = [       {
    id: "1",
    img: "./src/assets/lemon.png",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    price: 25000.00,
  },
  {
    id: "2",
    img: "./src/assets/lemon.png",
    make: "Honda",
    model: "Civic",
    year: 2021,
    price: 22000.00,
  },
  {
    id: "3",
    img: null,
    make: "Ford",
    model: "F-150",
    year: 2019,
    price: 35000.00,
  },
  {
    id: "4",
    img: "./src/assets/lemon.png",
    make: "Chevrolet",
    model: "Malibu",
    year: 2022,
    price: 28000.00,
  },
  {
    id: "5",
    img: "./src/assets/lemon.png",
    make: "Nissan",
    model: "Altima",
    year: 2018,
    price: 20000.00,
  },
  {
    id: "6",
    img: "./src/assets/lemon.png",
    make: "Jeep",
    model: "Wrangler",
    year: 2021,
    price: 40000.00,
  },
  {
    id: "7",
    img: "./src/assets/lemon.png",
    make: "BMW",
    model: "X5",
    year: 2020,
    price: 55000.00,
  },
  {
    id: "8",
    img: null,
    make: "Mercedes-Benz",
    model: "E-Class",
    year: 2019,
    price: 48000.00,
  },
  {
    id: "9",
    img: "./src/assets/lemon.png",
    make: "Audi",
    model: "A4",
    year: 2022,
    price: 42000.00,
  },
  {
    id: "10",
    img: null,
    make: "Lexus",
    model: "RX",
    year: 2023,
    price: 60000.00,
  },
  {
    id: "11",
    img: "./src/assets/lemon.png",
    make: "Subaru",
    model: "Outback",
    year: 2020,
    price: 28000.00,
  },
  {
    id: "12",
    img: "./src/assets/lemon.png",
    make: "Tesla",
    model: "Model 3",
    year: 2021,
    price: 45000.00,
  },
  {
    id: "13",
    img: "./src/assets/lemon.png",
    make: "Hyundai",
    model: "Tucson",
    year: 2019,
    price: 23000.00,
  },
  {
    id: "14",
    img: null,
    make: "Kia",
    model: "Sportage",
    year: 2022,
    price: 26000.00,
  },
  {
    id: "15",
    img: "./src/assets/lemon.png",
    make: "Mazda",
    model: "CX-5",
    year: 2020,
    price: 29000.00,
  },
  {
    id: "16",
    img: "./src/assets/lemon.png",
    make: "Volkswagen",
    model: "Jetta",
    year: 2021,
    price: 24000.00,
  },
  {
    id: "17",
    img: null,
    make: "Volvo",
    model: "XC90",
    year: 2022,
    price: 56000.00,
  },
  {
    id: "18",
    img: null,
    make: "Acura",
    model: "MDX",
    year: 2023,
    price: 52000.00,
  },
  {
    id: "19",
    img: "./src/assets/lemon.png",
    make: "GMC",
    model: "Sierra",
    year: 2019,
    price: 38000.00,
  },
  {
    id: "20",
    img: "./src/assets/lemon.png",
    make: "Chrysler",
    model: "Pacifica",
    year: 2020,
    price: 32000.00,
  },
  {
    id: "21",
    img: "./src/assets/lemon.png",
    make: "Lamborghini",
    model: "Huracan",
    year: 2022,
    price: 250000.00,
  },
  {
    id: "22",
    img: "./src/assets/lemon.png",
    make: "Ferrari",
    model: "488 GTB",
    year: 2021,
    price: 300000.00,
  },];

export async function fetchVehicle(vehicleID) {

    return debug ? debugVehicle : async () => {
        const response = await axios(`/api/vehicle/${vehiculeID}`, {
          method: "GET",
          headers: {
            ...session.getAuthHeaders()
          }
        });
  
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch vehicle data");
        }
      };
};

export async function fetchVehicles() {

    return debug ? debugVehicles : async () => {
        const response = await axios(`/api/vehicle/`, {
          method: "GET",
          headers: {
            ...session.getAuthHeaders()
          }
        });
  
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch vehicles data");
        }
      };
};