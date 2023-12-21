interface Point {
  x: number;
  y: number;
}

interface Woo extends Point {
  z: number;
}

interface Hoo extends Woo {
  w: number;

}

const yee: Hoo = {
  x: 1,
  y: 2,
  z: 3,
  w: 5  
}