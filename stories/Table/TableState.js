import React, { Component } from 'react'
import { bool } from 'prop-types'
import {
  assoc,
  compose,
  defaultTo,
  equals,
  findIndex,
  map,
  path,
  pipe,
  prepend,
  reverse,
  sortBy,
  toLower,
} from 'ramda'

import Table from '../../src/Table'
import style from './style.css'
import getMock from './tableMock'

const isAscending = equals('ascending')

const rowSort = accessor =>
  sortBy(compose(toLower, defaultTo(''), path(accessor)))

const getSort = (accessor, order) => (
  isAscending(order) ?
    rowSort(accessor) :
    pipe(rowSort(accessor), reverse)
)

const getRowsSort = (rows, columns) =>
  (orderColumn, order) => {
    const referenceColumn = columns[orderColumn]
    const referenceAccessor = referenceColumn.accessor
    const sort = getSort(referenceAccessor, order)
    return sort(rows)
  }

const formatSimpleTableColumns = map(
  assoc('orderable', false)
)

class TableState extends Component {
  constructor (props) {
    super(props)

    const {
      disabled,
      expandable,
      primaryAction,
      selectable,
      simple,
    } = props

    this.handleDetailsClick = this.handleDetailsClick.bind(this)
    this.handleExpandRow = this.handleExpandRow.bind(this)
    this.handleOrderChange = this.handleOrderChange.bind(this)
    this.handleRowClick = this.handleRowClick.bind(this)
    this.handleSelectRow = this.handleSelectRow.bind(this)
    this.getColumns = this.getColumns.bind(this)
    this.getColumnsWithPrimaryAction = this.getColumnsWithPrimaryAction.bind(this)
    this.mock = getMock(this.handleDetailsClick, disabled)
    this.state = {
      orderColumn: 0,
      order: 'ascending',
      rows: this.mock.rows,
      columns: this.getColumns(primaryAction, simple),
      selectedRows: selectable ? [2] : [],
      expandedRows: expandable ? [0, 1, 2, 3] : [],
      detailsClicks: 0,
    }
  }

  getColumns (primaryActions, simple) {
    if (simple) {
      return formatSimpleTableColumns(this.mock.columns)
    }
    return (
      primaryActions ?
        this.getColumnsWithPrimaryAction() :
        this.mock.columns
    )
  }

  getColumnsWithPrimaryAction (columnCount = 7) {
    const cols = this.mock.columns.map(col => col)
    const actionIndex = findIndex(a => (a.isAction), cols)
    const action = cols.splice(actionIndex, 1)[0]
    cols.splice((columnCount - 1), 1, action)
    return cols
  }

  handleOrderChange (index, order) {
    const { rows, columns } = this.state
    const sortByOrderColumn = getRowsSort(rows, columns)
    const sortedRows = sortByOrderColumn(index, order)
    this.setState({
      orderColumn: index,
      order,
      rows: sortedRows,
      selectedRows: [],
      expandedRows: [],
    })
  }

  handleSelectRow (selectedRows) {
    this.setState({
      selectedRows,
    })
  }

  handleExpandRow (expandedRows) {
    this.setState({
      expandedRows,
      detailsClicks: 0,
    })
  }

  handleDetailsClick () {
    const clicks = 1 + this.state.detailsClicks
    this.setState({
      detailsClicks: clicks,
    })
  }

  handleRowClick (clickedRowIndex) {
    this.setState({
      clickedRowIndex,
    })
  }

  render () {
    const {
      clickableRow,
      disabled,
      empty,
      expandable,
      hasEmptyRenderer,
      selectable,
      showAggregationRow,
      simple,
    } = this.props
    const {
      clickedRowIndex,
      columns,
      detailsClicks,
      expandedRows,
      order,
      orderColumn,
      rows,
      selectedRows,
    } = this.state
    const columnWithEmptyRenderer = {
      title: 'empty',
      renderer: () => null,
      accessor: ['empty'],
    }
    const emptyMessage = empty ? 'No items found' : null
    const maxColumns = expandable ? 6 : 7
    const onOrderChange = !simple ? this.handleOrderChange : null
    const onRowClick = clickableRow && !simple ? this.handleRowClick : null
    const tableColumns = hasEmptyRenderer
      ? prepend(columnWithEmptyRenderer, columns)
      : columns
    const tableRows = empty ? [] : rows
    return (
      <div>
        <Table
          className={style.table}
          columns={tableColumns}
          disabled={disabled}
          emptyMessage={emptyMessage}
          expandable={expandable}
          expandedRows={expandedRows}
          maxColumns={maxColumns}
          onExpandRow={this.handleExpandRow}
          onOrderChange={onOrderChange}
          onRowClick={onRowClick}
          onSelectRow={this.handleSelectRow}
          orderColumn={orderColumn}
          orderSequence={order}
          rows={tableRows}
          selectable={selectable}
          selectedRows={selectedRows}
          showAggregationRow={showAggregationRow}
        />

        <div className={style.texts}>
          {
            expandable && selectable &&
            <div>
              <div> Selected rows { selectedRows.length } </div>
              <div> Expanded rows { expandedRows.length } </div>
            </div>
          }
          {
            detailsClicks > 0 &&
            <div>
              Details link clicks: { detailsClicks }
            </div>
          }
          {
            (clickedRowIndex || clickedRowIndex === 0) &&
            <span> Last clicked row: { clickedRowIndex + 1 } </span>
          }
        </div>
      </div>
    )
  }
}

TableState.propTypes = {
  clickableRow: bool,
  disabled: bool,
  empty: bool,
  expandable: bool,
  hasEmptyRenderer: bool,
  primaryAction: bool,
  selectable: bool,
  simple: bool,
}

TableState.defaultProps = {
  clickableRow: false,
  disabled: false,
  empty: false,
  expandable: false,
  hasEmptyRenderer: false,
  primaryAction: false,
  selectable: false,
  simple: false,
}

export default TableState
