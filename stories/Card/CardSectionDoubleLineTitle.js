import React from 'react'

import IconCalendar from 'emblematic-icons/svg/Calendar32.svg'

import {
  Card,
  CardTitle,
  CardContent,
  CardSection,
  CardSectionDoubleLineTitle,
} from '../../src/Card'
import style from './style.css'

const loremIpsum = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
venenatis placerat lacus et pretium. Aenean porttitor mi odio, vel
blandit nulla malesuada et. Duis a tellus quis est iaculis accumsan.
In diam est, egestas eu lobortis eu, laoreet ut tortor. Sed mattis
sapien vel malesuada sodales. Curabitur hendrerit purus sed ex
feugiat hendrerit. Vivamus eleifend odio a congue consectetur.
`

export default class CardSectionDoubleLineTitleState extends React.Component {
  constructor (props) {
    super(props)
    this.state = { collapsed: false }
  }

  render () {
    return (
      <div className={style.showcase}>
        <Card>
          <CardTitle title="Lorem title" />

          <CardContent>
            <CardSection >
              <CardSectionDoubleLineTitle
                title={this.state.collapsed ? 'Title collapsed' : 'Title opened'}
                subtitle="Verifique ou edite as informações da sua empresa"
                icon={<IconCalendar width={16} height={16} />}
                collapsed={this.state.collapsed}
                onClick={
                  collapsed => this.setState({ collapsed: !collapsed })
                }
              />
              {!this.state.collapsed &&
                <CardContent>
                  {loremIpsum}
                </CardContent>
              }
            </CardSection>
          </CardContent>
        </Card>
      </div>
    )
  }
}
