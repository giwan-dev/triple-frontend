import React, { PureComponent } from 'react'
import DayPicker from '@titicaca/triple-design-system/elements/day-picker'

export default class App extends PureComponent {
  state = {
    date: null,
  }

  onDateChange = (date) => {
    this.setState({ date })
  }

  render() {
    return (
      <div>
        <DayPicker
          from={new Date()}
          to="2019-04-29"
          blockedDates={['2019-01-30', '2019-02-02']}
          onDateChange={this.onDateChange}
          date={this.state.date}
        />
      </div>
    )
  }
}
