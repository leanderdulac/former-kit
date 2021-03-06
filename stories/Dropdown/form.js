import React from 'react'
import { storiesOf } from '@storybook/react'
import Section from '../Section'
import Dropdown from '../../src/Dropdown/form'

const options = [
  {
    name: 'Github',
    value: 'github',
  },
  {
    name: 'Open Source',
    value: 'open-source',
  },
  {
    name: 'Pilot',
    value: 'pilot',
  },
]

class DropdownState extends React.Component {
  constructor (props) {
    super(props)
    const { value } = this.props
    this.state = { selected: value }
  }

  render () {
    return (
      <div>
        <Dropdown
          options={options}
          name="Things"
          label="Things"
          onChange={event => this.setState({ selected: event.target.value })}
          value={this.state.selected}
          disabled={this.props.disabled}
          placeholder={this.props.placeholder}
          error={this.props.error}
        />
        <p>Selected: {this.state.selected}</p>
      </div>
    )
  }
}

DropdownState.defaultProps = {
  disabled: false,
  error: '',
  placeholder: '',
  value: '',
}

storiesOf('Dropdown', module)
  .add('Form', () => (
    <div>
      <Section title="Default">
        <DropdownState />
      </Section>

      <Section title="With placeholder">
        <DropdownState placeholder="Select" />
      </Section>

      <Section title="Error">
        <DropdownState error="Something went wrong" />
      </Section>

      <Section title="Disabled">
        <DropdownState disabled />
      </Section>

      <Section title="Disabled with placeholder">
        <DropdownState disabled placeholder="Select" />
      </Section>
      <Section title="dropdown with value">
        <DropdownState
          value="open-source"
        />
      </Section>
    </div>
  ))
