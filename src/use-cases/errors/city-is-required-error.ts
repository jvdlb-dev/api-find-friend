export class CityIsRequiredError extends Error {
  constructor() {
    super('City is required.')
  }
}
