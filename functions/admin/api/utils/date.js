const firebaseDate = (fireDate) => new Date(
  (fireDate._seconds * Math.pow(10, 9) + fireDate._nanoseconds) * Math.pow(10, -6)
)

module.exports = {
  firebaseDate,
}
