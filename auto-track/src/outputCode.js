import tracker from 'tracker';
const a = () => {
  tracker();
  console.log('this is a');
};
function b() {
  tracker();
  console.log('this is b');
}
class C {
  constructor() {
    tracker();
    console.log('this is c constructor');
  }
  age() {
    tracker();
    console.log('this is c age');
  }
}