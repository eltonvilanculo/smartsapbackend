export default interface VictorInterface {
  name: String;
  hobby: String;
  wakeup?: () => {};

  dependent: Victorinho;
}

interface Victorinho {
  age: BigInteger;
  role: String;
}
