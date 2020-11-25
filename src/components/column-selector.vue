<script>
export default {
  props: {
    columnNames: {
      type: Array,
      validator: (prop) =>
        prop.length === 0 || prop.every((el) => typeof el === 'string'),
      default: () => [],
      required: true,
    },
    data: {
      type: Array,
      default: () => [],
      required: true,
    },
    selectedColumn: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      rowLimit: 4,
    }
  },
  computed: {
    displayedColumnNames() {
      if (this.selectedColumn) {
        return [this.selectedColumn]
      }
      return this.columnNames
    },
    deployed() {
      return !this.selectedColumn
    },
    lessThanTenColumns() {
      return this.columnNames.length < 10
    },
  },
  methods: {
    columnContent(columnName) {
      const content = this.data.map((booking) => booking[columnName])
      return this.deployed ? content : content.slice(0, this.rowLimit)
    },
    numberColumnIndices() {
      const data = this.deployed ? this.data : this.data.slice(0, this.rowLimit)
      return data.map((_, index) => index + 1)
    },
    selectColumn(event, name) {
      setTimeout(
        () =>
          event.target.scrollIntoView({
            block: 'nearest',
            inline: 'center',
            behavior: 'smooth',
          }),
        200
      )
      this.$emit('select', name)
    },
    fillerColumns() {
      return this.lessThanTenColumns && this.deployed
        ? new Array(10 - this.columnNames.length).map((row, index) => index)
        : []
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <div :class="[$style.selector, selectedColumn ? $style.selected : '']">
      <div :class="$style.numbersColumn">
        <div :class="$style.columnName">{{/* empty element */}}</div>
        <div v-for="index in numberColumnIndices()" :key="index">{{
          index
        }}</div>
        <div v-if="!deployed" :class="$style.row">
          ...
        </div>
      </div>
      <div
        v-for="name of columnNames"
        :key="name"
        tabindex="0"
        role="button"
        :class="[
          $style.column,
          selectedColumn && selectedColumn !== name ? $style.hiddenColumn : '',
        ]"
        @click="(e) => selectColumn(e, name)"
        @keyup.enter="(e) => selectColumn(e, name)"
      >
        <div :class="$style.columnName">
          {{ name }}
          <b-button
            v-if="selectedColumn === name"
            rounded
            type="is-small"
            :class="$style.columnNameButton"
            >changer</b-button
          >
        </div>
        <div
          v-for="[key, value] of Object.entries(columnContent(name))"
          :key="`${key} ${value}`"
          :class="$style.row"
        >
          {{ value || '(vide)' }}
        </div>
        <div v-if="!deployed" :class="$style.row">
          ...
        </div>
      </div>
      <div
        v-for="col of fillerColumns()"
        :key="col"
        :class="[$style.column, $style.fillerColumn]"
      >
        <div :class="$style.columnName">{{/* empty element */}}</div>
        <div
          v-for="index in numberColumnIndices()"
          :key="index"
          :class="$style.row"
          >{{/* empty element */}}</div
        >
        <div v-if="!deployed" :class="$style.row">
          ...
        </div>
      </div>
      <div :class="$style.numbersColumn">
        <div :class="$style.columnName">{{/* empty element */}}</div>
        <div v-for="index in numberColumnIndices()" :key="index">{{
          index
        }}</div>
        <div v-if="!deployed" :class="$style.row">
          ...
        </div>
      </div>
    </div>
    <div
      :class="[$style.filler, selectedColumn ? $style.selected : '']"
      >{{/* empty element */}}</div
    >
  </div>
</template>

<style lang="scss" module>
@import '@design';

$col-wid: 250px;
$border-color: lightgrey;
$header-bg-color: beige;
$row-bg-color: white;

.container {
  --border-color: #{$border-color};
  --row-bg-color: #{$row-bg-color};
  --header-bg-color: #{$header-bg-color};

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  padding: 0 1rem;
  margin: auto;
  overflow: auto;

  .filler {
    flex-basis: 1rem;
    flex-grow: 0;
    flex-shrink: 0;
    transition: all 100ms 200ms;
    &.selected {
      flex-basis: 0;
    }
  }

  .selector {
    display: flex;
    flex: 0 0 auto;
    flex-direction: row;
    flex-wrap: nowrap;
    width: fit-content;
    min-width: 100%;
    background-color: #fff;
    border-right: 8px solid black;
    border-left: 8px solid black;
    border-radius: 5px;
    transition: min-width 400ms;
    &.selected {
      min-width: 0;
      margin: auto;
    }

    .row {
      width: 100%;
      max-width: $col-wid;
      height: 2.2em;
      padding: 0.4rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background-color: var(--row-bg-color);
      border-bottom: 1px solid var(--border-color);
    }

    .column {
      flex: 0 0 auto;
      width: $col-wid;
      max-width: 50vw;
      cursor: pointer;
      border-right: 1px solid var(--border-color);
      transition: max-width 400ms, visibility 200ms;

      &:hover {
        --border-color: #{darken($border-color, 5%)};
        --row-bg-color: #{darken($row-bg-color, 5%)};
        --header-bg-color: #{darken($header-bg-color, 5%)};
      }

      &.hiddenColumn {
        max-width: 0;
        padding: 0;
        visibility: hidden;
        border: 0;
      }

      .columnName {
        @extend .row;

        position: relative;
        background-color: var(--header-bg-color);

        .columnNameButton {
          position: absolute;
          top: 10%;
          right: 0.5rem;
          height: 80%;
        }
      }
    }

    .fillerColumn {
      pointer-events: none;
    }

    .numbersColumn {
      @extend .column;

      width: auto;
      pointer-events: none;
      > * {
        @extend .row;
      }

      border-right: 1px solid var(--border-color);
    }
  }
}
</style>
