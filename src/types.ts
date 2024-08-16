export interface Fruit {
    name: string;
    family: string;
    order: string;
    genus: string;
    nutritions: {
      calories: number;
      carbohydrates: number;
      fat: number;
      protein: number;
      sugar: number;
    };
  }
  
  export interface JarItem {
    fruit: Fruit;
    quantity: number;
  }
  