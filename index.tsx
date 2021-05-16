import * as React from 'react'
import * as ReactDOM from 'react-dom'

/*
final_versionとか書いておきながらあれだけども
hookで書き直してみる
*/

interface BoilProps {
  celsius: number
}

function BoilingVerdict(props: BoilProps) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}

function toCelsius(fahrenheit: number) {
  return (fahrenheit - 32) * 5 / 9
}

function toFahrenheit(celsius: number) {
  return (celsius * 9 / 5) + 32
}

function tryConvert(temperature: string, convert: (n: number) => number) {
  const input = parseFloat(temperature)
  if (Number.isNaN(input)) {
    return ''
  }
  const output = convert(input)
  const rounded = Math.round(output * 1000) / 1000
  return rounded.toString()
}

const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
}

type Scale = 'c' | 'f'

interface TempProps {
  scale: Scale,
  temperature: string,
  onTemperatureChange: (n: string) => void
}

const TemperatureInput = (props: TempProps) => {

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    props.onTemperatureChange(e.target.value)
  }

  const temperature = props.temperature
  const scale = props.scale
  return (
    <fieldset>
      <legend>Enter temperature in {scaleNames[scale]}:</legend>
      <input
        value={temperature}
        onChange={handleChange} />
    </fieldset>
  )
}

interface CalcState {
  scale: Scale,
  temperature: string
}

const Calculator = () => {
  const [calcState, setCalcState] = React.useState<CalcState>({ scale: 'c', temperature: '' })

  function handleCelsiusChange(temperature: string) {
    setCalcState({ scale: 'c', temperature })
  }

  function handleFahrenheitChange(temperature: string) {
    setCalcState({ scale: 'f', temperature })
  }

  const scale = calcState.scale
  const temperature = calcState.temperature
  const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature
  const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature

  return (
    <div>
      <TemperatureInput
        scale='c'
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange} />
        {/* かっちょよく書きたい場合はこう */}

      <TemperatureInput
        scale='f'
        temperature={fahrenheit}
        onTemperatureChange={(e) => handleFahrenheitChange(e)} />
        {/* 余計なこと書きたい場合はこう
        () => handleCelsiusChangeだとだめだが、これ↑なら動く */}

      <BoilingVerdict
        celsius={parseFloat(celsius)} />
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Calculator />
  </React.StrictMode>,
  document.getElementById('app')
)