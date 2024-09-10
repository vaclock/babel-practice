class Cat {}

(() => {
  console.log(1)
})()

@annotation
class MyClass {}

function annotation(target) {
  target.annotated = true;
}