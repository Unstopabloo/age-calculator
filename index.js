const button = document.querySelector('#submit')
const day = document.getElementById('day')
const month = document.getElementById('month')
const year = document.getElementById('year')

button.disabled = true
let dayActive = false
let monthActive = false
let yearActive = false
let realDay
let realMonth
let realYear

function errorInputStyle(inputElement) {
  inputElement.style.borderColor = 'hsl(0, 100%, 67%)'
  const label = document.querySelector(`label[for="${inputElement.id}"]`)
  label.classList.add('error')
}

function removeErrorStyle(inputElement) {
  inputElement.style.borderColor = 'hsl(0, 0%, 86%)'
  const label = document.querySelector(`label[for="${inputElement.id}"]`)
  label.classList.remove('error')
  document.getElementById('monthError').textContent = ''
}

function checkSubmitButton() {
  // Verificar si todas las variables son verdaderas y habilitar/deshabilitar el botón en consecuencia
  if (dayActive && monthActive && yearActive) {
    button.disabled = false // Habilitar el botón
  } else {
    button.disabled = true // Deshabilitar el botón
  }
}

const validarDias = (mes, dia, anio) => {
  if (mes === 2) {
    const esBisiesto = (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0
    if (dia <= 28 || (dia === 29 && esBisiesto)) {
      dayActive = true
      realDay = day.valueAsNumber
      removeErrorStyle(day) // El día es válido para Febrero
    } else {
      const error = document.getElementById('dayError')
      error.innerHTML = 'Debe ser un día válido'
      errorInputStyle(day) // El día no es válido para Febrero
      dayActive = false
    }
  } else if (mes === 4 || mes === 6 || mes === 9 || mes === 11) {
    // Meses con 30 días
    if (dia <= 30) {
      const error = document.getElementById('dayError')
      error.innerHTML = ''
      dayActive = true
      realDay = day.valueAsNumber
      removeErrorStyle(day) // El día es válido para los meses con 30 días
    } else {
      const error = document.getElementById('dayError')
      error.innerHTML = 'Debe ser un día válido'
      dayActive = false
      errorInputStyle(day) // El día no es válido para los meses con 30 días
    }
  } else if (dia <= 31) {
    // Meses con 31 días
    const error = document.getElementById('dayError')
    error.innerHTML = ''
    dayActive = true
    realDay = day.valueAsNumber
    removeErrorStyle(day) // El día es válido para los meses con 31 días
  } else {
    dayActive = false
    const error = document.getElementById('dayError')
    error.innerHTML = 'Debe ser un día válido'
    errorInputStyle(day) // El día no es válido para los meses con 31 días
  }
}

month.addEventListener('blur', () => {
  const dayValue = day.valueAsNumber
  const monthValue = month.valueAsNumber
  const yearValue = year.valueAsNumber
  if (monthValue < 1 || monthValue > 12) {
    const error = document.getElementById('monthError')
    error.innerHTML = 'Debe ser un mes valido'
    errorInputStyle(month)
    monthActive = false
  } else {
    monthActive = true
    realMonth = monthValue
    removeErrorStyle(month)
    validarDias(monthValue, dayValue, yearValue)
  }
})

year.addEventListener('blur', () => {
  const yearValue = year.valueAsNumber
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  if (yearValue <= currentYear) {
    realYear = yearValue
    yearActive = true
    removeErrorStyle(year)
    document.getElementById('yearError').textContent = ''
    checkSubmitButton()
  } else {
    yearActive = false
    errorInputStyle(year)
    document.getElementById('yearError').textContent =
      'Debes ingresar un mes valido'
  }
})

button.addEventListener('click', (e) => {
  e.preventDefault()

  const displayYear = document.getElementById('display-year')
  const displayMonth = document.getElementById('display-month')
  const displayDay = document.getElementById('display-day')
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const currentDay = currentDate.getDate()

  // Validación de años
  let completedYears = currentYear - realYear
  if (
    currentMonth < realMonth ||
    (currentMonth === realMonth && currentDay < realDay)
  ) {
    completedYears--
  }
  // Validación de años

  // Validacion de meses
  let completedMonths = currentMonth + 12 - realMonth
  if (currentMonth >= realMonth) {
    completedMonths = currentMonth - realMonth
  }
  if (currentDay < realDay) {
    completedMonths--
  }
  // Validacion de meses

  // Cálculo de días
  let completedDays = 0
  if (currentMonth === realMonth && currentDay >= realDay) {
    completedDays = currentDay - realDay
  } else {
    const daysInPreviousMonth = new Date(
      currentYear,
      currentMonth - 1,
      0
    ).getDate()
    completedDays = daysInPreviousMonth - realDay + currentDay
  }
  // Cálculo de días

  // Display de año
  displayYear.textContent = completedYears
  displayMonth.textContent = completedMonths
  displayDay.textContent = completedDays
})
