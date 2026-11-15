/** Dato inválido ingresado por el usuario (a diferencia de un fallo de persistencia). */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}
